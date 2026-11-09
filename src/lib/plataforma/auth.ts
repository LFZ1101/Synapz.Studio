import { createHash, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { writeAudit } from "./audit";
import { ensureDefaultStages, getDb, nowIso } from "./db";
import { createId, createToken } from "./ids";
import type { Role, SessionUser } from "./types";

export const SESSION_COOKIE = "synapz_platform_session";
const SESSION_DAYS = 14;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionSecret() {
  const secret =
    process.env.PLATFORM_SESSION_SECRET ||
    process.env.PLATFORM_BOOTSTRAP_SECRET ||
    "";
  if (secret.length >= 32) return secret;
  if (secret.length >= 8) return `synapz-platform-v1:${secret}`.padEnd(32, "0");
  return "";
}

export function isBootstrapConfigured() {
  const secret = process.env.PLATFORM_BOOTSTRAP_SECRET || "";
  return secret.length >= 8;
}

export function verifyBootstrapSecret(candidate: string) {
  const expected = process.env.PLATFORM_BOOTSTRAP_SECRET || "";
  if (!expected || expected.length < 8 || !candidate) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(candidate);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function hasOwner() {
  const row = getDb()
    .prepare(`SELECT COUNT(*) AS c FROM memberships WHERE role = 'owner'`)
    .get() as { c: number };
  return row.c > 0;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const db = getDb();
  const token = createToken(32);
  const tokenHash = hashToken(token);
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);
  const hdrs = await headers();

  db.prepare(
    `INSERT INTO sessions (id, user_id, token_hash, expires_at, user_agent, ip, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    createId("ses"),
    userId,
    tokenHash,
    expires.toISOString(),
    hdrs.get("user-agent")?.slice(0, 300) ?? null,
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    nowIso(),
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });

  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    getDb()
      .prepare(`DELETE FROM sessions WHERE token_hash = ?`)
      .run(hashToken(token));
  }
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionUserFromToken(token?: string | null): SessionUser | null {
  if (!token) return null;
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
         u.id AS user_id,
         u.email,
         u.name,
         u.username,
         o.id AS org_id,
         o.name AS org_name,
         m.role,
         COALESCE(p.hide_values, 0) AS hide_values,
         s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN memberships m ON m.user_id = u.id
       JOIN organizations o ON o.id = m.org_id
       LEFT JOIN user_preferences p ON p.user_id = u.id
       WHERE s.token_hash = ?
       ORDER BY CASE m.role
         WHEN 'owner' THEN 0
         WHEN 'admin' THEN 1
         WHEN 'member' THEN 2
         ELSE 3
       END
       LIMIT 1`,
    )
    .get(hashToken(token)) as
    | {
        user_id: string;
        email: string;
        name: string;
        username: string;
        org_id: string;
        org_name: string;
        role: Role;
        hide_values: number;
        expires_at: string;
      }
    | undefined;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).run(hashToken(token));
    return null;
  }

  return {
    id: row.user_id,
    email: row.email,
    name: row.name,
    username: row.username,
    orgId: row.org_id,
    orgName: row.org_name,
    role: row.role,
    hideValues: Boolean(row.hide_values),
  };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  return getSessionUserFromToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/plataforma/entrar");
  return user;
}

export async function requireGuest() {
  const user = await getCurrentUser();
  if (user) redirect("/plataforma");
}

export type BootstrapInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  orgName: string;
  bootstrapSecret: string;
};

export async function bootstrapOwner(input: BootstrapInput) {
  if (!isBootstrapConfigured()) {
    throw new Error("Bootstrap não configurado no servidor.");
  }
  if (!verifyBootstrapSecret(input.bootstrapSecret)) {
    throw new Error("Segredo de bootstrap inválido.");
  }
  if (hasOwner()) {
    throw new Error("Já existe um proprietário. Use convite para novos usuários.");
  }
  if (!getSessionSecret()) {
    throw new Error("Defina PLATFORM_SESSION_SECRET ou PLATFORM_BOOTSTRAP_SECRET.");
  }
  if (input.password.length < 8) {
    throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  }

  const db = getDb();
  const now = nowIso();
  const userId = createId("usr");
  const orgId = createId("org");
  const passwordHash = await hashPassword(input.password);
  const slug = input.orgName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "synapz";

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO organizations (id, name, slug, created_at) VALUES (?, ?, ?, ?)`,
    ).run(orgId, input.orgName.trim(), `${slug}-${orgId.slice(-6)}`, now);

    db.prepare(
      `INSERT INTO users (id, email, name, username, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      userId,
      input.email.trim().toLowerCase(),
      input.name.trim(),
      input.username.trim().toLowerCase(),
      passwordHash,
      now,
      now,
    );

    db.prepare(
      `INSERT INTO memberships (id, org_id, user_id, role, created_at)
       VALUES (?, ?, ?, 'owner', ?)`,
    ).run(createId("mem"), orgId, userId, now);

    db.prepare(
      `INSERT INTO user_preferences (user_id, hide_values, updated_at) VALUES (?, 0, ?)`,
    ).run(userId, now);
  });

  tx();
  ensureDefaultStages(orgId);
  writeAudit({
    orgId,
    userId,
    action: "bootstrap.owner",
    entityType: "organization",
    entityId: orgId,
  });
  await createSession(userId);
  return { userId, orgId };
}

export async function loginWithPassword(email: string, password: string) {
  const db = getDb();
  const user = db
    .prepare(`SELECT id, password_hash FROM users WHERE email = ? COLLATE NOCASE`)
    .get(email.trim()) as { id: string; password_hash: string } | undefined;

  if (!user) {
    throw new Error("E-mail ou senha incorretos.");
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    throw new Error("E-mail ou senha incorretos.");
  }

  await createSession(user.id);
  const membership = db
    .prepare(`SELECT org_id FROM memberships WHERE user_id = ? LIMIT 1`)
    .get(user.id) as { org_id: string } | undefined;
  if (membership) {
    writeAudit({
      orgId: membership.org_id,
      userId: user.id,
      action: "auth.login",
      entityType: "session",
      entityId: user.id,
    });
  }
}

export async function requestPasswordReset(email: string) {
  const db = getDb();
  const user = db
    .prepare(`SELECT id FROM users WHERE email = ? COLLATE NOCASE`)
    .get(email.trim()) as { id: string } | undefined;

  // Resposta genérica para não enumerar contas
  if (!user) {
    return { ok: true as const, resetUrl: null as string | null };
  }

  const token = createToken(24);
  const expires = new Date();
  expires.setHours(expires.getHours() + 2);

  db.prepare(
    `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(createId("prt"), user.id, hashToken(token), expires.toISOString(), nowIso());

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    ok: true as const,
    resetUrl: `${base}/plataforma/redefinir-senha?token=${token}`,
  };
}

export async function resetPasswordWithToken(token: string, password: string) {
  if (password.length < 8) {
    throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  }
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id, user_id, expires_at, used_at FROM password_reset_tokens WHERE token_hash = ?`,
    )
    .get(hashToken(token)) as
    | { id: string; user_id: string; expires_at: string; used_at: string | null }
    | undefined;

  if (!row || row.used_at || new Date(row.expires_at).getTime() < Date.now()) {
    throw new Error("Link de redefinição inválido ou expirado.");
  }

  const passwordHash = await hashPassword(password);
  const tx = db.transaction(() => {
    db.prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`).run(
      passwordHash,
      nowIso(),
      row.user_id,
    );
    db.prepare(`UPDATE password_reset_tokens SET used_at = ? WHERE id = ?`).run(
      nowIso(),
      row.id,
    );
    db.prepare(`DELETE FROM sessions WHERE user_id = ?`).run(row.user_id);
  });
  tx();
}

export async function setHideValues(userId: string, hide: boolean) {
  getDb()
    .prepare(
      `INSERT INTO user_preferences (user_id, hide_values, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET hide_values = excluded.hide_values, updated_at = excluded.updated_at`,
    )
    .run(userId, hide ? 1 : 0, nowIso());
}

export async function updateProfile(
  userId: string,
  data: { name: string; username: string; email: string },
) {
  getDb()
    .prepare(
      `UPDATE users SET name = ?, username = ?, email = ?, updated_at = ? WHERE id = ?`,
    )
    .run(
      data.name.trim(),
      data.username.trim().toLowerCase(),
      data.email.trim().toLowerCase(),
      nowIso(),
      userId,
    );
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  if (newPassword.length < 8) {
    throw new Error("A nova senha precisa ter pelo menos 8 caracteres.");
  }
  const db = getDb();
  const user = db
    .prepare(`SELECT password_hash FROM users WHERE id = ?`)
    .get(userId) as { password_hash: string } | undefined;
  if (!user) throw new Error("Usuário não encontrado.");
  const ok = await verifyPassword(currentPassword, user.password_hash);
  if (!ok) throw new Error("Senha atual incorreta.");
  const hash = await hashPassword(newPassword);
  db.prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`).run(
    hash,
    nowIso(),
    userId,
  );
}

export function listSessions(userId: string) {
  return getDb()
    .prepare(
      `SELECT id, user_agent, ip, created_at, expires_at
       FROM sessions WHERE user_id = ? ORDER BY created_at DESC`,
    )
    .all(userId) as Array<{
    id: string;
    user_agent: string | null;
    ip: string | null;
    created_at: string;
    expires_at: string;
  }>;
}

export function revokeSession(userId: string, sessionId: string) {
  getDb()
    .prepare(`DELETE FROM sessions WHERE id = ? AND user_id = ?`)
    .run(sessionId, userId);
}

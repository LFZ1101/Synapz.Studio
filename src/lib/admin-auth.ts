import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "synapz_admin";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET?.trim() || "";
}

export function isAdminConfigured() {
  return getAdminSecret().length >= 8;
}

export function makeAdminToken(secret = getAdminSecret()) {
  if (!secret) return "";
  return createHash("sha256").update(`synapz-admin-v1:${secret}`).digest("hex");
}

export function verifyAdminSecret(input: string) {
  const secret = getAdminSecret();
  if (!secret || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyAdminToken(token: string | undefined | null) {
  const expected = makeAdminToken();
  if (!token || !expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Server-side check for Route Handlers / Server Components */
export async function requireAdmin() {
  if (!isAdminConfigured()) {
    return { ok: false as const, status: 503, error: "Admin não configurado. Defina ADMIN_SECRET no ambiente." };
  }
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!verifyAdminToken(token)) {
    return { ok: false as const, status: 401, error: "Não autorizado." };
  }
  return { ok: true as const };
}

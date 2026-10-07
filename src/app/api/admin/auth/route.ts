import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  makeAdminToken,
  verifyAdminSecret,
  verifyAdminToken,
} from "@/lib/admin-auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, configured: false, error: "Defina ADMIN_SECRET no ambiente." },
      { status: 503 },
    );
  }
  const jar = await cookies();
  const ok = verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ ok, configured: true });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin não configurado. Defina ADMIN_SECRET." },
      { status: 503 },
    );
  }

  let body: { secret?: string } = {};
  try {
    body = (await request.json()) as { secret?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  if (!verifyAdminSecret(body.secret || "")) {
    return NextResponse.json({ ok: false, error: "Senha incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: makeAdminToken(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

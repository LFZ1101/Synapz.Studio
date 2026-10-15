import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/plataforma/auth";
import { globalSearch } from "@/lib/plataforma/services";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({
      clients: [],
      projects: [],
      opportunities: [],
      sales: [],
    });
  }

  return NextResponse.json(globalSearch(user.orgId, q));
}

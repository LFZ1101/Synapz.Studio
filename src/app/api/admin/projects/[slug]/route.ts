import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { projectInputSchema } from "@/lib/project-schema";
import {
  deleteProject,
  getProjectBySlug,
  readAllProjects,
  upsertProject,
  writeAllProjects,
} from "@/lib/projects-store";
import type { Project } from "@/content/project-types";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ slug: string }> };

function revalidateProjectPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath(`/projetos/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function GET(_request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { slug } = await ctx.params;
  const project = getProjectBySlug(slug, { includeDrafts: true });
  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PUT(request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { slug } = await ctx.params;
  const existing = getProjectBySlug(slug, { includeDrafts: true });
  if (!existing) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = projectInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.slug !== slug) {
    const clash = getProjectBySlug(data.slug, { includeDrafts: true });
    if (clash) {
      return NextResponse.json(
        { error: "Já existe um projeto com o novo slug." },
        { status: 409 },
      );
    }
    // rename: remove old slug entry then save new
    const all = readAllProjects().filter((p) => p.slug !== slug);
    writeAllProjects(all);
  }

  const project: Project = {
    ...existing,
    ...data,
    client: data.client || undefined,
    video: data.video || undefined,
    nextProject: data.nextProject || undefined,
    externalUrl: data.externalUrl || undefined,
    results: existing.results ?? [],
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const saved = upsertProject(project);
  revalidateProjectPaths(slug);
  if (saved.slug !== slug) revalidateProjectPaths(saved.slug);
  return NextResponse.json({ project: saved });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { slug } = await ctx.params;
  const ok = deleteProject(slug);
  if (!ok) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }
  revalidateProjectPaths(slug);
  return NextResponse.json({ ok: true });
}

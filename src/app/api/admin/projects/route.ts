import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { projectInputSchema } from "@/lib/project-schema";
import {
  getProjectBySlug,
  readAllProjects,
  upsertProject,
} from "@/lib/projects-store";
import type { Project } from "@/content/project-types";

export const runtime = "nodejs";

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/projetos/${slug}`);
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  return NextResponse.json({ projects: readAllProjects() });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
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
  if (getProjectBySlug(data.slug, { includeDrafts: true })) {
    return NextResponse.json(
      { error: "Já existe um projeto com este slug." },
      { status: 409 },
    );
  }

  const project: Project = {
    ...data,
    client: data.client || undefined,
    video: data.video || undefined,
    nextProject: data.nextProject || undefined,
    externalUrl: data.externalUrl || undefined,
    results: [],
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const saved = upsertProject(project);
  revalidateProjectPaths(saved.slug);
  return NextResponse.json({ project: saved }, { status: 201 });
}

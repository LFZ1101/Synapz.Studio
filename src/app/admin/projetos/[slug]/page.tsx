import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectBySlug } from "@/lib/projects-store";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminEditProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug, { includeDrafts: true });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Editar · {project.name}</h1>
        <p className="mt-2 text-synapz-signal">
          /projetos/{project.slug} · atualizado em {project.updatedAt}
        </p>
      </div>
      <ProjectForm mode="edit" initial={project} />
    </div>
  );
}

import Link from "next/link";
import { ProjectsAdminList } from "@/components/admin/ProjectsAdminList";
import { readAllProjects } from "@/lib/projects-store";

export const dynamic = "force-dynamic";

export default function AdminProjectsPage() {
  const projects = readAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl">Projetos</h1>
          <p className="mt-2 text-synapz-signal">
            {projects.length} projeto{projects.length === 1 ? "" : "s"} no banco local.
          </p>
        </div>
        <Link
          href="/admin/projetos/novo"
          className="inline-flex h-11 items-center justify-center bg-synapz-impulse px-5 text-sm font-medium text-synapz-black"
        >
          Novo projeto
        </Link>
      </div>
      <ProjectsAdminList projects={projects} />
    </div>
  );
}

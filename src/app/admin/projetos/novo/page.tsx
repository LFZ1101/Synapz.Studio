import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default function AdminNewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Novo projeto</h1>
        <p className="mt-2 text-synapz-signal">
          Preencha o essencial e envie capa/vídeos. Você pode salvar como rascunho.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}

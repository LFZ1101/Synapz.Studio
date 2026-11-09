import Link from "next/link";
import { redirect } from "next/navigation";
import { PipelineEditor } from "@/components/plataforma/PipelineEditor";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import { listStages } from "@/lib/plataforma/services";

export const metadata = { title: "Editor de funil" };

export default async function FunilPage() {
  const user = await requireUser();
  if (!can(user.role, "manage_pipeline")) {
    redirect("/plataforma/crm");
  }
  const stages = listStages(user.orgId);

  return (
    <div>
      <PageHeader
        eyebrow="CRM"
        title="Editor de funil"
        description="Renomeie, reordene, ajuste probabilidade e resultado. Remover etapa com oportunidades exige remapeamento — oportunidades nunca são apagadas."
        actions={
          <Link href="/plataforma/crm" className="platform-btn-ghost">
            Voltar ao CRM
          </Link>
        }
      />
      <PipelineEditor initialStages={stages} />
    </div>
  );
}

import Link from "next/link";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  TextTextarea,
} from "@/components/plataforma/FormPrimitives";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { actionCreateSiteBrief } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDateTime } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { listSiteBriefs } from "@/lib/plataforma/extras";

export const metadata = { title: "Builder de Sites" };

async function briefAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionCreateSiteBrief(formData);
}

export default async function BuilderPage() {
  const user = await requireUser();
  const briefs = listSiteBriefs(user.orgId);
  const writable = can(user.role, "write");
  const latestRow = briefs[0] as
    | {
        id: string;
        title: string;
        brief_json: string;
        project_id: string | null;
        portfolio_id: string | null;
      }
    | undefined;
  const latest = latestRow
    ? {
        ...latestRow,
        parsed: JSON.parse(String(latestRow.brief_json || "{}")) as Record<
          string,
          unknown
        >,
      }
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="Builder de Sites"
        description="Descreva o site e gere um brief operacional SYNAPZ. Opcionalmente cria projeto de execução e item no portfólio."
      />

      {writable ? (
        <section className="platform-panel mb-6">
          <ActionForm action={briefAction} className="space-y-4">
            <Field label="Descreva o site que você quer criar" name="description">
              <TextTextarea
                id="description"
                name="description"
                required
                className="min-h-40"
                placeholder="Ex.: Landing para clínica odontológica em São Paulo, foco em agendamento WhatsApp..."
              />
            </Field>
            <label className="flex items-center gap-2 text-sm text-synapz-signal">
              <input type="checkbox" name="create_project" value="1" defaultChecked className="accent-synapz-impulse" />
              Criar projeto em Execução
            </label>
            <label className="flex items-center gap-2 text-sm text-synapz-signal">
              <input type="checkbox" name="create_portfolio" value="1" className="accent-synapz-impulse" />
              Criar rascunho no Portfólio
            </label>
            <FormActions>
              <button type="submit" className="platform-btn">
                Gerar brief e criar
              </button>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {latest ? (
        <section className="platform-panel mb-6">
          <p className="eyebrow">Brief mais recente</p>
          <h2 className="mt-2 font-display text-2xl">{String(latest.title)}</h2>
          <pre className="mt-4 max-h-[28rem] overflow-auto whitespace-pre-wrap font-mono text-xs text-synapz-signal">
            {JSON.stringify(latest.parsed, null, 2)}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            {latest.project_id ? (
              <Link href="/plataforma/projetos" className="platform-chip">
                Ver projetos
              </Link>
            ) : null}
            {latest.portfolio_id ? (
              <Link href="/plataforma/portfolio" className="platform-chip">
                Ver portfólio
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl mb-3">Histórico de briefs</h2>
        {briefs.length === 0 ? (
          <p className="text-sm text-synapz-signal">
            Descreva o primeiro site para gerar o brief.
          </p>
        ) : (
          <ul className="space-y-2">
            {briefs.map((b) => (
              <li key={String(b.id)} className="platform-panel flex justify-between gap-3 text-sm">
                <span>{String(b.title)}</span>
                <span className="font-mono text-xs text-synapz-signal">
                  {formatDateTime(String(b.created_at))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

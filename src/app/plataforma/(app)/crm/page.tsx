import Link from "next/link";
import { EmptyState } from "@/components/plataforma/EmptyState";
import { FilterTabs } from "@/components/plataforma/FilterTabs";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
  TextSelect,
} from "@/components/plataforma/FormPrimitives";
import { Money } from "@/components/plataforma/Money";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { actionSaveOpportunity } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatMoney } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import {
  listClients,
  listOpportunities,
  listStages,
  listTeam,
} from "@/lib/plataforma/services";

export const metadata = { title: "CRM Kanban" };

async function saveOppAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveOpportunity(formData);
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{
    filtro?: string;
    q?: string;
    vista?: string;
    novo?: string;
  }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = (sp.filtro || "todas") as
    | "todas"
    | "minhas"
    | "atrasadas"
    | "prioritarias"
    | "arquivadas";
  const vista = sp.vista === "lista" ? "lista" : "quadro";
  const stages = listStages(user.orgId);
  const opps = listOpportunities(user.orgId, {
    filter: filtro,
    q: sp.q,
    userId: user.id,
  });
  const clients = listClients(user.orgId);
  const team = listTeam(user.orgId);
  const writable = can(user.role, "write");
  const hide = user.hideValues;

  const byStage = Object.fromEntries(
    stages.map((s) => [
      s.id,
      opps.filter((o) => o.stage_id === s.id),
    ]),
  ) as Record<string, typeof opps>;

  return (
    <div>
      <PageHeader
        eyebrow="Pipeline"
        title="CRM Kanban"
        description="Avance oportunidades entre etapas. Ganhar no CRM não cria venda automática — o financeiro fica em Vendas."
        actions={
          <>
            {writable ? (
              <Link href="/plataforma/crm?novo=1" className="platform-btn">
                Nova oportunidade
              </Link>
            ) : null}
            {can(user.role, "manage_pipeline") ? (
              <Link href="/plataforma/crm/funil" className="platform-btn-ghost">
                Editar funil
              </Link>
            ) : null}
          </>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterTabs
          basePath="/plataforma/crm"
          active={filtro}
          items={[
            { value: "todas", label: "Todas" },
            { value: "minhas", label: "Minhas" },
            { value: "atrasadas", label: "Atrasadas" },
            { value: "prioritarias", label: "Prioritárias" },
            { value: "arquivadas", label: "Arquivadas" },
          ]}
        />
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/plataforma/crm?vista=quadro&filtro=${filtro}`}
            className={`platform-chip ${vista === "quadro" ? "is-active" : ""}`}
          >
            Quadro
          </Link>
          <Link
            href={`/plataforma/crm?vista=lista&filtro=${filtro}`}
            className={`platform-chip ${vista === "lista" ? "is-active" : ""}`}
          >
            Lista
          </Link>
        </div>
      </div>

      {sp.novo && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">Nova oportunidade</h2>
          <ActionForm action={saveOppAction} className="space-y-4">
            <FormGrid>
              <Field label="Projeto / oportunidade" name="title">
                <TextInput id="title" name="title" required />
              </Field>
              <Field label="Etapa" name="stage_id">
                <TextSelect id="stage_id" name="stage_id" required defaultValue={stages[0]?.id}>
                  {stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.probability}%)
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Empresa" name="company">
                <TextInput id="company" name="company" />
              </Field>
              <Field label="Pessoa de contato" name="contact_name">
                <TextInput id="contact_name" name="contact_name" />
              </Field>
              <Field label="Telefone / WhatsApp" name="phone">
                <TextInput id="phone" name="phone" />
              </Field>
              <Field label="E-mail" name="email">
                <TextInput id="email" name="email" type="email" />
              </Field>
              <Field label="Valor previsto (R$)" name="value">
                <TextInput id="value" name="value" inputMode="decimal" defaultValue="0" />
              </Field>
              <Field label="Responsável" name="owner_user_id">
                <TextSelect id="owner_user_id" name="owner_user_id" defaultValue={user.id}>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Prioridade" name="priority">
                <TextSelect id="priority" name="priority" defaultValue="media">
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </TextSelect>
              </Field>
              <Field label="Origem" name="source">
                <TextInput id="source" name="source" />
              </Field>
              <Field label="Próxima ação" name="next_action">
                <TextInput id="next_action" name="next_action" />
              </Field>
              <Field label="Cliente relacionado" name="client_id">
                <TextSelect id="client_id" name="client_id" defaultValue="">
                  <option value="">Sem cliente</option>
                  {clients.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {String(c.name)}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Tags (separadas por vírgula)" name="tags">
                <TextInput id="tags" name="tags" />
              </Field>
            </FormGrid>
            <FormActions>
              <button type="submit" className="platform-btn">
                Criar oportunidade
              </button>
              <Link href="/plataforma/crm" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {opps.length === 0 && !sp.novo ? (
        <div className="mt-6">
          <EmptyState
            title="Pipeline vazio"
            description="Crie a primeira oportunidade e avance pelos estágios do funil."
            actionHref={writable ? "/plataforma/crm?novo=1" : undefined}
            actionLabel={writable ? "Nova oportunidade" : undefined}
          />
        </div>
      ) : vista === "quadro" ? (
        <div className="platform-kanban mt-6">
          {stages.map((stage) => (
            <section key={stage.id} className="platform-kanban-col">
              <header className="flex items-center justify-between gap-2 border-b border-synapz-neural/10 px-3 py-3">
                <div>
                  <h3 className="text-sm font-medium text-synapz-neural">{stage.name}</h3>
                  <p className="font-mono text-[0.65rem] text-synapz-signal">
                    {stage.probability}% · {byStage[stage.id]?.length || 0}
                  </p>
                </div>
              </header>
              <div className="pb-2">
                {(byStage[stage.id] || []).map((opp) => (
                  <Link
                    key={String(opp.id)}
                    href={`/plataforma/crm/${opp.id}`}
                    className="platform-kanban-card"
                  >
                    <p className="text-sm text-synapz-neural">{String(opp.title)}</p>
                    <p className="mt-1 text-xs text-synapz-signal">
                      {String(opp.company || opp.contact_name || "Sem empresa")}
                    </p>
                    <p className="mt-2 font-mono text-xs text-synapz-impulse">
                      {formatMoney(Number(opp.value_cents || 0), hide)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="platform-table-wrap mt-6">
          <table className="platform-table">
            <thead>
              <tr>
                <th>Oportunidade</th>
                <th>Etapa</th>
                <th>Valor</th>
                <th>Responsável</th>
                <th>Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {opps.map((opp) => (
                <tr key={String(opp.id)}>
                  <td>
                    <Link href={`/plataforma/crm/${opp.id}`} className="text-link">
                      {String(opp.title)}
                    </Link>
                  </td>
                  <td>{String(opp.stage_name)}</td>
                  <td>
                    <Money cents={Number(opp.value_cents || 0)} hide={hide} />
                  </td>
                  <td>{String(opp.owner_name || "—")}</td>
                  <td>{String(opp.priority)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

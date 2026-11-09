import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
  TextSelect,
  TextTextarea,
} from "@/components/plataforma/FormPrimitives";
import { Money } from "@/components/plataforma/Money";
import { PageHeader } from "@/components/plataforma/PageHeader";
import {
  actionAddNote,
  actionArchiveOpportunity,
  actionMoveOpportunity,
  actionSaveOpportunity,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDateTime } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import {
  centsToNumber,
} from "@/lib/plataforma/format";
import {
  getOpportunity,
  listClients,
  listOpportunityHistory,
  listOpportunityNotes,
  listStages,
  listTasks,
  listTeam,
} from "@/lib/plataforma/services";

export const metadata = { title: "Dossiê" };

async function saveOppAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveOpportunity(formData);
}

async function noteAction(_prev: unknown, formData: FormData) {
  "use server";
  await actionAddNote(formData);
  return { ok: true as const, message: "Nota adicionada." };
}

export default async function OpportunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aba?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { aba = "detalhes" } = await searchParams;
  const opp = getOpportunity(user.orgId, id);
  if (!opp) notFound();

  const stages = listStages(user.orgId);
  const clients = listClients(user.orgId);
  const team = listTeam(user.orgId);
  const notes = listOpportunityNotes(user.orgId, id);
  const history = listOpportunityHistory(user.orgId, id);
  const tasks = listTasks(user.orgId).filter(
    (t) => (t as { opportunity_id?: string }).opportunity_id === id,
  );
  const writable = can(user.role, "write");
  const hide = user.hideValues;
  const tags = JSON.parse(String(opp.tags_json || "[]")) as string[];

  return (
    <div>
      <PageHeader
        eyebrow="Dossiê"
        title={String(opp.title)}
        description={`${String(opp.stage_name)} · probabilidade vinculada à etapa atual`}
        actions={
          <>
            <Link href="/plataforma/crm" className="platform-btn-ghost">
              Voltar ao quadro
            </Link>
            {writable ? (
              <form
                action={async () => {
                  "use server";
                  await actionArchiveOpportunity(id);
                }}
              >
                <button type="submit" className="platform-btn-danger">
                  Arquivar
                </button>
              </form>
            ) : null}
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["detalhes", "Detalhes"],
          ["tarefas", "Tarefas"],
          ["notas", "Notas"],
          ["historico", "Histórico"],
        ].map(([key, label]) => (
          <Link
            key={key}
            href={`/plataforma/crm/${id}?aba=${key}`}
            className={`platform-chip ${aba === key ? "is-active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {aba === "detalhes" ? (
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="platform-panel">
            {writable ? (
              <ActionForm action={saveOppAction} className="space-y-4">
                <input type="hidden" name="id" value={id} />
                <FormGrid>
                  <Field label="Projeto / oportunidade" name="title">
                    <TextInput id="title" name="title" required defaultValue={String(opp.title)} />
                  </Field>
                  <Field label="Etapa" name="stage_id">
                    <TextSelect id="stage_id" name="stage_id" defaultValue={String(opp.stage_id)}>
                      {stages.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="Empresa" name="company">
                    <TextInput id="company" name="company" defaultValue={String(opp.company || "")} />
                  </Field>
                  <Field label="Pessoa de contato" name="contact_name">
                    <TextInput
                      id="contact_name"
                      name="contact_name"
                      defaultValue={String(opp.contact_name || "")}
                    />
                  </Field>
                  <Field label="Telefone / WhatsApp" name="phone">
                    <TextInput id="phone" name="phone" defaultValue={String(opp.phone || "")} />
                  </Field>
                  <Field label="E-mail" name="email">
                    <TextInput id="email" name="email" type="email" defaultValue={String(opp.email || "")} />
                  </Field>
                  <Field label="Valor previsto (R$)" name="value">
                    <TextInput
                      id="value"
                      name="value"
                      defaultValue={String(centsToNumber(Number(opp.value_cents || 0)))}
                    />
                  </Field>
                  <Field label="Responsável" name="owner_user_id">
                    <TextSelect
                      id="owner_user_id"
                      name="owner_user_id"
                      defaultValue={String(opp.owner_user_id || "")}
                    >
                      <option value="">Sem responsável</option>
                      {team.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="Prioridade" name="priority">
                    <TextSelect id="priority" name="priority" defaultValue={String(opp.priority)}>
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </TextSelect>
                  </Field>
                  <Field label="Origem" name="source">
                    <TextInput id="source" name="source" defaultValue={String(opp.source || "")} />
                  </Field>
                  <Field label="Próxima ação" name="next_action">
                    <TextInput
                      id="next_action"
                      name="next_action"
                      defaultValue={String(opp.next_action || "")}
                    />
                  </Field>
                  <Field label="Cliente" name="client_id">
                    <TextSelect id="client_id" name="client_id" defaultValue={String(opp.client_id || "")}>
                      <option value="">Sem cliente</option>
                      {clients.map((c) => (
                        <option key={String(c.id)} value={String(c.id)}>
                          {String(c.name)}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="Tags" name="tags">
                    <TextInput id="tags" name="tags" defaultValue={tags.join(", ")} />
                  </Field>
                </FormGrid>
                <FormActions>
                  <button type="submit" className="platform-btn">
                    Salvar dossiê
                  </button>
                </FormActions>
              </ActionForm>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt>Valor</dt><dd><Money cents={Number(opp.value_cents || 0)} hide={hide} /></dd></div>
                <div className="flex justify-between"><dt>Empresa</dt><dd>{String(opp.company || "—")}</dd></div>
                <div className="flex justify-between"><dt>Contato</dt><dd>{String(opp.contact_name || "—")}</dd></div>
              </dl>
            )}
          </section>

          <aside className="platform-panel space-y-4">
            <div>
              <p className="eyebrow">Resultado da etapa</p>
              <p className="mt-2 text-synapz-neural">{String(opp.stage_outcome)}</p>
              <p className="mt-4 text-sm text-synapz-signal">
                Marcar como ganha não registra venda. Use a seção Vendas para o financeiro.
              </p>
            </div>
            {writable ? (
              <div className="space-y-2">
                <p className="eyebrow">Mover para</p>
                {stages.map((s) => (
                  <form
                    key={s.id}
                    action={async () => {
                      "use server";
                      await actionMoveOpportunity(id, s.id);
                    }}
                  >
                    <button
                      type="submit"
                      className={`platform-chip w-full justify-between ${
                        s.id === opp.stage_id ? "is-active" : ""
                      }`}
                      disabled={s.id === opp.stage_id}
                    >
                      <span>{s.name}</span>
                      <span className="font-mono text-[0.65rem]">{s.probability}%</span>
                    </button>
                  </form>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {aba === "notas" ? (
        <section className="platform-panel space-y-4">
          {writable ? (
            <ActionForm action={noteAction} className="space-y-3">
              <input type="hidden" name="opportunity_id" value={id} />
              <Field label="Nova nota" name="body">
                <TextTextarea id="body" name="body" required />
              </Field>
              <FormActions>
                <button type="submit" className="platform-btn">
                  Adicionar nota
                </button>
              </FormActions>
            </ActionForm>
          ) : null}
          <ul className="space-y-3">
            {notes.length === 0 ? (
              <li className="text-sm text-synapz-signal">Nenhuma nota ainda.</li>
            ) : (
              notes.map((n) => (
                <li key={String((n as { id: string }).id)} className="border-t border-synapz-neural/10 pt-3">
                  <p className="text-sm text-synapz-neural">{String((n as { body: string }).body)}</p>
                  <p className="mt-1 font-mono text-[0.65rem] text-synapz-signal">
                    {String((n as { author_name?: string }).author_name || "—")} ·{" "}
                    {formatDateTime(String((n as { created_at: string }).created_at))}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      ) : null}

      {aba === "historico" ? (
        <section className="platform-panel">
          <ul className="space-y-3">
            {history.map((h) => (
              <li key={String((h as { id: string }).id)} className="text-sm">
                <p className="text-synapz-neural">{String((h as { detail: string }).detail || (h as { event: string }).event)}</p>
                <p className="font-mono text-[0.65rem] text-synapz-signal">
                  {String((h as { actor_name?: string }).actor_name || "Sistema")} ·{" "}
                  {formatDateTime(String((h as { created_at: string }).created_at))}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {aba === "tarefas" ? (
        <section className="platform-panel">
          <div className="mb-4 flex justify-between gap-3">
            <p className="text-sm text-synapz-signal">
              Tarefas vinculadas a esta oportunidade.
            </p>
            <Link
              href={`/plataforma/tarefas?novo=1&opportunity_id=${id}`}
              className="platform-chip"
            >
              Nova tarefa
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-synapz-signal">Nenhuma tarefa vinculada.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={String((t as { id: string }).id)} className="flex justify-between gap-3 text-sm">
                  <span>{String((t as { title: string }).title)}</span>
                  <span className="font-mono text-xs text-synapz-signal">
                    {String((t as { status: string }).status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}

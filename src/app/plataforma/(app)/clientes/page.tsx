import Link from "next/link";
import { EmptyState } from "@/components/plataforma/EmptyState";
import { FilterTabs } from "@/components/plataforma/FilterTabs";
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
import { StatCard } from "@/components/plataforma/StatCard";
import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  actionArchiveClient,
  actionSaveClient,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import {
  clientStats,
  getClient,
  listClients,
} from "@/lib/plataforma/services";
import {
  CLIENT_STAGE_LABELS,
  CLIENT_STAGES,
  type ClientStage,
} from "@/lib/plataforma/types";

export const metadata = { title: "Clientes" };

async function saveClientAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveClient(formData);
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; q?: string; novo?: string; editar?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = (sp.filtro || "todos") as ClientStage | "todos";
  const clients = listClients(user.orgId, { stage: filtro, q: sp.q });
  const stats = clientStats(user.orgId);
  const editing = sp.editar ? getClient(user.orgId, sp.editar) : null;
  const showForm = Boolean(sp.novo || editing);
  const hide = user.hideValues;
  const writable = can(user.role, "write");

  return (
    <div>
      <PageHeader
        eyebrow="Carteira"
        title="Clientes"
        description="Organize leads e clientes com estágio comercial claro. Cada registro alimenta CRM, projetos e resultado."
        actions={
          writable ? (
            <Link href="/plataforma/clientes?novo=1" className="platform-btn">
              Novo cliente
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={<span className="font-mono">{stats.total}</span>} />
        <StatCard
          label="Em negociação"
          value={
            <span className="font-mono">{stats.byStage.negociacao || 0}</span>
          }
        />
        <StatCard
          label="Clientes fechados"
          value={<span className="font-mono">{stats.byStage.cliente || 0}</span>}
        />
        <StatCard
          label="Receita gerada"
          value={<Money cents={stats.revenue} hide={hide} />}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start">
        <aside className="platform-panel w-full lg:w-56 shrink-0">
          <p className="eyebrow mb-3">Funil</p>
          <ul className="space-y-2 text-sm">
            {CLIENT_STAGES.map((stage) => (
              <li key={stage} className="flex justify-between gap-2">
                <Link href={`/plataforma/clientes?filtro=${stage}`} className="text-synapz-signal hover:text-synapz-neural">
                  {CLIENT_STAGE_LABELS[stage]}
                </Link>
                <span className="font-mono text-xs">{stats.byStage[stage] || 0}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <FilterTabs
              basePath="/plataforma/clientes"
              active={filtro}
              items={[
                { value: "todos", label: "Todos", count: stats.total },
                ...CLIENT_STAGES.map((s) => ({
                  value: s,
                  label: CLIENT_STAGE_LABELS[s],
                  count: stats.byStage[s] || 0,
                })),
              ]}
            />
            <form className="w-full md:max-w-xs">
              <TextInput
                name="q"
                defaultValue={sp.q || ""}
                placeholder="Buscar cliente ou empresa"
              />
            </form>
          </div>

          {showForm && writable ? (
            <section className="platform-panel">
              <h2 className="font-display text-xl mb-4">
                {editing ? "Editar cliente" : "Novo cliente"}
              </h2>
              <ActionForm action={saveClientAction} className="space-y-4">
                {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
                <FormGrid>
                  <Field label="Nome" name="name">
                    <TextInput id="name" name="name" required defaultValue={String(editing?.name || "")} />
                  </Field>
                  <Field label="Empresa" name="company">
                    <TextInput id="company" name="company" defaultValue={String(editing?.company || "")} />
                  </Field>
                  <Field label="WhatsApp" name="whatsapp">
                    <TextInput id="whatsapp" name="whatsapp" defaultValue={String(editing?.whatsapp || "")} />
                  </Field>
                  <Field label="Estágio comercial" name="stage">
                    <TextSelect id="stage" name="stage" defaultValue={String(editing?.stage || "lead")}>
                      {CLIENT_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {CLIENT_STAGE_LABELS[s]}
                        </option>
                      ))}
                    </TextSelect>
                  </Field>
                  <Field label="GitHub (opcional)" name="github">
                    <TextInput id="github" name="github" defaultValue={String(editing?.github || "")} />
                  </Field>
                  <Field label="Site publicado (opcional)" name="site_url">
                    <TextInput id="site_url" name="site_url" defaultValue={String(editing?.site_url || "")} />
                  </Field>
                  <Field label="Vercel (opcional)" name="vercel_url">
                    <TextInput id="vercel_url" name="vercel_url" defaultValue={String(editing?.vercel_url || "")} />
                  </Field>
                </FormGrid>
                <Field label="Notas" name="notes">
                  <TextTextarea id="notes" name="notes" defaultValue={String(editing?.notes || "")} />
                </Field>
                <FormActions>
                  <button type="submit" className="platform-btn">
                    Salvar cliente
                  </button>
                  <Link href="/plataforma/clientes" className="platform-btn-ghost">
                    Cancelar
                  </Link>
                </FormActions>
              </ActionForm>
            </section>
          ) : null}

          {clients.length === 0 ? (
            <EmptyState
              title="Nenhum cliente nesta visão"
              description="Cadastre o primeiro contato para tirar a operação das planilhas."
              actionHref={writable ? "/plataforma/clientes?novo=1" : undefined}
              actionLabel={writable ? "Novo cliente" : undefined}
            />
          ) : (
            <div className="platform-table-wrap">
              <table className="platform-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Empresa</th>
                    <th>WhatsApp</th>
                    <th>Estágio</th>
                    <th>Receita</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={String(c.id)}>
                      <td>{String(c.name)}</td>
                      <td>{String(c.company || "—")}</td>
                      <td className="font-mono text-xs">{String(c.whatsapp || "—")}</td>
                      <td>{CLIENT_STAGE_LABELS[c.stage as ClientStage]}</td>
                      <td>
                        <Money cents={Number(c.revenue_cents || 0)} hide={hide} />
                      </td>
                      <td className="space-x-2 whitespace-nowrap">
                        {writable ? (
                          <>
                            <Link
                              href={`/plataforma/clientes?editar=${c.id}`}
                              className="text-link text-sm"
                            >
                              Editar
                            </Link>
                            <form
                              action={async () => {
                                "use server";
                                await actionArchiveClient(String(c.id));
                              }}
                              className="inline"
                            >
                              <button type="submit" className="platform-btn-danger">
                                Arquivar
                              </button>
                            </form>
                          </>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

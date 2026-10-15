import Link from "next/link";
import { ActionForm } from "@/components/plataforma/ActionForm";
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
import { actionArchiveSale, actionSaveSale } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { centsToNumber, formatDate } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { getDb } from "@/lib/plataforma/db";
import {
  listClients,
  listProjects,
  listSales,
  salesStats,
} from "@/lib/plataforma/services";
import {
  PROJECT_TYPE_LABELS,
  PROJECT_TYPES,
  type ProjectType,
} from "@/lib/plataforma/types";

export const metadata = { title: "Vendas" };

async function saveSaleAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveSale(formData);
}

export default async function VendasPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; novo?: string; editar?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = (sp.filtro || "todas") as
    | "todas"
    | "melhor_margem"
    | "entrega_proxima"
    | "atrasadas"
    | "entregues"
    | "sem_cliente";
  const sales = listSales(user.orgId, { filter: filtro });
  const stats = salesStats(user.orgId);
  const clients = listClients(user.orgId);
  const projects = listProjects(user.orgId);
  const writable = can(user.role, "write");
  const hide = user.hideValues;
  const editing = sp.editar
    ? (getDb()
        .prepare(`SELECT * FROM sales WHERE org_id = ? AND id = ?`)
        .get(user.orgId, sp.editar) as Record<string, unknown> | undefined)
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Comercial"
        title="Vendas e resultado"
        description="Registre valor vendido, custo e prazo. Lucro estimado é calculado automaticamente. Separado da execução em Projetos."
        actions={
          writable ? (
            <Link href="/plataforma/vendas?novo=1" className="platform-btn">
              Nova venda
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Faturamento" value={<Money cents={stats.revenue} hide={hide} />} />
        <StatCard label="Lucro líquido" value={<Money cents={stats.profit} hide={hide} />} />
        <StatCard
          label="Margem média"
          value={<span className="font-mono tabular-nums">{hide ? "••%" : `${stats.margin.toFixed(1)}%`}</span>}
        />
        <StatCard label="Ticket médio" value={<Money cents={stats.ticket} hide={hide} />} />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/plataforma/vendas"
          active={filtro}
          items={[
            { value: "todas", label: "Todas" },
            { value: "melhor_margem", label: "Melhor margem" },
            { value: "entrega_proxima", label: "Entrega próxima" },
            { value: "atrasadas", label: "Atrasadas" },
            { value: "entregues", label: "Entregues" },
            { value: "sem_cliente", label: "Sem cliente" },
          ]}
        />
      </div>

      {(sp.novo || editing) && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">
            {editing ? "Editar venda" : "Nova venda"}
          </h2>
          <ActionForm action={saveSaleAction} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
            <FormGrid>
              <Field label="Nome do projeto / venda" name="name">
                <TextInput id="name" name="name" required defaultValue={String(editing?.name || "")} />
              </Field>
              <Field label="Cliente (opcional)" name="client_id">
                <TextSelect id="client_id" name="client_id" defaultValue={String(editing?.client_id || "")}>
                  <option value="">Sem cliente</option>
                  {clients.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {String(c.name)}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Projeto de execução (opcional)" name="project_id">
                <TextSelect id="project_id" name="project_id" defaultValue={String(editing?.project_id || "")}>
                  <option value="">Sem vínculo</option>
                  {projects.map((p) => (
                    <option key={String((p as { id: string }).id)} value={String((p as { id: string }).id)}>
                      {String((p as { name: string }).name)}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Tipo de projeto" name="project_type">
                <TextSelect
                  id="project_type"
                  name="project_type"
                  defaultValue={String(editing?.project_type || "outro")}
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {PROJECT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Valor vendido (R$)" name="amount">
                <TextInput
                  id="amount"
                  name="amount"
                  inputMode="decimal"
                  required
                  defaultValue={
                    editing ? String(centsToNumber(Number(editing.amount_cents || 0))) : ""
                  }
                />
              </Field>
              <Field label="Custo do projeto (R$)" name="cost">
                <TextInput
                  id="cost"
                  name="cost"
                  inputMode="decimal"
                  defaultValue={
                    editing ? String(centsToNumber(Number(editing.cost_cents || 0))) : "0"
                  }
                />
              </Field>
              <Field label="Data da venda" name="sold_at">
                <TextInput
                  id="sold_at"
                  name="sold_at"
                  type="datetime-local"
                  defaultValue={
                    editing
                      ? String(editing.sold_at || "").slice(0, 16)
                      : new Date().toISOString().slice(0, 16)
                  }
                />
              </Field>
              <Field label="Previsão de entrega (opcional)" name="delivery_forecast">
                <TextInput
                  id="delivery_forecast"
                  name="delivery_forecast"
                  type="date"
                  defaultValue={String(editing?.delivery_forecast || "").slice(0, 10)}
                />
              </Field>
            </FormGrid>
            <Field label="Notas" name="notes">
              <TextTextarea id="notes" name="notes" defaultValue={String(editing?.notes || "")} />
            </Field>
            <p className="text-xs text-synapz-signal">
              Lucro estimado = valor vendido − custo do projeto.
            </p>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar venda
              </button>
              <Link href="/plataforma/vendas" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      <div className="mt-6">
        {sales.length === 0 ? (
          <EmptyState
            title="Nenhuma venda registrada"
            description="Receita, custo e prazo geram a análise financeira. Registre a primeira venda com dados reais."
            actionHref={writable ? "/plataforma/vendas?novo=1" : undefined}
            actionLabel={writable ? "Registrar venda" : undefined}
          />
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Venda</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Lucro</th>
                  <th>Margem</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => {
                  const row = s as {
                    id: string;
                    name: string;
                    client_name: string | null;
                    project_type: ProjectType;
                    amount_cents: number;
                    cost_cents: number;
                    margin_pct: number;
                    sold_at: string;
                  };
                  return (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.client_name || "—"}</td>
                      <td>{PROJECT_TYPE_LABELS[row.project_type]}</td>
                      <td>
                        <Money cents={row.amount_cents} hide={hide} />
                      </td>
                      <td>
                        <Money cents={row.amount_cents - row.cost_cents} hide={hide} />
                      </td>
                      <td className="font-mono text-xs">
                        {hide ? "••%" : `${Number(row.margin_pct).toFixed(1)}%`}
                      </td>
                      <td className="font-mono text-xs">{formatDate(row.sold_at)}</td>
                      <td className="space-x-2 whitespace-nowrap">
                        {writable ? (
                          <>
                            <Link href={`/plataforma/vendas?editar=${row.id}`} className="text-link text-sm">
                              Editar
                            </Link>
                            <form
                              action={async () => {
                                "use server";
                                await actionArchiveSale(row.id);
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

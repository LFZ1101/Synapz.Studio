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
import { PageHeader } from "@/components/plataforma/PageHeader";
import { StatCard } from "@/components/plataforma/StatCard";
import {
  actionArchivePortfolio,
  actionSavePortfolio,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import { getDb } from "@/lib/plataforma/db";
import {
  listClients,
  listPortfolio,
  portfolioStats,
} from "@/lib/plataforma/services";
import {
  PORTFOLIO_STATUS_LABELS,
  PORTFOLIO_STATUSES,
  type PortfolioStatus,
} from "@/lib/plataforma/types";

export const metadata = { title: "Portfólio" };

async function savePortfolioAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSavePortfolio(formData);
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; novo?: string; editar?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = (sp.filtro || "todos") as PortfolioStatus | "todos";
  const sites = listPortfolio(user.orgId, { status: filtro });
  const stats = portfolioStats(user.orgId);
  const clients = listClients(user.orgId);
  const writable = can(user.role, "write");
  const editing = sp.editar
    ? (getDb()
        .prepare(`SELECT * FROM portfolio_sites WHERE org_id = ? AND id = ?`)
        .get(user.orgId, sp.editar) as Record<string, unknown> | undefined)
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Acervo"
        title="Portfólio de sites"
        description="Galeria de entregas com status, URL e cliente relacionado."
        actions={
          writable ? (
            <Link href="/plataforma/portfolio?novo=1" className="platform-btn">
              Adicionar site
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 md:grid-cols-2">
        <StatCard label="Total do acervo" value={<span className="font-mono">{stats.total}</span>} />
        <StatCard
          label="Publicadas"
          value={
            <span className="font-mono">{stats.byStatus.publicado || 0}</span>
          }
        />
      </div>

      <div className="mt-6">
        <FilterTabs
          basePath="/plataforma/portfolio"
          active={filtro}
          items={[
            { value: "todos", label: "Todos" },
            ...PORTFOLIO_STATUSES.map((s) => ({
              value: s,
              label: PORTFOLIO_STATUS_LABELS[s],
            })),
          ]}
        />
      </div>

      {(sp.novo || editing) && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">
            {editing ? "Editar site" : "Novo site"}
          </h2>
          <ActionForm action={savePortfolioAction} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
            <FormGrid>
              <Field label="Título" name="title">
                <TextInput id="title" name="title" required defaultValue={String(editing?.title || "")} />
              </Field>
              <Field label="Status" name="status">
                <TextSelect
                  id="status"
                  name="status"
                  defaultValue={String(editing?.status || "em_desenvolvimento")}
                >
                  {PORTFOLIO_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {PORTFOLIO_STATUS_LABELS[s]}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="URL" name="url">
                <TextInput id="url" name="url" defaultValue={String(editing?.url || "")} />
              </Field>
              <Field label="Cliente" name="client_id">
                <TextSelect id="client_id" name="client_id" defaultValue={String(editing?.client_id || "")}>
                  <option value="">Sem cliente</option>
                  {clients.map((c) => (
                    <option key={String(c.id)} value={String(c.id)}>
                      {String(c.name)}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Imagem de capa (URL opcional)" name="cover_url">
                <TextInput id="cover_url" name="cover_url" defaultValue={String(editing?.cover_url || "")} />
              </Field>
            </FormGrid>
            <Field label="Descrição curta" name="description">
              <TextTextarea
                id="description"
                name="description"
                defaultValue={String(editing?.description || "")}
              />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar site
              </button>
              <Link href="/plataforma/portfolio" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      <div className="mt-6">
        {sites.length === 0 ? (
          <EmptyState
            title="Portfólio vazio"
            description="Adicione o primeiro site entregue para montar o acervo da SYNAPZ."
            actionHref={writable ? "/plataforma/portfolio?novo=1" : undefined}
            actionLabel={writable ? "Adicionar primeiro site" : undefined}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sites.map((site) => {
              const row = site as {
                id: string;
                title: string;
                status: PortfolioStatus;
                url: string | null;
                client_name: string | null;
                cover_url: string | null;
                description: string | null;
              };
              return (
                <article key={row.id} className="platform-panel flex flex-col">
                  <div
                    className="mb-4 aspect-[16/10] border border-synapz-neural/10 bg-synapz-black/40 bg-cover bg-center"
                    style={
                      row.cover_url
                        ? { backgroundImage: `url(${row.cover_url})` }
                        : undefined
                    }
                  />
                  <p className="eyebrow">{PORTFOLIO_STATUS_LABELS[row.status]}</p>
                  <h3 className="mt-2 font-display text-xl">{row.title}</h3>
                  <p className="mt-2 text-sm text-synapz-signal">
                    {row.description || row.client_name || "Sem descrição"}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {row.url ? (
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        className="platform-chip"
                      >
                        Abrir URL
                      </a>
                    ) : null}
                    {writable ? (
                      <>
                        <Link
                          href={`/plataforma/portfolio?editar=${row.id}`}
                          className="platform-chip"
                        >
                          Editar
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await actionArchivePortfolio(row.id);
                          }}
                        >
                          <button type="submit" className="platform-btn-danger">
                            Arquivar
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

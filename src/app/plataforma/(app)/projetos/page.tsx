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
import { actionArchiveProject, actionSaveProject } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDate } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { getDb } from "@/lib/plataforma/db";
import { listClients, listProjects } from "@/lib/plataforma/services";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUSES,
  PROJECT_TYPE_LABELS,
  PROJECT_TYPES,
  type ProjectStatus,
  type ProjectType,
} from "@/lib/plataforma/types";

export const metadata = { title: "Projetos" };

async function saveProjectAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveProject(formData);
}

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; novo?: string; editar?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = sp.filtro || "todos";
  const projects = listProjects(user.orgId, { status: filtro });
  const clients = listClients(user.orgId);
  const writable = can(user.role, "write");
  const editing = sp.editar
    ? (getDb()
        .prepare(`SELECT * FROM projects WHERE org_id = ? AND id = ?`)
        .get(user.orgId, sp.editar) as Record<string, unknown> | undefined)
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Execução"
        title="Projetos"
        description="Gestão de entrega separada do registro comercial. Vincule clientes e acompanhe status até a conclusão."
        actions={
          writable ? (
            <Link href="/plataforma/projetos?novo=1" className="platform-btn">
              Novo projeto
            </Link>
          ) : null
        }
      />

      <FilterTabs
        basePath="/plataforma/projetos"
        active={filtro}
        items={[
          { value: "todos", label: "Todos" },
          ...PROJECT_STATUSES.map((s) => ({
            value: s,
            label: PROJECT_STATUS_LABELS[s],
          })),
        ]}
      />

      {(sp.novo || editing) && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">
            {editing ? "Editar projeto" : "Novo projeto"}
          </h2>
          <ActionForm action={saveProjectAction} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
            <FormGrid>
              <Field label="Nome do projeto" name="name">
                <TextInput id="name" name="name" required defaultValue={String(editing?.name || "")} />
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
              <Field label="Tipo" name="project_type">
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
              <Field label="Status" name="status">
                <TextSelect id="status" name="status" defaultValue={String(editing?.status || "briefing")}>
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {PROJECT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Previsão de entrega" name="delivery_date">
                <TextInput
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  defaultValue={String(editing?.delivery_date || "").slice(0, 10)}
                />
              </Field>
            </FormGrid>
            <Field label="Descrição" name="description">
              <TextTextarea
                id="description"
                name="description"
                defaultValue={String(editing?.description || "")}
              />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar projeto
              </button>
              <Link href="/plataforma/projetos" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      <div className="mt-6">
        {projects.length === 0 ? (
          <EmptyState
            title="Nenhum projeto em execução"
            description="Crie projetos para acompanhar entregas sem misturar com o registro de vendas."
            actionHref={writable ? "/plataforma/projetos?novo=1" : undefined}
            actionLabel={writable ? "Novo projeto" : undefined}
          />
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Entrega</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const row = p as {
                    id: string;
                    name: string;
                    client_name: string | null;
                    project_type: ProjectType;
                    status: ProjectStatus;
                    delivery_date: string | null;
                  };
                  return (
                    <tr key={row.id}>
                      <td>{row.name}</td>
                      <td>{row.client_name || "—"}</td>
                      <td>{PROJECT_TYPE_LABELS[row.project_type]}</td>
                      <td>{PROJECT_STATUS_LABELS[row.status]}</td>
                      <td className="font-mono text-xs">{formatDate(row.delivery_date)}</td>
                      <td className="space-x-2 whitespace-nowrap">
                        {writable ? (
                          <>
                            <Link href={`/plataforma/projetos?editar=${row.id}`} className="text-link text-sm">
                              Editar
                            </Link>
                            <form
                              action={async () => {
                                "use server";
                                await actionArchiveProject(row.id);
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

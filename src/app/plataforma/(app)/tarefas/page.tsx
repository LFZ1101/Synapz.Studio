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
import { actionArchiveTask, actionSaveTask } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDate } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { getDb } from "@/lib/plataforma/db";
import { listProjects, listTasks, listTeam } from "@/lib/plataforma/services";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/plataforma/types";

export const metadata = { title: "Tarefas" };

async function saveTaskAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveTask(formData);
}

export default async function TarefasPage({
  searchParams,
}: {
  searchParams: Promise<{
    filtro?: string;
    novo?: string;
    editar?: string;
    opportunity_id?: string;
    project_id?: string;
  }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const filtro = sp.filtro || "todos";
  const tasks = listTasks(user.orgId, { status: filtro });
  const projects = listProjects(user.orgId);
  const team = listTeam(user.orgId);
  const writable = can(user.role, "write");
  const editing = sp.editar
    ? (getDb()
        .prepare(`SELECT * FROM tasks WHERE org_id = ? AND id = ?`)
        .get(user.orgId, sp.editar) as Record<string, unknown> | undefined)
    : null;

  return (
    <div>
      <PageHeader
        eyebrow="Rotina"
        title="Tarefas"
        description="Priorize o que move projeto e oportunidade. Vincule responsáveis e prazos."
        actions={
          writable ? (
            <Link href="/plataforma/tarefas?novo=1" className="platform-btn">
              Nova tarefa
            </Link>
          ) : null
        }
      />

      <FilterTabs
        basePath="/plataforma/tarefas"
        active={filtro}
        items={[
          { value: "todos", label: "Todas" },
          ...TASK_STATUSES.map((s) => ({
            value: s,
            label: TASK_STATUS_LABELS[s],
          })),
        ]}
      />

      {(sp.novo || editing) && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">
            {editing ? "Editar tarefa" : "Nova tarefa"}
          </h2>
          <ActionForm action={saveTaskAction} className="space-y-4">
            {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
            {sp.opportunity_id ? (
              <input type="hidden" name="opportunity_id" value={sp.opportunity_id} />
            ) : null}
            <FormGrid>
              <Field label="Título" name="title">
                <TextInput id="title" name="title" required defaultValue={String(editing?.title || "")} />
              </Field>
              <Field label="Status" name="status">
                <TextSelect id="status" name="status" defaultValue={String(editing?.status || "todo")}>
                  {TASK_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {TASK_STATUS_LABELS[s]}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Prioridade" name="priority">
                <TextSelect id="priority" name="priority" defaultValue={String(editing?.priority || "media")}>
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {TASK_PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Prazo" name="due_date">
                <TextInput
                  id="due_date"
                  name="due_date"
                  type="date"
                  defaultValue={String(editing?.due_date || "").slice(0, 10)}
                />
              </Field>
              <Field label="Projeto" name="project_id">
                <TextSelect
                  id="project_id"
                  name="project_id"
                  defaultValue={String(editing?.project_id || sp.project_id || "")}
                >
                  <option value="">Sem projeto</option>
                  {projects.map((p) => (
                    <option key={String((p as { id: string }).id)} value={String((p as { id: string }).id)}>
                      {String((p as { name: string }).name)}
                    </option>
                  ))}
                </TextSelect>
              </Field>
              <Field label="Responsável" name="assignee_id">
                <TextSelect
                  id="assignee_id"
                  name="assignee_id"
                  defaultValue={String(editing?.assignee_id || "")}
                >
                  <option value="">Sem responsável</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </TextSelect>
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
                Salvar tarefa
              </button>
              <Link href="/plataforma/tarefas" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      <div className="mt-6">
        {tasks.length === 0 ? (
          <EmptyState
            title="Nenhuma tarefa"
            description="Crie a primeira tarefa para organizar a execução do dia."
            actionHref={writable ? "/plataforma/tarefas?novo=1" : undefined}
            actionLabel={writable ? "Nova tarefa" : undefined}
          />
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Projeto</th>
                  <th>Status</th>
                  <th>Prioridade</th>
                  <th>Prazo</th>
                  <th>Responsável</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const row = t as {
                    id: string;
                    title: string;
                    project_name: string | null;
                    status: TaskStatus;
                    priority: TaskPriority;
                    due_date: string | null;
                    assignee_name: string | null;
                  };
                  return (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{row.project_name || "—"}</td>
                      <td>{TASK_STATUS_LABELS[row.status]}</td>
                      <td>{TASK_PRIORITY_LABELS[row.priority]}</td>
                      <td className="font-mono text-xs">{formatDate(row.due_date)}</td>
                      <td>{row.assignee_name || "—"}</td>
                      <td className="space-x-2 whitespace-nowrap">
                        {writable ? (
                          <>
                            <Link href={`/plataforma/tarefas?editar=${row.id}`} className="text-link text-sm">
                              Editar
                            </Link>
                            <form
                              action={async () => {
                                "use server";
                                await actionArchiveTask(row.id);
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

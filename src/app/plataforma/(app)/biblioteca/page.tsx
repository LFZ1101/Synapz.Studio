import Link from "next/link";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { EmptyState } from "@/components/plataforma/EmptyState";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
  TextTextarea,
} from "@/components/plataforma/FormPrimitives";
import { PageHeader } from "@/components/plataforma/PageHeader";
import {
  actionArchivePrompt,
  actionArchiveSkill,
  actionSavePrompt,
  actionSaveSkill,
  actionSeedLibrary,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import { listPrompts, listSkills, seedSynapzLibrary } from "@/lib/plataforma/extras";

export const metadata = { title: "Prompts e Skills" };

async function savePromptAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSavePrompt(formData);
}

async function saveSkillAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveSkill(formData);
}

export default async function BibliotecaPage({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string; novo?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const aba = sp.aba === "skills" ? "skills" : "prompts";
  const writable = can(user.role, "write");

  if (writable && listPrompts(user.orgId).length === 0 && listSkills(user.orgId).length === 0) {
    seedSynapzLibrary(user);
  }

  const prompts = listPrompts(user.orgId);
  const skills = listSkills(user.orgId);

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="Prompts e Skills"
        description="Templates e métodos da SYNAPZ. Conteúdo próprio da operação — editável e expansível."
        actions={
          writable ? (
            <>
              <form
                action={async () => {
                  "use server";
                  await actionSeedLibrary();
                }}
              >
                <button type="submit" className="platform-btn-ghost">
                  Recarregar starters
                </button>
              </form>
              <Link
                href={`/plataforma/biblioteca?aba=${aba}&novo=1`}
                className="platform-btn"
              >
                Novo {aba === "skills" ? "skill" : "prompt"}
              </Link>
            </>
          ) : null
        }
      />

      <div className="mb-6 flex gap-2">
        <Link
          href="/plataforma/biblioteca?aba=prompts"
          className={`platform-chip ${aba === "prompts" ? "is-active" : ""}`}
        >
          Prompts ({prompts.length})
        </Link>
        <Link
          href="/plataforma/biblioteca?aba=skills"
          className={`platform-chip ${aba === "skills" ? "is-active" : ""}`}
        >
          Skills ({skills.length})
        </Link>
        <Link href="/plataforma/gerador-prompts" className="platform-chip">
          Abrir gerador
        </Link>
      </div>

      {sp.novo && writable && aba === "prompts" ? (
        <section className="platform-panel mb-6">
          <h2 className="font-display text-xl mb-4">Novo prompt</h2>
          <ActionForm action={savePromptAction} className="space-y-4">
            <FormGrid>
              <Field label="Título" name="title">
                <TextInput id="title" name="title" required />
              </Field>
              <Field label="Categoria" name="category">
                <TextInput id="category" name="category" placeholder="comercial, crm..." />
              </Field>
            </FormGrid>
            <Field label="Corpo do prompt" name="body">
              <TextTextarea id="body" name="body" required className="min-h-40" />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar prompt
              </button>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {sp.novo && writable && aba === "skills" ? (
        <section className="platform-panel mb-6">
          <h2 className="font-display text-xl mb-4">Novo skill</h2>
          <ActionForm action={saveSkillAction} className="space-y-4">
            <FormGrid>
              <Field label="Título" name="title">
                <TextInput id="title" name="title" required />
              </Field>
              <Field label="Categoria" name="category">
                <TextInput id="category" name="category" />
              </Field>
            </FormGrid>
            <Field label="Resumo" name="summary">
              <TextInput id="summary" name="summary" />
            </Field>
            <Field label="Conteúdo" name="body">
              <TextTextarea id="body" name="body" required className="min-h-40" />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar skill
              </button>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {aba === "prompts" ? (
        prompts.length === 0 ? (
          <EmptyState title="Sem prompts" description="Crie o primeiro template da operação." />
        ) : (
          <div className="space-y-3">
            {prompts.map((p) => (
              <article key={String(p.id)} className="platform-panel">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{String(p.category || "geral")}</p>
                    <h3 className="font-display text-xl">{String(p.title)}</h3>
                  </div>
                  {writable ? (
                    <form
                      action={async () => {
                        "use server";
                        await actionArchivePrompt(String(p.id));
                      }}
                    >
                      <button type="submit" className="platform-btn-danger">
                        Arquivar
                      </button>
                    </form>
                  ) : null}
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs text-synapz-signal">
                  {String(p.body)}
                </pre>
              </article>
            ))}
          </div>
        )
      ) : skills.length === 0 ? (
        <EmptyState title="Sem skills" description="Documente métodos e checklists da equipe." />
      ) : (
        <div className="space-y-3">
          {skills.map((s) => (
            <article key={String(s.id)} className="platform-panel">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{String(s.category || "método")}</p>
                  <h3 className="font-display text-xl">{String(s.title)}</h3>
                  <p className="mt-1 text-sm text-synapz-signal">{String(s.summary || "")}</p>
                </div>
                {writable ? (
                  <form
                    action={async () => {
                      "use server";
                      await actionArchiveSkill(String(s.id));
                    }}
                  >
                    <button type="submit" className="platform-btn-danger">
                      Arquivar
                    </button>
                  </form>
                ) : null}
              </div>
              <pre className="mt-3 whitespace-pre-wrap font-mono text-xs text-synapz-signal">
                {String(s.body)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

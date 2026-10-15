import { ActionForm } from "@/components/plataforma/ActionForm";
import {
  Field,
  FormActions,
  FormGrid,
  TextSelect,
  TextTextarea,
} from "@/components/plataforma/FormPrimitives";
import { PageHeader } from "@/components/plataforma/PageHeader";
import {
  actionDeleteGeneratedPrompt,
  actionGeneratePrompt,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDateTime } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { listGeneratedPrompts } from "@/lib/plataforma/extras";

export const metadata = { title: "Gerador de Prompts" };

async function generateAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionGeneratePrompt(formData);
}

export default async function GeradorPage() {
  const user = await requireUser();
  const history = listGeneratedPrompts(user.orgId);
  const writable = can(user.role, "write");
  const latest = history[0];

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="Gerador de Prompts"
        description="Crie ou melhore prompts localmente, com estrutura SYNAPZ. Sem API externa e sem limite de créditos de terceiros."
      />

      {writable ? (
        <section className="platform-panel mb-6">
          <ActionForm action={generateAction} className="space-y-4">
            <FormGrid>
              <Field label="Modo" name="mode">
                <TextSelect id="mode" name="mode" defaultValue="criar">
                  <option value="criar">Criar a partir de uma ideia</option>
                  <option value="melhorar">Melhorar meu prompt</option>
                </TextSelect>
              </Field>
              <Field label="Formato" name="format">
                <TextSelect id="format" name="format" defaultValue="texto">
                  <option value="texto">Texto</option>
                  <option value="json">JSON</option>
                </TextSelect>
              </Field>
            </FormGrid>
            <Field label="Ideia ou prompt" name="text">
              <TextTextarea
                id="text"
                name="text"
                required
                className="min-h-36"
                placeholder="Descreva o que quer fazer ou cole um prompt existente"
              />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Gerar prompt
              </button>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {latest ? (
        <section className="platform-panel mb-6">
          <p className="eyebrow">Resultado mais recente</p>
          <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap font-mono text-xs text-synapz-neural">
            {String(latest.output_text)}
          </pre>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl mb-3">Histórico</h2>
        {history.length === 0 ? (
          <p className="text-sm text-synapz-signal">
            Seu histórico começa com o próximo prompt.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <article key={String(item.id)} className="platform-panel">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="eyebrow">
                    {String(item.mode)} · {String(item.format)} ·{" "}
                    {formatDateTime(String(item.created_at))}
                  </p>
                  {writable ? (
                    <form
                      action={async () => {
                        "use server";
                        await actionDeleteGeneratedPrompt(String(item.id));
                      }}
                    >
                      <button type="submit" className="platform-btn-danger">
                        Excluir
                      </button>
                    </form>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-synapz-signal line-clamp-2">
                  {String(item.input_text)}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

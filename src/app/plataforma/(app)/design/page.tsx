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
  actionArchiveDesignRef,
  actionSaveDesignRef,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import { listDesignRefs } from "@/lib/plataforma/extras";

export const metadata = { title: "SYNAPZ Design" };

async function saveAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveDesignRef(formData);
}

const TOKENS = [
  { name: "Preto SYNAPZ", value: "#050605", role: "Base" },
  { name: "Verde Impulso", value: "#B7FF00", role: "Ação / sinal" },
  { name: "Branco Neural", value: "#ECEDE7", role: "Texto" },
  { name: "Grafite", value: "#121412", role: "Superfície" },
  { name: "Cinza Sinal", value: "#898D86", role: "Secundário" },
];

export default async function DesignPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const refs = listDesignRefs(user.orgId);
  const writable = can(user.role, "write");

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="SYNAPZ Design"
        description="Tokens oficiais e referências visuais da sua operação — acervo próprio, sem bibliotecas de terceiros."
        actions={
          writable ? (
            <Link href="/plataforma/design?novo=1" className="platform-btn">
              Nova referência
            </Link>
          ) : null
        }
      />

      <section className="platform-panel mb-6">
        <h2 className="font-display text-xl">Tokens oficiais</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {TOKENS.map((t) => (
            <div key={t.value} className="overflow-hidden rounded-[16px_6px] border border-white/10">
              <div className="h-16" style={{ background: t.value }} />
              <div className="p-3">
                <p className="text-sm text-synapz-neural">{t.name}</p>
                <p className="font-mono text-xs text-synapz-impulse">{t.value}</p>
                <p className="mt-1 text-xs text-synapz-signal">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-synapz-signal">
          Tipografia: Space Grotesk (títulos), Inter (interface), IBM Plex Mono (dados).
        </p>
      </section>

      {sp.novo && writable ? (
        <section className="platform-panel mb-6">
          <h2 className="font-display text-xl mb-4">Nova referência</h2>
          <ActionForm action={saveAction} className="space-y-4">
            <FormGrid>
              <Field label="Título" name="title">
                <TextInput id="title" name="title" required />
              </Field>
              <Field label="URL" name="url">
                <TextInput id="url" name="url" placeholder="https://" />
              </Field>
              <Field label="Tags" name="tags">
                <TextInput id="tags" name="tags" placeholder="marca, web, motion" />
              </Field>
            </FormGrid>
            <Field label="Notas" name="notes">
              <TextTextarea id="notes" name="notes" />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar referência
              </button>
              <Link href="/plataforma/design" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {refs.length === 0 ? (
        <EmptyState
          title="Nenhuma referência salva"
          description="Guarde links e notas de direção visual para a equipe."
          actionHref={writable ? "/plataforma/design?novo=1" : undefined}
          actionLabel={writable ? "Adicionar referência" : undefined}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {refs.map((ref) => (
            <article key={String(ref.id)} className="platform-panel">
              <h3 className="font-display text-lg">{String(ref.title)}</h3>
              {ref.url ? (
                <a href={String(ref.url)} target="_blank" rel="noreferrer" className="text-link text-sm">
                  {String(ref.url)}
                </a>
              ) : null}
              <p className="mt-2 text-sm text-synapz-signal">{String(ref.notes || "Sem notas")}</p>
              {writable ? (
                <form
                  className="mt-4"
                  action={async () => {
                    "use server";
                    await actionArchiveDesignRef(String(ref.id));
                  }}
                >
                  <button type="submit" className="platform-btn-danger">
                    Arquivar
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

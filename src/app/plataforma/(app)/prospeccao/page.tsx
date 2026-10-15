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
  actionArchiveProspect,
  actionImportProspect,
  actionSaveProspect,
} from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { can } from "@/lib/plataforma/permissions";
import { listProspects } from "@/lib/plataforma/extras";

export const metadata = { title: "Prospecção" };

async function saveAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveProspect(formData);
}

export default async function ProspeccaoPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const prospects = listProspects(user.orgId);
  const writable = can(user.role, "write");

  return (
    <div>
      <PageHeader
        eyebrow="Ferramentas"
        title="Prospecção"
        description="Cadastro manual de leads por segmento e localidade. Sem consumo de créditos externos — importe para o CRM quando quiser."
        actions={
          writable ? (
            <Link href="/plataforma/prospeccao?novo=1" className="platform-btn">
              Novo prospecto
            </Link>
          ) : null
        }
      />

      {sp.novo && writable ? (
        <section className="platform-panel mb-6">
          <h2 className="font-display text-xl mb-4">Novo prospecto</h2>
          <ActionForm action={saveAction} className="space-y-4">
            <FormGrid>
              <Field label="Empresa" name="company">
                <TextInput id="company" name="company" required />
              </Field>
              <Field label="Contato" name="contact_name">
                <TextInput id="contact_name" name="contact_name" />
              </Field>
              <Field label="Telefone / WhatsApp" name="phone">
                <TextInput id="phone" name="phone" />
              </Field>
              <Field label="E-mail" name="email">
                <TextInput id="email" name="email" type="email" />
              </Field>
              <Field label="Segmento" name="segment">
                <TextInput id="segment" name="segment" placeholder="Clínica, ecommerce..." />
              </Field>
              <Field label="Cidade / área" name="city">
                <TextInput id="city" name="city" />
              </Field>
              <Field label="Origem" name="source">
                <TextInput id="source" name="source" defaultValue="manual" />
              </Field>
            </FormGrid>
            <Field label="Notas" name="notes">
              <TextTextarea id="notes" name="notes" />
            </Field>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar prospecto
              </button>
              <Link href="/plataforma/prospeccao" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      {prospects.length === 0 ? (
        <EmptyState
          title="Nenhum prospecto ainda"
          description="Registre empresas e contatos manualmente; depois envie para Clientes + CRM."
          actionHref={writable ? "/plataforma/prospeccao?novo=1" : undefined}
          actionLabel={writable ? "Novo prospecto" : undefined}
        />
      ) : (
        <div className="platform-table-wrap">
          <table className="platform-table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contato</th>
                <th>Segmento</th>
                <th>Cidade</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((p) => (
                <tr key={String(p.id)}>
                  <td>{String(p.company)}</td>
                  <td>
                    {String(p.contact_name || "—")}
                    <div className="font-mono text-[0.65rem] text-synapz-signal">
                      {String(p.phone || p.email || "")}
                    </div>
                  </td>
                  <td>{String(p.segment || "—")}</td>
                  <td>{String(p.city || "—")}</td>
                  <td>{String(p.status)}</td>
                  <td className="space-x-2 whitespace-nowrap">
                    {writable && p.status !== "importado" ? (
                      <form
                        action={async () => {
                          "use server";
                          await actionImportProspect(String(p.id));
                        }}
                        className="inline"
                      >
                        <button type="submit" className="platform-btn">
                          Importar CRM
                        </button>
                      </form>
                    ) : (
                      <Link href="/plataforma/crm" className="text-link text-sm">
                        Ver CRM
                      </Link>
                    )}
                    {writable ? (
                      <form
                        action={async () => {
                          "use server";
                          await actionArchiveProspect(String(p.id));
                        }}
                        className="inline"
                      >
                        <button type="submit" className="platform-btn-danger">
                          Arquivar
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

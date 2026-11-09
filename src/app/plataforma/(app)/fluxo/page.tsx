import Link from "next/link";
import { ActionForm } from "@/components/plataforma/ActionForm";
import { EmptyState } from "@/components/plataforma/EmptyState";
import {
  Field,
  FormActions,
  FormGrid,
  TextInput,
  TextSelect,
} from "@/components/plataforma/FormPrimitives";
import { Money } from "@/components/plataforma/Money";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { StatCard } from "@/components/plataforma/StatCard";
import { actionDeleteCash, actionSaveCash } from "@/lib/plataforma/actions";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDate } from "@/lib/plataforma/format";
import { can } from "@/lib/plataforma/permissions";
import { cashStats, listCashEntries } from "@/lib/plataforma/services";

export const metadata = { title: "Fluxo de caixa" };

async function saveCashAction(_prev: unknown, formData: FormData) {
  "use server";
  return actionSaveCash(formData);
}

export default async function FluxoPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const entries = listCashEntries(user.orgId);
  const stats = cashStats(user.orgId);
  const writable = can(user.role, "write");
  const hide = user.hideValues;

  return (
    <div>
      <PageHeader
        eyebrow="Financeiro"
        title="Fluxo de caixa manual"
        description="Lance entradas e saídas reais. Sem integração de gateway neste MVP — apenas controle manual confiável."
        actions={
          writable ? (
            <Link href="/plataforma/fluxo?novo=1" className="platform-btn">
              Novo lançamento
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard label="Entradas" value={<Money cents={stats.income} hide={hide} />} />
        <StatCard label="Saídas" value={<Money cents={stats.expense} hide={hide} />} />
        <StatCard label="Saldo" value={<Money cents={stats.balance} hide={hide} />} />
      </div>

      {sp.novo && writable ? (
        <section className="platform-panel mt-6">
          <h2 className="font-display text-xl mb-4">Novo lançamento</h2>
          <ActionForm action={saveCashAction} className="space-y-4">
            <FormGrid>
              <Field label="Tipo" name="entry_type">
                <TextSelect id="entry_type" name="entry_type" defaultValue="entrada">
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </TextSelect>
              </Field>
              <Field label="Valor (R$)" name="amount">
                <TextInput id="amount" name="amount" inputMode="decimal" required />
              </Field>
              <Field label="Descrição" name="description">
                <TextInput id="description" name="description" required />
              </Field>
              <Field label="Categoria" name="category">
                <TextInput id="category" name="category" />
              </Field>
              <Field label="Data" name="occurred_at">
                <TextInput
                  id="occurred_at"
                  name="occurred_at"
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </Field>
            </FormGrid>
            <FormActions>
              <button type="submit" className="platform-btn">
                Salvar lançamento
              </button>
              <Link href="/plataforma/fluxo" className="platform-btn-ghost">
                Cancelar
              </Link>
            </FormActions>
          </ActionForm>
        </section>
      ) : null}

      <div className="mt-6">
        {entries.length === 0 ? (
          <EmptyState
            title="Fluxo ainda vazio"
            description="Registre a primeira entrada ou saída para acompanhar o saldo operacional."
            actionHref={writable ? "/plataforma/fluxo?novo=1" : undefined}
            actionLabel={writable ? "Novo lançamento" : undefined}
          />
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Tipo</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const row = e as {
                    id: string;
                    entry_type: string;
                    description: string;
                    category: string | null;
                    amount_cents: number;
                    occurred_at: string;
                  };
                  return (
                    <tr key={row.id}>
                      <td className="font-mono text-xs">{formatDate(row.occurred_at)}</td>
                      <td>{row.entry_type === "entrada" ? "Entrada" : "Saída"}</td>
                      <td>{row.description}</td>
                      <td>{row.category || "—"}</td>
                      <td>
                        <Money cents={row.amount_cents} hide={hide} />
                      </td>
                      <td>
                        {writable ? (
                          <form
                            action={async () => {
                              "use server";
                              await actionDeleteCash(row.id);
                            }}
                          >
                            <button type="submit" className="platform-btn-danger">
                              Excluir
                            </button>
                          </form>
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

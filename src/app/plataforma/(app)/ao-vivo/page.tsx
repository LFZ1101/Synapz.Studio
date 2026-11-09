import { Money } from "@/components/plataforma/Money";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { StatCard } from "@/components/plataforma/StatCard";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDateTime } from "@/lib/plataforma/format";
import { getLiveSales } from "@/lib/plataforma/extras";

export const metadata = { title: "Ao vivo" };

export default async function AoVivoPage() {
  const user = await requireUser();
  const live = getLiveSales(user.orgId);
  const hide = user.hideValues;
  const maxRev = Math.max(...live.byHour.map((h) => h.revenue), 1);

  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Vendas ao vivo"
        description="Pulso do dia: total vendido hoje, tendência por horário, quantidade, ticket e lucro. Apenas vendas registradas na central — sem duplicar pagamentos externos."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total vendido hoje" value={<Money cents={live.revenue} hide={hide} />} />
        <StatCard label="Lucro de hoje" value={<Money cents={live.profit} hide={hide} />} />
        <StatCard label="Ticket médio" value={<Money cents={live.ticket} hide={hide} />} />
        <StatCard
          label="Vendas"
          value={<span className="font-mono">{live.count}</span>}
          hint="Registros manuais do dia"
        />
      </div>

      <section className="platform-panel mt-6">
        <h2 className="font-display text-xl">Tendência por horário</h2>
        <div className="platform-chart mt-4">
          {live.byHour.map((bucket) => (
            <div
              key={bucket.hour}
              className="platform-chart-bar"
              style={{
                height: `${Math.max(4, (bucket.revenue / maxRev) * 100)}%`,
                opacity: bucket.count ? 1 : 0.15,
              }}
              title={`${bucket.hour}h · ${bucket.count} venda(s)`}
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[0.65rem] text-synapz-signal">
          00h — 23h (hoje)
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl mb-3">Vendas de hoje</h2>
        {live.sales.length === 0 ? (
          <p className="text-sm text-synapz-signal">
            Nenhuma venda registrada hoje. O painel permanece zerado até o primeiro lançamento real.
          </p>
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Horário</th>
                  <th>Venda</th>
                  <th>Cliente</th>
                  <th>Valor</th>
                  <th>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {live.sales.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{formatDateTime(s.sold_at)}</td>
                    <td>{s.name}</td>
                    <td>{s.client_name || "—"}</td>
                    <td>
                      <Money cents={s.amount_cents} hide={hide} />
                    </td>
                    <td>
                      <Money cents={s.amount_cents - s.cost_cents} hide={hide} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import Link from "next/link";
import { EmptyState } from "@/components/plataforma/EmptyState";
import { FilterTabs } from "@/components/plataforma/FilterTabs";
import { Money, Percent } from "@/components/plataforma/Money";
import { PageHeader } from "@/components/plataforma/PageHeader";
import { PeriodSummary } from "@/components/plataforma/PeriodSummary";
import { StatCard } from "@/components/plataforma/StatCard";
import { requireUser } from "@/lib/plataforma/auth";
import { formatDate, formatMoney } from "@/lib/plataforma/format";
import { buildPeriodSummaryText } from "@/lib/plataforma/extras";
import { getDashboardMetrics } from "@/lib/plataforma/services";
import {
  PERIOD_FILTERS,
  PERIOD_LABELS,
  type PeriodFilter,
} from "@/lib/plataforma/types";

export const metadata = { title: "Visão geral" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const period = (PERIOD_FILTERS.includes(sp.periodo as PeriodFilter)
    ? sp.periodo
    : "1m") as PeriodFilter;
  const metrics = getDashboardMetrics(user.orgId, period);
  const maxRevenue = Math.max(...metrics.series.map((s) => s.revenue), 1);
  const hide = user.hideValues;

  return (
    <div>
      <PageHeader
        eyebrow="Operação"
        title="Visão geral"
        description="Acompanhe lucro, receita e ritmo comercial do período. Valores vazios significam ausência de lançamentos — não há números fictícios."
        actions={
          <>
            <Link href="/plataforma/clientes?novo=1" className="platform-btn">
              Novo cliente
            </Link>
            <Link href="/plataforma/vendas?novo=1" className="platform-btn-ghost">
              Registrar venda
            </Link>
          </>
        }
      />

      <FilterTabs
        basePath="/plataforma"
        param="periodo"
        active={period}
        items={PERIOD_FILTERS.map((p) => ({
          value: p,
          label: PERIOD_LABELS[p],
        }))}
      />

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Lucro no período"
          value={<Money cents={metrics.profit} hide={hide} />}
          hint={
            <span>
              vs período anterior <Percent value={metrics.profitChange} hide={hide} />
            </span>
          }
        />
        <StatCard
          label="Receita total"
          value={<Money cents={metrics.revenue} hide={hide} />}
          hint={
            <span>
              variação <Percent value={metrics.revenueChange} hide={hide} />
            </span>
          }
        />
        <StatCard
          label="Ticket médio"
          value={<Money cents={metrics.ticket} hide={hide} />}
          hint={`${metrics.salesCount} venda(s)`}
        />
        <StatCard
          label="Clientes ativos"
          value={<span className="font-mono tabular-nums">{metrics.clientCount}</span>}
          hint="Carteira sem arquivados"
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="platform-panel">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl">Resultado no tempo</h2>
            <span className="eyebrow">{PERIOD_LABELS[period]}</span>
          </div>
          {metrics.series.length === 0 ? (
            <p className="mt-8 text-sm text-synapz-signal">
              Sem vendas neste período para montar o gráfico.
            </p>
          ) : (
            <div className="platform-chart mt-4" role="img" aria-label="Gráfico de receita">
              {metrics.series.map((point) => (
                <div
                  key={point.day}
                  className="platform-chart-bar"
                  style={{ height: `${Math.max(8, (point.revenue / maxRevenue) * 100)}%` }}
                  title={`${point.day}`}
                />
              ))}
            </div>
          )}
        </section>

        <section className="platform-panel">
          <h2 className="font-display text-xl">Carteira</h2>
          <p className="mt-2 text-sm text-synapz-signal">
            Receita e lucro acumulados no filtro atual, com atalhos para operar.
          </p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-synapz-signal">Receita</dt>
              <dd>
                <Money cents={metrics.revenue} hide={hide} />
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-synapz-signal">Lucro</dt>
              <dd>
                <Money cents={metrics.profit} hide={hide} />
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/plataforma/clientes" className="platform-chip">
              Clientes
            </Link>
            <Link href="/plataforma/vendas" className="platform-chip">
              Vendas
            </Link>
            <Link href="/plataforma/crm" className="platform-chip">
              CRM
            </Link>
          </div>
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl">Vendas recentes</h2>
          <Link href="/plataforma/vendas?novo=1" className="platform-chip">
            Nova venda
          </Link>
        </div>
        {metrics.recentSales.length === 0 ? (
          <EmptyState
            title="Nenhuma venda registrada"
            description="Registre a primeira venda para acompanhar receita, custo e lucro com dados reais."
            actionHref="/plataforma/vendas?novo=1"
            actionLabel="Registrar primeira venda"
          />
        ) : (
          <div className="platform-table-wrap">
            <table className="platform-table">
              <thead>
                <tr>
                  <th>Projeto / venda</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {(
                  metrics.recentSales as Array<{
                    id: string;
                    name: string;
                    client_name: string | null;
                    sold_at: string;
                    amount_cents: number;
                    cost_cents: number;
                  }>
                ).map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.name}</td>
                    <td>{sale.client_name || "—"}</td>
                    <td className="font-mono text-xs">{formatDate(sale.sold_at)}</td>
                    <td>
                      <Money cents={sale.amount_cents} hide={hide} />
                    </td>
                    <td>
                      <Money
                        cents={sale.amount_cents - sale.cost_cents}
                        hide={hide}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {metrics.clientCount === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Comece pela carteira de clientes"
            description="Com a base vazia, cadastre o primeiro cliente para alimentar CRM, projetos e vendas."
            actionHref="/plataforma/clientes?novo=1"
            actionLabel="Cadastrar cliente"
          />
        </div>
      ) : null}

      <PeriodSummary
        text={buildPeriodSummaryText({
          orgName: user.orgName,
          periodLabel: PERIOD_LABELS[period],
          revenueLabel: formatMoney(metrics.revenue, hide),
          profitLabel: formatMoney(metrics.profit, hide),
          ticketLabel: formatMoney(metrics.ticket, hide),
          salesCount: metrics.salesCount,
        })}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/plataforma/ao-vivo" className="platform-chip">
          Abrir vendas ao vivo
        </Link>
        <Link href="/plataforma/builder" className="platform-chip">
          Builder de Sites
        </Link>
        <Link href="/plataforma/gerador-prompts" className="platform-chip">
          Gerador de Prompts
        </Link>
      </div>
    </div>
  );
}

import { useMemo } from "react"

import KpiCard from "../../components/KpiCard"
import SalesTrendChart from "../../components/SalesTrendChart"
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics"
import { useSalesTrend } from "../../hooks/useSalesTrend"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const DashboardOverview = () => {
  const { data: metrics, isLoading: loadingMetrics, isError } = useDashboardMetrics()
  const { trend, isLoading: loadingTrend } = useSalesTrend()

  const cards = useMemo(
    () => [
      {
        label: "Total de vendas",
        value: metrics?.total_sales ? formatCurrency(metrics.total_sales) : undefined,
        helper: "Acumulado no período",
      },
      {
        label: "Ticket médio",
        value: metrics?.average_ticket ? formatCurrency(metrics.average_ticket) : undefined,
        helper: "Valor médio por venda",
      },
      {
        label: "Quantidade vendida",
        value: metrics?.total_quantity?.toLocaleString("pt-BR"),
        helper: "Itens negociados",
      },
      {
        label: "Produto em destaque",
        value: metrics?.top_product ?? "Carregando...",
        helper: "Maior faturamento",
      },
    ],
    [metrics],
  )

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <KpiCard
            key={card.label}
            label={card.label}
            value={card.value}
            helper={card.helper}
            indicator={loadingMetrics && card.label === "Total de vendas" ? "Carregando..." : undefined}
          />
        ))}
      </div>

      {metrics?.alert_message && (
        <div className="rounded-2xl border border-slate-200 bg-slate-900/5 p-4 text-slate-700">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
            Insight inteligente
          </p>
          <p className="text-sm font-semibold text-slate-800">{metrics.alert_message}</p>
        </div>
      )}

      <SalesTrendChart data={loadingTrend ? [] : trend.map(({ month, total }) => ({ month, total }))} />

      {isError && (
        <p className="text-center text-sm text-red-500">
          Não foi possível carregar os dados. Confirme se a API está ativa.
        </p>
      )}
    </section>
  )
}

export default DashboardOverview


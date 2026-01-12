import { useMemo, useState } from "react"

import KpiCard from "../../components/KpiCard"
import ProductMonthlySalesTrendChart from "../../components/ProductMonthlySalesTrendChart"
import ProductSalesPieChart from "../../components/ProductSalesPieChart"
import SalesTrendChart from "../../components/SalesTrendChart"
import { useDashboardMetrics } from "../../hooks/useDashboardMetrics"
import { useProducts } from "../../hooks/useProducts"
import { useSalesQuantityByProduct } from "../../hooks/useSalesQuantityByProduct"
import { useSalesTrend } from "../../hooks/useSalesTrend"
import { useProductMonthlySalesTrend } from "../../hooks/useProductMonthlySalesTrend"
import { downloadDatabaseCsv } from "../../services/api"

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const DashboardOverview = () => {
  const { data: metrics, isLoading: loadingMetrics, isError } = useDashboardMetrics()
  const { trend, isLoading: loadingTrend } = useSalesTrend()
  const { data: monthlyTrend, isLoading: loadingMonthlyTrend } = useProductMonthlySalesTrend()
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { data: products, isLoading: loadingProducts } = useProducts()
  const { data: productQuantities, isLoading: loadingProductQuantities } = useSalesQuantityByProduct()

  const sortedProducts = useMemo(
    () => (products ? [...products].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")) : []),
    [products],
  )

  const quantityByProductMap = useMemo(() => {
    const map = new Map<number, number>()
    productQuantities?.forEach((item) => map.set(item.product_id, item.quantity))
    return map
  }, [productQuantities])

  const selectedProductQuantity =
    selectedProductId != null
      ? loadingProductQuantities
        ? undefined
        : quantityByProductMap.get(selectedProductId) ?? 0
      : metrics?.total_quantity

  const selectedProductName =
    selectedProductId != null ? sortedProducts.find((product) => product.id === selectedProductId)?.name : undefined

  const quantityCardValue =
    selectedProductQuantity != null ? selectedProductQuantity.toLocaleString("pt-BR") : undefined

  const quantityCardHelper = selectedProductId
    ? `Itens negociados de ${selectedProductName ?? "item selecionado"}`
    : "Itens negociados"

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
        value: quantityCardValue,
        helper: quantityCardHelper,
      },
      {
        label: "Produto em destaque",
        value: metrics?.top_product ?? "Carregando...",
        helper: "Maior faturamento",
      },
    ],
    [metrics, quantityCardValue, quantityCardHelper],
  )

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const blob = await downloadDatabaseCsv()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "smartmart-data.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert("Não foi possível exportar o CSV no momento.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
            Exportar dados
          </p>
          <p className="text-lg font-semibold text-slate-900">Base completa em CSV</p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isDownloading ? "Gerando CSV..." : "Exportar CSV"}
        </button>
      </div>

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

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Filtro</p>
            <p className="text-lg font-semibold text-slate-900">Quantidade por item</p>
          </div>
          <span className="text-xs text-slate-500">
            {loadingProducts || loadingProductQuantities
              ? "Carregando itens..."
              : `${productQuantities?.length ?? 0} ${productQuantities?.length === 1 ? "item" : "itens"} com vendas`}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="text-sm font-medium text-slate-600" htmlFor="product-filter">
            Produto
          </label>
          <select
            id="product-filter"
            value={selectedProductId ?? ""}
            onChange={(event) => setSelectedProductId(event.target.value ? Number(event.target.value) : null)}
            disabled={loadingProducts || loadingProductQuantities}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400 sm:w-auto"
          >
            <option value="">Todos os itens</option>
            {sortedProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {loadingProductQuantities
            ? "Carregando dados de vendas por item..."
            : selectedProductId
            ? `Total de ${selectedProductQuantity ?? 0} unidades de ${selectedProductName ?? "item selecionado"}.`
            : "Selecione um produto para visualizar a quantidade vendida individual."}
        </p>
      </div>

      <ProductSalesPieChart
        data={loadingProductQuantities ? [] : productQuantities ?? []}
        loading={loadingProductQuantities}
      />

      {metrics?.alert_message && (
        <div className="rounded-2xl border border-slate-200 bg-slate-900/5 p-4 text-slate-700">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">
            Insight inteligente
          </p>
          <p className="text-sm font-semibold text-slate-800">{metrics.alert_message}</p>
        </div>
      )}

      <SalesTrendChart data={loadingTrend ? [] : trend.map(({ month, total }) => ({ month, total }))} />

      <ProductMonthlySalesTrendChart
        data={loadingMonthlyTrend ? [] : monthlyTrend ?? []}
        loading={loadingMonthlyTrend}
      />

      {isError && (
        <p className="text-center text-sm text-red-500">
          Não foi possível carregar os dados. Confirme se a API está ativa.
        </p>
      )}
    </section>
  )
}

export default DashboardOverview


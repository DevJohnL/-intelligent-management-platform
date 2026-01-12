import { useMemo } from "react"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ProductMonthlySalesRecord } from "../hooks/useProductMonthlySalesTrend"

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#6366f1", "#e11d48", "#14b8a6", "#facc15"]

const formatMonthLabel = (year: number, month: number) =>
  new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(new Date(year, month - 1, 1))

const formatQuantity = (value: number) => new Intl.NumberFormat("pt-BR").format(value)

type ProductMonthlySalesTrendChartProps = {
  data: ProductMonthlySalesRecord[]
  loading?: boolean
}

const ProductMonthlySalesTrendChart = ({ data, loading }: ProductMonthlySalesTrendChartProps) => {
  const orderedProducts = useMemo(() => {
    const products = Array.from(new Set(data.map((record) => record.product_name)))
    return products.sort((a, b) => a.localeCompare(b, "pt-BR"))
  }, [data])

  const chartData = useMemo(() => {
    const map = new Map<string, Record<string, number | string>>()

    data.forEach((record) => {
      const { period, year, month, product_name, quantity } = record
      const label = formatMonthLabel(year, month)
      const existing = map.get(period)
      const entry = existing ?? { label, period }
      entry[product_name] = (Number(entry[product_name]) || 0) + quantity
      map.set(period, entry)
    })

    return Array.from(map.values()).sort((a, b) => (String(a.period) || "").localeCompare(String(b.period)))
  }, [data])

  const hasData = chartData.length > 0 && orderedProducts.length > 0

  return (
    <div className="h-[400px] rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">Tendência</p>
          <p className="text-xl font-semibold text-slate-900">Unidades vendidas por produto</p>
        </div>
      </div>

      <div className="h-full ">
        {loading ? (
          <p className="text-sm text-slate-500">Buscando histórico...</p>
        ) : !hasData ? (
          <p className="text-sm text-slate-500">Ainda não há registros de vendas.</p>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData} margin={{ left: 16, right: 16, top: 24, bottom: 12 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: "#475569" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#475569" }}
                tickFormatter={(value) => formatQuantity(Number(value))}
                width={64}
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "none" }}
                formatter={(value: number) => formatQuantity(Number(value))}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend

                verticalAlign="bottom"
                align="center"
                formatter={(value) => <span className="text-xs text-slate-500">{value}</span>}
              />
              {orderedProducts.map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  name={product}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default ProductMonthlySalesTrendChart


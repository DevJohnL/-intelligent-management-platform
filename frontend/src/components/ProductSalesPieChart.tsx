import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import type { SaleQuantityByProduct } from "../hooks/useSalesQuantityByProduct"

const COLORS = ["#475569", "#2563eb", "#7c3aed", "#0ea5e9", "#f97316", "#14b8a6", "#ef4444", "#eab308"]

type ProductSalesPieChartProps = {
  data: SaleQuantityByProduct[]
  loading?: boolean
}

const formatValue = (value: number) => value.toLocaleString("pt-BR")

const ProductSalesPieChart = ({ data, loading = false }: ProductSalesPieChartProps) => {
  const chartData = data.filter((item) => item.quantity > 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500">Comparativo</p>
          <p className="text-lg font-semibold text-slate-900">Vendas por produto</p>
        </div>
        <span className="text-xs text-slate-500">
          {loading
            ? "Buscando dados..."
            : `${chartData.length} ${chartData.length === 1 ? "produto" : "produtos"} com quantidade > 0`}
        </span>
      </div>

      <div className="mt-6 h-72 sm:h-80">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando gráfico de pizza...</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum produto registrado com vendas.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: number) => `${formatValue(value)} unidades`}
                contentStyle={{ borderRadius: 12, border: "none", backgroundColor: "white" }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                formatter={(value) => <span className="text-xs text-slate-500">{value}</span>}
              />
              <Pie
                data={chartData}
                dataKey="quantity"
                nameKey="product_name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.product_id} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default ProductSalesPieChart


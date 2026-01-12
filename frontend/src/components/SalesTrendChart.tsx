import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type SalesTrendChartProps = {
  data: Array<{ month: string; total: number }>
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const SalesTrendChart = ({ data }: SalesTrendChartProps) => (
  <div className="h-72 rounded-3xl border border-white/10 bg-card/80 p-4 shadow-2xl">
    <div className="mb-2 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Tendência</p>
        <p className="text-xl font-semibold text-white">Faturamento mensal</p>
      </div>
      <span className="text-sm text-slate-400">{data.slice(-1)[0] && `Último: ${formatCurrency(data.slice(-1)[0].total)}`}</span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 64, right: 48, top: 32, bottom: 48 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#cbd5f5" }}
          interval="preserveStartEnd"
          tickMargin={18}
          height={40}
          padding={{ left: 8, right: 8 }}
        />
        <YAxis
          width={110}
          tickFormatter={formatCurrency}
          tick={{ fill: "#cbd5f5", textAnchor: "end" }}
          tickMargin={12}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#0f172a", border: "none" }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#34d399"
          strokeWidth={2}
          fill="url(#trendGradient)"
          fillOpacity={0.7}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default SalesTrendChart


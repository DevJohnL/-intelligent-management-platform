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
  <div className="h-72 rounded-2xl border border-slate-200 bg-white/90 p-7 shadow-sm">
    <div className="mb-2 flex items-center justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-slate-500">Tendência</p>
        <p className="text-xl font-semibold text-slate-900">Faturamento mensal</p>
      </div>
      <span className="text-sm text-slate-500">{data.slice(-1)[0] && `Último: ${formatCurrency(data.slice(-1)[0].total)}`}</span>
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: 42, right: 32, top: 32, bottom: 32 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#475569" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.15} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: "#475569" }}
          interval="preserveStartEnd"
          tickMargin={14}
          height={30}
          padding={{ left: 8, right: 8 }}
        />
        <YAxis
          width={100}
          tickFormatter={formatCurrency}
          tick={{ fill: "#475569", textAnchor: "end" }}
          tickMargin={12}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "white", border: "none" }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#475569"
          strokeWidth={2}
          fill="url(#trendGradient)"
          fillOpacity={0.8}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
)

export default SalesTrendChart


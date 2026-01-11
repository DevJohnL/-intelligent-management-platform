import type { ReactNode } from "react"

type KpiCardProps = {
  label: string
  value?: string | number
  helper?: string
  indicator?: ReactNode
}

const KpiCard = ({ label, value, helper, indicator }: KpiCardProps) => (
  <div className="rounded-2xl border border-white/5 bg-card/60 p-4 shadow-xl backdrop-blur">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
      {indicator && <span className="text-sm text-emerald-400">{indicator}</span>}
    </div>
    <p className="mt-4 text-3xl font-semibold text-white">
      {value ?? <span className="text-sm text-slate-500">Carregando...</span>}
    </p>
    {helper && <p className="mt-1 text-sm text-slate-400">{helper}</p>}
  </div>
)

export default KpiCard


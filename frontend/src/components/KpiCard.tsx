import type { ReactNode } from "react"

type KpiCardProps = {
  label: string
  value?: string | number
  helper?: string
  indicator?: ReactNode
}

const KpiCard = ({ label, value, helper, indicator }: KpiCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">{label}</p>
      {indicator && <span className="text-sm text-slate-500">{indicator}</span>}
    </div>
    <p className="mt-4 text-3xl font-semibold text-slate-900">
      {value ?? <span className="text-sm text-slate-500">Carregando...</span>}
    </p>
    {helper && <p className="mt-1 text-sm text-slate-500">{helper}</p>}
  </div>
)

export default KpiCard


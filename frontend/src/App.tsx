import { useState } from "react"

import DashboardOverview from "./features/dashboard/DashboardOverview"
import CsvIngestForm from "./features/forms/CsvIngestForm"
import ProductForm from "./features/forms/ProductForm"
import SaleForm from "./features/forms/SaleForm"

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {sidebarOpen ? (
        <aside className="flex w-96 flex-col gap-6 border-r border-white/5 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.6em] text-slate-500">
                Operações
              </p>
              <p className="text-xs text-slate-400">Cadastre dados e envie CSVs</p>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              aria-label="Recolher painel de operações"
            >
              <span className="text-lg leading-none">⊖</span>
              <span className="text-[0.6rem] tracking-[0.5em] text-slate-300">OCULTAR</span>
            </button>
          </div>
          <div className="space-y-6">
            <ProductForm />
            <SaleForm />
            <CsvIngestForm />
          </div>
        </aside>
      ) : (
        <div className="flex w-16 items-start justify-center px-2 py-4">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center rounded-full border border-white/20 bg-white/0 px-3 py-2 text-white transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            aria-label="Abrir painel de operações"
          >
            <span className="sr-only">Abrir painel de operações</span>
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-white"></span>
              <span className="h-0.5 w-5 bg-white"></span>
              <span className="h-0.5 w-5 bg-white"></span>
            </span>
          </button>
        </div>
      )}

      <main className="flex-1 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <header className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.8em] text-slate-500">
              SmartMart Analytics
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Painel executivo de varejo</h1>
            <p className="max-w-2xl text-slate-400">
              Monitoramos margens, tickets médios e a saúde do negócio em tempo real. Atualize os dados
              via CSV e acompanhe as recomendações inteligentes do Smart Insights.
            </p>
          </header>
          <DashboardOverview />
        </div>
      </main>
    </div>
  )
}

export default App


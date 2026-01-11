import DashboardOverview from "./features/dashboard/DashboardOverview"

const App = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.8em] text-slate-500">SmartMart Analytics</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Painel executivo de varejo</h1>
        <p className="max-w-2xl text-slate-400">
          Monitoramos margens, tickets médios e a saúde do negócio em tempo real. Atualize os dados via CSV
          e acompanhe as recomendações inteligentes do Smart Insights.
        </p>
      </header>
      <DashboardOverview />
    </div>
  </div>
)

export default App


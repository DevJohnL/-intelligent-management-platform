import { FormEvent, useState } from "react"

import { useCsvUpload } from "../../hooks/useCsvUpload"

const entities = [
  { value: "categories", label: "Categorias" },
  { value: "products", label: "Produtos" },
  { value: "sales", label: "Vendas" },
]

const CsvIngestForm = () => {
  const mutation = useCsvUpload()
  const [entity, setEntity] = useState("products")
  const [file, setFile] = useState<File>()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!file) return
    await mutation.mutateAsync({ entity, file })
    setFile(undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        <span>Upload CSV</span>
        <select
          value={entity}
          onChange={(event) => setEntity(event.target.value)}
          className="rounded-full border border-white/10 bg-slate-900/60 px-2 py-1 text-[0.6rem] text-white"
        >
          {entities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <input
        type="file"
        accept=".csv"
        onChange={(event) => {
          const targetFile = event.target.files?.[0]
          setFile(targetFile)
        }}
        className="w-full rounded-xl border border-dashed border-white/20 bg-slate-900/60 px-3 py-2 text-sm text-white"
        required
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={mutation.isLoading || !file}
      >
        {mutation.isLoading ? "Processando..." : "Enviar CSV"}
      </button>
      {mutation.isSuccess && (
        <p className="text-xs text-emerald-400">{mutation.data?.insight}</p>
      )}
      {mutation.isError && (
        <p className="text-xs text-amber-400">Falha no upload. Refaça o envio.</p>
      )}
    </form>
  )
}

export default CsvIngestForm


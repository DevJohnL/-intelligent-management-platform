import { FormEvent, useState } from "react"

import { useProducts } from "../../hooks/useProducts"
import { useCreateSale } from "../../hooks/useCreateSale"

type SaleFormState = {
  product_id: string
  quantity: string
  total_price: string
  date: string
}

const initialState: SaleFormState = {
  product_id: "",
  quantity: "",
  total_price: "",
  date: "",
}

const SaleForm = () => {
  const { data: products, isLoading: loadingProducts } = useProducts()
  const mutation = useCreateSale()
  const [form, setForm] = useState(initialState)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.product_id) return

    await mutation.mutateAsync({
      product_id: Number(form.product_id),
      quantity: Number(form.quantity),
      total_price: Number(form.total_price),
      date: form.date,
    })
    setForm(initialState)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Registrar venda</p>
      <select
        value={form.product_id}
        onChange={(event) => setForm((prev) => ({ ...prev, product_id: event.target.value }))}
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
        required
        disabled={loadingProducts}
      >
        <option value="">Produto</option>
        {products?.map((product: { id: number; name: string }) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          placeholder="Quantidade"
          value={form.quantity}
          onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          type="number"
          min="1"
          required
        />
        <input
          placeholder="Total (BRL)"
          value={form.total_price}
          onChange={(event) => setForm((prev) => ({ ...prev, total_price: event.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </div>
      <input
        type="date"
        value={form.date}
        onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
        required
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-slate-700/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Registrando..." : "Adicionar venda"}
      </button>
      {mutation.isSuccess && (
        <p className="text-xs text-emerald-400">Venda registrada.</p>
      )}
      {mutation.isError && (
        <p className="text-xs text-amber-400">Não foi possível registrar.</p>
      )}
    </form>
  )
}

export default SaleForm


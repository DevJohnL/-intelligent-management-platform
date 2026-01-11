import { FormEvent, useState } from "react"

import { useCategories } from "../../hooks/useCategories"
import { useCreateProduct } from "../../hooks/useCreateProduct"

type ProductFormState = {
  name: string
  price: string
  cost_price: string
  category_id: string
}

const initialState: ProductFormState = {
  name: "",
  price: "",
  cost_price: "",
  category_id: "",
}

const ProductForm = () => {
  const { data: categories, isLoading: loadingCategories } = useCategories()
  const mutation = useCreateProduct()
  const [form, setForm] = useState(initialState)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.category_id) return

    await mutation.mutateAsync({
      name: form.name,
      price: Number(form.price),
      cost_price: Number(form.cost_price),
      category_id: Number(form.category_id),
    })
    setForm(initialState)
  }

  const disabled = mutation.isLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        Cadastrar produto
      </p>
      <input
        placeholder="Nome"
        value={form.name}
        onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        required
      />
      <div className="grid gap-3 md:grid-cols-2">
        <input
          placeholder="Preço"
          value={form.price}
          onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          type="number"
          min="0"
          step="0.01"
          required
        />
        <input
          placeholder="Custo"
          value={form.cost_price}
          onChange={(event) => setForm((prev) => ({ ...prev, cost_price: event.target.value }))}
          className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white placeholder:text-slate-500"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </div>
      <select
        value={form.category_id}
        onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white"
        required
        disabled={loadingCategories}
      >
        <option value="">Categoria</option>
        {categories?.map((category: { id: number; name: string }) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled}
      >
        {mutation.isLoading ? "Enviando..." : "Salvar produto"}
      </button>
      {mutation.isSuccess && (
        <p className="text-xs text-emerald-400">Produto salvo com sucesso.</p>
      )}
      {mutation.isError && (
        <p className="text-xs text-amber-400">Falha ao salvar. Tente novamente.</p>
      )}
    </form>
  )
}

export default ProductForm


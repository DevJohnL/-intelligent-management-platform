export const formatCurrencyInput = (value?: number) =>
  value !== undefined ? `R$ ${value}` : ""

export const parseCurrencyInput = (value?: string) => {
  if (!value) return 0
  const sanitized = value.replace(/[R$\s,]/g, "")
  const parsed = Number(sanitized)
  return Number.isNaN(parsed) ? 0 : parsed
}


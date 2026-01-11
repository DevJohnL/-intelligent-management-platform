import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { fetchSales } from "../services/api"

type SaleRecord = {
  date: string
  total_price: number
  quantity: number
}

type TrendPoint = {
  month: string
  total: number
  key: string
}

export const useSalesTrend = () => {
  const query = useQuery({
    queryKey: ["sales", "trend"],
    queryFn: fetchSales,
    staleTime: 1000 * 60,
    retry: 1,
  })

  const trend = useMemo(() => {
    if (!query.data) {
      return []
    }

    const grouped = new Map<string, TrendPoint>()

    query.data.forEach((sale: SaleRecord) => {
      const date = new Date(sale.date)
      if (Number.isNaN(date.getTime())) {
        return
      }

      const key = date.toISOString().slice(0, 7)

      const month = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" }).format(date)

      const existing = grouped.get(key)
      const total = (existing?.total ?? 0) + Number(sale.total_price)

      grouped.set(key, {
        month,
        total,
        key,
      })
    })

    return Array.from(grouped.values()).sort((a, b) => a.key.localeCompare(b.key))
  }, [query.data])

  return {
    ...query,
    trend,
  }
}


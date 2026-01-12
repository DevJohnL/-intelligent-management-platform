import { useQuery } from "@tanstack/react-query"

import { fetchSalesMonthlyQuantityTrend } from "../services/api"

export type ProductMonthlySalesRecord = {
  product_id: number
  product_name: string
  period: string
  year: number
  month: number
  quantity: number
}

export const useProductMonthlySalesTrend = () =>
  useQuery<ProductMonthlySalesRecord[]>({
    queryKey: ["sales", "monthly-quantity-trend"],
    queryFn: fetchSalesMonthlyQuantityTrend,
    staleTime: 1000 * 60,
  })


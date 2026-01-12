import { useQuery } from "@tanstack/react-query"

import { fetchSalesQuantityByProduct } from "../services/api"

export type SaleQuantityByProduct = {
  product_id: number
  product_name: string
  quantity: number
}

export const useSalesQuantityByProduct = () =>
  useQuery<SaleQuantityByProduct[]>({
    queryKey: ["sales", "quantity-by-product"],
    queryFn: fetchSalesQuantityByProduct,
    staleTime: 1000 * 60,
  })


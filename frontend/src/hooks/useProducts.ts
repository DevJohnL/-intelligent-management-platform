import { useQuery } from "@tanstack/react-query"

import { fetchProducts } from "../services/api"

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  })


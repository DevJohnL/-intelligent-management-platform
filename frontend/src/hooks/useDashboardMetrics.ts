import { useQuery } from "@tanstack/react-query"

import { fetchDashboardMetrics } from "../services/api"

export const useDashboardMetrics = () =>
  useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: fetchDashboardMetrics,
    staleTime: 1000 * 60,
    retry: 1,
  })


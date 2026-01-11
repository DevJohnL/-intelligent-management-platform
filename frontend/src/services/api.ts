import axios from "axios"

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
})

export const fetchDashboardMetrics = async () => {
  const { data } = await api.get("/dashboard/metrics")
  return data
}

export const fetchSales = async () => {
  const { data } = await api.get("/sales")
  return data
}


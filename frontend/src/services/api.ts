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

export const fetchSalesQuantityByProduct = async () => {
  const { data } = await api.get("/sales/quantity")
  return data
}

export const fetchSalesMonthlyQuantityTrend = async () => {
  const { data } = await api.get("/sales/quantity-trend")
  return data
}

export const fetchCategories = async () => {
  const { data } = await api.get("/categories")
  return data
}

export const fetchProducts = async () => {
  const { data } = await api.get("/products")
  return data
}

export const createProduct = async (payload: {
  name: string
  price: number
  cost_price: number
  category_id: number
}) => {
  const { data } = await api.post("/products", payload)
  return data
}

export const createSale = async (payload: {
  product_id: number
  quantity: number
  total_price: number
  date: string
}) => {
  const { data } = await api.post("/sales", payload)
  return data
}

export const uploadCsv = async (entity: string, file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await api.post(`/ingest/csv/${entity}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}


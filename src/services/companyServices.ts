import { api } from "./api";



export async function getCustomers(token: string, page = 1) {
  return api.get("/v1/customers", {
    params: { page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getReportsSummary() {
  return api.get("/api/workspace/reports/summary")
}

export async function getOrders() {
  return api.get("/api/workspace/orders")
}
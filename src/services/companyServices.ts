import { api } from "./api";

export interface ReportsParams {
  from: string;
  to: string;
  model?: string;
  locationId?: string;
  currency?: string;
  tz?: string;
}

export async function getCustomers(token: string, page = 1) {
  return api.get("/v1/customers", {
    params: { page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getOrders() {
  return api.get("/api/workspace/orders")
}

export async function getReportsSummary(params: ReportsParams) {
  return api.get("/v1/reports/summary", { params });
}

export async function getReportChannels(params: ReportsParams) {
  return api.get("/v1/reports/channels", { params });
}

export async function getReportCampaigns(params: ReportsParams) {
  return api.get("/v1/reports/campaigns", { params });
}

export async function getReportLocations(params: ReportsParams) {
  return api.get("/v1/reports/locations", { params });
}

export async function getReportTrend(params: ReportsParams) {
  return api.get("/v1/reports/trend", { params });
}

export async function getReportCustomers(params: ReportsParams) {
  return api.get("/v1/reports/customers", { params });
}

export async function getWorkspaceDashboard() {
  return api.get("/api/workspace/dashboard");
}
import { api } from "./api";

export interface KeyCredentials {
  name: string;
  allowedOrigins: string[];
}

export async function getCompanyKey() {
  return api.get("/api-keys");
}

export async function rotateCompanyKey() {
  return api.post("/api-keys/rotate");
}

export async function generateKey(credentials: KeyCredentials) {
  return api.post("/api-keys", credentials);
}

export async function updateCompanyKey(
  id: string,
  credentials: KeyCredentials,
) {
  return api.patch(`/api-keys/${encodeURIComponent(id)}`, credentials);
}

export async function revokeCompanyKey(id: string) {
  return api.delete(`/api-keys/${encodeURIComponent(id)}`);
}
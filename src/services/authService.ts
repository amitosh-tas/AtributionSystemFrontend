import { api } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  const res = await api.post("/api/auth/user/login", credentials);
  return res.data;
}

export async function registerCompany(credentials: LoginCredentials) {
  const res = await api.post("/api/auth/company/register", credentials);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/api/auth/me");
  return res.data.decoded;
}

export async function logoutUser() {
  const res = await api.post("/api/auth/logout");
  return res.data;
}
import { api } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  const res = await api.post("/auth/user/login", credentials);
  return res.data;
}

export async function registerCompany(credentials: LoginCredentials) {
  const res = await api.post("/auth/company/register", credentials);
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data.decoded;
}

export async function logoutUser() {
  const res = await api.post("/auth/logout");
  return res.data;
}
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface LoginCredentials {
  email: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  const res = await api.post("/auth/user/login", credentials);
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
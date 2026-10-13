import { api } from "./api";

interface KeyCredentials {
  name: string;
  allowedOrigins: string[];
}

export async function getCompanyKey(){
  const res = await api.get("/api-keys")
  return res
}

export async function rotateCompanyKey(){
  return await api.post("/api-keys/rotate")
}

export async function generateKey(credentials: KeyCredentials){
  const res = await api.post("/", credentials)
  return res
}
import { api } from "./api";


export async function getCompanyKey(){
  const res = await api.get("/api-keys")
  return res
}

export async function rotateCompanyKey(){
  return await api.post("/api-keys/rotate")
}
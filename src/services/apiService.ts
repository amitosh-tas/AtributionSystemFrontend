import { api } from "./api";


export async function getCompanyKey(){
  const res = await api.get("/api-keys")
  return res
}
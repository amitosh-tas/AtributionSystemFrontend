import { api } from "./api";



export async function getCustomers( token: string){
  return await api.get("/v1/customers",{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
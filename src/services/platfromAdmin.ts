import { api } from "./api";



export async function getPlatformDashboard(){
  const res = await api.get("/platform-admin/dashboard")
  return res;
}


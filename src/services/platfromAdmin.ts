import { api } from "./api";



export async function getPlatformDashboard(){
  const res = await api.get("/platform-admin/dashboard")
  return res;
}

export async function getWorkspaces( page = 1){
  const res = await api.get("/platform-admin/workspaces", {
    params:{
      reason: "Mai admin huu ngga",
      page
    }
  })
  return res;
}
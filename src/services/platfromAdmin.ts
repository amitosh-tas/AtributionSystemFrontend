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

export async function getWorkspaceById(id: string){
  const res = await api.get(`/platform-admin/workspaces/${id}`,{
    params: {
      reason: "Mai admin hu ngga",
    }
  }
  );
  return res;
}
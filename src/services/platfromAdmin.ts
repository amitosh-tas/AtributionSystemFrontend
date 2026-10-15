import { api } from "./api";

type TStatus = "invited" | "active" | "deactivated";

interface IUpdateUser {
  role: string;
  status: TStatus;
  reason: string;
}

interface IUpdateUserProps {
  id: string;
  data: IUpdateUser;
}

export async function getPlatformDashboard(){
  const res = await api.get("/api/platform-admin/dashboard")
  return res;
}

export async function getWorkspaces( page = 1){
  const res = await api.get("/api/platform-admin/workspaces", {
    params:{
      reason: "Mai admin huu ngga",
      page
    }
  })
  return res;
}

export async function getWorkspaceById(id: string){
  const res = await api.get(`/api/platform-admin/workspaces/${id}`,{
    params: {
      reason: "Mai admin hu ngga",
    }
  }
  );
  return res;
}

export async function updateUser( {id, data}: IUpdateUserProps){
  return await api.patch(`/api/platform-admin/users/${id}`, data)
}
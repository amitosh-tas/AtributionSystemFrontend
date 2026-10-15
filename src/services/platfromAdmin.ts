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

export async function updateUser( {id, data}: IUpdateUserProps){
  return await api.patch(`/platform-admin/users/${id}`, data)
}
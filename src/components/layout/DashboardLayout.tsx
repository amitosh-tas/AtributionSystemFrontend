

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import RoleSwitcher from "@/components/dev/RoleSwitcher";
import { useAppSelector } from "@/app/hooks";
import { getCompanyNavigation } from "@/config/navigation";

function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);

  const items = user
    ? getCompanyNavigation(user.role)
    : [];
  return (
    <div
    className="flex min-h-dvh 
    font-body cursor-default bg-sidebar
    "
    >

      <Sidebar items={items} />

      <div
      className="flex-1 bg-page-background p-10">
        {/* Remove RoleSwitcher after testing */}
        {/* <RoleSwitcher /> */}
        <Outlet />
      </div>
      
    </div>
  )
}

export default DashboardLayout
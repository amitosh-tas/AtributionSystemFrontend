

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import RoleSwitcher from "@/components/dev/RoleSwitcher";

function DashboardLayout() {
  return (
    <div
    className="flex min-h-dvh 
    font-body cursor-default bg-sidebar
    "
    >

      <Sidebar/>

      <div
      className="flex-1 bg-page-background p-10">
        {/* Remove RoleSwitcher after testing */}
        <RoleSwitcher />
        <Outlet />
      </div>
      
    </div>
  )
}

export default DashboardLayout
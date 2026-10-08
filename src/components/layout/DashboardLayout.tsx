

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

function DashboardLayout() {
  return (
    <div
    className="flex h-dvh 
    font-body cursor-default
    "
    >

      <Sidebar/>

      <div
      className="flex-1 bg-page-background p-10">
        <Outlet />
      </div>
      
    </div>
  )
}

export default DashboardLayout
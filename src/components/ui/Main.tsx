

import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

function Main() {
  return (
    <div
    className="flex h-dvh 
    font-manrope cursor-default
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

export default Main
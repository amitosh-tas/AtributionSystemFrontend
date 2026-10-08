import { useState } from "react"

function Sidebar() {

  const [companyName, setCompanyName] = useState("COMPANY NAME"); 

  return (
    <div 
    className="bg-sidebar text-sidebar-text w-[15%] p-5">

      <div
      className="flex flex-col">

        <h1
        className="
        text-primary font-heading
        uppercase text-lg
        ">
          Ledger
        </h1>

        <p
        className="text-[10px]">
          {companyName}
        </p>

        {/* BOTTOM BAR */}
        <div className="bg-gray-400/20 h-px w-full mt-5"></div>

      </div>
    
    
    </div>
  )
}

export default Sidebar
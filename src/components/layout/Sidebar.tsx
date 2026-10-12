import { NavLink, useLocation } from "react-router-dom";
import type { SidebarItem } from "@/config/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  companyName?: string;
  items: SidebarItem[];
}

function Sidebar({
  companyName = "COMPANY NAME",
  items,
}: SidebarProps) {

  const location = useLocation();
  const [isActive, setActive] = useState<Boolean>(false);

  function handleClick(){
    setActive( !isActive )
  }

  useEffect(()=>{
    setActive( false )
  }, [location])

  return (
    <div
    className="min-h-dvh relative z-10">
      
      <div
      onClick={handleClick}
      className={`
        md:hidden
        bg-sidebar text-text-muted fixed top-2.5 left-2.5 z-10 p-2 rounded-full
        duration-300 cursor-pointer
        ${isActive? "translate-x-39": ""}
        `}
      >
        <i className={`flex items-center text-xs duration-300
          ${isActive ? "fi fi-br-cross" : " fi fi-bs-menu-dots "}
          `}></i>
      </div>

      <aside className={`relative bg-sidebar text-sidebar-text duration-300 h-full`}>
        <div className={`fixed top-0 flex h-full bg-sidebar w-50 flex-col gap-2 duration-300

        md:translate-x-0 md:sticky md:h-max p-5
          ${isActive ? "" : "-translate-x-full" }  
          `}>
          <div>
            <h1 className="font-heading text-lg uppercase text-primary">
              Ledger
            </h1>

            <p className="text-[10px]">{companyName}</p>

            <div className="mt-5 h-px w-full bg-gray-400/20" />
          </div>

          <nav className="flex flex-col gap-0.5">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/" || item.path === "/super"}
                className={({ isActive }) =>
                  `rounded-md py-1.5 transition-all duration-300 ${
                    isActive
                      ? "translate-x-2 text-primary"
                      : "hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
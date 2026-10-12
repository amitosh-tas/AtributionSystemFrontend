import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { SidebarItem } from "@/config/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/services/authService";

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
        justify-between
        md:translate-x-0 md:sticky md:h-dvh p-5
          ${isActive ? "" : "-translate-x-full" }  
          `}>

          <div
          className="flex flex-col">
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
          <AccountComponent />
        </div>

      </aside>


    </div>
  );
}

function AccountComponent(){
  
  const user = useAppSelector( state => state.auth.user )
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(logout());
      navigate("/signin", { replace: true });
    }
  };

  return (
    <div
    className="border-t-2 border-text-muted/20 pt-2.5 text-sm
    flex flex-col gap-1
    ">
      
      <p
      className="font-medium">
        {user?.name}
      </p>
      <p
      className="text-[10px]">
        {user?.email}
      </p>

      <div
      className="text-[9px] font-medium uppercase p-0.5 px-1.5 bg-amber-950/70 text-amber-700 rounded-sm 
      w-max
      ">
        {user?.role}
      </div>

      <button
      onClick={handleLogout}
      className="px-3 py-1.5 border border-gray-400/20 rounded-sm text-xs cursor-pointer">
        Sign out
      </button>

    </div>
  )
}

export default Sidebar;
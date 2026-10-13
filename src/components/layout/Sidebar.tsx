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
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed left-3 top-3 z-50
          flex h-10 w-10 items-center justify-center
          rounded-lg border border-white/10
          bg-sidebar text-sidebar-text shadow-md
          transition-transform duration-300
          md:hidden
          ${isOpen ? "translate-x-60" : "translate-x-0"}
        `}
      >
        <i
          className={
            isOpen ? "fi fi-br-cross" : "fi fi-bs-menu-dots"
          }
        />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar wrapper reserves desktop width */}
      <aside className="relative z-40 w-0 shrink-0 md:w-60">
        <div
          className={`
            fixed inset-y-0 left-0 z-40
            flex h-dvh w-60 flex-col
            overflow-hidden bg-sidebar text-sidebar-text
            transition-transform duration-300 ease-in-out
            md:sticky md:top-0 md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header: never scrolls */}
          <div className="shrink-0 px-5 pb-4 pt-6">
            <h1 className="font-heading text-lg uppercase text-primary">
              Ledger
            </h1>

            <p className="mt-1 truncate text-[10px]">
              {companyName}
            </p>

            <div className="mt-5 h-px w-full bg-gray-400/20" />
          </div>

          {/* Navigation: scrolls independently */} 
          <nav
            aria-label="Main navigation"
            className="
              min-h-0 flex-1 overflow-y-auto overscroll-contain
              px-5 pb-4
              scrollbar-thin
              [scrollbar-color:rgba(148,163,184,0.35)_transparent]
            "
          >
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/" || item.path === "/super"}
                  className={({ isActive }) =>
                    `
                      rounded-md px-3 py-2 text-sm
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-sidebar-text hover:bg-white/5 hover:text-primary"
                      }
                    `
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Account section: stays at the bottom */}
          <div className="shrink-0 border-t border-white/10 p-5">
            <AccountComponent />
          </div>
        </div>
      </aside>
    </>
  );
}

function AccountComponent() {
  const user = useAppSelector((state) => state.auth.user);
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
    <div className="flex flex-col gap-1.5">
      <p className="truncate text-sm font-medium">
        {user?.name}
      </p>

      <p className="truncate text-[10px] text-sidebar-text/70">
        {user?.email}
      </p>

      <span
        className="
          mt-1 w-max max-w-full truncate rounded-sm
          bg-amber-500/10 px-2 py-1
          text-[9px] font-medium uppercase text-amber-400
        "
      >
        {user?.role}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="
          mt-2 rounded-md border border-white/10 px-3 py-2
          text-xs transition-colors
          hover:bg-white/5 hover:text-primary
        "
      >
        Sign out
      </button>
    </div>
  );
}

export default Sidebar;
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
  companyName,
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
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed left-4 top-4 z-0 flex h-10 items-center justify-center
          rounded-lg border border-border bg-white px-3 text-xs font-medium text-text
          transition-colors duration-150 hover:bg-hover
          md:hidden
          ${isOpen ? "" : "translate-x-0"}
        `}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
        />
      )}

      <aside className="relative z-40 w-0 shrink-0 md:w-60">
        <div
          className={`
            fixed inset-y-0 left-0 z-40 flex h-dvh w-60 flex-col
            overflow-hidden border-r border-border bg-sidebar text-sidebar-text
            transition-transform duration-200 ease-out
            md:sticky md:top-0 md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="shrink-0 border-b border-border px-5 pb-5 pt-6">
            <p className="font-Cinzel text-3xl font-medium tracking-tight text-text">
              Elysium
            </p>
            {companyName && (
              <p className="mt-5 truncate text-xs font-medium text-text-muted">
                {companyName}
              </p>
            )}
          </div>

          <nav
            aria-label="Main navigation"
            className="
              min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4
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
                      flex min-h-10 items-center rounded-lg px-3 py-2
                      text-sm font-medium transition-colors duration-150
                      ${
                        isActive
                          ? "bg-active text-text"
                          : "text-sidebar-text hover:bg-hover hover:text-text"
                      }
                    `
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="shrink-0 border-t border-border p-4">
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
    <div className="flex flex-col gap-1">
      <p className="truncate text-sm font-semibold text-text">
        {user?.name}
      </p>

      <p className="truncate text-xs text-text-muted">
        {user?.email}
      </p>

      <span
        className="
          mt-2 w-max max-w-full truncate rounded-md
          border border-border bg-surface-muted px-2 py-1
          text-[10px] font-medium text-text-muted
        "
      >
        {user?.role}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 rounded-lg border cursor-pointer border-border px-3 py-2 text-left text-xs font-medium text-text transition-colors hover:bg-hover"
      >
        Sign out
      </button>
    </div>
  );
}

export default Sidebar;
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
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed left-4 top-4 z-50 flex size-10 items-center justify-center
          rounded-lg border border-white/10 bg-sidebar text-white
          transition-transform duration-200
          md:hidden
          ${isOpen ? "translate-x-54" : "translate-x-0"}
        `}
      >
        <i
          aria-hidden="true"
          className={isOpen ? "fi fi-rr-cross-small" : "fi fi-rr-menu-burger"}
        />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
        />
      )}

      <aside className="relative z-40 w-0 shrink-0 md:w-60">
        <div
          className={`
            fixed inset-y-0 left-0 z-40 flex h-dvh w-60 flex-col
            overflow-hidden border-r border-white/6 bg-sidebar text-sidebar-text
            transition-transform duration-200 ease-out
            md:sticky md:top-0 md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="shrink-0 px-5 pb-5 pt-6">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                L
              </span>
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Ledger
              </span>
            </div>
            <p className="mt-6 truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {companyName}
            </p>
          </div>

          <nav
            aria-label="Main navigation"
            className="
              min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4
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
                      flex min-h-10 items-center gap-3 rounded-lg px-3 py-2
                      text-[13px] font-medium transition-colors duration-150
                      ${
                        isActive
                          ? "bg-white/9 text-white"
                          : "text-sidebar-text hover:bg-white/5 hover:text-white"
                      }
                    `
                  }
                >
                  <span
                    aria-hidden="true"
                    className={`fi ${navIcon(item.label)} text-sm opacity-80`}
                  />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="shrink-0 border-t border-white/8 p-4">
            <AccountComponent />
          </div>
        </div>
      </aside>
    </>
  );
}

function navIcon(label: string) {
  const icons: Record<string, string> = {
    Dashboard: "fi-rr-chart-pie",
    Analytics: "fi-rr-chart-histogram",
    Campaign: "fi-rr-bullseye",
    Customers: "fi-rr-users",
    Transactions: "fi-rr-receipt",
    Upcoming: "fi-rr-calendar",
    Team: "fi-rr-user-add",
    Settings: "fi-rr-settings",
    Companies: "fi-rr-building",
    Members: "fi-rr-users-alt",
    "Api Keys": "fi-rr-key",
  };
  return icons[label] ?? "fi-rr-circle";
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
      <p className="truncate text-[13px] font-semibold text-white">
        {user?.name}
      </p>

      <p className="truncate text-[11px] text-sidebar-text">
        {user?.email}
      </p>

      <span
        className="
          mt-2 w-max max-w-full truncate rounded-md
          border border-white/10 bg-white/5 px-2 py-1
          text-[9px] font-semibold uppercase tracking-wide text-slate-300
        "
      >
        {user?.role}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-3 rounded-lg border border-white/10 px-3 py-2 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-white/6 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}

export default Sidebar;
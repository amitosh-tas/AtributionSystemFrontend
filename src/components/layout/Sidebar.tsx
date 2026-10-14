import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { SidebarItem } from "@/config/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/store/slices/authSlice";
import { logoutUser } from "@/services/authService";
import GlassSurface from "@/components/GlassSurface";

interface SidebarProps {
  companyName?: string;
  items: SidebarItem[];
}

function Sidebar({ companyName = "COMPANY NAME", items }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
        className={`fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-900/70 text-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.45)] transition-transform duration-300 md:hidden ${isOpen ? "translate-x-44" : "translate-x-0"}`}
      >
        <i className={`flex items-center text-sm ${isOpen ? "fi fi-br-cross" : "fi fi-bs-menu-dots"}`} />
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/55 md:hidden"
        />
      )}

      <aside className="relative z-40 w-0 shrink-0 md:w-72">
        <div
          className={`fixed inset-y-0 left-0 z-40 h-dvh w-72 overflow-hidden text-slate-200 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="pointer-events-none absolute inset-0">
            <GlassSurface
              width="100%"
              height="100%"
              borderRadius={20}
              borderWidth={0.05}
              distortionScale={-120}
              displace={0.18}
              backgroundOpacity={0.04}
              opacity={0.94}
              blur={14}
              saturation={1.15}
              redOffset={0}
              greenOffset={4}
              blueOffset={8}
              refraction
              renderer="auto"
              className="h-full w-full"
            />
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <div className="shrink-0 px-5 pb-4 pt-6">
              <div className="flex items-center justify-between gap-3">
                <h1 className="font-heading text-2xl font-semibold tracking-tight text-sky-200">Ledger</h1>
                <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-200">Live</span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/40 px-3 py-2 shadow-inner shadow-slate-950/30">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</p>
                <p className="mt-2 truncate text-sm font-medium text-slate-100">{companyName}</p>
              </div>
            </div>

            <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 scrollbar-thin [scrollbar-color:rgba(148,163,184,0.35)_transparent]">
              <div className="mt-2 flex flex-col gap-1.5">
                {items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/" || item.path === "/super"}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium
                      transition-all duration-200
                      ${
                        isActive
                          ? "border border-sky-400/25 bg-sky-500/12 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                          : "text-slate-300 hover:bg-white/5 hover:text-sky-100"
                      }
                    `}
                  >
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-sky-300/90" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="shrink-0 border-t border-white/10 px-4 py-4">
              <AccountComponent />
            </div>
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
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl border border-white/10 bg-slate-900/35 px-3 py-2.5">
        <p className="truncate text-sm font-medium text-slate-50">{user?.name}</p>
        <p className="mt-1 truncate text-[10px] uppercase tracking-[0.12em] text-slate-400">{user?.email}</p>
      </div>

      <span className="w-max max-w-full truncate rounded-full border border-violet-400/25 bg-violet-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-200">
        {user?.role}
      </span>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:border-sky-400/25 hover:bg-sky-500/10 hover:text-sky-100"
      >
        Sign out
      </button>
    </div>
  );
}

export default Sidebar;
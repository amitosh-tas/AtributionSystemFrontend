import { NavLink } from "react-router-dom";
import type { SidebarItem } from "@/config/navigation";

interface SidebarProps {
  companyName?: string;
  items: SidebarItem[];
}

function Sidebar({
  companyName = "COMPANY NAME",
  items,
}: SidebarProps) {
  return (
    <aside className="relative bg-sidebar text-sidebar-text">
      <div className="sticky top-0 flex h-max w-50 flex-col gap-2 p-5">
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
  );
}

export default Sidebar;
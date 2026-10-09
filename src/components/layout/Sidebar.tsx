import { NavLink } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

interface ISidebarItem {
  label: string;
  path: string;
}

interface ISidebarProps {
  companyName?: string;
  items?: ISidebarItem[];
}

const defaultItems: ISidebarItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "Campaign", path: "/campaigns" },
  { label: "Customers", path: "/customers" },
  { label: "Transactions", path: "/transactions" },
  { label: "Upcoming", path: "/upcoming" },
  { label: "Team", path: "/team" },
];

function Sidebar({
  companyName = "COMPANY NAME",
  items = defaultItems,
}: ISidebarProps) {
  const user = useAppSelector((state) => state.auth.user);

  const visibleItems = items.filter(
    (item) => !(user?.role === "VIEWER" && item.path === "/team"),
  );

  return (
    <aside className="relative bg-sidebar text-sidebar-text">
      <div className="sticky top-0 flex h-max w-50 flex-col gap-2 p-5">
        <div className="flex flex-col">
          <h1 className="font-heading text-lg uppercase text-primary">
            Ledger
          </h1>

          <p className="text-[10px]">{companyName}</p>

          <div className="mt-5 h-px w-full bg-gray-400/20" />
        </div>

        <nav className="flex flex-col gap-0.5">
          {visibleItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              end={item.path === "/"}
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
import { Link, NavLink } from "react-router-dom";


interface ISidebarProps {
  companyName?: string;
}

interface ISidebarItem {
  label: string;
  path: string;
}

interface ISidebarProps {
  companyName?: string;
  items?: ISidebarItem[];
}

const defaultItems: ISidebarItem[] = [
  {
    label: "Overview",
    path: "/",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
  {
    label: "Customers",
    path: "/customers",
  },
  {
    label: "Transactions",
    path: "/transactions",
  },
];

function Sidebar({
  companyName = "COMPANY NAME",
  items = defaultItems,
}: ISidebarProps) {
  return (
    <aside
      className="
        bg-sidebar text-sidebar-text
        w-[15%] p-5
        sticky top-0 h-dvh
      "
    >
      <div className="flex flex-col">

        <h1
          className="
            text-primary
            font-heading
            uppercase
            text-lg
          "
        >
          Ledger
        </h1>

        <p className="text-[10px]">
          {companyName}
        </p>

        <div className="bg-gray-400/20 h-px w-full mt-5" />

        <div
        className="flex flex-col gap-0.5">
          {items.map((item) => (
            <NavLink
              to={item.path}
              key={item.path}
              className={`
              ${({isActive}: boolean ) => isActive ? `text-primary` : ``}
              `}
            >
              {item.label}
            </NavLink>
          ))}
        </div>


      </div>
    </aside>
  );
}

export default Sidebar;
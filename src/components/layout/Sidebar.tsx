import { NavLink } from "react-router-dom";


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
    <>
      <aside
        className="
          bg-sidebar text-sidebar-text
          relative
        "
      >
        <div
        className="sticky top-0 h-max w-50 p-5
        flex flex-col gap-2
        ">
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
          </div>

          <div
          className="flex flex-col gap-0.5">
            {items.map((item) => (
              <NavLink
                to={item.path}
                key={item.path}
                className={
                  ({isActive}) => ` 
                  
                  duration-300 py-1.5

                  ${isActive ? "text-primary translate-x-2" : "" } `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
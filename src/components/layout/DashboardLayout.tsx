import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/app/hooks";
import { getCompanyNavigation } from "@/config/navigation";
import DashboardBackground from "./DashboardBackground";

function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);

  const items = user ? getCompanyNavigation(user.role) : [];

  return (
    <div className="relative isolate flex min-h-dvh font-body cursor-default">
      {/* Animated background */}
      <DashboardBackground />

      {/* Dashboard UI */}
      <div className="relative z-10 flex min-h-dvh w-full">
        <Sidebar items={items} />

        <main className="min-w-0 flex-1 p-2.5 pt-10 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
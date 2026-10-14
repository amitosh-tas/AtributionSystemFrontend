import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "@/app/hooks";
import { getCompanyNavigation } from "@/config/navigation";
import DashboardBackground from "./DashboardBackground";

function DashboardLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const items = user ? getCompanyNavigation(user.role) : [];

  return (
    <div className="relative isolate flex min-h-dvh cursor-default font-body">
      <DashboardBackground />

      <div className="relative z-10 flex min-h-dvh w-full">
        <Sidebar items={items} />

        <main className="relative min-w-0 flex-1 p-2.5 pt-8 md:p-7 xl:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
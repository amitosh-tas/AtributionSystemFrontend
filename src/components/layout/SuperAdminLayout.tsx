import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { superAdminNavigation } from "@/config/navigation";
import DashboardBackground from "@/components/layout/DashboardBackground";

function SuperAdminLayout() {
  return (
    <div className="relative isolate flex min-h-dvh cursor-default font-body">
      <DashboardBackground />

      <div className="relative z-10 flex min-h-dvh w-full">
        <Sidebar companyName="PLATFORM ADMIN" items={superAdminNavigation} />

        <main className="relative min-w-0 flex-1 p-2.5 pt-8 md:p-7 xl:p-8">
          <div className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SuperAdminLayout;
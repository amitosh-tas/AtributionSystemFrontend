import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { superAdminNavigation } from "@/config/navigation";

function SuperAdminLayout() {
  return (
    <div className="flex min-h-dvh bg-page-background font-body">
      <Sidebar
        companyName="PLATFORM ADMIN"
        items={superAdminNavigation}
      />

      <main className="min-w-0 flex-1 px-4 pb-8 pt-16 sm:px-6 md:px-8 md:pt-8 xl:px-10">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { superAdminNavigation } from "@/config/navigation";

function SuperAdminLayout() {
  return (
    <div className="flex min-h-dvh">
      <Sidebar
        companyName="PLATFORM ADMIN"
        items={superAdminNavigation}
      />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { superAdminNavigation } from "@/config/navigation";

function SuperAdminLayout() {
  return (
    <div className="flex min-h-dvh 
    font-body cursor-default bg-sidebar">
      <Sidebar
        companyName="PLATFORM ADMIN"
        items={superAdminNavigation}
      />

      <main className="flex-1 bg-page-background p-2.5 pt-10 md:p-10 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default SuperAdminLayout;
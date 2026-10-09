import { Routes, Route } from "react-router-dom";

import Notfound from "@/components/layout/Notfound";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Testing from "@/test/Testing";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ScrollToTop from "@/components/ScrollToTop";

import Overview from "@/pages/company/Overview";
import Analytics from "@/pages/company/Analytics";
import Transactions from "@/pages/company/Transactions";
import Customers from "@/pages/company/Customers";
import Team from "@/pages/company/Team";
import Campaign from "@/pages/company/Campaign";
import Upcoming from "@/pages/company/Upcoming";

import SignIn from "@/pages/auth/SignIn";
import Dashboard from "@/pages/superAdmin/Dashboard";
import Unauthorized from "@/pages/Unauthorized";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import SignUp from "@/pages/auth/SignUp";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Company dashboard: ADMIN and VIEWER */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "VIEWER"]} />
          }
        >
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="campaigns" element={<Campaign />} />
            <Route path="customers" element={<Customers />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="upcoming" element={<Upcoming />} />
            {/* <Route path="team" element={<Team />} /> */}
          </Route>
        </Route>

        {/* Team: ADMIN only */}
        <Route
          element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
        >
          <Route path="/team" element={<DashboardLayout />}>
            <Route index element={<Team />} />
          </Route>
        </Route>

        {/* Super Admin dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]} />
          }
        >
          <Route path="/super" element={<SuperAdminLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/test" element={<Testing />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
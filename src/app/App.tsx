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
import GuestRoute from "@/components/auth/GuestRoute";

import { useAppDispatch } from "@/app/hooks";
import {
  logout,
  setAuthLoading,
  setCredentials,
} from "@/store/slices/authSlice";
import { useEffect } from "react";
import { getMe } from "@/services/authService";
import Companies from "@/pages/superAdmin/Companies";
import Members from "@/pages/superAdmin/Members";
import Settings from "@/pages/superAdmin/Settings";
import ApiKeys from "@/pages/superAdmin/ApiKeys";
import A_Settings from "@/pages/company/Settings";

function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const user = await getMe();
        dispatch(setCredentials(user));
      } catch {
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Company dashboard: company_admin and company_viewer */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["company_admin", "company_viewer"]} />
          }
        >
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="campaigns" element={<Campaign />} />
            <Route path="customers" element={<Customers />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="settings" element={<A_Settings />}/>
          </Route>
        </Route>

        {/* Team: company_admin only */}
        <Route
          element={<ProtectedRoute allowedRoles={["company_admin"]} />}
        >
          <Route path="/team" element={<DashboardLayout />}>
            <Route index element={<Team />} />
          </Route>
        </Route>

        {/* Super Admin dashboard */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["platform_admin"]} />
          }
        >
          <Route path="/super" element={<SuperAdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="companies" element={<Companies/>} />
            <Route path="members" element={<Members />} />
            <Route path="settings" element={<Settings />}/>
            <Route path="api-keys" element={<ApiKeys />}/>
          </Route>
        </Route>

        {/* Public routes */}
        <Route
        element={<GuestRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="/test" element={<Testing />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;

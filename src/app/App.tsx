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

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setCredentials,
  type UserRole,
} from "@/store/slices/authSlice";
import { useEffect } from "react";
import { loginUser } from "@/services/authService";

const testUsers: Record<UserRole, {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}> = {
  SUPER_ADMIN: {
    id: "test-super-admin",
    name: "Test Super Admin",
    email: "superadmin@test.local",
    role: "SUPER_ADMIN",
  },
  ADMIN: {
    id: "test-admin",
    name: "Test Admin",
    email: "admin@test.local",
    role: "ADMIN",
  },
  VIEWER: {
    id: "test-viewer",
    name: "Test Viewer",
    email: "viewer@test.local",
    role: "VIEWER",
  },
};

function App() {

  const dispatch = useAppDispatch();


  useEffect(()=>{
    // dispatch()
  }, []);

  // // const\

  // useEffect(()=>{
  //   // dispatch(setCredentials(testUsers["ADMIN"]));

  //   console.log( loginUser({
  //     email: "techarch@gmail.com",
  //     password: "HELLO"
  //   }) );
  // },[]) 
  



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
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import type { UserRole } from "@/store/slices/authSlice";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAppSelector((state) => state.auth.user);

  // Not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Logged in, but role is not permitted
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized: render the nested route
  return <Outlet />;
}

export default ProtectedRoute;
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setCredentials,
  type UserRole,
} from "@/store/slices/authSlice";

// Keep your existing testUsers object
const testUsers: Record<UserRole, {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}> = {
  platform_admin: {
    id: "test-super-admin",
    name: "Test Super Admin",
    email: "superadmin@test.local",
    role: "platform_admin",
  },
  company_admin: {
    id: "test-admin",
    name: "Test Admin",
    email: "admin@test.local",
    role: "company_admin",
  },
  company_viewer: {
    id: "test-viewer",
    name: "Test Viewer",
    email: "viewer@test.local",
    role: "company_viewer",
  },
};

export default function RoleSwitcher() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentRole = useAppSelector(
    (state) => state.auth.user?.role ?? "company_admin",
  );

  function switchRole(role: UserRole) {
    dispatch(setCredentials(testUsers[role]));

    if (role === "platform_admin") {
      navigate("/super");
    } else {
      navigate("/");
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div>
        <p className="text-xs text-gray-500">DEV MODE · TEST USER</p>
        <p className="text-sm font-medium text-gray-900">
          {testUsers[currentRole].name}
        </p>
      </div>

      <select
        value={currentRole}
        onChange={(event) =>
          switchRole(event.target.value as UserRole)
        }
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Switch test role"
      >
        <option value="platform_admin">Super Admin</option>
        <option value="company_admin">Admin</option>
        <option value="company_viewer">Viewer</option>
      </select>
    </div>
  );
}
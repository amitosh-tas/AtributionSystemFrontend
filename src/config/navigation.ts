import type { UserRole } from "@/store/slices/authSlice";

export interface SidebarItem {
  label: string;
  path: string;
}

export const companyNavigation: SidebarItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "Analytics", path: "/analytics" },
  { label: "Campaign", path: "/campaigns" },
  { label: "Customers", path: "/customers" },
  { label: "Transactions", path: "/transactions" },
  { label: "Upcoming", path: "/upcoming" },
  { label: "Team", path: "/team" },
];

export const superAdminNavigation: SidebarItem[] = [
  { label: "Dashboard", path: "/super" },
  { label: "Companies", path: "/super/companies" },
  { label: "Members", path: "/super/members" },
  { label: "Settings", path: "/super/settings" },
];

export function getCompanyNavigation(role: UserRole) {
  if (role === "VIEWER") {
    return companyNavigation.filter((item) => item.path !== "/team");
  }

  return companyNavigation;
}
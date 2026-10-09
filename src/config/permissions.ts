export type UserRole = "SUPER_ADMIN" | "ADMIN" | "VIEWER";

export type Permission =
  | "dashboard:view"
  | "revenue:view"
  | "teams:view"
  | "teams:add"
  | "teams:edit"
  | "teams:delete"
  | "roles:manage";

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard:view",
    "revenue:view",
    "teams:view",
    "teams:add",
    "teams:edit",
    "teams:delete",
    "roles:manage",
  ],

  ADMIN: [
    "dashboard:view",
    "revenue:view",
    "teams:view",
    "teams:add",
    "teams:edit",
  ],

  VIEWER: [
    "dashboard:view",
    "revenue:view",
    "teams:view",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission,
): boolean {
  return rolePermissions[role].includes(permission);
}
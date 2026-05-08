export type Permission =
  | "users:read"
  | "users:write"
  | "projects:read"
  | "projects:write"
  | "admin:access"
  | "experiments:access";

export type AuthUser = {
  id: string;
  name: string;
  role: "admin" | "manager" | "engineer";
};

const rolePermissions: Record<AuthUser["role"], Permission[]> = {
  admin: [
    "users:read",
    "users:write",
    "projects:read",
    "projects:write",
    "admin:access",
    "experiments:access"
  ],
  manager: ["users:read", "projects:read", "projects:write", "experiments:access"],
  engineer: ["projects:read", "experiments:access"]
};

export function can(user: AuthUser, permission: Permission) {
  return rolePermissions[user.role].includes(permission);
}
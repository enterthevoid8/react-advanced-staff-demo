import { ReactNode } from "react";
import { Permission } from "./permissions";
import { useAuth } from "./AuthProvider";

export function PermissionGate({
  permission,
  children,
  fallback = null
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { AuthUser, can, Permission } from "./permissions";

type AuthContextValue = {
  user: AuthUser;
  switchRole(role: AuthUser["role"]): void;
  hasPermission(permission: Permission): boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>({
    id: "current-user",
    name: "Principal Demo User",
    role: "admin"
  });

  const switchRole = useCallback((role: AuthUser["role"]) => {
    setUser((previous) => ({ ...previous, role }));
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => can(user, permission),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      switchRole,
      hasPermission
    }),
    [user, switchRole, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return auth;
}
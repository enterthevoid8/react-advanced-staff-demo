import { PermissionGate } from "../../auth/PermissionGate";
import { useAuth } from "../../auth/AuthProvider";
import { useUIStore } from "../../store/uiStore";

export function AdminPage() {
  const { user } = useAuth();
  const pushToast = useUIStore((state) => state.pushToast);

  return (
    <PermissionGate
      permission="admin:access"
      fallback={
        <section className="card danger">
          <h1>Admin access required</h1>
          <p>Switch to the admin role from the top-right role selector.</p>
        </section>
      }
    >
      <div className="stack">
        <section className="card">
          <h1>Admin Console</h1>
          <p>
            Current user is <strong>{user.role}</strong>.
          </p>
        </section>

        <section className="card">
          <h2>Operational Controls</h2>
          <p>
            This is where production-grade apps often expose cache inspection,
            support tooling, feature flag overrides, user impersonation, and
            audit trails.
          </p>

          <button onClick={() => pushToast("Admin action recorded")}>
            Simulate admin action
          </button>
        </section>
      </div>
    </PermissionGate>
  );
}
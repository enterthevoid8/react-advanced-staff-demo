import { NavLink, Outlet } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../auth/AuthProvider";
import { useUIStore } from "../store/uiStore";
import { CommandPalette } from "../components/CommandPalette";

export function App() {
  const { user, switchRole } = useAuth();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const toasts = useUIStore((state) => state.toasts);
  const dismissToast = useUIStore((state) => state.dismissToast);

  return (
    <div className="app-shell">
      <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
        <h2>Staff React</h2>

        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/experiments">Experiments</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <button onClick={toggleSidebar}>Toggle sidebar</button>

          <div className="role-switcher">
            <span>{user.name}</span>

            <select
              value={user.role}
              onChange={(event) =>
                switchRole(event.target.value as typeof user.role)
              }
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="engineer">Engineer</option>
            </select>
          </div>
        </header>

        <section className="page">
          <Suspense fallback={<div className="card">Loading route...</div>}>
            <Outlet />
          </Suspense>
        </section>
      </main>

      <CommandPalette />

      <div className="toast-region">
        {toasts.map((toast) => (
          <button key={toast.id} onClick={() => dismissToast(toast.id)}>
            {toast.message}
          </button>
        ))}
      </div>
    </div>
  );
}
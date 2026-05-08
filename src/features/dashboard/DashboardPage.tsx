import { Tabs } from "../../components/Tabs";
import { useAuth } from "../../auth/AuthProvider";
import { useFeatureFlags } from "../../flags/FeatureFlagProvider";

export function DashboardPage() {
  const { user } = useAuth();
  const { flags } = useFeatureFlags();

  return (
    <div className="stack">
      <section className="card hero">
        <h1>Advanced React Architecture Demo</h1>
        <p>
          This project demonstrates senior/staff-level React patterns:
          dependency injection, query caching, route-level splitting,
          permission gates, feature flags, external stores, reducers,
          portals, compound components, and virtualization.
        </p>
      </section>

      <Tabs.Root defaultValue="architecture">
        <Tabs.List>
          <Tabs.Trigger value="architecture">Architecture</Tabs.Trigger>
          <Tabs.Trigger value="runtime">Runtime</Tabs.Trigger>
          <Tabs.Trigger value="product">Product</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="architecture">
          <div className="card">
            <h2>Architecture</h2>
            <ul>
              <li>Feature-first folders</li>
              <li>Service boundary via dependency injection</li>
              <li>Server state separated from client state</li>
              <li>Typed permissions and feature flags</li>
            </ul>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="runtime">
          <div className="card">
            <h2>Runtime</h2>
            <p>Current role: {user.role}</p>
            <p>Open command palette with Ctrl+K or Cmd+K.</p>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="product">
          <div className="card">
            <h2>Feature Flags</h2>
            <pre>{JSON.stringify(flags, null, 2)}</pre>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
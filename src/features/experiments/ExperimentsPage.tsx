import { useFeatureFlags } from "../../flags/FeatureFlagProvider";
import { PermissionGate } from "../../auth/PermissionGate";

export function ExperimentsPage() {
  const { flags, toggle } = useFeatureFlags();

  return (
    <PermissionGate
      permission="experiments:access"
      fallback={<div className="card danger">No access to experiments.</div>}
    >
      <div className="stack">
        <section className="card">
          <h1>Experiments</h1>
          <p>
            Demonstrates a local feature flag provider. In production, these
            flags usually come from LaunchDarkly, Statsig, Unleash, or an
            internal experimentation service.
          </p>
        </section>

        <section className="card">
          {Object.entries(flags).map(([flag, enabled]) => (
            <div className="row" key={flag}>
              <div>
                <strong>{flag}</strong>
                <p>{enabled ? "enabled" : "disabled"}</p>
              </div>

              <button onClick={() => toggle(flag as keyof typeof flags)}>
                Toggle
              </button>
            </div>
          ))}
        </section>
      </div>
    </PermissionGate>
  );
}
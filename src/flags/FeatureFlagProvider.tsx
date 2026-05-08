import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type FeatureFlag = "new-project-workflow" | "command-palette" | "virtualized-users";

type FeatureFlagContextValue = {
  flags: Record<FeatureFlag, boolean>;
  isEnabled(flag: FeatureFlag): boolean;
  toggle(flag: FeatureFlag): void;
};

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<FeatureFlag, boolean>>({
    "new-project-workflow": true,
    "command-palette": true,
    "virtualized-users": true
  });

  const value = useMemo<FeatureFlagContextValue>(
    () => ({
      flags,
      isEnabled(flag) {
        return flags[flag];
      },
      toggle(flag) {
        setFlags((previous) => ({
          ...previous,
          [flag]: !previous[flag]
        }));
      }
    }),
    [flags]
  );

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  const value = useContext(FeatureFlagContext);

  if (!value) {
    throw new Error("useFeatureFlags must be used inside FeatureFlagProvider");
  }

  return value;
}
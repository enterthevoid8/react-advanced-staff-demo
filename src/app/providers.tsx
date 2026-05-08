import { ReactNode, useMemo } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { AuthProvider } from "../auth/AuthProvider";
import { FeatureFlagProvider } from "../flags/FeatureFlagProvider";
import { ServicesProvider, createServices } from "../services/createServices";
import { ErrorBoundary } from "../components/ErrorBoundary";

export function AppProviders({ children }: { children: ReactNode }) {
  const services = useMemo(() => createServices(), []);

  return (
    <ErrorBoundary
      onError={(error, info) => {
        services.telemetry.error(error, {
          componentStack: info.componentStack
        });
      }}
    >
      <ServicesProvider value={services}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <FeatureFlagProvider>{children}</FeatureFlagProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ServicesProvider>
    </ErrorBoundary>
  );
}
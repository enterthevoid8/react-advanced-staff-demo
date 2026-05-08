import { createContext, useContext } from "react";
import { createMockApi } from "./mockApi";
import { consoleTelemetry } from "./telemetry";

export function createServices() {
  return {
    api: createMockApi(),
    telemetry: consoleTelemetry
  };
}

export type Services = ReturnType<typeof createServices>;

const ServicesContext = createContext<Services | null>(null);

export const ServicesProvider = ServicesContext.Provider;

export function useServices() {
  const services = useContext(ServicesContext);

  if (!services) {
    throw new Error("useServices must be used inside ServicesProvider");
  }

  return services;
}
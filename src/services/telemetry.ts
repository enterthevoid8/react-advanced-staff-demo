export type TelemetryEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export interface Telemetry {
  track(event: TelemetryEvent): void;
  error(error: unknown, context?: Record<string, unknown>): void;
}

export const consoleTelemetry: Telemetry = {
  track(event) {
    console.info("[telemetry]", event.name, event.properties ?? {});
  },

  error(error, context) {
    console.error("[telemetry:error]", error, context ?? {});
  }
};
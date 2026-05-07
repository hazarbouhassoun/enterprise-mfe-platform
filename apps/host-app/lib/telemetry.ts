import { createLogger } from '@repo/config';

const log = createLogger('host:telemetry');

type TelemetryPayload = Record<string, unknown> | undefined;

/**
 * Fire-and-forget client events. Ingest URL is optional — most internal apps start with
 * console + later wire Datadog/GA without renaming call sites.
 */
export function trackClientEvent(name: string, payload?: TelemetryPayload): void {
  if (typeof window === 'undefined') return;

  const ingest = process.env.NEXT_PUBLIC_TELEMETRY_INGEST_URL;
  const body = JSON.stringify({
    name,
    payload,
    path: window.location.pathname,
    t: Date.now(),
  });

  if (ingest) {
    try {
      const ok = navigator.sendBeacon(ingest, new Blob([body], { type: 'application/json' }));
      if (ok) return;
    } catch {
      // fall through to dev log
    }
  }

  if (process.env.NODE_ENV === 'development') {
    log.debug(name, payload);
  }
}

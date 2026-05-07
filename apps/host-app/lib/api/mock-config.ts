import { flags } from '@/lib/flags';

/** Tunable mock latency for local demos (ms). Caps so nobody accidentally sets 60s. */
export function mockApiDelayMs(): number {
  const raw = process.env.NEXT_PUBLIC_MOCK_API_DELAY_MS;
  if (raw === undefined || raw === '') return 120;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return 120;
  let ms = Math.min(n, 5000);
  if (flags.slowMockNetwork()) ms = Math.min(ms * 2, 5000);
  return ms;
}

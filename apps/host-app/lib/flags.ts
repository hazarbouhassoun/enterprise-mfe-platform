function truthyEnv(name: string): boolean {
  const v = process.env[name];
  return v === '1' || v?.toLowerCase() === 'true';
}

/** Build-time toggles — no runtime service, just env reads teams already use. */
export const flags = {
  /** Doubles mock API delay (see mock-config) — handy when recording demos or testing spinners. */
  slowMockNetwork: () => truthyEnv('NEXT_PUBLIC_FLAG_SLOW_MOCK'),
} as const;

import { createLogger } from '@repo/config';

const log = createLogger('host:env');

/** Warn once per server boot / client hydration if public config looks wrong. */
export function warnPublicEnvIssues(): void {
  if (process.env.NODE_ENV !== 'production') return;

  const admin = process.env.NEXT_PUBLIC_ADMIN_APP_URL;
  if (!admin) {
    log.warn('NEXT_PUBLIC_ADMIN_APP_URL is unset — admin remote will 404 in prod builds');
    return;
  }
  try {
    const u = new URL(admin);
    if (!u.protocol.startsWith('http')) {
      log.warn('NEXT_PUBLIC_ADMIN_APP_URL should be http(s)', { admin });
    }
  } catch {
    log.warn('NEXT_PUBLIC_ADMIN_APP_URL is not a valid URL', { admin });
  }
}

import { useRouter } from 'next/compat/router';
import { trackClientEvent } from '@/lib/telemetry';
import { useEffect } from 'react';
import { getIsAuthenticatedSnapshot, useAuthStore } from './auth-store';
import { routerReplace } from './client-navigation';
import { shellRouteNeedsSession } from './shell-routes';

export function useRequireAuth(redirectTo = '/login') {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!getIsAuthenticatedSnapshot()) {
      const from =
        typeof window !== 'undefined' ? window.location.pathname : undefined;
      if (from && shellRouteNeedsSession(from)) {
        trackClientEvent('auth_redirect', { to: redirectTo, from });
      }
      void routerReplace(router, redirectTo);
    }
  }, [redirectTo, router, token]);

  return Boolean(token);
}

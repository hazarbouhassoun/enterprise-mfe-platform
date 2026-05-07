import type { NextRouter } from 'next/router';

/**
 * SPA navigation when the Pages Router instance is available; otherwise full
 * navigation (helps when RouterContext is missing under some Module Federation setups).
 */
export async function routerReplace(router: NextRouter | null, href: string): Promise<void> {
  if (router) {
    await router.replace(href);
    return;
  }
  if (typeof window !== 'undefined') {
    window.location.replace(href);
  }
}

/** Safe return path after login (?next=); only same-origin relative paths allowed. */
export function getPostLoginPath(router: NextRouter | null): string {
  const fromRouter =
    router?.query?.next != null && typeof router.query.next === 'string' ? router.query.next : null;
  if (fromRouter && isSafeInternalPath(fromRouter)) return fromRouter;
  if (typeof window !== 'undefined') {
    const q = new URLSearchParams(window.location.search).get('next');
    if (q && isSafeInternalPath(q)) return q;
  }
  return '/dashboard';
}

function isSafeInternalPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

/** Prefixes that assume a session in the shell (client-side guard today only). */
export const SHELL_AUTH_PREFIXES = ['/dashboard', '/profile', '/account'] as const;

export function shellRouteNeedsSession(pathname: string): boolean {
  return SHELL_AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

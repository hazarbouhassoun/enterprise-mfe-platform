import { describe, expect, it } from 'vitest';
import { shellRouteNeedsSession } from './shell-routes';

describe('shellRouteNeedsSession', () => {
  it('matches dashboard and nested self-serve paths', () => {
    expect(shellRouteNeedsSession('/dashboard')).toBe(true);
    expect(shellRouteNeedsSession('/profile/settings')).toBe(true);
    expect(shellRouteNeedsSession('/account/preferences')).toBe(true);
  });

  it('ignores marketing-ish routes', () => {
    expect(shellRouteNeedsSession('/')).toBe(false);
    expect(shellRouteNeedsSession('/login')).toBe(false);
  });
});

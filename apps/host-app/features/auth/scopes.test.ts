import { describe, expect, it } from 'vitest';
import { canEmbedAdminRemote, mockLoginScopes } from './scopes';

describe('mockLoginScopes', () => {
  it('adds admin read when +ops is in the local part', () => {
    expect(mockLoginScopes('x+ops@acme.com')).toContain('admin.widgets.read');
  });

  it('stays customer-only otherwise', () => {
    expect(mockLoginScopes('x@acme.com')).not.toContain('admin.widgets.read');
  });
});

describe('canEmbedAdminRemote', () => {
  it('is false without scope', () => {
    expect(canEmbedAdminRemote(['customer.self_serve'])).toBe(false);
  });

  it('is true with scope', () => {
    expect(canEmbedAdminRemote(['customer.self_serve', 'admin.widgets.read'])).toBe(true);
  });
});

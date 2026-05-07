/** String scopes are a stand-in until real IdP claims land. */
export const SCOPE = {
  customerSelfServe: 'customer.self_serve',
  adminWidgetsRead: 'admin.widgets.read',
} as const;

/** Derives mock scopes from the email typed at login — same idea as a claim mapper, minus the JWT. */
export function mockLoginScopes(email: string): string[] {
  const e = email.trim().toLowerCase();
  const [local, domain] = e.split('@');
  const base: string[] = [SCOPE.customerSelfServe];
  if (local?.includes('+ops') || domain === 'staff.example') {
    base.push(SCOPE.adminWidgetsRead);
  }
  return base;
}

export function canEmbedAdminRemote(scopes: string[] | undefined): boolean {
  return Boolean(scopes?.includes(SCOPE.adminWidgetsRead));
}

# Engineering notes (internal)

Context and tracked work that does not belong in the main README.

## Runtime / demo trade-offs

- **Auth storage key** bumped to `host-auth-demo-v2` when mock `scopes` were added. If you had an old session blob, sign in again — fine for a demo repo.
- **Federation + router**: host uses `next/compat/router` in a few places because webpack/MF can split `next/router` oddly; not worth fighting the graph for a portfolio app.
- **Scopes** (`features/auth/scopes.ts`): `mockLoginScopes` / `canEmbedAdminRemote` are stand-ins until IdP claims or an entitlements API exist. Local demo only: `+ops` in the email local-part or `@staff.example` grants admin embed scope (see `e2e/smoke.spec.ts`).
- **Mocks** (`lib/api/user.ts`): `sleep` + `AbortSignal` so TanStack Query can cancel in-flight work when you navigate away. The token argument is unused until a real BFF — then thread `createHttpClient` through hooks or context.
- **`trackClientEvent`**: dev logs by default; set `NEXT_PUBLIC_TELEMETRY_INGEST_URL` if you want `sendBeacon` traffic against a collector.

## Backlog (blocked on backend or a deliberate migration)

- **Auth**: move from mock Zustand + `localStorage` to HttpOnly cookies (or BFF-issued session), refresh handling, and server-enforced protection for shell routes — not just client redirects.

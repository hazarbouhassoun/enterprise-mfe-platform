# Enterprise Micro-Frontend Monorepo (Demo)

A production-style frontend platform demonstrating scalable **micro-frontend architecture**, **monorepo design**, and **modern React/Next.js engineering patterns**.

Built as a portfolio project to simulate real-world frontend platform systems used in enterprise environments.

---

## TL;DR

- React 19 + Next.js 15 (Pages Router)
- Micro-frontends using Module Federation
- Turborepo monorepo architecture
- Shared UI system (`@repo/ui`)
- Shared engineering config (`@repo/config`)
- Auth + scoped access control demo
- Self-service UX (profile, settings, preferences)
- Testing: Vitest + Playwright + Storybook
- CI/CD via GitHub Actions

---

## Architecture Overview

- **Host App (`host-app`)**
  Customer-facing shell handling auth, routing, and self-service flows.

- **Remote App (`admin-app`)**
  Exposes federated UI modules consumed at runtime.

- **Shared Packages**
  - `@repo/ui`: reusable design system components
  - `@repo/config`: shared TypeScript, ESLint, utilities

- **Micro-Frontend Strategy**
  Module Federation enables runtime composition and independent deployment of apps.

---

## Key Features

### Platform Capabilities
- Authentication demo (Zustand-based session)
- Scoped access control (feature gating)
- Self-service forms (RHF + Zod)
- Protected dashboard flows

### Frontend Architecture
- Feature-based structure
- Shared UI system
- API abstraction layer
- Error boundaries + loading states
- SSR + dynamic imports

### Engineering Practices
- Monorepo with Turborepo
- CI pipeline (lint, typecheck, test, build, e2e)
- Component documentation (Storybook)
- Unit + E2E testing

---

## Development

Internal context (demo limitations, federation quirks, backlog): [`docs/engineering-notes.md`](docs/engineering-notes.md).

```bash
pnpm install
pnpm dev
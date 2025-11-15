# Implementation Plan: User CMS (accounts, roles, API keys)

**Branch**: `001-implement-user-cms` | **Date**: 2025-11-15 | **Spec**: `/specs/001-implement-user-cms/spec.md`
**Input**: Feature specification from `/specs/001-implement-user-cms/spec.md`

**Note**: This plan is generated via the `/speckit.plan` workflow for the User CMS feature.

## Summary

Implement a secure, role-based user management system for LumiBible that supports:

- Admin user management (CRUD on users, role changes, status changes) via CMS.
- Self-service user registration with email verification and password reset.
- Role-based access control for `admin`, `contributor`, and `user`, including `/cms` protection.
- Personal API keys that inherit user permissions and can be created, rotated, and revoked.
- Automated cleanup of stale pending accounts and expired tokens, plus long-term anonymization of inactive users.

The initial technical approach is to create a new LumiBible stack with a NestJS backend and a Next.js frontend, implementing user, API key, and token models, and exposing REST-style `/api/` endpoints plus CMS UI components. The system will enforce security best practices (hashed passwords, non-retrievable secrets, audit logging) and use JWT-based authentication for interactive users alongside API key-based programmatic access.

## Technical Context

**Language/Version**: TypeScript on Node.js (latest LTS) for both backend (NestJS) and frontend (Next.js)  
**Primary Dependencies**: NestJS for the backend HTTP API and background jobs; Next.js + React for the frontend; PostgreSQL 18 with Prisma as the ORM; SCSS for styling and design tokens following ITCSS and BEM; linting/formatting via ESLint + Prettier  
**Storage**: PostgreSQL 18 for users, API keys, and tokens, with migrations and schema managed via Prisma  
**Testing**: Jest (unit + integration) on backend and frontend, plus optional end-to-end tests (e.g., Playwright/Cypress) for critical flows, following industry best practices for test structure and coverage  
**Target Platform**: Linux servers running Docker containers (Docker Swarm deployments) for both NestJS and Next.js, accessed via modern baseline-widely-available browsers  
**Project Type**: Web application with backend API (`/api/` REST endpoints) and a Next.js-based CMS/frontend  
**Performance Goals**: Support at least low tens of thousands of registered users with typical auth flows completing in < 500ms p95 under normal load for authenticated web requests on a single VM (up to 4 cores and 8GB RAM), with the ability to scale out by adding containers as usage grows; apply industry best practices for performance on both backend and frontend  
**Constraints**: Strong security (no plaintext secrets, time-limited tokens, rate limiting), GDPR-oriented data minimization and anonymization, responsive UI with simple accessible design, and SCSS architecture following ITCSS and BEM; remaining detailed SLOs can be refined later as usage data is collected  
**Scale/Scope**: Initial rollout focused on early adopters (hundreds to low thousands of active users), running on a single VM (up to 4 cores and 8GB RAM), but architecture designed for feature-oriented modularity and scaling to 10k+ active accounts via horizontal scaling

### Technical Unknowns (resolved for this plan)

- **JWT authentication strategy**: Use a dual-token model with 15-minute access tokens (JWTs containing `sub`, `role`, `iat`, `exp`) sent via `Authorization: Bearer <token>`, and 7-day refresh tokens stored in HTTP-only, Secure cookies. Maintain a `UserSession` table (with `session_id`, `user_id`, hashed refresh token, `created_at`, `expires_at`, `revoked_at`) to support rotation on each refresh and server-side revocation on logout, password change, role change, or deactivation.
- **Email templating and localization**: Implement language-aware email templates using a file-based structure (e.g., Handlebars) under `backend/src/email/templates/`, with per-language files such as `verification/en.hbs` and `verification/fr.hbs`, plus shared partials for layout. For each message, choose the template based on the user’s `preferred_language` (falling back to a default if unsupported) and render verification and reset URLs into localized copy.
- **End-to-end testing**: Use Playwright as the primary E2E framework to cover critical flows (registration + verification, login/logout, password reset, `/cms` access per role, admin user management, API key lifecycle). Combine this with Jest-based unit/integration tests targeting ~80% coverage for auth, users, API keys, and tokens modules, treating this as a planning baseline rather than a hard gate.
- **SCSS tokens and ITCSS structure**: Organize `frontend/src/styles/` according to ITCSS layers (`settings/`, `tools/`, `generic/`, `elements/`, `objects/`, `components/`, `utilities/`) with design tokens (colors, spacing, typography, breakpoints) defined in `settings/_tokens.scss`. Apply BEM naming conventions for components (e.g., `.btn`, `.btn__icon`, `.btn--primary`) and use `o-` prefixes for layout objects and `u-` prefixes for utilities to keep specificity low and styles predictable.
- **Performance posture and SLO refinement**: Start with a performance budget targeting < 500ms p95 for core auth and CMS operations on a single 4-core/8GB VM, using Prisma with appropriate indexes and connection pooling, NestJS clustering (1 worker per core), and Next.js optimizations (code splitting, asset optimization). Refine SLOs and capacity plans over time based on observed latencies, error rates, and resource usage, and prepare to scale horizontally by adding containers behind Docker Swarm as load increases.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Code quality and maintainability risks identified? (Principle I)
  - YES: Authentication/authorization and security logic are cross-cutting concerns that can become complex. Plan MUST:
    - Keep user models, API key management, and token handling encapsulated behind NestJS feature modules and services (e.g., `auth`, `users`, `api-keys`).
    - Reuse shared configuration, logging, and error-handling patterns across modules.
- Required automated tests for critical flows listed? (Principle II)
  - PARTIAL: Critical flows identified for test coverage:
    - Registration + email verification (happy path + invalid/expired tokens).
    - Login/logout and session handling.
    - Password reset (happy path + token reuse/expiry).
    - Role-based access to `/cms` for admin/contributor/user.
    - Admin user management (role changes, deactivate/delete, anonymization behavior).
    - API key issuance, usage, revocation, and behavior on role/status changes.
    - Cleanup jobs for pending accounts and expired tokens.
  - Exact test tooling and coverage thresholds NEED CLARIFICATION.
- UX consistency with existing patterns confirmed? (Principle III)
  - PARTIAL: CMS user management and account settings UI will be implemented in Next.js with a simple, responsive design and shared SCSS-based design tokens (colors, spacing, typography). Detailed design language and any future design system conventions remain NEEDS CLARIFICATION.
- Accessibility and inclusivity considerations captured? (Principle IV)
  - PARTIAL: Plan includes keyboard-accessible forms, proper labels and error messaging, and localization-ready copy for auth-related emails and screens. Detailed accessibility checklist and language strategy NEED CLARIFICATION.
- Target platforms, older devices, and performance budgets defined? (Principle V)
  - PARTIAL: Target platform is Dockerized NestJS/Next.js services on Linux servers, accessed via baseline-widely-available browsers; performance goals are qualitatively defined, but detailed budgets and supported browser/device matrix remain NEEDS CLARIFICATION.

## Project Structure

### Documentation (this feature)

```text
specs/001-implement-user-cms/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
backend/                          # NestJS backend (feature-oriented)
├── src/
│   ├── app.module.ts
│   ├── common/                   # shared utilities, guards, interceptors
│   ├── config/                   # configuration (env, database, mail, auth)
│   ├── database/                 # ORM setup, migrations
│   ├── auth/                     # JWT auth, guards, strategies
│   ├── users/                    # user domain: entities, DTOs, services, controllers
│   ├── api-keys/                 # API key entities, services, controllers
│   ├── tokens/                   # email verification and password reset tokens
│   ├── cms/                      # CMS-specific endpoints and authorization checks
│   └── jobs/                     # NestJS background jobs for cleanup and anonymization
└── test/
  ├── unit/
  │   ├── auth/
  │   ├── users/
  │   └── api-keys/
  └── integration/
    ├── auth-flows/
    ├── cms-access-control/
    └── api-keys-and-roles/

frontend/                         # Next.js frontend (feature-oriented)
├── src/
│   ├── app/ or pages/            # depending on chosen Next.js routing
│   │   ├── auth/                 # login, register, verify-email, reset-password pages
│   │   ├── account/              # account settings, API keys management
│   │   └── cms/                  # CMS shell and user management screens
│   ├── features/                 # feature modules (auth, users, api-keys, layout)
│   ├── components/               # shared UI components (forms, tables, layout)
│   ├── styles/
│   │   ├── tokens.scss           # design tokens (colors, spacing, typography)
│   │   └── globals.scss
│   └── lib/
│       ├── api-client/           # typed fetch/axios wrappers for `/api/` endpoints
│       └── auth/                 # client-side auth helpers (JWT handling, redirects)
└── test/
  ├── unit/
  └── integration/

## Complexity Tracking
> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
```

# Research: User CMS (accounts, roles, API keys)

This document consolidates Phase 0 research for the User CMS feature.
Each section follows the format:

- Decision
- Rationale
- Alternatives considered

## Backend stack and auth model

**Decision**: Use Node.js (latest LTS 24) with NestJS as the backend framework, TypeScript as the language, and JWT for interactive user sessions plus API keys for programmatic access.

**Rationale**: NestJS provides a modular, feature-oriented architecture well-suited to the large scope of LumiBible, with first-class support for TypeScript, testing, background jobs, and structured modules (e.g., `auth`, `users`, `api-keys`). JWT is a standard, well-supported choice for stateless auth in a web/API context, and complements personal API keys for script/integration access.

**Alternatives considered**:

- Use a different backend framework (e.g., Express directly, Fastify, or a Python framework) – rejected to keep the stack consistent and leverage NestJS conventions and tooling.
- Use session cookies backed by a server store instead of JWT – could still be considered, but JWT aligns better with stateless APIs and Docker-scaled deployments.

## Database choice and migrations

**Decision**: Use PostgreSQL 18 as the primary database, with schema and migrations managed via Prisma as the ORM.

**Rationale**: User accounts, roles, API keys, and tokens fit naturally into relational models with strong constraints and transactional guarantees. PostgreSQL is widely used and well supported by most ORMs.

**Alternatives considered**:

- Use a document store (e.g., MongoDB) for flexibility – rejected because relational constraints (unique emails, foreign keys from API keys/tokens) are simpler and safer in SQL.
- Use in-memory or file-based storage – rejected due to durability, concurrency, and scaling concerns.

## Email delivery infrastructure

**Decision**: Use SMTP with an external provider (e.g., transactional email service) for verification and password reset emails; templates and localization will be handled by the backend using a templating approach that supports multiple languages.

**Rationale**: Registration, verification, and password reset flows rely on reliable email delivery and localized templates. Integrating with the existing solution avoids duplicating infrastructure.

**Alternatives considered**:

- Build a new email delivery path just for this feature – rejected due to operational overhead and consistency risks.

## API style and routing conventions

**Decision**: Expose REST-style JSON APIs under `/api/` paths (e.g., `/api/auth/login`, `/api/users`), without explicit versioning, assuming the backend and Next.js frontend move in lockstep.

**Rationale**: REST JSON is a broadly compatible default and matches the expectations in most web stacks. It maps well to CMS and programmatic clients.

**Alternatives considered**:

- GraphQL-only API – rejected for now due to added complexity for auth/side-effect flows; may be added later as an alternative interface.
- RPC-style endpoints without clear resource modeling – rejected due to maintainability and discoverability concerns.

## Tests and quality gates

**Decision**: Critical flows MUST be covered by automated tests using Jest for unit and integration tests on both backend (NestJS) and frontend (Next.js/React), with optional Playwright or Cypress for end-to-end testing of key user journeys.

**Rationale**: The LumiBible Constitution requires tests for critical paths, especially auth, security, and data integrity. The exact tooling depends on the existing stack.

**Alternatives considered**:

- Rely primarily on manual testing – rejected; insufficient for long-term reliability.

## CMS UI framework and design system

**Decision**: Implement the CMS UI with React and Next.js, using a simple, responsive layout and SCSS-based design tokens to define colors, typography, spacing, and other primitives, structured according to ITCSS and BEM methodologies. This will serve as the seed of a future design system.

**Rationale**: The Constitution requires UX consistency and reuse of shared components. Implementing CMS UI in a different framework or with ad-hoc styling would violate these principles.

**Alternatives considered**:

- Standalone admin UI built with a different stack – rejected; increases maintenance burden and breaks UX consistency.

## Configuration and secrets management

**Decision**: Manage secrets (password hashing config, JWT and token lifetimes, rate limits, SMTP credentials, database credentials) via environment variables, using `.env.local` files in development and injected environment variables in production.

**Rationale**: Security-sensitive configuration must not be hard-coded. Using the central configuration mechanism ensures consistency across environments.

**Alternatives considered**:

- Hard-code lifetimes and limits in code – rejected due to inflexibility and operational risk.

## Cleanup and background jobs

**Decision**: Implement daily cleanup jobs for expired tokens and stale pending accounts using NestJS’s background job capabilities (e.g., `@nestjs/schedule` for cron-like tasks or queue-based workers), avoiding external schedulers where possible.

**Rationale**: The spec mandates recurrent cleanup. Hooking into the established job runner avoids introducing new infrastructure.

**Alternatives considered**:

- Cleanup only on user interaction – rejected; would leave stale data indefinitely if users do not interact.

---

At this stage, most core technology choices (NestJS, Next.js, PostgreSQL 18 with Prisma, SMTP, REST `/api/` style, Jest-based testing, ITCSS/BEM SCSS design tokens, env-var configuration, and NestJS background jobs) are fixed. Remaining open questions primarily concern detailed JWT token lifetimes/refresh strategy (within industry best practices), concrete email templating/localization implementation, choice of E2E test framework, and refined performance SLOs based on real usage on a 4-core/8GB VM.

# Tasks: User CMS (accounts, roles, API keys)

**Input**: Design documents from `/specs/001-implement-user-cms/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Critical flows MUST be covered by automated tests (backend + frontend). This task list includes explicit test tasks for those flows; additional tests can be added as needed during implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- All tasks include concrete file paths aligned with `plan.md` structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base structure for backend and frontend.

- [X] T001 Create backend NestJS project structure in `backend/` per plan.md
- [X] T002 Create frontend Next.js project structure in `frontend/` per plan.md
- [X] T003 [P] Initialize TypeScript, ESLint, and Prettier in `backend/`
- [X] T004 [P] Initialize TypeScript, ESLint, and Prettier in `frontend/`
- [X] T005 [P] Add basic Dockerfile for NestJS backend in `backend/Dockerfile`
- [X] T006 [P] Add basic Dockerfile for Next.js frontend in `frontend/Dockerfile`
- [X] T007 Configure root-level workspace settings for Node.js/TypeScript in `lumibible.code-workspace`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before implementing any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T008 Setup Prisma schema and migrations in `backend/prisma/schema.prisma` for core entities (User, ApiKey, EmailVerificationToken, PasswordResetToken, UserSession)
- [ ] T009 [P] Configure NestJS database module and Prisma client in `backend/src/database/`
- [ ] T010 [P] Implement global configuration module for env vars in `backend/src/config/config.module.ts`
- [ ] T011 [P] Implement logging and error-handling interceptors in `backend/src/common/`
- [ ] T012 Implement Auth module skeleton (JWT, guards, decorators) in `backend/src/auth/`
- [ ] T013 Implement Users module skeleton (controllers, services, DTOs) in `backend/src/users/`
- [ ] T014 Implement API Keys module skeleton in `backend/src/api-keys/`
- [ ] T015 Implement Tokens module skeleton (email verification + reset) in `backend/src/tokens/`
- [ ] T016 Implement CMS access control module skeleton in `backend/src/cms/`
- [ ] T017 Wire `/api/` routing and global prefix in `backend/src/app.module.ts` and `backend/src/main.ts`
- [ ] T018 Setup basic frontend routing structure (auth, account, cms) in `frontend/src/app/` or `frontend/src/pages/`
- [ ] T019 [P] Setup SCSS structure with ITCSS layers and tokens in `frontend/src/styles/`
- [ ] T020 [P] Configure shared HTTP client and auth helpers in `frontend/src/lib/api-client/` and `frontend/src/lib/auth/`
- [ ] T021 Configure Jest for backend unit and integration tests in `backend/jest.config.ts` and `backend/test/`
- [ ] T022 Configure Jest (and optional Playwright scaffolding) for frontend tests in `frontend/jest.config.ts` and `frontend/test/`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 – Admin manages user accounts (Priority: P1) 🎯 MVP

**Goal**: Allow admins to manage user accounts (CRUD, roles, status) via the CMS with immediate effect on access.

**Independent Test**: Using test admin credentials, perform user CRUD in `/cms/users` and verify changes affect login and `/cms` access immediately.

### Tests for User Story 1 (critical flows)

- [ ] T023 [P] [US1] Backend integration tests for admin user CRUD in `backend/test/integration/accounts/admin-users.e2e-spec.ts`
- [ ] T024 [P] [US1] Frontend integration tests for `/cms/users` flows in `frontend/test/integration/cms-users.spec.ts`

### Implementation for User Story 1 – Backend

- [ ] T025 [P] [US1] Implement `User` entity and Prisma model fields per `data-model.md` in `backend/prisma/schema.prisma`
- [ ] T026 [US1] Implement Users service methods (list, create, update, deactivate/anonymize) in `backend/src/users/users.service.ts`
- [ ] T027 [US1] Implement Users controller endpoints for `/api/accounts/users` and `/api/accounts/users/{userId}` in `backend/src/users/users.controller.ts` using `contracts/openapi-user-cms.yaml`
- [ ] T028 [US1] Implement role and status validation logic in `backend/src/users/dto/` and `backend/src/users/users.service.ts`
- [ ] T029 [US1] Implement anonymization logic for deleted users in `backend/src/users/users.service.ts`
- [ ] T030 [US1] Implement audit logging for admin user changes in `backend/src/users/users.service.ts` and `backend/src/common/audit/`
- [ ] T031 [US1] Add RBAC guard restricting `/api/accounts/users*` to admins in `backend/src/auth/roles.guard.ts`

### Implementation for User Story 1 – Frontend (CMS)

- [ ] T032 [P] [US1] Implement `/cms/users` list page with filters and pagination in `frontend/src/app/cms/users/page.tsx` or `frontend/src/pages/cms/users/index.tsx`
- [ ] T033 [P] [US1] Implement user create/edit form components in `frontend/src/features/users/components/UserForm.tsx`
- [ ] T034 [US1] Implement hooks/services for user CRUD API calls in `frontend/src/features/users/api/usersApi.ts`
- [ ] T035 [US1] Wire role and status options into UI from shared constants in `frontend/src/features/users/constants.ts`
- [ ] T036 [US1] Implement deactivate/anonymize actions with confirmation dialogs in `frontend/src/features/users/components/UserActions.tsx`
- [ ] T037 [US1] Ensure CMS navigation shows Users section only for admins in `frontend/src/features/cms/components/CmsSidebar.tsx`

**Checkpoint**: Admin user management is fully functional and testable independently.

---

## Phase 4: User Story 4 – Role-based access to CMS and content (Priority: P1)

**Goal**: Enforce `admin`, `contributor`, and `user` roles across backend and frontend so only contributors/admins access `/cms` and management features.

**Independent Test**: Create three accounts (admin, contributor, user); verify `/cms` and user management access matches role definitions.

### Tests for User Story 4 (critical flows)

- [ ] T038 [P] [US4] Backend integration tests for role-based guards on `/api/cms/*` and `/api/accounts/users*` in `backend/test/integration/auth/roles.e2e-spec.ts`
- [ ] T039 [P] [US4] Frontend E2E tests for `/cms` access per role in `frontend/test/e2e/cms-role-access.spec.ts`

### Implementation for User Story 4 – Backend

- [ ] T040 [P] [US4] Implement `Role` enum and decorators in `backend/src/auth/roles.decorator.ts`
- [ ] T041 [US4] Implement `RolesGuard` enforcing admin/contributor/user permissions in `backend/src/auth/roles.guard.ts`
- [ ] T042 [US4] Protect CMS-related controllers (e.g., `backend/src/cms/cms.controller.ts`) with role guards
- [ ] T043 [US4] Ensure JWT payload includes role and status fields in `backend/src/auth/jwt.strategy.ts`
- [ ] T044 [US4] Implement logic to recalculate permissions on role change in `backend/src/users/users.service.ts`

### Implementation for User Story 4 – Frontend

- [ ] T045 [P] [US4] Implement client-side role-aware route guards for `/cms` in `frontend/src/lib/auth/routeGuards.ts`
- [ ] T046 [US4] Ensure navigation and menus hide `/cms` links for basic users in `frontend/src/components/Layout/MainNav.tsx`
- [ ] T047 [US4] Implement unauthorized/forbidden UI for denied `/cms` access in `frontend/src/app/cms/forbidden/page.tsx` or equivalent
- [ ] T048 [US4] Ensure role changes on backend propagate to frontend session state (e.g., via refreshed JWT) in `frontend/src/lib/auth/session.ts`

**Checkpoint**: Role-based access is enforced; `/cms` and user management behavior matches role definitions.

---

## Phase 5: User Story 2 – User self-registration and account recovery (Priority: P2)

**Goal**: Allow visitors to register, verify email, log in, and reset password securely.

**Independent Test**: Use a test email to register, verify via email link, log in, request password reset, change password, and confirm access persists.

### Tests for User Story 2 (critical flows)

- [ ] T049 [P] [US2] Backend integration tests for registration, email verification, and password reset flows in `backend/test/integration/auth/registration-reset.e2e-spec.ts`
- [ ] T050 [P] [US2] Frontend integration/E2E tests for signup, verification, login, and password reset in `frontend/test/e2e/auth-flows.spec.ts`

### Implementation for User Story 2 – Backend

- [ ] T051 [P] [US2] Implement registration endpoint `/api/auth/register` in `backend/src/auth/auth.controller.ts` using `openapi-user-cms.yaml`
- [ ] T052 [US2] Implement email verification token creation and storage in `backend/src/tokens/email-verification.service.ts`
- [ ] T053 [US2] Implement `/api/auth/verify-email` endpoint in `backend/src/auth/auth.controller.ts`
- [ ] T054 [US2] Implement password reset token logic in `backend/src/tokens/password-reset.service.ts`
- [ ] T055 [US2] Implement `/api/auth/request-password-reset` and `/api/auth/reset-password` endpoints in `backend/src/auth/auth.controller.ts`
- [ ] T056 [US2] Implement throttling for verification and reset tokens in `backend/src/auth/rate-limit.service.ts`
- [ ] T057 [US2] Integrate email sending via templated emails in `backend/src/email/` for verification and reset

### Implementation for User Story 2 – Frontend

- [ ] T058 [P] [US2] Implement registration page and form in `frontend/src/app/auth/register/page.tsx` or `frontend/src/pages/auth/register.tsx`
- [ ] T059 [P] [US2] Implement login page and form in `frontend/src/app/auth/login/page.tsx` or `frontend/src/pages/auth/login.tsx`
- [ ] T060 [P] [US2] Implement password reset request and reset pages in `frontend/src/app/auth/reset-password/` or `frontend/src/pages/auth/reset-password/*.tsx`
- [ ] T061 [US2] Implement auth API client functions for auth endpoints in `frontend/src/features/auth/api/authApi.ts`
- [ ] T062 [US2] Implement user-facing success/error states and messaging for verification and reset flows in `frontend/src/features/auth/components/`

**Checkpoint**: Self-registration and recovery flows are fully functional and testable independently.

---

## Phase 6: User Story 3 – Users manage personal API keys (Priority: P3)

**Goal**: Allow users to create, view (metadata), revoke, and rotate personal API keys that carry their permissions.

**Independent Test**: As a logged-in user, create multiple API keys, exercise protected endpoints with them, revoke a key, and verify revoked keys fail while others succeed.

### Tests for User Story 3 (critical flows)

- [ ] T063 [P] [US3] Backend integration tests for API key lifecycle and permission enforcement in `backend/test/integration/api-keys/api-keys.e2e-spec.ts`
- [ ] T064 [P] [US3] Frontend integration tests for API key management UI in `frontend/test/integration/account-api-keys.spec.ts`

### Implementation for User Story 3 – Backend

- [ ] T065 [P] [US3] Implement `ApiKey` Prisma model per `data-model.md` in `backend/prisma/schema.prisma`
- [ ] T066 [US3] Implement API keys service (create, list, revoke, rotate) in `backend/src/api-keys/api-keys.service.ts`
- [ ] T067 [US3] Implement API keys controller endpoints for `/api/accounts/api-keys` and `/api/accounts/api-keys/{keyId}` in `backend/src/api-keys/api-keys.controller.ts`
- [ ] T068 [US3] Implement API key authentication strategy/guard in `backend/src/auth/api-key.strategy.ts`
- [ ] T069 [US3] Enforce max 10 active keys per user and limit checks in `backend/src/api-keys/api-keys.service.ts`
- [ ] T070 [US3] Ensure API key usage is logged with owning user in `backend/src/common/audit/`
- [ ] T071 [US3] Implement hooks so user deactivation/role change revokes or updates keys in `backend/src/users/users.service.ts`

### Implementation for User Story 3 – Frontend

- [ ] T072 [P] [US3] Implement account "API keys" page in `frontend/src/app/account/api-keys/page.tsx` or `frontend/src/pages/account/api-keys.tsx`
- [ ] T073 [P] [US3] Implement API keys list and create/revoke UI components in `frontend/src/features/api-keys/components/ApiKeysList.tsx`
- [ ] T074 [US3] Implement API keys API client functions in `frontend/src/features/api-keys/api/apiKeysApi.ts`
- [ ] T075 [US3] Implement one-time display of full API key value on creation in `frontend/src/features/api-keys/components/CreateApiKeyModal.tsx`
- [ ] T076 [US3] Integrate API key auth usage into frontend developer documentation snippet (optional) in `frontend/src/features/api-keys/components/ApiUsageExamples.tsx`

**Checkpoint**: Personal API key management is fully functional and testable independently.

---

## Phase 7: Background jobs, cleanup, and anonymization (Cross-story)

**Purpose**: Implement cleanup and long-term anonymization behaviors that support multiple user stories.

- [ ] T077 Implement NestJS scheduled jobs module using `@nestjs/schedule` in `backend/src/jobs/jobs.module.ts`
- [ ] T078 Implement daily job to delete stale pending users (>7 days) in `backend/src/jobs/cleanup-pending-users.job.ts`
- [ ] T079 Implement daily job to delete expired verification and reset tokens in `backend/src/jobs/cleanup-tokens.job.ts`
- [ ] T080 Implement scheduled anonymization job for inactive users (>=2 years) in `backend/src/jobs/anonymize-inactive-users.job.ts`
- [ ] T081 Ensure cleanup and anonymization jobs respect audit and content linkage rules in `backend/src/jobs/*.ts`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Finalize UX, accessibility, performance, security hardening, and documentation.

- [ ] T082 [P] Add and refine audit trail UI for admins to view security events in `frontend/src/app/cms/audit/page.tsx`
- [ ] T083 Improve accessibility (labels, keyboard navigation, ARIA attributes) across auth and CMS pages in `frontend/src/features/**`
- [ ] T084 [P] Optimize database indexes and queries for account and API key operations in `backend/prisma/schema.prisma` and related services
- [ ] T085 Security hardening review (rate limiting, brute-force protection, CSRF considerations) in `backend/src/auth/` and `backend/src/common/security/`
- [ ] T086 [P] Update developer documentation for User CMS APIs in `conception/features.md` and `specs/001-implement-user-cms/quickstart.md`
- [ ] T087 Run full test suite (backend, frontend, E2E) and address any failures in `backend/test/` and `frontend/test/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories.
- **User Stories (Phases 3–6)**: All depend on Foundational completion; can then proceed in parallel or in priority order: US1/US4 (P1) → US2 (P2) → US3 (P3).
- **Background Jobs (Phase 7)**: Depends on core auth, users, tokens, and API keys being in place (Phases 3–6); can be implemented after main flows are stable.
- **Polish (Phase 8)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Phases 1–2; provides admin user management and is part of MVP.
- **User Story 4 (P1)**: Depends on Phases 1–2; can be developed in parallel with US1 but must integrate with Users and Auth modules.
- **User Story 2 (P2)**: Depends on Phases 1–2; can be developed in parallel with or after US1/US4; primarily focused on auth flows.
- **User Story 3 (P3)**: Depends on Phases 1–2 and requires basic `User` and auth infrastructure; can start once Users and Auth modules are in place.

### Within Each User Story

- Tests are defined first and should be implemented to FAIL before feature implementation.
- Models (Prisma & entities) before services.
- Services before controllers/endpoints.
- Backend endpoints before frontend integration.
- UI wiring and UX polish after functional flows work.

### Parallel Opportunities

- Setup tasks marked [P] (T003–T006) can run in parallel.
- Foundational tasks marked [P] (T009–T011, T019–T020, T021–T022) can run in parallel within Phase 2.
- Once Phase 2 is complete, user story phases (3–6) can be worked on in parallel by different developers.
- Within each story, tasks marked [P] can be implemented concurrently when they touch different files or modules.

---

## Implementation Strategy

### MVP Scope

- **MVP**: Complete Phases 1–3 and 4 (Setup, Foundational, US1 Admin user management, and US4 Role-based access to CMS).
- This yields a functional CMS with secure admin user management and role-based access control, even before self-registration and API keys.

### Incremental Delivery

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Implement User Story 1 (Phase 3) and User Story 4 (Phase 4); deploy as MVP.
3. Add User Story 2 (Phase 5) for self-registration and recovery; deploy.
4. Add User Story 3 (Phase 6) for API keys; deploy.
5. Implement Phase 7 (cleanup/anonymization) and Phase 8 (polish) as ongoing improvements.

### Format Validation

All tasks above follow the required checklist format:

- Markdown checkbox (`- [ ]`).
- Sequential Task ID (T001–T087).
- `[P]` marker only for parallelizable tasks.
- `[US#]` label included for user story–specific tasks (phases 3–6) and omitted for Setup, Foundational, Background, and Polish phases.
- Descriptions include explicit file paths.

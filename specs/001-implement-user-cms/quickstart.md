# Quickstart: Implementing the User CMS

This guide outlines the high-level steps to implement the User CMS feature according to the current plan and research documents.

1. **Bootstrap the project structure**

   - Create a `backend/` NestJS app and a `frontend/` Next.js app following the structure in `plan.md`.
   - Set up TypeScript, ESLint, and Prettier in both projects.
   - Add Dockerfiles and basic Docker Swarm deployment configuration targeting a single 4-core/8GB VM.

2. **Add data models and Prisma schema**

   - Implement `User`, `ApiKey`, `EmailVerificationToken`, and `PasswordResetToken` in the Prisma schema according to `data-model.md`.
   - Generate migrations for required tables, indexes (e.g., email, token hashes), and foreign keys.
   - Wire Prisma into the NestJS `database/` module.

3. **Implement JWT-based auth and user flows**

   - Implement registration (`POST /api/auth/register`) issuing 24-hour email verification tokens.
   - Implement email verification (`POST /api/auth/verify-email`) consuming verification tokens.
   - Implement login/logout with a dual-token strategy:
     - 15-minute access tokens (JWT) returned in JSON.
     - 7-day refresh tokens stored in HTTP-only, Secure cookies, backed by a `UserSession` table.
   - Implement password reset request and completion (`/api/auth/request-password-reset`, `/api/auth/reset-password`) using 15-minute reset tokens.

4. **Implement role-based access control**

   - Enforce `admin`, `contributor`, and `user` roles in NestJS guards (e.g., `RolesGuard`).
   - Protect `/api/cms/*` and `/cms` routes so only contributors and admins can access CMS features.
   - Ensure role changes, deactivation, and anonymization immediately affect permissions and API key behavior.

5. **Admin user management UI (Next.js)**

   - Build CMS Users pages under `/cms` with list, filters, and pagination.
   - Implement create/edit user forms for admins, including role and status management.
   - Implement actions for deactivate, delete, and anonymize users according to `spec.md` and `data-model.md`.

6. **API keys management**

   - Implement backend endpoints to create, list, and revoke API keys for the current user (`/api/account/api-keys`).
   - Enforce a maximum of 10 active API keys per user.
   - Build account pages in Next.js for users to manage their API keys.

7. **Email templates and localization**

   - Implement an email templating system in NestJS (e.g., Handlebars) with language-specific templates under `backend/src/email/templates/`.
   - Use the `preferred_language` field on `User` to choose the template language, falling back to a default when necessary.
   - Integrate with an SMTP provider for sending verification and password reset emails.

8. **Background jobs and cleanup**

   - Use NestJS background jobs (e.g., `@nestjs/schedule`) to run daily cleanup tasks:
     - Delete stale pending users (not verified within 7 days).
     - Delete or mark expired email verification and password reset tokens.
   - Implement scheduled anonymization for users inactive for 2+ years.

9. **Styling and design system**

   - Set up SCSS with ITCSS layers (`settings/`, `tools/`, `generic/`, `elements/`, `objects/`, `components/`, `utilities/`) and define design tokens in `settings/_tokens.scss`.
   - Use BEM naming conventions for components and utilities to keep styles predictable and low-specificity.
   - Ensure the CMS and auth pages are responsive and accessible.

10. **Testing and QA**
    - Write Jest unit tests for NestJS modules (`auth`, `users`, `api-keys`, `tokens`) and for key frontend utilities/components.
    - Add integration tests for registration, login, password reset, `/cms` access, and API key flows.
    - Add Playwright E2E tests covering primary user journeys from `spec.md` (registration + verification, password reset, role-based `/cms` access, admin user and API key management).
    - Perform UX and accessibility checks for all auth and CMS pages, ensuring keyboard navigation and clear error messages.

Refer to `plan.md`, `research.md`, `data-model.md`, and the feature spec for detailed requirements and architectural decisions.

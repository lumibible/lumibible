# Feature Specification: User CMS & Access Control

**Feature Branch**: `001-implement-user-cms`  
**Created**: 2025-11-15  
**Status**: Draft  
**Input**: User description: "Implement the user CMS feature: admin user management, registration with email validation and password reset, inactive user cleanup, API keys with same permissions as owner, and roles admin/contributor/user with CMS access for contributors at /cms"

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Admin manages user accounts (Priority: P1)

An authenticated admin can list, create, edit, deactivate, and delete user accounts through the CMS, assign roles (admin, contributor, user), and see key account status information (active/inactive, email verified, last activity) so they can control who has access to LumiBible content and tools.

**Why this priority**: Without admin control over user accounts and roles, the CMS cannot be operated safely; this is foundational for all other personalization, contribution, and access-controlled features.

**Independent Test**: Can be fully tested by logging in as an admin, performing user CRUD (create, view, edit, deactivate/delete) on a small set of test accounts, and verifying that changes apply immediately to authentication and CMS access.

**Acceptance Scenarios**:

1. **Given** an authenticated admin in the CMS, **When** they open the Users section, **Then** they see a paginated list of users with search and basic filters (by email, role, status).
2. **Given** an authenticated admin, **When** they create a new user with a specified email and role, **Then** the system saves the user, sends the appropriate onboarding or activation communication, and the user appears in the list with the chosen role and an appropriate initial status.
3. **Given** an existing user, **When** an admin changes that user's role (for example from contributor to admin or to basic user), **Then** the user's permissions and access are updated on subsequent actions according to the new role.
4. **Given** an existing user who should no longer access the system, **When** an admin deactivates or deletes that user, **Then** the user can no longer log in or use API keys, and their content history is preserved according to retention rules.

---

### User Story 2 - User self-registration and account recovery (Priority: P2)

A visitor to LumiBible can create an account with an email address, complete email verification, and later reset their password if they forget it, so they can safely use personalization features (bookmarks, notes, reading plans) and CMS access if they are contributors.

**Why this priority**: Self-service registration and recovery are critical to scale user onboarding and reduce admin workload, while email verification ensures that accounts are owned by real, reachable users.

**Independent Test**: Can be fully tested end-to-end by using a test email, registering a new account, following the verification link, logging in, triggering a password reset, and confirming that previously stored data remains accessible after password change.

**Acceptance Scenarios**:

1. **Given** an anonymous visitor on the site, **When** they submit the registration form with a valid email and password that meets password policy, **Then** the system creates a pending account, sends a verification email, and informs the user that they must verify their email before full access.
2. **Given** a pending user who has received a verification email, **When** they follow the verification link within its validity period, **Then** their account becomes active, they can log in, and the system confirms the verification.
3. **Given** a user who has forgotten their password, **When** they request a password reset with their email, **Then** the system sends a time-limited reset link, and following that link allows them to set a new password without revealing the old one.
4. **Given** a user with an inactive or deleted account, **When** they attempt to log in or request a password reset, **Then** the system does not restore access automatically and guides them appropriately (for example by indicating that their account isn't active or exists).

---

### User Story 3 - Users manage personal API keys (Priority: P3)

An authenticated user can create, view (partial), revoke, and rotate personal API keys that carry the same permissions as their account, so they can programmatically manage content and personalization while keeping access auditable and revocable.

**Why this priority**: API keys enable integrations and programmatic content management, which are important for the CMS and for external tools, but they must be controlled and revocable to avoid security risks.

**Independent Test**: Can be tested by logging in as a user, creating several keys, using them to access protected endpoints, revoking one or more keys, and verifying that revoked keys no longer work while others continue to function.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they open their "API keys" section, **Then** they see a list of existing keys (with name, creation date, last used, and status) and controls to add or revoke keys.
2. **Given** an authenticated user with permission to use APIs, **When** they create a new API key and optionally label it, **Then** the system generates a secret token, shows it once, associates it with their current permissions, and logs its creation event.
3. **Given** an API key previously created by the user, **When** the user revokes that key from the UI, **Then** any subsequent calls using that key are rejected, and the key is shown as revoked.
4. **Given** an admin, **When** they review a user account, **Then** they can see the number of active API keys and revoke them if necessary (for example when deactivating the user).

---

### User Story 4 - Role-based access to CMS and content (Priority: P1)

Admins, contributors, and basic users must experience different capabilities in LumiBible according to their roles: admins can manage all users and content, contributors can access the CMS at `/cms` and manage content they are allowed to edit, and basic users can only use reading and personalization features.

**Why this priority**: Role-based access is essential to protect the integrity of biblical and edification content, ensure only trusted contributors can publish, and keep the CMS protected from general users.

**Independent Test**: Can be tested by creating three accounts with different roles, logging in as each, and validating that accessible pages and actions match the defined permissions, especially for `/cms` routes, user management, and content editing.

**Acceptance Scenarios**:

1. **Given** a basic user, **When** they attempt to access any `/cms` route, **Then** they are denied access or redirected to a suitable page explaining that they lack permissions.
2. **Given** a contributor, **When** they log in and navigate to `/cms`, **Then** they can access the CMS interface for content creation and editing but cannot manage users or system-level settings.
3. **Given** an admin, **When** they use `/cms`, **Then** they can access all CMS features, including user management and configuration.
4. **Given** a user whose role was changed by an admin, **When** they next access `/cms` or other restricted features, **Then** their access reflects the new role without requiring re-registration.

### Edge Cases

- Pending registrations that never complete (for example future reuse of the same email, cleanup of stale pending accounts) MUST be automatically deleted after 7 days, allowing the same email address to be used for a fresh registration.
- The system MUST handle expired, reused, or tampered email verification and password reset links so that accounts remain secure, including invalidating prior tokens when a new token is issued.
- When an admin deletes or deactivates a user who owns content, comments, or collaborative data, the content MUST be retained but the author MUST be anonymized and disconnected from personal identifiers while preserving content integrity.
- When a user with API keys is deactivated, all associated API keys MUST be revoked immediately; when the user's role changes, existing keys MUST remain valid but their effective permissions MUST reflect the new role from the next use onward.
- When a user is anonymized or deleted, all associated API keys and email verification/password reset tokens MUST be deleted.
- What happens when a user reaches the maximum number of allowed API keys or attempts to create an API key without having required permissions?

## Clarifications

### Session 2025-11-15

- Q: What happens when a user starts registration but never clicks the verification link (for example future reuse of the same email, cleanup of stale pending accounts)? → A: Delete pending after 7 days; allow re-registration; resend and invalidate previous tokens; user can request new email verification token; throttle new tokens to at most one per minute.

- Q: What happens when an admin tries to delete or deactivate a user who owns content, comments, or collaborative data (for example reassignment or anonymization)? → A: Keep content but anonymize the author and disconnect it from personal identifiers while preserving usefulness.

- Q: How does the system behave when a user with API keys is deactivated or their role changes (for example revoking or updating key permissions)? → A: On deactivation, revoke all API keys; on role change, keep keys but enforce new role permissions; on anonymization/delete, delete all API keys and tokens; add recurrent cleanup of expired email verification and password reset tokens.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

#### User account lifecycle

- **FR-001**: System MUST allow visitors to create user accounts using a unique email address and a password that meets defined security rules.
- **FR-002**: System MUST validate that the email address is syntactically valid and not already associated with an active or pending account.
- **FR-003**: System MUST send a verification message to the provided email address with a time-limited link (valid for 24 hours) that, when used, confirms the account and moves it from a pending to an active state.
- **FR-004**: System MUST prevent unverified or inactive accounts from logging in and from accessing any connected or personalized features until email verification is complete.
- **FR-005**: System MUST allow users to initiate a password reset process by providing their registered email address without revealing whether the email exists beyond generic messaging.
- **FR-006**: System MUST generate time-limited (valid for 15 minutes), single-use reset tokens and allow users to set a new password using those tokens without exposing any existing credentials.
- **FR-007**: System MUST provide a mechanism to mark user accounts as inactive or deleted, ensuring they can no longer log in or use API keys, while following data retention and content ownership rules.
- **FR-008**: System MUST automatically identify and clean up inactive or unverified accounts according to defined inactivity or age thresholds, with clear criteria and behavior (for example deleting pending accounts that never verified after a period).
- **FR-009**: System MUST anonymize accounts that have been inactive for at least two years (based on last successful login) by replacing the stored email address with a non-reversible placeholder such as `uuid-deleted@lumibible.com` while preserving links to content and audit history.

#### Authentication and authorization

- **FR-010**: System MUST authenticate users with a secure, standard mechanism based on email and password and maintain a secure authenticated session, including protection against brute-force attacks (for example by limiting repeated failed login attempts and requiring progressive delays or additional checks).
- **FR-011**: System MUST support three and only three primary roles: `admin`, `contributor`, and `user`.
- **FR-012**: System MUST enforce that only admins can access user management features (list, create, edit, deactivate, delete users, and update roles).
- **FR-013**: System MUST enforce that only authenticated contributors and admins can access the CMS at `/cms` and perform content creation and editing.
- **FR-014**: System MUST ensure that basic users cannot access `/cms` or other management interfaces but can still use personalization features such as bookmarks, notes, and reading progress.
- **FR-015**: System MUST prevent privilege escalation by ensuring users cannot modify their own role or grant themselves additional permissions through UI or APIs.

#### Admin user management

- **FR-016**: System MUST provide a CMS section where admins can view a list of users with key attributes such as email, role, status (active/inactive/pending/anonymized), email verification state, creation date, and last activity.
- **FR-017**: System MUST allow admins to create user accounts directly, specifying email, role, and initial status, and optionally triggering a welcome or activation communication.
- **FR-018**: System MUST allow admins to edit user details (for example role, status, and preferred language) while logging who made the change and when, while ensuring that no additional personally identifiable information is stored beyond email and password.
- **FR-019**: System MUST allow admins to deactivate or delete users in a controlled way that preserves historical content and audit trails according to LumiBible policies and GDPR-oriented anonymization rules.
- **FR-020**: System MUST prevent admins from accidentally locking themselves out of all admin access (for example by disallowing removal of the last admin or requiring confirmation for critical changes).

#### API keys for programmatic access

- **FR-021**: System MUST allow authenticated users to create one or more personal API keys from their account area, with each key inheriting the same permissions as the user at the time the request is made.
- **FR-022**: System MUST display API keys to users only at creation time (full value) and subsequently show only metadata such as name, creation date, and last used; the full key value MUST never be retrievable again after creation.
- **FR-023**: System MUST allow users to revoke any of their API keys at any time, after which those keys can no longer be used for authentication.
- **FR-024**: System MUST ensure that API access via keys respects the same authorization model as interactive sessions, including role-based access to CMS endpoints.
- **FR-025**: System MUST associate API key usage with the owning user in logs for auditability (for example user identifier, key identifier, and timestamp).
- **FR-026**: System MUST enforce a maximum of 10 active API keys per user and provide clear feedback when the limit is reached.
- **FR-027**: System MUST ensure that when a user is deactivated, deleted, anonymized, or downgraded to a role with fewer permissions, all associated API keys are either revoked or updated so that no access beyond the current role remains.

#### Security, privacy, and audit

- **FR-028**: System MUST protect authentication secrets (passwords, API keys, tokens) so they are never exposed in clear text through the UI or logs after initial display when strictly necessary.
- **FR-029**: System MUST record important security-related events (for example login attempts, password changes, role changes, API key creation and revocation, and account deactivation) in an audit trail accessible to admins.
- **FR-030**: System MUST provide user-facing controls for reviewing and updating key account settings such as email, password, and preferred language, subject to necessary verification steps.
- **FR-031**: System MUST respect LumiBible's planned multilingual capabilities by storing the user's preferred language and using it when presenting communications such as emails where possible.
- **FR-032**: System MUST avoid storing any personally identifiable information for users beyond what is strictly necessary for authentication and communication (email address, password secret, and derived identifiers) and MUST apply anonymization rules after the defined inactivity period.

_Clarifications and assumptions_:

- **FR-033**: System MUST authenticate users exclusively via email and password for this feature, with no additional authentication methods such as SSO planned in this scope.
- **FR-034**: System MUST retain user data and account history long enough to support audit and legal requirements, with the explicit behavior that deleted or long-term inactive accounts are anonymized (rather than fully purged) unless stricter legal requirements demand otherwise.
- **FR-035**: System MUST automatically delete pending user accounts that have not completed email verification within 7 days, after which the same email address MAY be used to register a new account.
- **FR-036**: System MUST allow users to request a new email verification token and, when doing so, MUST invalidate any previous verification tokens for that account.
- **FR-037**: System MUST invalidate any previous password reset token for a user when a new password reset is requested and issued.
- **FR-038**: System MUST enforce throttling on the issuance of email verification and password reset tokens so that no more than one new token per channel (verification or reset) is sent per user per minute.
- **FR-039**: System MUST ensure that when a user is deactivated, all associated API keys are revoked immediately; when a user's role changes, existing API keys remain valid but their effective permissions reflect the new role from the next use onward; and when a user is anonymized or deleted, all associated API keys and authentication tokens are deleted.
- **FR-040**: System MUST perform recurrent cleanup (once a day) of expired email verification and password reset tokens to remove them from persistent storage.

### Key Entities _(include if feature involves data)_

- **User**: Represents a human person using LumiBible. Key attributes include unique identifier, email, password secret, role (admin/contributor/user), status (pending/active/inactive/anonymized/deleted), email verification state, preferred language, creation date, last activity date, and references to owned content and personalization data. Beyond email and password, no other personally identifiable information is stored for this feature.
- **API Key**: Represents a token used for programmatic access on behalf of a user. Attributes include unique identifier, secret value (stored securely), associated user, label/name, creation date, last used timestamp, status (active/revoked), and effective permissions derived from the owning user's role at the time of use.
- **Email Verification Token**: Represents a one-time, time-limited token used solely for email verification. Attributes include associated user, creation time, expiration time (24 hours after creation), consumption state, and minimal metadata needed to validate verification requests.
- **Password Reset Token**: Represents a one-time, time-limited token used solely for password reset. Attributes include associated user, creation time, expiration time (15 minutes after creation), consumption state, and minimal metadata needed to validate reset requests.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable, and MUST cover both
  functional behavior and non-functional aspects such as accessibility,
  UX consistency, performance, and platform support where relevant.
-->

### Measurable Outcomes

- **SC-001**: A new visitor with a valid email can complete registration and email verification and log in successfully within 5 minutes under normal conditions.
- **SC-002**: At least 95% of password reset requests result in a successful password change within 10 minutes when using a valid email address.
- **SC-003**: 100% of access to `/cms` and other management features is restricted to authenticated contributors and admins; basic users and anonymous visitors never see editable CMS interfaces.
- **SC-004**: 100% of attempts to use revoked or expired API keys are rejected, and such events are recorded in the audit trail.
- **SC-005**: Admins can locate and update a specific user account (including role and status) in under 2 minutes using the CMS interface in usability tests.
- **SC-006**: No more than 1% of active accounts are left in an unverified or orphaned state longer than the defined inactivity window (including the two-year anonymization rule) after rollout of the automated cleanup.

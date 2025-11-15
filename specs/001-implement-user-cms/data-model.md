# Data Model: User CMS (accounts, roles, API keys)

This document describes the core entities, fields, relationships, and validation rules for the User CMS feature.

## User

Represents a human person using LumiBible.

### Fields

- `id` (UUID or bigint, PK)
- `email` (string, unique, normalized to lowercase)
- `password_hash` (string, hashed using a strong algorithm, e.g., bcrypt/argon2)
- `role` (enum: `admin`, `contributor`, `user`)
- `status` (enum: `email_not_verified`, `active`, `inactive`, `anonymized`)
- `preferred_language` (string/enum, e.g., `fr`, `en`, etc.)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `last_login_at` (timestamp, nullable)

### Relationships

- One-to-many with `ApiKey` (a user can own multiple API keys).
- One-to-many with `EmailVerificationToken`.
- One-to-many with `PasswordResetToken`.
- Links to content/personalization entities (bookmarks, notes, etc.) are handled by other features but MUST remain intact when accounts are anonymized.

### Validation and Rules

- `email` MUST be syntactically valid and unique among non-deleted users.
- `password_hash` MUST be produced by an approved hashing algorithm with proper parameters.
- `role` MUST be one of the three allowed values; users (unless admin) cannot change their own role.
- `status` transitions MUST follow lifecycle rules (see below).

### State Transitions

- `email_not_verified` → `active` upon successful email verification.
- `email_not_verified` → deletion after 7 days without verification.
- `active` → `inactive` when an admin deactivates the user.
- `active` or `inactive` → `anonymized` after 2 years of inactivity (per policy).

## ApiKey

Represents a token used for programmatic access on behalf of a user.

### Fields

- `id` (UUID or bigint, PK)
- `user_id` (FK → `User.id`)
- `name` (string, optional label)
- `secret_hash` (string, hashed/derived token value)
- `created_at` (timestamp)
- `last_used_at` (timestamp, nullable)
- `is_enabled` (boolean)

### Validation and Rules

- A user MAY have up to 10 active API keys.
- Full secret value is shown only once at creation and never stored in retrievable form.
- When a user is deactivated, anonymized, or deleted, associated API keys MUST be deleted according to FR-027/FR-039.
- API requests authenticated by a key MUST derive effective permissions from the owning user's current role at time of use.

## EmailVerificationToken

One-time, time-limited token used to verify user email addresses.

### Fields

- `id` (UUID or bigint, PK)
- `user_id` (FK → `User.id`)
- `token_hash` (string, hashed token)
- `created_at` (timestamp)
- `expires_at` (timestamp)

### Validation and Rules

- Used tokens MUST be deleted once consumed.
- Tokens MUST expire 24 hours after creation.
- Only one active token per user SHOULD be kept; issuing a new token invalidates previous ones.
- Expired tokens MUST be cleaned up by a daily job.

## PasswordResetToken

One-time, time-limited token used for password resets.

### Fields

- `id` (UUID or bigint, PK)
- `user_id` (FK → `User.id`)
- `token_hash` (string, hashed token)
- `created_at` (timestamp)
- `expires_at` (timestamp)

### Validation and Rules

- Used tokens MUST be deleted once consumed.
- Tokens MUST expire 15 minutes after creation.
- Issuing a new token invalidates any previous reset token for that user.
- Tokens MUST be deleted once consumed or expired and after cleanup.

## Lifecycle Rules Summary

- Pending users older than 7 days without verification MUST be deleted, freeing their email for reuse.
- Users with no successful login for at least 2 years MUST be anonymized.
- When a user is deactivated, all API keys MUST be disabled immediately.
- When a user is anonymized or deleted, all API keys and auth tokens MUST be removed.

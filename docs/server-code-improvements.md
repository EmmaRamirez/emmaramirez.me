# Server Code Improvements

This document collects the server-side and schema concerns identified during review and links each one to a focused design note. The goal is to turn the current observations into concrete follow-up work instead of leaving them as one-off comments.

## Scope

These notes cover:

- public write access to debug settings
- weakly typed content schema fields
- oversized JSON storage in debug settings
- analytics retention and query strategy
- duplicate persistence paths in map places
- API error response hardening

## Documents

### 1. Debug settings access control

See `docs/server-debug-settings-hardening.md`.

This note covers:

- why `debug-settings` should not be a public write surface
- short-term production safeguards
- longer-term auth and ownership options

### 2. Content entry schema cleanup

See `docs/server-content-entry-schema.md`.

This note covers:

- replacing `publishedAt String?` with a real datetime field
- replacing `tags Json?` with a typed string array
- migration and rollout considerations

### 3. Debug settings schema normalization

See `docs/server-debug-settings-schema.md`.

This note covers:

- reducing schema ambiguity caused by large JSON blobs
- separating `hero3dParams` and `discoParams`
- keeping future migrations easier to reason about

### 4. Analytics persistence and retention

See `docs/server-analytics-persistence.md`.

This note covers:

- event growth and retention planning
- database-side aggregation
- indexing and partitioning considerations

### 5. Map places persistence cleanup

See `docs/server-map-places-persistence.md`.

This note covers:

- removing raw SQL fallback paths
- aligning runtime behavior with Prisma schema defaults
- clarifying moderation and dedupe rules

### 6. API error response hardening

See `docs/server-api-error-handling.md`.

This note covers:

- avoiding leakage of internal error details
- standardizing public error payloads
- distinguishing development and production behavior

## Recommended Order

The rough implementation order should be:

1. `debug-settings` access control
2. API error response hardening
3. map places persistence cleanup
4. content entry schema cleanup
5. debug settings schema normalization
6. analytics retention and aggregation

This order front-loads risk reduction and production safety before schema churn and longer-horizon data work.

## Cross-Cutting Principles

Each follow-up should preserve these rules:

- Keep route handlers thin and move reusable logic into `src/lib/server/`.
- Prefer typed Prisma models over loosely structured JSON where the shape is known.
- Keep public API payloads stable even when internal storage changes.
- Add focused tests around migrations, validation, and serialization seams.
- Avoid coupling dev-only surfaces to production behavior.

## Definition Of Done

This work is complete when:

- debug-only settings are no longer publicly mutable in production
- content and debug settings persistence use clearer schema shapes
- analytics storage has an explicit retention story
- map places uses one supported persistence path
- API routes no longer expose internal exception details by default

# Map Places Persistence Cleanup

This document proposes simplifying the `map-places` persistence path so the route uses one supported database access model.

## Problem

The current route supports two execution paths:

- Prisma delegate access
- raw SQL fallback queries

That makes the code harder to reason about and introduces behavioral drift, including different ID generation behavior.

## Goals

- use one persistence path for reads and writes
- align runtime behavior with the Prisma schema
- make moderation and dedupe rules explicit
- reduce branching and raw SQL maintenance in the route

## Current State

The `MapPlace` schema defines:

- Prisma-managed model access
- `id @default(cuid())`
- simple indexes for listing by status and region

But the route also includes raw SQL fallback branches for:

- listing places
- inserting places
- deleting places

That causes two notable issues:

- the route carries extra complexity for what should be standard model access
- fallback insertion uses `randomUUID()` instead of the schema default

## Recommended Direction

### Remove the fallback path

Treat the Prisma delegate as the only supported runtime path.

If the generated client or delegate availability is ever in doubt, that should be fixed at the Prisma generation or initialization layer rather than papered over in route code.

### Keep route logic focused

The route should only do:

- request parsing
- validation
- call into persistence/service helpers
- serialize the response

Any reusable DB logic should move into `src/lib/server/`.

## Data Model Follow-Up

The current model is enough for a simple visible/hidden list, but future behavior likely needs one or more of these clarifications:

- should duplicate names in the same region be allowed
- should submissions start as `hidden` and require moderation
- should a submission record preserve user-supplied coordinates separately from derived region centroid data

Those are product decisions, but the schema should eventually reflect whichever behavior is intended.

## Recommended First Step

1. Remove raw SQL fallback code.
2. Rely on the Prisma delegate only.
3. Keep ID generation fully schema-driven.

This is mostly a simplification and correctness cleanup, not a behavior redesign.

## Optional Schema Improvements

Depending on desired behavior, consider:

- `@@index([regionId, status, createdAt])` if region-based moderation views become common
- a uniqueness rule if exact duplicate submissions should be prevented
- separate fields for submitted coordinates versus canonical region coordinates

Do not add these until the intended product behavior is clear.

## Risks

### Risk: fallback existed to work around generation drift

Mitigation:

- verify Prisma generation and imports
- fix the root cause in the DB client setup rather than preserving two route paths

### Risk: dedupe behavior remains ambiguous

Mitigation:

- document whether duplicate places are valid
- add explicit constraints only once the rule is decided

## Success Criteria

This work is complete when:

- `map-places` uses one persistence path
- the route no longer has raw SQL branches for ordinary CRUD
- schema defaults and runtime behavior agree on ID generation and persistence semantics
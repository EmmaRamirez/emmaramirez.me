# Content Entry Schema Cleanup

This document proposes tightening the `ContentEntry` model so the schema reflects the data shape the app already expects.

## Problem

The current schema uses flexible storage for fields that have a well-known meaning:

- `publishedAt String?`
- `tags Json?`

That weak typing pushes validation, parsing, and sorting concerns into application code.

## Goals

- make content dates and tags first-class typed fields
- reduce app-side normalization work
- improve queryability and index options
- keep the public content API stable during migration

## Current State

`ContentEntry` currently stores article metadata in a generic shape:

- `publishedAt` is treated as text
- `tags` is treated as arbitrary JSON

That leads to a few avoidable costs:

- date sorting depends on string parsing in app code
- bad or inconsistent date formats can slip into storage
- tags need runtime array checks and string filtering
- future tag-based queries are harder to express cleanly

## Recommended Schema

The preferred shape is:

```prisma
model ContentEntry {
  id           String           @id @default(cuid())
  entityType   ContentEntryType
  entityId     String
  title        String?
  description  String?
  excerpt      String?
  bodyMarkdown String?
  tags         String[]         @default([])
  publishedAt  DateTime?
  createdAt    DateTime         @default(now())
  updatedAt    DateTime         @updatedAt

  @@unique([entityType, entityId])
  @@index([entityType, updatedAt])
  @@index([entityType, publishedAt])
}
```

## Benefits

### Better validation boundaries

The database can reject clearly invalid shapes earlier, and the route layer can validate against concrete expectations instead of generic text and JSON containers.

### Cleaner server code

Code in `src/lib/server/content.ts` can stop reparsing dates and re-checking whether tags is actually an array of strings.

### Better future queries

Once dates and tags are typed:

- ordering by publish date becomes straightforward
- filtering recent articles becomes easier
- tag-based browsing can use a clearer storage contract

## Migration Plan

### Phase 1: add typed columns

Add new columns without removing the old ones:

- `publishedAtAt` or final `publishedAt` as `DateTime?`
- `tagsArray` or final `tags` as `String[]`

Use temporary names if needed to make migration safer.

### Phase 2: backfill data

Backfill from existing rows:

- parse string dates into timestamps
- extract string arrays from JSON tags
- log or quarantine rows that fail conversion

### Phase 3: dual-read and dual-write briefly

Update application code so reads prefer the new fields while fallback support exists for old data during rollout.

### Phase 4: remove old columns

Once the new fields are fully populated and code no longer depends on the old ones:

- drop the legacy string/JSON columns
- simplify the server normalization helpers

## Validation Rules

Route validation should also become stricter:

- article `publishedAt` should be parsed as a valid date before write
- tags should be normalized to a deduped array of non-empty strings
- project entries should not carry article-only metadata unless intentionally supported

## Risks

### Risk: existing seeded content contains bad date strings

Mitigation:

- validate the current rows before migration
- fix or skip invalid values during backfill
- keep a migration log for manual cleanup

### Risk: public API shape churn

Mitigation:

- continue serializing `publishedAt` to a string for clients if that is the current contract
- keep the change internal to persistence first

## Success Criteria

This work is complete when:

- content dates are stored as timestamps
- tags are stored as typed string arrays
- content server code no longer reparses loosely typed storage on every read


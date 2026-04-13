# Debug Settings Schema Normalization

This document focuses on the `DebugSettings` data model and the trade-offs of storing large, structured settings blobs in JSON.

## Problem

`DebugSettings` currently stores complex structured settings in a single `hero3dParams` JSON field, and `discoParams` is nested inside that JSON under a magic key.

That makes the schema easy to change quickly, but harder to validate, migrate, and reason about over time.

## Goals

- make stored settings easier to understand and evolve
- reduce hidden coupling between unrelated setting groups
- keep server serialization simpler
- create a path for versioned settings in the future

## Current State

The current model stores:

- global scalar fields such as `headerBlendMode`
- one JSON blob for hero settings
- nested disco settings inside the hero JSON payload

This creates a few issues:

- one column mixes unrelated concerns
- changes to one setting group require field-by-field reconstruction of a large JSON object
- schema migrations cannot describe or constrain the stored structure well
- runtime code has to know about hidden nested keys

## Recommended Direction

### Option A: split by setting domain

Keep JSON where it is useful, but separate domains:

```prisma
model DebugSettings {
  id                  String   @id @default(cuid())
  key                 String   @unique
  headerBlendMode     String
  showSectionsEnabled Boolean
  hero3dParams        Json
  discoParams         Json
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

This is the best near-term option if the parameter surfaces remain large and fluid.

### Option B: promote stable fields to typed columns

If parts of the config are now stable, move those parts into explicit columns and leave only genuinely variable data in JSON.

This works well if:

- only a subset of values change frequently
- the settings need indexing or stricter validation
- the app has outgrown "everything is a blob"

### Option C: use versioned named presets

If these settings become more like saved configurations than one mutable singleton row, model them as presets:

- preset name
- setting domain payloads
- version number
- owner or environment metadata

This is likely overkill for now, but useful if the debug/editor surface becomes a real internal tool.

## Recommended First Step

Adopt Option A.

Splitting `hero3dParams` and `discoParams` into separate columns gives most of the clarity benefit without forcing a full redesign of every parameter field.

## Implementation Plan

1. Add a dedicated `discoParams` JSON column.
2. Update route serialization so `discoParams` no longer lives inside `hero3dParams`.
3. Backfill existing rows by extracting the nested payload into the new column.
4. Remove the legacy magic-key read path once old data is migrated.

## Validation

Even with JSON columns, validation should improve:

- validate each domain separately
- keep normalization helpers domain-specific
- reject malformed payloads instead of silently coercing everything

For example:

- `hero3dParams` validation should only deal with hero settings
- `discoParams` validation should only deal with disco settings

## Risks

### Risk: schema change without enough practical payoff

Mitigation:

- keep the first change small
- split storage first, then decide later whether more fields deserve typed columns

### Risk: old readers still expect nested disco settings

Mitigation:

- use a short dual-read window during rollout
- remove the fallback only after migration and verification

## Success Criteria

This work is complete when:

- hero and disco settings are stored as separate concerns
- route code no longer depends on hidden nested keys inside a shared JSON blob
- future settings changes can be made without reconstructing unrelated payloads


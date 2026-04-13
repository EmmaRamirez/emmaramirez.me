# Debug Settings Hardening

This document proposes a safer architecture for `src/routes/api/debug-settings/+server.ts` and the debug surfaces that consume it.

## Problem

The current `debug-settings` route persists global settings but does not appear to enforce a production-only deny rule or any authentication boundary. That makes a site-wide settings row writable through a public endpoint.

Current risks:

- anyone who finds the endpoint can mutate persisted settings
- the public homepage can carry debug behavior into production
- future debug settings will inherit the same weak boundary

## Goals

- prevent unauthenticated writes in production
- make debug behavior explicitly dev-only or admin-only
- reduce the chance that future settings accidentally become public

## Current State

The route currently behaves like a general-purpose settings API:

- `GET` returns the stored settings row
- `PUT` upserts the stored settings row
- the row is keyed globally with `key = 'default'`
- the public site can fetch and write it through the debug menu

This creates two separate concerns that are currently blended together:

- whether the UI should expose debug controls
- whether the server should persist or serve debug settings

## Recommended Direction

### Option A: Dev-only persistence

If the route is only intended for local iteration, the cleanest fix is:

- return `403` or `404` outside `dev`
- hide or disable the client fetch/write path outside `dev`
- keep the table only as a development convenience

This is the smallest and safest change.

### Option B: Authenticated admin settings

If these settings should remain usable outside development:

- require authentication
- require an explicit admin capability or allowlist
- add audit-friendly logging for writes

In this model, `debug-settings` becomes an internal admin feature instead of a hidden public route.

## Recommended First Step

Adopt Option A now.

The repo already treats several other write surfaces as development-only, so this fits the current architecture better than introducing a partial auth layer around one route.

## Implementation Plan

1. Add a `dev` guard to `GET` and `PUT`.
2. Stop mounting or activating the debug menu in production.
3. Make any production fallback explicit in the client so silent write failures are easy to notice.
4. Add a small route test that verifies production requests are rejected.

## Schema Implications

The current model stores one global row:

- one row
- one key
- one shared configuration payload

That is acceptable for local-only debug settings. If the route ever becomes authenticated production functionality, the schema should probably change to reflect ownership, for example:

- per-user settings
- per-environment settings
- named presets with explicit metadata

## Risks

### Risk: losing a useful production tuning surface

Mitigation:

- distinguish between real site configuration and debug tuning
- move genuine production config to a separate, authenticated admin model

### Risk: debug UI continues to write in production silently

Mitigation:

- gate both server and client behavior
- surface an obvious error state in the debug UI during development if the route is unavailable

## Success Criteria

This work is complete when:

- production traffic cannot mutate debug settings
- the debug menu no longer implies a hidden production capability
- future debug settings are clearly scoped as dev-only or admin-only


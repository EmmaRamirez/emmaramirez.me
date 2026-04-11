---
name: repo-api-route-patterns
description: Implements SvelteKit API routes in this repo using the existing server, env, and response conventions. Use when editing `src/routes/api/**/+server.ts`, adding new endpoints, or connecting server routes to Prisma or GitHub-backed data.
---

# Repo API Route Patterns

## Use this skill when

- Adding a new `src/routes/api/**/+server.ts` file
- Refactoring an existing route handler
- Connecting a route to Prisma, private env vars, or GitHub data

## Existing patterns to follow

- Keep handlers small and use `json(...)` responses.
- Parse and normalize request data with small helpers near the route unless the logic is reused broadly.
- Log failures with a route-specific prefix.
- Use `cache-control: no-store` when the response depends on live private data.

## Server boundaries

- Prisma access belongs behind `src/lib/server/prisma.ts`.
- Private env access belongs in server modules such as `src/lib/server/github.ts`.
- Keep client-safe shapes in `src/lib/types/` when the route returns structured data to the browser.

## Current examples

- Prisma-backed settings: `src/routes/api/debug-settings/+server.ts`
- Prisma-backed map data: `src/routes/api/map-places/+server.ts`
- Private GitHub GraphQL fetch: `src/routes/api/github/top-languages/+server.ts`

## Rules

1. Add `export const prerender = false` when a route depends on live database or request-time server data.
2. Keep secrets out of shared modules and browser code.
3. Return explicit status codes for validation failures and server failures.
4. Prefer typed serialization over returning raw database records directly.
5. If route logic starts to repeat, move the reusable part into `src/lib/server/`.

---
name: repo-prisma-migration-workflow
description: Handles Prisma schema, generate, and migration work for this repo's non-default layout. Use when changing database models, adding migrations, updating generated Prisma types, or wiring new server-side persistence.
---

# Repo Prisma Migration Workflow

## Use this skill when

- Editing `server/schema.prisma`
- Adding a migration under `server/migrations/`
- Updating code that imports Prisma types or the generated client

## Repo-specific layout

- Prisma config: `prisma.config.ts`
- Schema path: `server/schema.prisma`
- Migrations path: `server/migrations`
- Generated client import: `$generated/prisma/client`
- Prisma singleton: `src/lib/server/prisma.ts`

## Rules

1. Treat `server/schema.prisma` as the source of truth.
2. Import Prisma types and the client from `$generated/prisma/client`, not `@prisma/client`.
3. Access the database through `src/lib/server/prisma.ts`.
4. Keep migrations small and focused.
5. Do not hand-edit migration SQL unless the change cannot be expressed cleanly in schema DSL.

## Standard workflow

1. Update `server/schema.prisma`.
2. Run `npm run db:generate`.
3. Run `npm run db:migrate` when a migration is required.
4. Update server code, route serialization, and tests to match the new model shape.

## Common follow-through

- API routes usually live in `src/routes/api/**/+server.ts`.
- If a model is exposed to the client, add or update a typed client-safe shape in `src/lib/types/`.
- If env access is required, keep it server-only.

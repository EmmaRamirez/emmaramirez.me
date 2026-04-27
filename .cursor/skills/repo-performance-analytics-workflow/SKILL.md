---
name: repo-performance-analytics-workflow
description: Maintains the dev performance analytics pipeline across browser instrumentation, persisted analytics API, Prisma storage, and editor analytics UI. Use when editing `performanceAnalytics`, `/api/performance-analytics`, analytics Prisma models, or editor analytics sections.
---

# Repo Performance Analytics Workflow

## Use this skill when

- Editing `src/lib/stores/performanceAnalytics.svelte.ts`
- Changing `src/lib/server/performanceAnalyticsIngest.ts`
- Updating `src/routes/api/performance-analytics/+server.ts`
- Changing analytics Prisma models or migrations
- Editing editor analytics UI under `src/lib/components/editor/` or `src/routes/editor/analytics/+page.svelte`

## Source-of-truth split

- Browser-only collection and session state live in `src/lib/stores/performanceAnalytics.svelte.ts`.
- Request validation, normalization, dedupe, and rate limiting live in `src/lib/server/performanceAnalyticsIngest.ts`.
- Persistence and summary API behavior live in `src/routes/api/performance-analytics/+server.ts`.
- Database shape lives in `server/schema.prisma` and `server/migrations/`.
- Dev UI lives in `src/lib/components/editor/EditorAnalyticsSection.svelte`.

## Rules

1. Keep analytics collection dev-only through `$app/environment` guards.
2. Do not let client-provided analytics fields bypass server-side normalization limits.
3. Keep event kind names aligned across client types, server `mapKind`, and Prisma `AnalyticsEventKind`.
4. Preserve capped in-memory queues and batching to avoid noisy dev sessions overwhelming storage.
5. Treat route, URL, detail, and session ID fields as untrusted user input at the API boundary.
6. If persistence shape changes, update Prisma schema, normalization, API serialization, UI summary types, and tests together.

## Verification

- Run `npm run test:unit -- --run` after changing normalization, summaries, or analytics helpers.
- Run `npm run check` after client store or editor UI changes.
- Manually verify `/editor/analytics` in dev mode when changing displayed metrics or persistence status.

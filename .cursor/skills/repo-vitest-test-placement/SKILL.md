---
name: repo-vitest-test-placement
description: Places and writes Vitest tests correctly for this repo's split browser and server projects. Use when adding or updating unit tests for Svelte components, stores, server modules, or shared TypeScript logic.
---

# Repo Vitest Test Placement

## Use this skill when

- Adding a new unit test
- Moving a test that is in the wrong environment
- Unsure whether a change belongs in a browser Svelte test or a node test

## Project split

- Browser project: `src/**/*.svelte.{test,spec}.{js,ts}`
- Browser project excludes: `src/lib/server/**`
- Server project: `src/**/*.{test,spec}.{js,ts}`
- Server project excludes all `.svelte.test.ts` and `.svelte.spec.ts` files

## Placement rules

1. Use `ComponentName.svelte.test.ts` for rendered Svelte component behavior.
2. Use non-Svelte test files such as `thing.spec.ts` for stores, helpers, API logic, and server code.
3. If the test needs DOM rendering or browser interaction, keep it in the browser project.
4. If the test touches `src/lib/server/**`, Prisma, env access, or pure TypeScript logic, keep it in the server project.

## Test style

- `vite.config.ts` enables `requireAssertions`, so every test should make a real assertion.
- Prefer semantic queries and user-visible behavior for component tests.
- Keep tests close to the file they cover.
- Avoid moving server logic into browser tests just to reuse helpers.

## Verification

- Run `npm run test:unit -- --run` for full unit coverage.
- Run a narrower Vitest command when the affected area is obvious, then expand if needed.

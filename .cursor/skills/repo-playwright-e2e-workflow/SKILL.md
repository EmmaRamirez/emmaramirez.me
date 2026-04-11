---
name: repo-playwright-e2e-workflow
description: Adds and maintains Playwright end-to-end coverage using this repo's local dev-server configuration and test style. Use when writing `e2e/` specs, validating homepage flows, or covering API-backed UI behavior in the browser.
---

# Repo Playwright E2E Workflow

## Use this skill when

- Adding or editing files in `e2e/`
- Covering a homepage flow, modal, tab set, or editor/debug interaction
- Unsure how this repo boots the app for Playwright

## Repo-specific setup

- Config file: `playwright.config.ts`
- Test directory: `e2e`
- Base URL: `http://127.0.0.1:4173`
- Web server command: `npm run dev -- --host 127.0.0.1 --port 4173`

## Guidelines

1. Write specs under `e2e/` near related flows.
2. Prefer roles, labels, and visible text before CSS selectors.
3. Reuse tiny helpers when a setup step repeats, such as enabling debug sections through `localStorage`.
4. Keep tests parallel-safe and independent.
5. Assert user-visible outcomes, not implementation details.

## Important repo gotchas

- The default Playwright config runs the dev server, not `preview`.
- Dev-only surfaces such as `/editor` depend on `import.meta.env.DEV`, so the default config is the correct environment for them.
- If a scenario needs a different server mode or env setup, create that intentionally instead of mutating the default flow.

## Verification

- Run `npm run test:e2e` for the full suite.
- Run a focused Playwright command while iterating, then rerun the closest broader coverage before finishing.

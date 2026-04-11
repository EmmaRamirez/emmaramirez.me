---
name: repo-svelte-change-workflow
description: Changes Svelte 5 and SvelteKit files in this repo using the required Svelte MCP flow and local UI conventions. Use when editing `.svelte`, `.svelte.ts`, route components, shared blocks, editor panels, or homepage UI behavior.
---

# Repo Svelte Change Workflow

## Use this skill when

- Touching `src/**/*.svelte` or `src/**/*.svelte.ts`
- Changing route UI such as `src/routes/+layout.svelte` or `src/routes/**/+page.svelte`
- Updating shared blocks, hero components, editor sections, or UI primitives

## Required workflow

1. Read `AGENTS.md`.
2. Use the Svelte MCP in this order: `list-sections`, then `get-documentation` for every relevant section.
3. Make the change with the Svelte 5 patterns already used here: `$props`, `$state`, `$effect`, and shared state in `.svelte.ts` modules.
4. Run the Svelte autofixer and keep iterating until it returns no issues or suggestions.
5. Run targeted verification such as `npm run check`, the nearest Vitest file, or the relevant Playwright spec.

## Repo conventions

- Prefer Tailwind utilities over custom CSS.
- Keep components focused; extract helpers before adding new abstractions.
- Put shared mutable state in `src/lib/stores/*.svelte.ts`.
- Keep markup semantic and accessible so tests can use role-based queries.

## Common paths

- `src/lib/components/blocks/`
- `src/lib/components/editor/`
- `src/lib/components/hero/`
- `src/lib/components/ui/`

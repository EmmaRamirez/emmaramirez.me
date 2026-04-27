---
name: repo-design-system-catalog
description: Maintains this repo's UI component library, design page, component documentation registry, and design-system docs. Use when editing `src/lib/components/ui/**`, `src/lib/components/design/**`, `src/lib/registry/designComponents.ts`, `src/routes/design/**`, or `docs/components/**`.
---

# Repo Design System Catalog

## Use this skill when

- Adding or changing shared UI primitives in `src/lib/components/ui/`
- Updating the `/design` route or design gallery components
- Editing `src/lib/registry/designComponents.ts`
- Updating design-system documentation under `docs/components/**`

## Required companion workflow

This skill usually involves Svelte code. Also use `repo-svelte-change-workflow` for the required Svelte MCP documentation and autofixer loop before finishing Svelte edits.

## Source-of-truth split

- Component implementations live in `src/lib/components/ui/` and related component folders.
- Public UI exports live in `src/lib/components/ui/index.ts`.
- Design gallery metadata lives in `src/lib/registry/designComponents.ts`.
- Design route components live in `src/lib/components/design/` and `src/routes/design/+page.svelte`.
- Design notes live in `docs/components.md` and `docs/components/**`.

## Rules

1. When adding a reusable component, update the UI barrel export if it should be app-wide.
2. Keep design registry entries aligned with real component paths and prop names.
3. Prefer `previewMode: "documented"` for components that require app state, network data, WebGL, Mapbox, or browser-only side effects.
4. Prefer `previewMode: "mocked"` for components that can be shown with fixtures without mutating app state.
5. Keep examples short and valid enough to teach usage without pretending all dependencies are available.
6. Preserve accessibility contracts on primitives: labels for form controls, `aria-label` for icon-only actions, semantic landmarks where appropriate.

## Verification

- Run `npm run check` for component and registry changes.
- Run the nearest `.svelte.test.ts` when changing component behavior.
- Manually inspect `/design` after changing registry entries, categories, preview modes, or gallery UI.

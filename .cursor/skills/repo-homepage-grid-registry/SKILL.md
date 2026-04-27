---
name: repo-homepage-grid-registry
description: Maintains homepage registry data, grid item types, shuffled layout behavior, reader panels, and homepage block wiring. Use when editing `src/lib/registry/homepage.ts`, `src/lib/types/homepage.ts`, grid components, homepage blocks, or `src/routes/+page.svelte`.
---

# Repo Homepage Grid Registry

## Use this skill when

- Adding, removing, or reordering homepage projects, articles, or special blocks
- Changing `GridItem`, `FeaturedItem`, or homepage registry types
- Editing `src/routes/+page.svelte`, grid components, or homepage block composition
- Updating reader panel selection for article or project cards

## Source-of-truth split

- Project and homepage registry data lives in `src/lib/registry/homepage.ts`.
- Grid item unions live in `src/lib/types/homepage.ts`.
- Grid layout state lives in `src/lib/stores/gridLayoutStore.svelte.ts`.
- Reader panel state lives in `src/lib/stores/readerPanelStore.svelte.ts`.
- Grid UI lives in `src/lib/components/grids/`.
- Homepage-specific blocks live in `src/lib/components/blocks/`.

## Rules

1. Keep `ProjectId`, `projectRegistry`, and `projectIds` in sync.
2. Keep `GridItem` variants aligned with the blocks that `src/routes/+page.svelte` can render.
3. Preserve the seeded shuffle behavior unless the layout requirement explicitly changes.
4. Treat article registry entries as derived from `defaultArticles`; do not duplicate article metadata manually.
5. Update reader panel behavior when adding a card type that opens article or project detail.
6. Consider `/editor` impact for changes that share `gridLayoutStore` or user settings.

## Verification

- Run `npm run check` for registry or route changes.
- Run `npm run test:unit -- --run` when changing shuffle, neighbor, layout store, or selection helpers.
- Manually verify homepage cards, reader panels, and `/editor/grid` when layout or registry behavior changes.

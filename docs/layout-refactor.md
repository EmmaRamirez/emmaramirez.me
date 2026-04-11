# Layout Refactor Plan

This document turns the current architectural observations into a concrete refactor plan for the homepage, editor, and related state modules. The goal is to simplify the mental model without changing the user-facing behavior of the site.

## Goals

- Reduce the number of places where homepage layout behavior is defined.
- Standardize shared app state around one primary pattern.
- Separate production site concerns from editor and debug concerns.
- Shrink oversized components into smaller, easier-to-test modules.
- Preserve the current visual layout and interactions while making future changes cheaper.

## Current Pain Points

### 1. Homepage layout knowledge is split across too many modules

Today, tile identity, default layout, item ordering, rendering, and editor metadata are spread across:

- `src/lib/registry/homepage.ts`
- `src/lib/registry/gridItems.ts`
- `src/lib/stores/gridLayoutStore.svelte.ts`
- `src/lib/components/grids/MainGrid.svelte`
- `src/lib/components/editor/EditorGridSection.svelte`
- `src/lib/components/editor/editorGridMeta.ts`

This makes it too easy for item kinds or defaults to drift out of sync.

### 2. Shared state uses two different architectural styles

The codebase mixes classic `svelte/store` stores in `src/lib/stores.ts` with rune-based state modules in `src/lib/stores/*.svelte.ts`. Both approaches are valid, but the current mix makes it harder to predict where state should live and how it should be read or updated.

### 3. The editor is acting as a mega-surface

`src/lib/components/editor/EditorGridSection.svelte` currently owns:

- drag and drop
- layout persistence
- tile preview rendering
- inspector behavior
- debug settings fetch/save
- hero tuning
- disco settings display
- top-languages settings

That makes the component expensive to understand and risky to change.

### 4. Homepage overlays are coordinated through scattered booleans

The home route manages multiple modal or overlay-like surfaces independently:

- article reader
- project reader
- omnibar
- design system browser
- API explorer
- debug menu

The current approach works, but it spreads UI flow logic across the page component and a separate panel store.

### 5. The 3D hero exposes a very large mutable parameter surface

The combination of `src/lib/stores/hero3dParams.svelte.ts` and `src/lib/components/hero/Hero3DScene.svelte` exposes many low-level shader controls directly to app code. That is flexible, but it is more configuration surface than the site likely needs for normal iteration.

## Target Architecture

The refactor should move toward the following shape:

### A single homepage tile manifest

Create one manifest layer that defines each tile kind in one place:

- stable key
- render kind
- default grid span
- editor label/icon/color
- dev-only or feature-flag status
- optional inspector config

Suggested location:

- `src/lib/homepage/tiles/manifest.ts`

This manifest should become the source of truth used by:

- homepage item assembly
- editor item assembly
- default layout generation
- editor metadata

### A clearer separation between content data and layout data

Split "what content exists" from "how it appears in the homepage grid."

- Content registry stays responsible for articles/projects/disco data.
- Homepage tile assembly becomes responsible for selecting which content appears on the homepage.
- Layout state becomes responsible only for order and spans.

Suggested locations:

- `src/lib/content/` for article/project data access
- `src/lib/homepage/tiles/` for tile definitions and assembly
- `src/lib/homepage/layout/` for persisted layout state

### One primary shared-state pattern

Prefer rune-based `.svelte.ts` modules for shared app state unless a classic store is actually needed for compatibility or streaming behavior.

Suggested result:

- move `showSections` and theme-related state behind rune-based modules, or
- explicitly label classic stores as legacy or interop-only

The main win is consistency, not dogma.

### A route shell plus focused editor subcomponents

Break the editor into a small route shell and a few focused components:

- `EditorGridShell.svelte`
- `EditorGridPreview.svelte`
- `EditorInspector.svelte`
- `EditorSettingsPanel.svelte`
- `EditorToolbar.svelte`

Shared logic can move into:

- `src/lib/components/editor/state.svelte.ts`
- `src/lib/components/editor/serialization.ts`

### A unified overlay controller

Replace multiple booleans and separate panel coordination with one discriminated union representing the active overlay.

Example shape:

```ts
type ActiveOverlay =
	| { kind: 'none' }
	| { kind: 'article'; slug: string }
	| { kind: 'project'; id: ProjectId }
	| { kind: 'omnibar' }
	| { kind: 'design-system' }
	| { kind: 'api-explorer' }
	| { kind: 'debug-menu' };
```

This can live in:

- `src/lib/stores/overlayState.svelte.ts`

### A smaller public hero configuration API

The hero effect should keep its internal complexity, but the rest of the app should interact with a smaller config surface.

Preferred direction:

- group related values into nested domains like `parallax`, `ripple`, `caustics`
- expose a small set of presets for normal usage
- keep advanced tuning isolated to the editor/debug surface

## Proposed File Moves

This is a suggested end state, not a mandatory one:

```text
src/lib/content/
  articles.ts
  projects.ts

src/lib/homepage/
  tiles/
    manifest.ts
    buildTiles.ts
    tileMeta.ts
    renderers.ts
  layout/
    gridLayoutState.svelte.ts
    defaults.ts
    persistence.ts

src/lib/overlays/
  overlayState.svelte.ts

src/lib/components/editor/
  EditorGridShell.svelte
  EditorGridPreview.svelte
  EditorInspector.svelte
  EditorSettingsPanel.svelte
  EditorToolbar.svelte
  state.svelte.ts

src/lib/components/hero/
  Hero.svelte
  Hero3D.svelte
  Hero3DScene.svelte
  hero3dConfig.svelte.ts
  hero3dPresets.ts
```

## Phased Execution Plan

### Phase 1: Standardize homepage tile ownership

Objective: make one layer responsible for homepage tile definitions.

Tasks:

1. Create a `homepage/tiles` module for tile manifest and assembly.
2. Move editor metadata out of `editorGridMeta.ts` into the tile manifest or a sibling `tileMeta.ts`.
3. Move default span knowledge out of `gridLayoutStore.svelte.ts` into `homepage/layout/defaults.ts`.
4. Make `buildHomepageGridItems()` read from the manifest rather than hardcoding tile kinds inline.

Deliverable:

- one source of truth for tile kinds and defaults

Success criteria:

- adding a new tile kind requires touching one manifest path, not five files
- editor and homepage assemble tiles from the same definitions

### Phase 2: Simplify layout state responsibilities

Objective: make layout state only responsible for persistence and mutation.

Tasks:

1. Extract local storage read/write helpers into `persistence.ts`.
2. Extract default layout generation into `defaults.ts`.
3. Keep `gridLayoutState.svelte.ts` focused on:
  - initialize
  - reorder
  - resize
  - save/reset
4. Rename the exported store to reflect that homepage and editor intentionally share state.

Deliverable:

- a smaller layout state module with fewer cross-cutting responsibilities

Success criteria:

- layout store no longer knows content selection details
- default layout logic is testable without store setup

### Phase 3: Break up the editor surface

Objective: reduce the size and responsibility count of `EditorGridSection.svelte`.

Tasks:

1. Extract toolbar actions into `EditorToolbar.svelte`.
2. Extract drag-and-drop preview into `EditorGridPreview.svelte`.
3. Extract item detail rendering into `EditorInspector.svelte`.
4. Extract settings fetch/save logic into `EditorSettingsPanel.svelte` or `state.svelte.ts`.
5. Keep the route page and shell focused on composition only.

Deliverable:

- editor route composed from smaller parts with explicit responsibilities

Success criteria:

- no single editor component owns both preview rendering and settings persistence
- individual editor pieces can be changed without scanning a thousand-line file

### Phase 4: Unify overlay and panel navigation state

Objective: move overlay state to one model.

Tasks:

1. Introduce `overlayState.svelte.ts`.
2. Replace `readerPanelStore.svelte.ts` open/close functions with overlay actions.
3. Update `src/routes/+page.svelte` to derive UI from one active overlay state.
4. Keep route-level helpers thin and declarative.

Deliverable:

- one overlay state model for readers, omnibar, and debug surfaces

Success criteria:

- route component loses most local booleans
- overlay transitions become easier to reason about

### Phase 5: Reduce hero configuration surface

Objective: keep the effect expressive while simplifying how the rest of the app interacts with it.

Tasks:

1. Replace the flat hero param object with grouped config domains.
2. Add named presets for common states.
3. Keep advanced controls behind the editor or debug route.
4. Reduce repeated field-by-field copying where possible.

Deliverable:

- smaller public hero config API

Success criteria:

- normal usage reads like choosing a preset or changing a few grouped values
- shader implementation details stay local to the hero module

### Phase 6: Separate production and debug architecture

Objective: make the public site easier to read by isolating debug-only concerns.

Tasks:

1. Group editor and debug-only modules under a clearer boundary.
2. Move debug settings API concerns closer to editor/debug features.
3. Ensure homepage production rendering does not carry unnecessary editor logic.

Deliverable:

- clearer distinction between site architecture and tooling architecture

Success criteria:

- a new contributor can read the homepage flow without needing to understand the editor first

## Recommended Order

Follow this order to reduce churn:

1. Phase 1: tile ownership
2. Phase 2: layout state extraction
3. Phase 3: editor decomposition
4. Phase 4: overlay state unification
5. Phase 5: hero config cleanup
6. Phase 6: debug isolation

This sequence works well because each step lowers coupling for the next one.

## Risks and Mitigations

### Risk: layout persistence breaks for existing users

Mitigation:

- keep the current local storage key during the first refactor pass
- add a migration helper if tile keys change
- add tests around saved order/layout hydration

### Risk: homepage and editor drift during the transition

Mitigation:

- move both to the shared manifest early
- avoid parallel one-off fixes in old and new assembly paths

### Risk: refactor becomes a rewrite

Mitigation:

- preserve current behavior
- refactor one seam at a time
- do not redesign visuals while changing architecture

## Testing Plan

Add focused coverage where it protects the new seams:

- unit tests for tile manifest assembly
- unit tests for default layout generation
- unit tests for layout persistence and hydration
- unit tests for overlay state transitions

Avoid broad snapshot-heavy tests for the editor unless a specific regression risk appears.

## Definition of Done

The refactor is complete when:

- homepage tile definitions have one source of truth
- layout state is isolated from content selection
- editor responsibilities are split into focused components
- overlay state is unified behind one model
- hero configuration has a smaller public API
- production site code is easier to read without debug/editor context

## Optional Follow-Up

Once the architecture is simplified, the next natural follow-ups would be:

- document the tile manifest contract in a short ADR or architecture note
- remove legacy state helpers that become redundant
- review whether any routes or debug features can be lazy-loaded


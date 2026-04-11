---
name: repo-editor-dev-surface
description: Maintains the dev-only editor route and its shared homepage customization state. Use when changing `/editor`, grid layout behavior, local user settings, debug toggles, or editor section components.
---

# Repo Editor Dev Surface

## Use this skill when

- Editing `src/routes/editor/+page.svelte`
- Changing files under `src/lib/components/editor/`
- Updating `src/lib/stores/gridLayoutStore.svelte.ts` or `src/lib/stores/userSettings.svelte.ts`
- Wiring new debug or customization controls into the editor

## Repo-specific behavior

- `/editor` is intentionally dev-only and should stay guarded with `$app/environment`.
- The editor shares homepage layout state through `editorGridLayoutStore = gridLayoutStore`.
- User preferences persist in local storage through `src/lib/stores/userSettings.svelte.ts`.

## Rules

1. Do not remove the dev gate from `src/routes/editor/+page.svelte` unless the product requirement changes.
2. Treat editor changes as homepage changes when they share the same backing store.
3. Keep storage keys stable unless a deliberate migration is included.
4. Add new editor controls in the editor component layer, then connect them to the owning store.
5. Prefer updating existing state modules over creating duplicate editor-only state.

## Common paths

- Route shell: `src/routes/editor/+page.svelte`
- Editor sections: `src/lib/components/editor/`
- Layout persistence: `src/lib/stores/gridLayoutStore.svelte.ts`
- User settings: `src/lib/stores/userSettings.svelte.ts`
- Debug menu: `src/lib/components/dev/DebugMenu.svelte`

## Verification

- Manually verify `/editor` in dev mode.
- Confirm homepage behavior still matches the shared state after editor changes.

---
name: repo-hero-3d-workflow
description: Updates the homepage hero 3D effect across Threlte scene code, parameter stores, and persisted debug settings. Use when changing `Hero3D`, shader parameters, presets, motion tuning, or hero debug controls.
---

# Repo Hero 3D Workflow

## Use this skill when

- Editing `src/lib/components/hero/Hero3D.svelte` or `src/lib/components/hero/Hero3DScene.svelte`
- Changing `src/lib/stores/hero3dParams.svelte.ts`
- Updating `src/routes/api/debug-settings/+server.ts`
- Adjusting editor controls or presets for the hero effect

## Paths that must stay in sync

- Scene implementation: `src/lib/components/hero/Hero3DScene.svelte`
- Store defaults and presets: `src/lib/stores/hero3dParams.svelte.ts`
- Persisted normalization: `src/routes/api/debug-settings/+server.ts`
- Parent integration: `src/lib/components/hero/Hero.svelte`

## Rules

1. When adding or renaming a hero parameter, update the store type, defaults, normalization, persistence, and UI controls together.
2. Preserve browser-only guards for canvas and DOM work.
3. Keep uniform names, store keys, and serialized JSON keys aligned.
4. Use `refreshHero3dEffect()` when a change needs a hard rerender.
5. Favor tuning existing parameters over introducing new ones unless the effect truly needs a new control.

## Current architecture

- The scene uses Threlte primitives plus `useTask` for frame updates.
- Textures come from `useTexture`.
- Debug settings persist hero params through the `debug-settings` API route.
- Presets are defined in the hero param store and should remain valid after any schema change.

## Verification

- Run the nearest unit tests for hero params or settings serialization.
- Manually verify the hero in the browser when the visual output changes.

# Header Logo Proposal

This document proposes a new header logo for `HeaderLogo` that replaces the current text-only treatment with a compact, cursor-reactive mark.

## Summary

The logo should feel like a miniature relative of the homepage hero:

- a soft-cornered squircle container
- an `EMZ` monogram or ligature inside the shape
- a shader-driven color field underneath the mark
- cursor motion that produces a subtle, satisfying response rather than a loud gimmick

The reference image is useful for the overall silhouette and "letter inside a glowing squircle" idea, but this version should feel more native to the site's visual system.

## Design Goals

- Make the mark recognizable at header scale, around `32px` to `40px`.
- Keep it cohesive with the site's current dark aurora, glow, and reveal language.
- Let the effect respond to movement, but keep it calm enough for a persistent header element.
- Preserve readability and identity even when motion is disabled.
- Give the header a memorable signature without competing with the hero section.

## Recommended Direction

### Aurora Monogram

Use a dark plum or near-black squircle as the frame, with an interlocked `EMZ` monogram sitting above a live shader field.

The monogram should not read like three separate cramped letters. Instead, it should behave more like a single emblem:

- the `M` acts as the anchor structure
- the `E` is suggested on the left with one strong vertical and short horizontal cuts
- the `Z` is implied by a diagonal slash and lower bar

The result should read as `EMZ` when viewed for a beat, but still function as a bold abstract icon at small sizes.

### Visual Character

- Base shell: deep aubergine, black-plum, or inky charcoal.
- Main light: Caroline blue and warm coral-peach, echoing the hero.
- Secondary accent: a small amount of mint or pink only at high motion energy.
- Surface finish: faint bloom, very light grain, and a restrained glassy highlight.

## Shader Behavior

The shader should live underneath the monogram and be clipped by the squircle shape.

Recommended behavior:

1. Idle: slow aurora drift with barely-there chroma movement.
2. Hover: a soft highlight wakes up under the cursor.
3. Cursor motion: movement creates a trailing ribbon or pressure wake that bends color through the shape.
4. Exit: energy decays smoothly back to idle rather than snapping off.

This should feel more like "color being pulled through enamel" than a generic gradient following the mouse.

## Why This Fits The Site

The homepage hero already uses:

- dark cinematic backgrounds
- orange and blue aurora lighting
- grid glow
- cursor-driven reveal and motion damping
- subtle grain and chromatic energy

The header logo can echo that system in miniature:

- reuse the same orange-blue family
- borrow the same easing and damping values
- keep the interaction softer than the hero
- use a faint internal grid or scan texture only when it supports the composition

That makes the logo feel like part of the same world instead of a separate brand asset pasted on top.

## Effect Ideas

### 1. Aurora Wake

The cursor drags a soft color wake through the logo, like light suspended in liquid.

Why it works:

- most cohesive with the hero
- elegant at small sizes
- easy to tune from subtle to expressive

### 2. Prism Scan

A thin diagonal band sweeps through the monogram and briefly splits into spectral edges as the user moves across the header.

Why it works:

- strong "tech-fashion" feel
- gives the mark a premium shine
- less organic than the hero, so it should be used carefully

### 3. Topographic Bloom

The cursor causes contour-like rings or ink lines to bloom from the point of interaction inside the squircle.

Why it works:

- distinctive and artistic
- can connect to editorial or map-like compositions elsewhere on the site
- slightly riskier because it may feel busier in a small icon

## Recommendation

Start with `Aurora Wake`.

It best matches the current site language and gives plenty of room to add secondary details later, such as:

- a faint internal grid flare
- a momentary chroma split on fast motion
- a glossy edge highlight near the top-left corner

## Composition Notes

To keep the header balanced:

- the icon should carry the animation
- the adjacent wordmark, if kept, should remain stable and mostly typographic
- the logo effect should stay inside the squircle and avoid spilling large glows into nearby nav items

Recommended pairing options:

- `Mark + EMZINNIA` on desktop, mark-only acceptable at tighter widths
- mark-only on all breakpoints if the monogram is strong enough

The safer first pass is `mark + wordmark`, since the site currently uses the full name and the icon will be new.

## Interaction Model

The logo should react to local cursor position within the mark, not the entire viewport.

Suggested states:

- `idle`: low-frequency motion, soft internal color drift
- `proximity`: brighter center and slightly more saturation
- `active`: velocity-driven wake or ripple on direct movement
- `settle`: smooth decay over `180ms` to `320ms`

Motion should also scale down for touch and reduced-motion users:

- no cursor wake on coarse pointers
- static gradient or extremely slow shimmer fallback
- preserve the monogram silhouette with no reliance on motion for legibility

## Implementation Notes

This should be implemented as a lightweight WebGL treatment, not a DOM-only hover effect.

Recommended approach in this repo:

- keep `HeaderLogo.svelte` as the clickable wrapper
- add a dedicated mark component such as `HeaderLogoMark.svelte`
- render a very small shader scene inside the squircle
- use a single plane with a fragment shader rather than a complex 3D setup
- reuse motion concepts from the hero, especially damping and energy decay

Because the repo already uses Threlte and shader-driven interaction in the hero, the logo can borrow that direction without copying the full hero stack.

## Constraints

- Keep GPU cost low because this runs in the persistent header.
- Do not require a large canvas or expensive texture work.
- Ensure the mark still looks good before hydration and when WebGL is unavailable.
- Keep the monogram high-contrast against the animated field.
- Avoid effects that depend on tiny details, since the logo will often render small.

## First Build Target

The first implementation should prove four things:

1. The `EMZ` monogram reads clearly at header size.
2. The squircle silhouette is attractive even while static.
3. Cursor movement produces a tasteful wake effect.
4. The logo feels like it belongs beside the existing hero and header styling.

If that works, the next pass can explore richer polish like gloss, grid flare, or a more custom ligature.

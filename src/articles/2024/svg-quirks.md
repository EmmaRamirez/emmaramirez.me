---
title: "SVG Quirks I Keep Forgetting"
date: 2024-06-28
tags: [svg, frontend]
description: "viewBox math, stroke alignment, and why the use tag is both a friend and a trap."
---

viewBox math, stroke alignment, and why the `<use>` tag is both a friend and a trap.

## The viewBox Dance

Every time I set up an SVG, I rediscover viewBox. The syntax is simple—four numbers—but the implications cascade.

```html
<svg viewBox="0 0 100 100" width="50" height="50">
```

The viewBox defines the coordinate system. The width and height define the display size. Get these out of sync and everything scales unexpectedly.

**Rule I keep forgetting**: When icons look fuzzy, check if viewBox dimensions match the original design canvas.

## Stroke Alignment Chaos

CSS has `box-sizing: border-box`. SVG has... nothing equivalent.

Strokes center on the path by default. A 0.125rem stroke on a 100x100 square actually renders at 101x101 if you're not careful.

Solutions:
- Inset your paths by half the stroke width
- Use `vector-effect="non-scaling-stroke"` when appropriate
- Accept that SVG math sometimes requires a calculator

## The `<use>` Trap

The `<use>` element seems magical. Define once, reference everywhere. Symbols and sprites. DRY SVGs.

Then you try to style it from CSS. The shadow DOM boundary laughs at your `fill: currentColor`. Inheritance works, but direct selection doesn't.

**What actually works**:

```html
<symbol id="icon">
  <path fill="currentColor" d="..."/>
</symbol>

<svg><use href="#icon"/></svg>
```

Let `currentColor` do the work. Accept limited styling. Or inline the SVG when you need full control.

## Text is a Trap

SVG text seems simpler than HTML text. It's not. Fonts work differently. Wrapping doesn't exist natively. Accessibility is easier to break.

When in doubt, use HTML for text and SVG for graphics. Overlay them if needed.


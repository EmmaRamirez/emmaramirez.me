---
title: 'CSS Architecture Notes'
date: 2023-12-19
tags: [css, architecture]
description: 'Layered styles, tokens, and when to reach for utilities over components.'
---

Layered styles, tokens, and when to reach for utilities over components. These are notes I've accumulated over years of building and maintaining CSS at scale.

## The Layer Cake

Modern CSS architecture isn't about picking one methodology and sticking to it. It's about understanding layers:

1. **Reset/Normalize** — The foundation that removes browser inconsistencies
2. **Design Tokens** — Your design system's DNA: colors, spacing, typography
3. **Base Styles** — Element defaults without classes
4. **Utilities** — Single-purpose classes for rapid iteration
5. **Components** — Reusable patterns with semantic meaning

Each layer has its place. Problems arise when layers bleed into each other.

## When Utilities Win

Utility classes shine when you need:

- Quick iterations without touching CSS files
- Consistent spacing and sizing from tokens
- Responsive adjustments at multiple breakpoints
- One-off styling that doesn't warrant a component

They struggle when patterns repeat. If you're copying the same twelve utility classes across ten files, you've created implicit components that should be explicit.

## When Components Win

Component classes make sense when:

- The same visual pattern appears in multiple places
- The styling has semantic meaning tied to functionality
- You want to abstract away implementation details
- The design is stable enough to warrant the abstraction

## The Token Foundation

Everything should flow from design tokens. When a designer says "make that blue," you should ask "which blue?" Your token system should answer that question definitively.

```css
:root {
	--color-primary: oklch(60% 0.15 250);
	--color-surface: oklch(98% 0.01 250);
	--spacing-md: 1rem;
}
```

Tokens aren't just variables—they're contracts between design and development. Break them thoughtfully.

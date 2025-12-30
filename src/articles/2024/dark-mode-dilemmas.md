---
title: "Dark Mode Dilemmas"
date: 2024-08-01
tags: [design, accessibility]
description: "Color tokens, contrast pitfalls, and why your shadows feel wrong at midnight."
---

Color tokens, contrast pitfalls, and why your shadows feel wrong at midnight.

## The Easy Part

Swapping colors is straightforward. Background goes dark. Text goes light. Ship it, right?

Not so fast.

## Contrast is Contextual

A color pair that hits 4.5:1 contrast in light mode might fail in dark mode when you naively invert it. The relationships matter as much as the absolute values.

Dark mode needs its own contrast testing. Every pairing. Every state.

## Shadows in the Dark

Here's where many dark modes fall apart. Shadows that look subtle against white backgrounds become invisible against dark ones. But making them darker often looks muddy.

The solution: use elevation through brightness rather than shadow. Surfaces that are "higher" are slightly lighter. It's how light actually works.

```css
:root[data-theme="dark"] {
  --surface-base: hsl(220 15% 12%);
  --surface-raised: hsl(220 15% 16%);
  --surface-overlay: hsl(220 15% 20%);
}
```

## Color Meaning Shifts

Your warning yellow might need to become softer. Your success green might need more blue. Colors that pop appropriately in light mode can feel aggressive in dark mode.

> Dark mode isn't inversion. It's translation.

## The Human Element

Remember that people switch modes for different reasons. Eye strain. Aesthetic preference. Battery life. OLED benefits. Low-light environments.

Each context has different needs. The best dark modes account for this by testing in actual conditions, not just in design tools.


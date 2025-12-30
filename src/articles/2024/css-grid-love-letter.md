---
title: "A Love Letter to CSS Grid"
date: 2024-08-18
tags: [css, layout]
description: "Grid has turned layout from a chore into a small act of poetry. Here are patterns I reach for weekly."
---

Grid has turned layout from a chore into a small act of poetry. Here are patterns I reach for weekly.

## The Before Times

Remember float clearing? Remember the holy grail layout hacks? Remember flexbox gymnastics for two-dimensional layouts that really needed grid?

Grid changed everything.

## Patterns That Spark Joy

### The Full-Bleed Layout

```css
.wrapper {
  display: grid;
  grid-template-columns: 
    1fr 
    min(65ch, 100%) 
    1fr;
}

.wrapper > * {
  grid-column: 2;
}

.full-bleed {
  grid-column: 1 / -1;
}
```

Content stays readable. Images break free. Simple, elegant, bulletproof.

### The Responsive Card Grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

No media queries. Cards flow naturally. The browser figures it out.

### The Dashboard Layout

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr;
}
```

Named areas make the structure visible. Changes are obvious. Intent is clear.

## Why It Matters

Grid isn't just a layout tool. It's a way of thinking about two-dimensional space. Once you internalize it, you stop fighting the browser and start collaborating with it.

That's the difference between wrestling CSS and writing poetry.


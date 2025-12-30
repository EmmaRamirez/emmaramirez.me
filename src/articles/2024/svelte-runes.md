---
title: "Svelte 5 Runes"
date: 2024-10-10
tags: [svelte, javascript]
description: "Runes represent a fundamental shift in how Svelte handles reactivity. Moving from implicit to explicit reactivity opens new possibilities."
---

Runes represent a fundamental shift in how Svelte handles reactivity. Moving from implicit to explicit reactivity might seem like a step backward, but it opens up new possibilities for composition and clarity.

## From Magic to Mechanics

Svelte's original appeal was its "disappearing framework" philosophy. Reactivity just happened. You wrote `let count = 0` and updates propagated automatically.

But magic has costs. It's harder to refactor, harder to extract into libraries, and sometimes behaves in unexpected ways at the boundaries.

## Enter Runes

Runes make reactivity explicit without making it verbose:

```javascript
let count = $state(0);
let doubled = $derived(count * 2);
```

The dollar sign signals intent. This is reactive. This depends on something else. The mental model is clearer.

## Composition Unlocked

The real power shows in extraction. Want to share reactive logic between components? Before, you needed stores or context. Now:

```javascript
function useCounter(initial = 0) {
  let count = $state(initial);
  return {
    get count() { return count; },
    increment: () => count++
  };
}
```

This function works anywhere. No special APIs. No framework coupling.

## The Tradeoffs

Yes, there's more syntax. Yes, the compiler is still doing work under the hood. But the explicitness pays dividends in large codebases where tracking data flow matters.

Svelte 5 feels like a framework that's grown up without losing its soul.


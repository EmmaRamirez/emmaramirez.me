---
title: 'Refactoring CSS with Intent'
date: 2023-10-10
tags: [css, refactoring]
description: 'How I chip away at legacy styles without pausing feature work.'
---

How I chip away at legacy styles without pausing feature work.

## The Legacy Mountain

Legacy CSS accumulates. Specificity wars. Duplicated declarations. Styles nobody understands but everyone's afraid to touch.

The dream: rewrite everything. The reality: there's never time.

## Incremental Strategy

Instead of a rewrite, I chip away:

### 1. Opportunistic Refactoring

When touching a file for features, improve it slightly:

- Remove dead declarations
- Consolidate duplicates
- Add missing custom properties

Small improvements compound.

### 2. The Scout Rule

Leave code cleaner than you found it. Every PR that touches CSS should improve, not just extend.

### 3. Protected Time

Negotiate 10-20% of each sprint for technical health. Use some of it for CSS.

## Safe Refactoring Patterns

**Extract to tokens**: Replace magic numbers with custom properties. Searching and replacing becomes trivial.

**Increase specificity temporarily**: When consolidating selectors, bump specificity to match legacy code. Reduce it later.

**Visual regression testing**: Screenshots catch what eyes miss. Percy, Chromatic, or simple diff scripts.

## Danger Zones

**Global resets**: Changing them affects everything. Test exhaustively.

**Third-party component overrides**: Brittle by nature. Document heavily.

**Inherited styles**: Easy to break children when fixing parents.

## Measuring Progress

Track:

- Lines of CSS (should decrease or stabilize)
- Number of !important declarations
- Custom property usage
- File count and organization

Visibility motivates.

## The End State

You'll never be "done." Legacy accumulates constantly. The goal is sustainable maintenance, not perfection.

Refactor with intent. Ship with confidence.

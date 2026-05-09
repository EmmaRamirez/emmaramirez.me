---
title: 'Managing Design Debt'
date: 2023-12-01
tags: [design, process]
description: 'Tracking messy corners, prioritizing fixes, and communicating tradeoffs.'
---

Tracking messy corners, prioritizing fixes, and communicating tradeoffs.

## Design Debt Exists

Just like code can accumulate technical debt, designs accumulate their own form of debt:

- Inconsistent patterns that "ship now, fix later"
- Accessibility issues documented but deferred
- Components that diverge from the design system
- Responsive breakpoints that were never tested

Left unaddressed, design debt compounds just like the technical kind.

## The Inventory

Start with visibility. You can't manage what you can't see.

I maintain a simple spreadsheet:

- **What**: The specific inconsistency
- **Where**: Pages or components affected
- **Impact**: User experience or maintenance burden
- **Effort**: Rough estimate to fix
- **Dependencies**: What else needs to change

Review it quarterly. Some items resolve themselves. Others grow.

## Prioritization Framework

Not all debt is equal. Prioritize by:

**User impact**: Does it cause confusion or friction?
**Frequency**: How often do users encounter it?
**Compound risk**: Will it get harder to fix over time?
**Opportunity cost**: Does it block other improvements?

High impact + high frequency = fix now. Low impact + low frequency = document and defer.

## The Communication Layer

Design debt often gets invisible to stakeholders. Product sees "it works." Engineering sees "it shipped."

Make the tradeoffs explicit:

- "We shipped this with a known accessibility gap affecting X users"
- "This pattern diverges from our system, creating Y maintenance burden"

Document decisions and their consequences.

## Prevention

The best debt is the debt you don't take on:

- Design reviews before development
- Accessibility checks in QA
- Component audits quarterly
- Time allocated for polish

Debt is sometimes necessary. But it should be intentional, not accidental.

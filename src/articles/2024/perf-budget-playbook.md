---
title: "Performance Budget Playbook"
date: 2024-07-14
tags: [performance, web]
description: "How I set, track, and defend performance budgets when timelines get tight."
---

How I set, track, and defend performance budgets when timelines get tight.

## Why Budgets Matter

Performance degrades gradually, then suddenly. Each small addition seems harmless. Another analytics script. Another font. Another animation library. Then one day, your site takes eight seconds to load.

Budgets prevent the boiling frog problem.

## Setting Realistic Limits

I start with user context:

- **Core Web Vitals targets** — Google's thresholds are reasonable baselines
- **Competitor analysis** — What are users accustomed to?
- **Device profiles** — Budget for your real users, not your dev machine

Then I allocate:

- **JavaScript**: 170KB compressed (main bundle)
- **CSS**: 50KB compressed
- **Fonts**: 100KB total
- **Images**: Budget per page, not globally
- **Third parties**: 50KB, and every addition needs justification

## Tracking Automatically

Budgets only work if violations are visible:

```javascript
// In your CI pipeline
if (bundleSize > BUDGET) {
  throw new Error(`Bundle exceeded budget by ${delta}KB`);
}
```

Make failures loud. Make exceptions explicit. Document the reasons.

## Defending Under Pressure

"We just need to add this one tracking pixel."

Every violation has a sponsor. Build relationships before the conflict. Share performance data regularly. Make the cost visible.

> "Adding this will push our LCP from 2.1s to 2.8s. Is that acceptable for this feature?"

Numbers make the tradeoff concrete.

## Recovery Strategies

When budgets slip (and they will):

1. **Audit third parties** — Often the biggest wins
2. **Code-split aggressively** — Load what you need
3. **Optimize images** — Still the low-hanging fruit
4. **Question assumptions** — Does that animation need a library?

Performance is a practice, not a project.


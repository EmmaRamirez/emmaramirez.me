---
title: "Designing Component APIs"
date: 2024-01-22
tags: [components, api-design]
description: "Prop naming, sensible defaults, and the power of good slots."
---

Prop naming, sensible defaults, and the power of good slots.

## The User is a Developer

When you design a component, your user is a developer consuming your API. The same UX principles apply: be clear, be consistent, be forgiving.

A confusing component API creates bugs. A good one prevents them.

## Prop Naming Principles

**Be consistent** — If one component uses `isOpen`, they all should. Not `open`, not `visible`, not `shown`.

**Be specific** — `disabled` beats `state`. `variant` beats `type` when `type` means something in HTML.

**Be predictable** — Follow platform conventions. `onClick` in React. `on:click` in Svelte.

## Sensible Defaults

The most common use case should require the least configuration.

```svelte
<!-- This should work -->
<Button>Click me</Button>

<!-- Options for when you need them -->
<Button variant="secondary" size="small">Click me</Button>
```

If consumers always have to pass the same props, those should be defaults.

## The Power of Slots

Slots (or children in React) are escape hatches that keep APIs simple.

Instead of:

```svelte
<Card 
  title="Hello" 
  subtitle="World"
  headerAction={<Button>Edit</Button>}
  footer={<Link>Read more</Link>}
/>
```

Consider:

```svelte
<Card>
  <Card.Header>
    <h2>Hello</h2>
    <Button>Edit</Button>
  </Card.Header>
  <p>Content here</p>
  <Card.Footer>
    <Link>Read more</Link>
  </Card.Footer>
</Card>
```

Composition over configuration.

## Documentation is API

If your component needs extensive documentation to use, the API might be wrong. The best APIs teach themselves through clear naming and TypeScript definitions.

## Evolution Strategy

APIs are promises. Breaking changes break trust.

Add props, don't remove them. Deprecate gracefully. Provide migration paths. Version when you must.


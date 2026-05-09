---
title: 'Writing Better Commit Messages'
date: 2024-06-10
tags: [workflow, git]
description: 'Small, narrative commits save future you. A quick rubric I follow for clarity.'
---

Small, narrative commits save future you. A quick rubric I follow for clarity.

## The Problem with "misc fixes"

Six months from now, you're debugging a regression. Git bisect narrows it down to a commit. The message says "misc fixes and updates."

You've sabotaged future you.

## The 50/72 Rule

Keep the subject line under 50 characters. Wrap the body at 72. This isn't arbitrary—it's how git and GitHub display commits comfortably.

```
feat: add dark mode toggle to settings

Implements user preference for color scheme with system
detection fallback. Stores preference in localStorage.

Closes #142
```

## Imperative Mood

Write like you're giving the codebase a command:

- ✓ "Add validation to email field"
- ✗ "Added validation to email field"
- ✗ "Adding validation to email field"

The commit tells the code what to do when applied.

## The Why Matters More Than What

The diff shows what changed. The message should explain why.

```
fix: prevent duplicate form submissions

Users on slow connections were seeing double charges
because the submit button remained active during the
API call. Now disables immediately on click.
```

Future you understands the intent, not just the mechanics.

## Small, Atomic Commits

Each commit should do one thing. If you're writing "and" in your message, consider splitting.

Benefits:

- Easier to revert
- Clearer history
- Simpler code review
- Better bisect results

## A Quick Template

```
<type>: <subject>

<body explaining why>

<footer with references>
```

Types I use: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`.

Simple system. Consistent history. Future you says thanks.

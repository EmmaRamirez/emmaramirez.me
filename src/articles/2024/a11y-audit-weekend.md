---
title: "A Weekend Accessibility Audit"
date: 2024-05-05
tags: [accessibility, audit]
description: "I spent 48 hours with a screen reader and came back with a checklist."
---

I spent 48 hours with a screen reader and came back with a checklist.

## The Setup

Friday evening. VoiceOver enabled. Trackpad covered with a post-it. The goal: use my own site the way some of my users do.

The first hour was humbling.

## What Broke Immediately

**Focus management was chaos.** Modal opened, focus stayed on the trigger. Closed the modal, focus went to the top of the page. Users were lost in navigation loops.

**Images lied.** Alt text said "image" or was missing entirely. Decorative images weren't marked as such. The screen reader announced everything.

**Forms were ambiguous.** Labels were visually clear but programmatically disconnected. Error messages appeared but weren't announced.

## The Checklist That Emerged

After fixing the obvious issues, I documented patterns to check for:

1. **Focus order** — Tab through everything. Does it make sense?
2. **Focus visibility** — Can you always see where you are?
3. **Heading hierarchy** — Does it form an outline?
4. **Link text** — Does it make sense out of context?
5. **Alt text** — Descriptive for content, empty for decoration
6. **Form labels** — Programmatically connected, not just visual
7. **Error handling** — Announced, not just colored

## Tools That Helped

- **axe DevTools** — Automated scanning catches low-hanging fruit
- **Wave** — Visual overlay shows structure issues
- **Screen reader** — Nothing replaces the real experience

## The Ongoing Work

Accessibility isn't a checkbox. It's a practice. Now every PR includes manual keyboard testing. Every new component gets screen reader verification.

The weekend changed how I build, permanently.


---
title: "Rubber Ducks and Real Bugs"
date: 2024-01-06
tags: [debugging, habits]
description: "My favorite questions to ask the duck before opening DevTools."
---

My favorite questions to ask the duck before opening DevTools.

## The Duck Method

Rubber duck debugging is famous: explain the problem out loud to a duck, and the solution often appears. But the duck is just a prop. The real technique is structured self-interrogation.

## Questions Before Tools

Before I open DevTools, before I add console.logs, I ask:

### "What exactly do I expect to happen?"

Vague expectations lead to vague debugging. Get specific. "I expect this function to return an array of 3 items with these properties."

### "What is actually happening?"

Again, be specific. "I'm getting undefined." Cool. But also: when? On what input? On which line?

### "What changed?"

If it worked before, something changed. Git diff is often faster than debugging. What commits came between working and broken?

### "What assumptions am I making?"

This one catches the subtle bugs. "I assume the API returns data in this format." "I assume this function is being called." "I assume this variable is in scope."

Write down your assumptions. Check each one.

## The Minimal Reproduction

If I can't answer these questions, I can't debug effectively. Time to create a minimal reproduction:

1. Strip away everything unrelated
2. Hardcode variables
3. Isolate the specific behavior

Often, building the reproduction reveals the bug.

## When to Stop

If you've been stuck for more than 30 minutes:

- Take a break
- Ask someone else
- Sleep on it

Fresh perspective beats exhausted persistence.


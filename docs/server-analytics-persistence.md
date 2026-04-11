# Analytics Persistence And Retention

This document proposes a more durable plan for the `AnalyticsEvent` model and the `performance-analytics` ingestion and summary route.

## Problem

The analytics table is append-only, but the current design does not yet define:

- retention limits
- archival policy
- database-side summaries
- scale expectations for long-lived local or hosted environments

That is fine early on, but it becomes risky once event volume grows.

## Goals

- keep ingestion simple and cheap
- keep summary queries predictable as the table grows
- define how long raw events should live
- avoid letting analytics become an unbounded operational burden

## Current State

Today the route:

- ingests batches with basic normalization and dedupe
- stores raw events in `AnalyticsEvent`
- computes summaries partly in application code after loading recent rows
- performs additional full-table queries such as `count()` and distinct-session counting

The schema already has helpful indexes, but the operational story is still incomplete.

## Recommended Direction

### 1. Define retention now

Pick an explicit retention window for raw events, for example:

- 7 days for noisy local development data
- 30 days for a small hosted internal environment

The exact number matters less than making it explicit.

### 2. Move summaries closer to the database

Summary-style questions should be answered by SQL or pre-aggregated tables rather than pulling rows into application memory and computing everything in the route handler.

Good candidates:

- event counts by kind
- recent session counts
- slowest network events in a time window
- percentile metrics for network and vital events

### 3. Separate raw events from reporting

Use one of these patterns:

- raw events table plus SQL views
- raw events table plus scheduled aggregate tables
- raw events table plus materialized views if the environment supports them well

For this repo, aggregate tables or views are likely the simplest next step.

## Schema Recommendations

### Keep current indexes, then refine based on query shape

The existing indexes are a good starting point. Once the summary queries are explicit, revisit whether additional compound indexes are warranted.

### Consider BRIN or partitioning later

If event volume becomes large and rows are mostly queried by time:

- BRIN on `createdAt` can be attractive
- time-based partitioning becomes reasonable

This is not a first step, but it should be part of the long-term plan.

## Retention Strategy

The simplest approach is a scheduled delete job:

- delete rows older than the retention window
- run on a cadence appropriate to the environment
- emit logs or metrics so cleanup failures are visible

If historical reporting becomes important later, archive before delete.

## Query Strategy

### Near term

- keep raw ingestion as-is
- add explicit SQL or Prisma aggregate queries for summary endpoints
- avoid unnecessary full-table work in request handlers

### Medium term

- introduce a compact rollup table keyed by day, route, and event kind
- use raw events for recent drill-down only
- use rollups for dashboards and counts

## Testing Plan

Add targeted tests for:

- ingestion normalization and dedupe
- retention job cutoff behavior
- summary query correctness for seeded event sets

Avoid trying to unit test every dashboard permutation. Focus on the data seams.

## Risks

### Risk: overengineering a dev-only feature

Mitigation:

- implement retention first
- only add rollups once real query pain appears

### Risk: summary numbers drift from raw data

Mitigation:

- keep aggregate logic small and testable
- define the reporting window and semantics clearly

## Success Criteria

This work is complete when:

- raw event retention is explicit
- summary queries no longer depend on avoidable full-table scans
- the table can grow without silently degrading route performance

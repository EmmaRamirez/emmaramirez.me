---
name: repo-mapbox-geojson-patterns
description: Updates the map feature stack across GeoJSON, typed region metadata, API contracts, and UI blocks. Use when changing Mapbox behavior, region data, map place submissions, or North America map rendering.
---

# Repo Mapbox GeoJSON Patterns

## Use this skill when

- Editing `src/lib/components/blocks/LocationBlock.svelte` or related map UI
- Changing `src/lib/data/mapRegions.ts`
- Updating `src/routes/api/map-places/+server.ts`
- Touching `static/data/north-america-regions.geojson` or `src/lib/types/mapPlaces.ts`

## Source-of-truth split

- Geometry lives in `static/data/north-america-regions.geojson`.
- Typed region metadata lives in `src/lib/data/mapRegions.ts`.
- Client-safe API shapes live in `src/lib/types/mapPlaces.ts`.
- Persistence and serialization live in `src/routes/api/map-places/+server.ts`.

## Rules

1. Keep region IDs aligned between the GeoJSON-backed map and `mapRegions`.
2. Treat `mapRegionById` as the validation index for incoming `regionId` values.
3. Keep `MapPlaceSubmissionPayload` narrow: the current POST shape is `{ name, regionId }`.
4. Keep `MapPlaceRecord` client-safe: serialize dates to ISO strings and preserve the `countryCode` union.
5. Update the API route, type file, and UI together when the payload or record shape changes.

## Current domain assumptions

- Regions cover North America only.
- `countryCode` is currently `'US' | 'CA'`.
- The API only exposes visible places by default and allows broader reads only in dev flows.

## Common follow-through

- Add or update e2e coverage when the visible map behavior changes.
- Add a migration if a map place schema change reaches the database.

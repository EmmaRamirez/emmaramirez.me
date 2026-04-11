# API Error Response Hardening

This document proposes a consistent error-handling policy for server routes under `src/routes/api/`.

## Problem

Several routes currently serialize `String(error)` into JSON responses. That is convenient during development, but it can leak internal implementation details in production.

Examples of leaked details can include:

- database error messages
- driver or adapter failures
- environment configuration problems
- internal class names or stack-adjacent details

## Goals

- keep public error responses safe and predictable
- preserve detailed diagnostics in server logs
- make development debugging still convenient
- reduce repeated per-route error handling logic

## Recommended Policy

### Public response rules

In production:

- return stable, user-safe error messages
- avoid including raw exception details in the JSON body
- use appropriate HTTP status codes

In development:

- optionally include extra detail for fast iteration
- keep the behavior explicit rather than accidental

### Logging rules

Always log the original exception on the server with:

- a route-specific prefix
- enough context to trace the failure
- no accidental exposure to the client

## Recommended Shape

Use a small shared helper for route failures, for example:

```ts
type PublicApiError = {
  error: string;
  code?: string;
};
```

Then centralize behavior like:

- `badRequest(message)`
- `forbidden(message)`
- `notFound(message)`
- `internalServerError(logPrefix, error, publicMessage)`

This keeps route handlers smaller and more consistent.

## Implementation Plan

1. Add a server-only helper module for common API responses.
2. Update routes to stop returning `details: String(error)` by default.
3. Allow opt-in development detail only when explicitly gated.
4. Add a small test around one route to lock in the policy.

## Suggested Response Strategy

### Validation failures

Return:

- clear public message
- `400` status

These are safe to expose because they describe the caller's mistake, not internal failures.

### Missing resource or disabled feature

Return:

- `404` or `403` as appropriate
- concise public message

### Unexpected server failure

Return:

- generic public message
- `500` status

Log the real exception server-side.

## Risks

### Risk: debugging becomes slower in local development

Mitigation:

- include extra detail only in development
- keep route-specific logs readable and searchable

### Risk: each route reimplements the same policy slightly differently

Mitigation:

- use shared helpers
- keep the response shape small and boring

## Success Criteria

This work is complete when:

- production API responses no longer expose raw internal exception details
- server logs still contain enough information to debug failures
- routes follow one consistent error response pattern

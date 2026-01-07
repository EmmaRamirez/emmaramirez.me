# Refactor Opportunities

This document lists areas that could be refactored to improve clarity, maintainability, and performance. It is intentionally high-level and should be updated as the codebase evolves.

## Architecture and Structure
- [x] [P1] Consolidate duplicate utilities into shared modules.
- [x] [P1] Separate data-fetching logic from UI components.
- [ ] [P2] Standardize module boundaries to avoid cross-layer imports.

## Components and UI
- [x] [P1] Extract repeated UI patterns into reusable components.
- [ ] [P2] Normalize component props (names, shapes, defaults).
- [ ] [P2] Reduce component size by splitting large files into focused pieces.

## State and Data Flow
- [ ] [P1] Centralize state where it is shared across multiple views.
- [ ] [P1] Remove redundant derived state and compute on demand.
- [ ] [P2] Replace ad-hoc event chains with a consistent data flow pattern.

## Routing and Navigation
- [ ] [P2] Simplify route-level layout composition.
- [ ] [P2] Remove unused or legacy routes.
- [ ] [P2] Normalize route params and error handling.

## Styling
- [ ] [P2] Consolidate duplicate styles and variables.
- [ ] [P2] Align naming conventions for classes and design tokens.
- [ ] [P2] Remove unused styles and legacy overrides.

## Tooling and Tests
- [ ] [P1] Add missing unit tests for core utilities.
- [ ] [P2] Replace brittle integration tests with more targeted coverage.
- [ ] [P2] Standardize linting/formatting rules across the repo.

## Performance
- [ ] [P1] Reduce unnecessary re-renders and expensive computations.
- [ ] [P2] Lazy-load non-critical modules and assets.
- [ ] [P2] Remove unused dependencies.

## Documentation
- [ ] [P1] Update README and internal docs to match current behavior.
- [ ] [P2] Add examples for tricky APIs and edge cases.
- [ ] [P2] Document architectural decisions and trade-offs.

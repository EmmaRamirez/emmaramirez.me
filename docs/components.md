# Component Library Inventory

This document outlines the components that a **robust UI component library** should include.
They are grouped by category. For components that already exist in this project, a path
to the Svelte implementation is noted.

---

## Foundations

- [x] **Typography primitives (Text, Heading, Code, Link)**
  - Use for consistent text styling across the app.
  - Accessibility: ensure proper semantic tags (h1–h6, p, a) and contrast.
  - Existing: `Typography` → `$lib/components/ui/Typography.svelte`.
- [x] **Color tokens & theming notes**
  - Centralize design tokens (CSS custom properties, Tailwind theme).
  - Accessibility: document contrast ratios and dark-mode behavior.
  - Documentation: `docs/components/theming.md`.
- [x] **Icon**
  - Wrapper for SVG icons with consistent sizing and alignment.
  - Accessibility: `role="img"`, `aria-hidden`, and `aria-label` when needed.
  - Existing: `Icon` → `$lib/components/ui/Icon.svelte`.

---

## Layout & Structure

- [x] **Container / Section / PageShell**
  - Page-level layout primitives for padding, max-width, and background.
  - Existing: `Container` → `$lib/components/ui/Container.svelte`.
  - Existing: `Section` → `$lib/components/ui/Section.svelte`.
  - Existing: `PageShell` → `$lib/components/ui/PageShell.svelte`.
- [x] **Grid / Stack / Flex utilities**
  - Flexible layout primitives for columns, rows, and responsive gaps.
  - Existing: `Grid` → `$lib/components/ui/Grid.svelte`.
  - Existing: `Stack` → `$lib/components/ui/Stack.svelte`.
  - Existing: `Flex` → `$lib/components/ui/Flex.svelte`.
- [x] **Divider / Separator**
  - Horizontal or vertical separators between content blocks.
  - Existing: `Divider` → `$lib/components/ui/Divider.svelte`.
- [x] **Card**
  - Content grouping with optional header/body/footer.
  - Existing: `Card` → `$lib/components/ui/Card.svelte`.

---

## Inputs & Controls

- [x] **Button**
  - Primary, secondary, outline, ghost variants; different sizes.
  - Accessibility: keyboard operable, visible focus ring.
  - Existing: `Button` → `$lib/components/ui/Button.svelte`.
- [x] **ButtonGroup**
  - Group related actions horizontally or vertically.
  - Existing: `ButtonGroup` → `$lib/components/ui/ButtonGroup.svelte`.
- [x] **IconButton**
  - Square or circular button for icons only; label via `aria-label`.
  - Existing: `IconButton` → `$lib/components/ui/IconButton.svelte`.
- [x] **LinkButton / NavButton**
  - Navigation-focused button that renders as `<a>` or integrates with the router.
  - Existing: `LinkButton` → `$lib/components/ui/LinkButton.svelte`.
- [x] **Input (text)**
  - Standard text input with label, hint, and error messaging.
  - Existing: `Input` → `$lib/components/ui/Input.svelte`.
- [x] **Textarea**
  - Multiline text entry with character counts and resize controls.
  - Existing: `Textarea` → `$lib/components/ui/Textarea.svelte`.
- [x] **Select**
  - Native `<select>` or custom listbox for single selection.
  - Existing: `Select` → `$lib/components/ui/Select.svelte`.
- [ ] **Combobox / Autocomplete**
  - Searchable selection with keyboard navigation.
- [x] **Checkbox**
  - Boolean toggle, possibly in groups.
  - Existing: `Checkbox` → `$lib/components/ui/Checkbox.svelte`.
- [x] **Radio**
  - Single-choice selection from a group.
  - Existing: `Radio` → `$lib/components/ui/Radio.svelte`.
- [x] **Switch / Toggle**
  - On/off control with clear visual affordance.
  - Existing: `Switch` → `$lib/components/ui/Switch.svelte`.
- [x] **Slider / RangeSlider**
  - Numeric value selection by dragging a thumb.
  - Existing: `Slider` → `$lib/components/ui/Slider.svelte`.
- [ ] **DatePicker / DateRangePicker**
  - Calendar-based date selection.
- [x] **FileInput**
  - File upload with drag-and-drop support.
  - Existing: `FileInput` → `$lib/components/ui/FileInput.svelte`.
- [x] **SearchField**
  - Input optimized for search, often with an icon and clear button.
  - Existing: `SearchField` → `$lib/components/ui/SearchField.svelte`.

---

## Data Display

- [x] **Avatar**
  - User or entity representation (image, initials, fallback).
  - Existing: `Avatar` → `$lib/components/ui/Avatar.svelte`.
- [x] **Badge / Pill**
  - Small labels for statuses or categories.
  - Existing: `Badge` → `$lib/components/ui/Badge.svelte`.
- [x] **Tag / Chip**
  - Removable tokens for filters, selections, or labels.
  - Existing: `Tag` → `$lib/components/ui/Tag.svelte`.
- [x] **Tooltip**
  - On-hover/on-focus contextual help.
  - Existing: `Tooltip` → `$lib/components/ui/Tooltip.svelte`.
- [ ] **Table**
  - Tabular data with header, rows, sorting, and pagination hooks.
- [x] **DescriptionList (KeyValue)**
  - Name/value pairs for attribute display.
  - Existing: `DescriptionList` → `$lib/components/ui/DescriptionList.svelte`.
- [ ] **List / ListItem**
  - Generic list with optional icons, metadata, and actions.
- [x] **Statistic / KPI**
  - Highlighted numeric metrics with labels and trends.
  - Existing: `Statistic` → `$lib/components/ui/Statistic.svelte`.
- [x] **ProgressBar**
  - Linear representation of completion state.
  - Existing: `ProgressBar` → `$lib/components/ui/ProgressBar.svelte`.
- [x] **Spinner / Loader**
  - Indeterminate loading indicator.
  - Existing: `Spinner` → `$lib/components/ui/Spinner.svelte`.

---

## Feedback & Status

- [x] **Alert / Callout**
  - Inline status messages (info, success, warning, danger).
  - Existing: `Alert` → `$lib/components/ui/Alert.svelte`.
- [ ] **Toast / Snackbar**
  - Ephemeral notifications that stack and auto-dismiss.
- [ ] **Inline validation messages**
  - Field-level feedback tied to inputs.
- [x] **EmptyState**
  - Illustrations and copy for when lists or views have no data.
  - Existing: `EmptyState` → `$lib/components/ui/EmptyState.svelte`.

---

## Navigation

- [ ] **Navbar / AppHeader**
  - Top-level navigation bar with branding and primary actions.
- [ ] **Sidebar / AppShell**
  - Shell layout with persistent navigation on the side.
- [ ] **Tabs**
  - Switch between related views without navigation changes.
- [ ] **Breadcrumbs**
  - Show hierarchical navigation path.
- [ ] **Pagination**
  - Navigate between pages of content.
- [ ] **Stepper / Wizard**
  - Multi-step workflows with progress tracking.

---

## Overlays & Surfaces

- [ ] **Modal / Dialog**
  - Focus-trapped overlay for blocking interactions.
- [x] **Drawer / Sheet**
  - Slide-in panel from edge of screen.
  - Existing: `Drawer` → `$lib/components/ui/Drawer.svelte`.
- [ ] **Popover**
  - Contextual panel anchored to a trigger.
- [ ] **DropdownMenu / ContextMenu**
  - Menu of actions or navigation attached to a trigger.

---

## Interactive & Complex Components

- [ ] **Accordion**
  - Expand/collapse panels for grouped content.
- [ ] **Collapse / Disclosure**
  - Simple show/hide section with a header.
- [ ] **Carousel / Content Slider**
  - Rotate between panels or media items.
- [ ] **Tooltip-rich controls**
  - Icon-only or compact controls relying on tooltips for clarity.
- [ ] **Command palette / Command menu**
  - Fuzzy-searchable menu for actions and navigation.

---

## Existing UI Components in This Project

These components already exist and can be extended or documented further:

- `Alert` → `$lib/components/ui/Alert.svelte`
- `Avatar` → `$lib/components/ui/Avatar.svelte`
- `Badge` → `$lib/components/ui/Badge.svelte`
- `Button` → `$lib/components/ui/Button.svelte`
- `ButtonGroup` → `$lib/components/ui/ButtonGroup.svelte`
- `Card` → `$lib/components/ui/Card.svelte`
- `Checkbox` → `$lib/components/ui/Checkbox.svelte`
- `Container` → `$lib/components/ui/Container.svelte`
- `DescriptionList` → `$lib/components/ui/DescriptionList.svelte`
- `Divider` → `$lib/components/ui/Divider.svelte`
- `Drawer` → `$lib/components/ui/Drawer.svelte`
- `EmptyState` → `$lib/components/ui/EmptyState.svelte`
- `FileInput` → `$lib/components/ui/FileInput.svelte`
- `Flex` → `$lib/components/ui/Flex.svelte`
- `Grid` → `$lib/components/ui/Grid.svelte`
- `Icon` → `$lib/components/ui/Icon.svelte`
- `IconButton` → `$lib/components/ui/IconButton.svelte`
- `Input` → `$lib/components/ui/Input.svelte`
- `LinkButton` → `$lib/components/ui/LinkButton.svelte`
- `PageShell` → `$lib/components/ui/PageShell.svelte`
- `ProgressBar` → `$lib/components/ui/ProgressBar.svelte`
- `Radio` → `$lib/components/ui/Radio.svelte`
- `SearchField` → `$lib/components/ui/SearchField.svelte`
- `Section` → `$lib/components/ui/Section.svelte`
- `Select` → `$lib/components/ui/Select.svelte`
- `Slider` → `$lib/components/ui/Slider.svelte`
- `Spinner` → `$lib/components/ui/Spinner.svelte`
- `Stack` → `$lib/components/ui/Stack.svelte`
- `Statistic` → `$lib/components/ui/Statistic.svelte`
- `Switch` → `$lib/components/ui/Switch.svelte`
- `Tag` → `$lib/components/ui/Tag.svelte`
- `Textarea` → `$lib/components/ui/Textarea.svelte`
- `Tooltip` → `$lib/components/ui/Tooltip.svelte`
- `Typography` → `$lib/components/ui/Typography.svelte`



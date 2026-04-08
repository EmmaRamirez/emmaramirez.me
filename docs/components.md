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
- [x] **Combobox / Autocomplete**
  - Searchable selection with keyboard navigation.
  - Existing: `Combobox` → `$lib/components/ui/Combobox.svelte`.
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
- [x] **DatePicker / DateRangePicker**
  - Calendar-based date selection.
  - Existing: `DatePicker` → `$lib/components/ui/DatePicker.svelte`.
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
- [x] **Table**
  - Tabular data with header, rows, sorting, and pagination hooks.
  - Existing: `Table` → `$lib/components/ui/Table.svelte`.
- [x] **DescriptionList (KeyValue)**
  - Name/value pairs for attribute display.
  - Existing: `DescriptionList` → `$lib/components/ui/DescriptionList.svelte`.
- [x] **List / ListItem**
  - Generic list with optional icons, metadata, and actions.
  - Existing: `List` → `$lib/components/ui/List.svelte`.
  - Existing: `ListItem` → `$lib/components/ui/ListItem.svelte`.
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
- [x] **Toast / Snackbar**
  - Ephemeral notifications that stack and auto-dismiss.
  - Existing: `Toast` → `$lib/components/ui/Toast.svelte`.
- [x] **Inline validation messages**
  - Field-level feedback tied to inputs.
  - Existing: `InlineValidation` → `$lib/components/ui/InlineValidation.svelte`.
- [x] **EmptyState**
  - Illustrations and copy for when lists or views have no data.
  - Existing: `EmptyState` → `$lib/components/ui/EmptyState.svelte`.

---

## Navigation

- [x] **Navbar / AppHeader**
  - Top-level navigation bar with branding and primary actions.
  - Existing: `Navbar` → `$lib/components/ui/Navbar.svelte`.
- [x] **Sidebar / AppShell**
  - Shell layout with persistent navigation on the side.
  - Existing: `Sidebar` → `$lib/components/ui/Sidebar.svelte`.
- [x] **Tabs**
  - Switch between related views without navigation changes.
  - Existing: `Tabs` → `$lib/components/ui/Tabs.svelte`.
- [x] **Breadcrumbs**
  - Show hierarchical navigation path.
  - Existing: `Breadcrumbs` → `$lib/components/ui/Breadcrumbs.svelte`.
- [x] **Pagination**
  - Navigate between pages of content.
  - Existing: `Pagination` → `$lib/components/ui/Pagination.svelte`.
- [x] **Stepper / Wizard**
  - Multi-step workflows with progress tracking.
  - Existing: `Stepper` → `$lib/components/ui/Stepper.svelte`.

---

## Overlays & Surfaces

- [x] **Modal / Dialog**
  - Focus-trapped overlay for blocking interactions.
  - Existing: `Modal` → `$lib/components/ui/Modal.svelte`.
- [x] **Drawer / Sheet**
  - Slide-in panel from edge of screen.
  - Existing: `Drawer` → `$lib/components/ui/Drawer.svelte`.
- [x] **Popover**
  - Contextual panel anchored to a trigger.
  - Existing: `Popover` → `$lib/components/ui/Popover.svelte`.
- [x] **DropdownMenu / ContextMenu**
  - Menu of actions or navigation attached to a trigger.
  - Existing: `DropdownMenu` → `$lib/components/ui/DropdownMenu.svelte`.

---

## Interactive & Complex Components

- [x] **Accordion**
  - Expand/collapse panels for grouped content.
  - Existing: `Accordion` → `$lib/components/ui/Accordion.svelte`.
- [x] **Collapse / Disclosure**
  - Simple show/hide section with a header.
  - Existing: `Collapse` → `$lib/components/ui/Collapse.svelte`.
- [x] **Carousel / Content Slider**
  - Rotate between panels or media items.
  - Existing: `Carousel` → `$lib/components/ui/Carousel.svelte`.
- [x] **Tooltip-rich controls**
  - Icon-only or compact controls relying on tooltips for clarity.
  - Note: Use `Tooltip` + `IconButton` components together.
- [x] **Command palette / Command menu**
  - Fuzzy-searchable menu for actions and navigation.
  - Existing: `CommandPalette` → `$lib/components/ui/CommandPalette.svelte`.

---

## Existing UI Components in This Project

These components already exist and can be extended or documented further:

- `Accordion` → `$lib/components/ui/Accordion.svelte`
- `Alert` → `$lib/components/ui/Alert.svelte`
- `Avatar` → `$lib/components/ui/Avatar.svelte`
- `Badge` → `$lib/components/ui/Badge.svelte`
- `Breadcrumbs` → `$lib/components/ui/Breadcrumbs.svelte`
- `Button` → `$lib/components/ui/Button.svelte`
- `ButtonGroup` → `$lib/components/ui/ButtonGroup.svelte`
- `Card` → `$lib/components/ui/Card.svelte`
- `Carousel` → `$lib/components/ui/Carousel.svelte`
- `Checkbox` → `$lib/components/ui/Checkbox.svelte`
- `Collapse` → `$lib/components/ui/Collapse.svelte`
- `Combobox` → `$lib/components/ui/Combobox.svelte`
- `CommandPalette` → `$lib/components/ui/CommandPalette.svelte`
- `Container` → `$lib/components/ui/Container.svelte`
- `DatePicker` → `$lib/components/ui/DatePicker.svelte`
- `DescriptionList` → `$lib/components/ui/DescriptionList.svelte`
- `Divider` → `$lib/components/ui/Divider.svelte`
- `Drawer` → `$lib/components/ui/Drawer.svelte`
- `DropdownMenu` → `$lib/components/ui/DropdownMenu.svelte`
- `EmptyState` → `$lib/components/ui/EmptyState.svelte`
- `FileInput` → `$lib/components/ui/FileInput.svelte`
- `Flex` → `$lib/components/ui/Flex.svelte`
- `Grid` → `$lib/components/ui/Grid.svelte`
- `Icon` → `$lib/components/ui/Icon.svelte`
- `IconButton` → `$lib/components/ui/IconButton.svelte`
- `InlineValidation` → `$lib/components/ui/InlineValidation.svelte`
- `Input` → `$lib/components/ui/Input.svelte`
- `LinkButton` → `$lib/components/ui/LinkButton.svelte`
- `List` → `$lib/components/ui/List.svelte`
- `ListItem` → `$lib/components/ui/ListItem.svelte`
- `Modal` → `$lib/components/ui/Modal.svelte`
- `Navbar` → `$lib/components/ui/Navbar.svelte`
- `PageShell` → `$lib/components/ui/PageShell.svelte`
- `Pagination` → `$lib/components/ui/Pagination.svelte`
- `Popover` → `$lib/components/ui/Popover.svelte`
- `ProgressBar` → `$lib/components/ui/ProgressBar.svelte`
- `Radio` → `$lib/components/ui/Radio.svelte`
- `SearchField` → `$lib/components/ui/SearchField.svelte`
- `Section` → `$lib/components/ui/Section.svelte`
- `Select` → `$lib/components/ui/Select.svelte`
- `Sidebar` → `$lib/components/ui/Sidebar.svelte`
- `Slider` → `$lib/components/ui/Slider.svelte`
- `Spinner` → `$lib/components/ui/Spinner.svelte`
- `Stack` → `$lib/components/ui/Stack.svelte`
- `Statistic` → `$lib/components/ui/Statistic.svelte`
- `Stepper` → `$lib/components/ui/Stepper.svelte`
- `Switch` → `$lib/components/ui/Switch.svelte`
- `Table` → `$lib/components/ui/Table.svelte`
- `Tabs` → `$lib/components/ui/Tabs.svelte`
- `Tag` → `$lib/components/ui/Tag.svelte`
- `Textarea` → `$lib/components/ui/Textarea.svelte`
- `Toast` → `$lib/components/ui/Toast.svelte`
- `Tooltip` → `$lib/components/ui/Tooltip.svelte`
- `Typography` → `$lib/components/ui/Typography.svelte`

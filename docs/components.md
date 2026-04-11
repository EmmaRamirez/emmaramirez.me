# Component Library Inventory

This document outlines the components that a **robust UI component library** should include.
They are grouped by category. For components that already exist in this project, a path
to the Svelte implementation is noted.

---

## Foundations

- **Typography primitives (Text, Heading, Code, Link)**
  - Use for consistent text styling across the app.
  - Accessibility: ensure proper semantic tags (h1–h6, p, a) and contrast.
  - Existing: `Typography` → `$lib/components/ui/Typography.svelte`.
- **Color tokens & theming notes**
  - Centralize design tokens (CSS custom properties, Tailwind theme).
  - Accessibility: document contrast ratios and dark-mode behavior.
  - Documentation: `docs/components/theming.md`.
- **Icon**
  - Wrapper for SVG icons with consistent sizing and alignment.
  - Accessibility: `role="img"`, `aria-hidden`, and `aria-label` when needed.
  - Existing: `Icon` → `$lib/components/ui/Icon.svelte`.

---

## Layout & Structure

- **Container / Section / PageShell**
  - Page-level layout primitives for padding, max-width, and background.
  - Existing: `Container` → `$lib/components/ui/Container.svelte`.
  - Existing: `Section` → `$lib/components/ui/Section.svelte`.
  - Existing: `PageShell` → `$lib/components/ui/PageShell.svelte`.
- **Grid / Stack / Flex utilities**
  - Flexible layout primitives for columns, rows, and responsive gaps.
  - Existing: `Grid` → `$lib/components/ui/Grid.svelte`.
  - Existing: `Stack` → `$lib/components/ui/Stack.svelte`.
  - Existing: `Flex` → `$lib/components/ui/Flex.svelte`.
- **Divider / Separator**
  - Horizontal or vertical separators between content blocks.
  - Existing: `Divider` → `$lib/components/ui/Divider.svelte`.
- **Card**
  - Content grouping with optional header/body/footer.
  - Existing: `Card` → `$lib/components/ui/Card.svelte`.

---

## Inputs & Controls

- **Button**
  - Primary, secondary, outline, ghost variants; different sizes.
  - Accessibility: keyboard operable, visible focus ring.
  - Existing: `Button` → `$lib/components/ui/Button.svelte`.
- **ButtonGroup**
  - Group related actions horizontally or vertically.
  - Existing: `ButtonGroup` → `$lib/components/ui/ButtonGroup.svelte`.
- **IconButton**
  - Square or circular button for icons only; label via `aria-label`.
  - Existing: `IconButton` → `$lib/components/ui/IconButton.svelte`.
- **LinkButton / NavButton**
  - Navigation-focused button that renders as `<a>` or integrates with the router.
  - Existing: `LinkButton` → `$lib/components/ui/LinkButton.svelte`.
- **Input (text)**
  - Standard text input with label, hint, and error messaging.
  - Existing: `Input` → `$lib/components/ui/Input.svelte`.
- **Textarea**
  - Multiline text entry with character counts and resize controls.
  - Existing: `Textarea` → `$lib/components/ui/Textarea.svelte`.
- **Select**
  - Native `<select>` or custom listbox for single selection.
  - Existing: `Select` → `$lib/components/ui/Select.svelte`.
- **Combobox / Autocomplete**
  - Searchable selection with keyboard navigation.
  - Existing: `Combobox` → `$lib/components/ui/Combobox.svelte`.
- **Checkbox**
  - Boolean toggle, possibly in groups.
  - Existing: `Checkbox` → `$lib/components/ui/Checkbox.svelte`.
- **Radio**
  - Single-choice selection from a group.
  - Existing: `Radio` → `$lib/components/ui/Radio.svelte`.
- **Switch / Toggle**
  - On/off control with clear visual affordance.
  - Existing: `Switch` → `$lib/components/ui/Switch.svelte`.
- **Slider / RangeSlider**
  - Numeric value selection by dragging a thumb.
  - Existing: `Slider` → `$lib/components/ui/Slider.svelte`.
- **DatePicker / DateRangePicker**
  - Calendar-based date selection.
  - Existing: `DatePicker` → `$lib/components/ui/DatePicker.svelte`.
- **FileInput**
  - File upload with drag-and-drop support.
  - Existing: `FileInput` → `$lib/components/ui/FileInput.svelte`.
- **SearchField**
  - Input optimized for search, often with an icon and clear button.
  - Existing: `SearchField` → `$lib/components/ui/SearchField.svelte`.

---

## Data Display

- **Avatar**
  - User or entity representation (image, initials, fallback).
  - Existing: `Avatar` → `$lib/components/ui/Avatar.svelte`.
- **Badge / Pill**
  - Small labels for statuses or categories.
  - Existing: `Badge` → `$lib/components/ui/Badge.svelte`.
- **Tag / Chip**
  - Removable tokens for filters, selections, or labels.
  - Existing: `Tag` → `$lib/components/ui/Tag.svelte`.
- **Tooltip**
  - On-hover/on-focus contextual help.
  - Existing: `Tooltip` → `$lib/components/ui/Tooltip.svelte`.
- **Table**
  - Tabular data with header, rows, sorting, and pagination hooks.
  - Existing: `Table` → `$lib/components/ui/Table.svelte`.
- **DescriptionList (KeyValue)**
  - Name/value pairs for attribute display.
  - Existing: `DescriptionList` → `$lib/components/ui/DescriptionList.svelte`.
- **List / ListItem**
  - Generic list with optional icons, metadata, and actions.
  - Existing: `List` → `$lib/components/ui/List.svelte`.
  - Existing: `ListItem` → `$lib/components/ui/ListItem.svelte`.
- **Statistic / KPI**
  - Highlighted numeric metrics with labels and trends.
  - Existing: `Statistic` → `$lib/components/ui/Statistic.svelte`.
- **ProgressBar**
  - Linear representation of completion state.
  - Existing: `ProgressBar` → `$lib/components/ui/ProgressBar.svelte`.
- **Spinner / Loader**
  - Indeterminate loading indicator.
  - Existing: `Spinner` → `$lib/components/ui/Spinner.svelte`.

---

## Feedback & Status

- **Alert / Callout**
  - Inline status messages (info, success, warning, danger).
  - Existing: `Alert` → `$lib/components/ui/Alert.svelte`.
- **Toast / Snackbar**
  - Ephemeral notifications that stack and auto-dismiss.
  - Existing: `Toast` → `$lib/components/ui/Toast.svelte`.
- **Inline validation messages**
  - Field-level feedback tied to inputs.
  - Existing: `InlineValidation` → `$lib/components/ui/InlineValidation.svelte`.
- **EmptyState**
  - Illustrations and copy for when lists or views have no data.
  - Existing: `EmptyState` → `$lib/components/ui/EmptyState.svelte`.

---

## Navigation

- **Navbar / AppHeader**
  - Top-level navigation bar with branding and primary actions.
  - Existing: `Navbar` → `$lib/components/ui/Navbar.svelte`.
- **Sidebar / AppShell**
  - Shell layout with persistent navigation on the side.
  - Existing: `Sidebar` → `$lib/components/ui/Sidebar.svelte`.
- **Tabs**
  - Switch between related views without navigation changes.
  - Existing: `Tabs` → `$lib/components/ui/Tabs.svelte`.
- **Breadcrumbs**
  - Show hierarchical navigation path.
  - Existing: `Breadcrumbs` → `$lib/components/ui/Breadcrumbs.svelte`.
- **Pagination**
  - Navigate between pages of content.
  - Existing: `Pagination` → `$lib/components/ui/Pagination.svelte`.
- **Stepper / Wizard**
  - Multi-step workflows with progress tracking.
  - Existing: `Stepper` → `$lib/components/ui/Stepper.svelte`.

---

## Overlays & Surfaces

- **Modal / Dialog**
  - Focus-trapped overlay for blocking interactions.
  - Existing: `Modal` → `$lib/components/ui/Modal.svelte`.
- **Drawer / Sheet**
  - Slide-in panel from edge of screen.
  - Existing: `Drawer` → `$lib/components/ui/Drawer.svelte`.
- **Popover**
  - Contextual panel anchored to a trigger.
  - Existing: `Popover` → `$lib/components/ui/Popover.svelte`.
- **DropdownMenu / ContextMenu**
  - Menu of actions or navigation attached to a trigger.
  - Existing: `DropdownMenu` → `$lib/components/ui/DropdownMenu.svelte`.

---

## Interactive & Complex Components

- **Accordion**
  - Expand/collapse panels for grouped content.
  - Existing: `Accordion` → `$lib/components/ui/Accordion.svelte`.
- **Collapse / Disclosure**
  - Simple show/hide section with a header.
  - Existing: `Collapse` → `$lib/components/ui/Collapse.svelte`.
- **Carousel / Content Slider**
  - Rotate between panels or media items.
  - Existing: `Carousel` → `$lib/components/ui/Carousel.svelte`.
- **Tooltip-rich controls**
  - Icon-only or compact controls relying on tooltips for clarity.
  - Note: Use `Tooltip` + `IconButton` components together.
- **Command palette / Command menu**
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
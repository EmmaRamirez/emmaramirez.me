# Color Tokens & Theming

This document outlines the color system and design tokens used throughout the project. All tokens are defined as CSS custom properties in `src/app.css`.

---

## Color Palette

### Caroline Blue
Primary accent color used for interactive elements, links, and primary actions.

| Token | Value | Usage |
|-------|-------|-------|
| `--caroline-blue-base` | `hsla(217, 97%, 76%, 1)` | Base reference |
| `--caroline-blue-100` | `hsl(217, 68%, 63%)` | Lightest variant |
| `--caroline-blue-200` | `hsl(217, 90%, 76%)` | Light variant |
| `--caroline-blue-400` | `hsl(217, 85%, 75%)` | Soft variant |
| `--caroline-blue-500` | `hsla(217, 97%, 76%, 1)` | Default |
| `--caroline-blue-600` | `hsl(217, 78%, 65%)` | Medium |
| `--caroline-blue-700` | `hsl(217, 78%, 60%)` | Primary buttons/links |
| `--caroline-blue-800` | `hsl(217, 78%, 55%)` | Hover state |
| `--caroline-blue-900` | `hsl(217, 78%, 50%)` | Darkest variant |

**Contrast:** Blue tokens from 700+ provide WCAG AA contrast against light backgrounds.

---

### Sandy Tan
Background and surface colors providing a warm, paper-like foundation.

| Token | Value | Usage |
|-------|-------|-------|
| `--sandy-tan-200` | `hsl(36, 38%, 95%)` | Lightest backgrounds |
| `--sandy-tan-300` | `hsl(36, 38%, 90%)` | Card backgrounds |
| `--sandy-tan-400` | `hsl(36, 38%, 90%)` | Subtle surfaces |
| `--sandy-tan-500` | `hsl(36, 38%, 85%)` | Default surface |
| `--sandy-tan-600` | `hsl(36, 38%, 80%)` | Body background |
| `--sandy-tan-700` | `hsl(36, 38%, 75%)` | Elevated surfaces |
| `--sandy-tan-800` | `hsl(36, 38%, 70%)` | Darker surfaces |
| `--sandy-tan-900` | `hsl(36, 38%, 65%)` | Darkest surface |

---

### Transit Yellow
Warning states and highlight accents.

| Token | Value | Usage |
|-------|-------|-------|
| `--transit-yellow-100` | `hsl(47, 100%, 96%)` | Subtle highlights |
| `--transit-yellow-200` | `hsl(47, 100%, 85%)` | Light warning bg |
| `--transit-yellow-300` | `hsl(47, 100%, 80%)` | - |
| `--transit-yellow-400` | `hsl(47, 100%, 75%)` | - |
| `--transit-yellow-500` | `hsl(47, 100%, 78%)` | Default |
| `--transit-yellow-600` | `hsl(47, 100%, 73%)` | - |
| `--transit-yellow-700` | `hsl(47, 100%, 68%)` | - |
| `--transit-yellow-800` | `hsl(47, 100%, 63%)` | Warning text |
| `--transit-yellow-900` | `hsl(47, 100%, 58%)` | Darkest |

---

### Liver Brown
Text and border colors providing strong contrast.

| Token | Value | Usage |
|-------|-------|-------|
| `--liver-brown-500` | `hsl(0, 9%, 32%)` | Borders, secondary text |
| `--liver-brown-600` | `hsl(0, 9%, 27%)` | Muted text |
| `--liver-brown-700` | `hsl(0, 9%, 25%)` | Default text |
| `--liver-brown-800` | `hsl(0, 9%, 20%)` | Strong text |
| `--liver-brown-900` | `hsl(0, 9%, 15%)` | Headings, emphasis |

**Contrast:** All liver-brown tokens from 600+ provide WCAG AAA contrast against sandy-tan backgrounds.

---

### Lawn Green
Success states and positive indicators.

| Token | Value | Usage |
|-------|-------|-------|
| `--lawn-green-500` | `hsl(128, 61%, 47%)` | Default success |
| `--lawn-green-600` | `hsl(128, 61%, 42%)` | - |
| `--lawn-green-700` | `hsl(128, 61%, 37%)` | Success text |
| `--lawn-green-800` | `hsl(128, 61%, 32%)` | - |
| `--lawn-green-900` | `hsl(128, 61%, 27%)` | Darkest |

---

### Accent Colors

Single-use accent colors for specific design elements:

| Token | Value | Usage |
|-------|-------|-------|
| `--eggshell-white-500` | `hsl(40, 38%, 90%)` | Input backgrounds |
| `--blush-pink-500` | `#ED9CEF` | Decorative accents |
| `--light-rose-500` | `#FFCBCB` | Soft highlights |
| `--magic-mint-500` | `#B8FFE5` | Fresh accents |

---

### Language Colors

Colors for programming language indicators:

| Token | Value | Language |
|-------|-------|----------|
| `--lang-svelte` | `#ff3e00` | Svelte |
| `--lang-rust` | `#dea584` | Rust |
| `--lang-elixir` | `#6e4a7e` | Elixir |
| `--lang-typescript` | `#3178c6` | TypeScript |
| `--lang-javascript` | `#f1e05a` | JavaScript |
| `--lang-haskell` | `#5e5086` | Haskell |

---

## Dark Mode

Dark mode is supported via the `.dark` class on the root element. The following semantic tokens automatically adapt:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--background` | `0 0% 100%` | `20 14.3% 4.1%` |
| `--foreground` | `20 14.3% 4.1%` | `60 9.1% 97.8%` |
| `--muted` | `60 4.8% 95.9%` | `12 6.5% 15.1%` |
| `--muted-foreground` | `25 5.3% 44.7%` | `24 5.4% 63.9%` |
| `--border` | `20 5.9% 90%` | `12 6.5% 15.1%` |
| `--primary` | `24 9.8% 10%` | `60 9.1% 97.8%` |
| `--destructive` | `0 72.2% 50.6%` | `0 62.8% 30.6%` |

---

## Accessibility Guidelines

1. **Text Contrast**: Always use `--liver-brown-700` or darker for body text on sandy-tan backgrounds to ensure WCAG AA compliance.

2. **Interactive Elements**: Use `--caroline-blue-700` for primary actions. The hover state (`--caroline-blue-800`) provides sufficient contrast change.

3. **Error States**: Use `text-red-600` (from Tailwind) for error messages, which provides AAA contrast.

4. **Focus Indicators**: All interactive elements should have visible focus rings using the component's focus ring classes.

---

## Usage in Components

### CSS Custom Properties
```css
.my-element {
  color: var(--liver-brown-800);
  background-color: var(--sandy-tan-300);
  border-color: var(--liver-brown-500);
}
```

### Tailwind Arbitrary Values
```html
<div class="text-[var(--liver-brown-800)] bg-[var(--sandy-tan-300)]">
  Content
</div>
```

### Tailwind Theme Colors
For semantic colors defined in `tailwind.config.ts`:
```html
<div class="text-foreground bg-background border-border">
  Content
</div>
```


# Combo UI Editor

<img src="https://vida.guillermovalentin.es/combo/comboui.svg" width="128" height="128" alt="Combo UI" align="right" />

A visual design system editor that lets you create, customize, and sync UI component themes in real-time across your Vue, React, Angular, and Vanilla JS applications.

**[Download the Editor](https://github.com/masweb/combo-ui-editor/releases/)** · **[View on GitHub](https://github.com/masweb/combo-ui-editor)**

---

## How It Works

1. **Design** — Open the desktop editor and visually configure your components: colors, typography, borders, shadows, and more.
2. **Install** — Add the combo-ui package for your framework as an npm dependency.
3. **Build** — Create your app pages using combo-ui CSS classes. Components render with your theme styles automatically.
4. **Sync** — Edit your theme live while watching changes in your own app in real-time.
5. **Ship** — When your theme is ready, export the JSON and bundle it with your app.

---

## Features

### Theme Generator

Add dark/light color pairs and auto-generate a complete theme with consistent variants across every component. Choose typography, border radius, and external/internal shadows for all components in a single motion.

### Live Preview

Connect the editor to any app running combo-ui-vue, combo-ui-react, or combo-ui-angular via WebSocket. Enable live editing and see the result of your changes directly in the client app — no page reload needed.

```
Editor (Tauri 2 Desktop App)
  │  Dexie hooks → debounced buildThemeData() → WebSocket
  ▼
theme-sync-server (port 3001)
  │  Stores current theme, broadcasts to all connected clients
  ├──► Vue runtime — ComboUIPlugin → regenerate CSS
  └──► Vanilla runtime — ComboUX → regenerate CSS
```

Changes are debounced at 300ms, with `broadcastImmediate()` available for real-time color adjustments that skip the debounce.

### Dark Mode Built-in

Every theme comes with dark mode support out of the box. Packages include a customizable `ThemeToggler` component compatible with VueUse and Tailwind dark mode conventions.

### Multi-Framework

| Package | Framework | Status |
|---------|-----------|--------|
| combo-ui-vue | Vue 3 | Available |
| combo-ux-vanilla | Vanilla JS | Planned |
| combo-ui-react | React | Planned |
| combo-ui-angular | Angular | Planned |

All packages consume the same theme JSON, so you can share designs across your entire stack.

### Unlimited Variants

Create themes with an unlimited number of variants per component. The editor is designed to keep a low memory footprint — it only loads variants for the component you're actively editing, not all components at once.

### Typography Control

Manage fonts, sizes, weights, and line-heights globally from the Typography panel, or override per-component and per-form. Google Fonts are loaded automatically from the theme data.

### Auto-Save Persistence

All changes persist automatically to IndexedDB via Dexie. Never lose your work — close the editor and resume anytime.

### BASSCSS & Reset

All themes include [BASSCSS](https://basscss.com/) utility classes for rapid template design, plus a CSS reset for consistent cross-browser rendering.

---

## Supported Components

| Component | Editor | CSS Generation | Vue Component |
|-----------|--------|---------------|---------------|
| Typography | Yes | Yes | — |
| Forms | Yes | Yes | — |
| Button | Yes | Yes | — |
| Card | Yes | Yes | — |
| Alert | Yes | Yes | — |
| Avatar | Yes | Yes | — |
| Progress | Yes | Yes | — |
| Spinner | Yes | Yes | Yes |
| Badge | Yes | Yes | — |
| Chip | Yes | Yes | — |
| Tooltip | Yes | Yes | Yes |
| Popover | Yes | Yes | Yes |
| Table | Yes | Yes | — |
| ListGroup | Yes | Yes | — |
| Accordion | Yes | Yes | — |
| Pagination | Yes | Yes | — |

Components with CSS-only rendering use classes like `cui-button.--primary`. Components marked "Yes" under Vue Component also have a dynamic Vue component for variant-dependent HTML structure or JavaScript behavior.

---

## Theme JSON Structure

The editor exports a flat JSON with the following schema:

```typescript
{
  name: string
  version: string                          // "1.0"
  typography?: {
    globalConfig: TypographyGlobalConfig
    variants: TypographyVariant[]
    selectedVariantIndex: number
  }
  forms?: {
    globalConfig: FormsGlobalConfig
    variants: FormsVariant[]
    selectedVariantIndex: number
    currentState?: string
  }
  buttons?: { variants: ButtonVariant[]; selectedVariantIndex: number }
  cards?: { ... }
  alerts?: { ... }
  spinners?: { ... }
  // ... one key per component
}
```

---

## CSS Generation

Each package follows the same CSS generation pipeline:

1. `ComboUI.init()` loads the theme from URL, object, or file
2. For each component with variants:
   - Load Google Fonts from variant data
   - Call `generate[Component]CSS(variants, globalConfig)`
   - Inject combined CSS into `<style id="cui-styles">`

CSS uses custom properties for theming:

- **Base class** `.cui-component` declares `--cui-*` custom properties
- **Variant class** `.cui-component.--variant-name` overrides those properties
- **Dark mode** `body[color-scheme="dark"] .cui-component.--variant-name`

Injection order: Reset → Base styles → Basscss → Component CSS

---

## Download

[Latest Release](https://github.com/masweb/combo-ui-editor/releases/)

Available for macOS as a Tauri 2 desktop application.

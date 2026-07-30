# Aurora Themes Documentation

Aurora supports custom themes that allow users to personalize the application without modifying Aurora's source code.

Themes are lightweight CSS files with Aurora metadata. Users can create, install, import, export, and share themes with the Aurora community.

---

# Theme Locations

Aurora automatically loads themes from the `themes` directory.

## Windows

```
%APPDATA%\aurora\themes
```

## macOS

```
~/Library/Application Support/aurora/themes
```

## Linux

```
~/.config/aurora/themes
```

Create the folder if it does not exist.

Example:

```
themes/
├── tokyo-night.css
├── catppuccin.css
└── nord.css
```

---

# Creating a Theme

A theme is a normal CSS file with Aurora metadata at the top.

Example:

```css
/*
@aurora-theme
{
  "id": "tokyo-night",
  "name": "Tokyo Night",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "A Tokyo Night inspired theme for Aurora.",
  "variant": "dark",
  "preview": "#1a1b26"
}
*/

:root {
  --aurora-bg: #1a1b26;
  --aurora-surface: #16161e;
  --aurora-surface-muted: #24283b;

  --aurora-text: #c0caf5;
  --aurora-text-muted: #a9b1d6;

  --aurora-border: rgba(255,255,255,0.1);

  --aurora-hover: rgba(255,255,255,0.08);
}
```

The metadata block allows Aurora to display information about the theme inside Settings.

---

# Theme Metadata

Every theme should include an `@aurora-theme` metadata block.

## Required fields

## `id`

Unique identifier for the theme.

Example:

```json
"id": "tokyo-night"
```

Rules:

- Must be unique
- Use lowercase letters
- Use hyphens instead of spaces
- Avoid special characters

---

## `name`

The display name shown in Aurora.

Example:

```json
"name": "Tokyo Night"
```

---

# Optional Fields

## `author`

Theme creator.

Example:

```json
"author": "Aurora Community"
```

---

## `version`

Theme version.

Example:

```json
"version": "1.0.0"
```

Useful when sharing updated themes.

---

## `description`

Short explanation shown in the theme card.

Example:

```json
"description": "A dark blue theme inspired by Tokyo Night."
```

---

## `variant`

Defines the theme style.

Supported values:

```json
"dark"
```

or:

```json
"light"
```

Example:

```json
"variant": "dark"
```

---

## `preview`

Theme preview color displayed in Aurora Settings.

Example:

```json
"preview": "#1a1b26"
```

---

# Installing Themes

Themes can be installed manually.

1. Download a theme `.css` file.
2. Copy it into the Aurora themes folder.
3. Restart Aurora.
4. Open:

```
Settings → Appearance → Themes
```

5. Select the theme.

Aurora automatically discovers valid theme files.

---

# Importing Themes

Aurora also supports theme importing.

From:

```
Settings → Appearance → Themes
```

Use:

```
Import Theme
```

Aurora will add the theme to your installed themes.

---

# Exporting Themes

Custom themes can be exported from Aurora.

Exported themes include:

- Theme CSS
- Metadata
- Custom styling

This makes it easy to share themes with other Aurora users.

---

# Aurora CSS Variables

Aurora themes are based on CSS variables.

## Background

```css
--aurora-bg
```

Main application background.

Example:

```css
--aurora-bg: #1a1b26;
```

---

## Surface

```css
--aurora-surface
```

Cards, panels, and containers.

Example:

```css
--aurora-surface: #16161e;
```

---

## Muted Surface

```css
--aurora-surface-muted
```

Secondary backgrounds.

Example:

```css
--aurora-surface-muted: #24283b;
```

---

## Text

```css
--aurora-text
```

Primary text color.

Example:

```css
--aurora-text: #c0caf5;
```

---

## Muted Text

```css
--aurora-text-muted
```

Secondary text.

Example:

```css
--aurora-text-muted: #a9b1d6;
```

---

## Borders

```css
--aurora-border
```

Used for separators and outlines.

Example:

```css
--aurora-border: rgba(255,255,255,0.1);
```

---

## Hover

```css
--aurora-hover
```

Used for hover states.

Example:

```css
--aurora-hover: rgba(255,255,255,0.08);
```

---

# Custom Component Styling

Themes can override Aurora components directly.

Example:

```css
.aurora-card {
  border-radius: 20px;
}

.aurora-button-primary {
  background: #7aa2f7;
}
```

Common classes:

| Class | Description |
|-|-|
| `.aurora-card` | Cards and containers |
| `.aurora-glass` | Glass panels |
| `.aurora-button` | Secondary buttons |
| `.aurora-button-primary` | Primary actions |
| `.aurora-input` | Inputs and text areas |
| `.aurora-sidebar-item` | Sidebar buttons |
| `.aurora-row` | List rows |

---

# Testing a Theme

1. Place your theme CSS file into Aurora's themes folder.
2. Restart Aurora.
3. Open:

```
Settings → Appearance → Themes
```

4. Apply your theme.

The theme will be active immediately.

---

# Recommended Practices

## Use Aurora variables

Prefer:

```css
background: var(--aurora-surface);
```

instead of:

```css
background: #181825;
```

This keeps themes compatible with future Aurora updates.

---

## Avoid global overrides

Avoid:

```css
* {
  color: red;
}
```

Prefer:

```css
.aurora-button {
  color: red;
}
```

---

## Keep themes lightweight

Themes should only contain styling.

Do not include:

- JavaScript
- HTML
- External imports
- Tracking code

---

# Built-in Themes

Aurora includes several built-in themes:

- Aurora
- Light Aurora
- Dark
- AMOLED

Future releases may add more official themes.

---

# Future Theme Features

Planned improvements:

- More theme variables
- Better theme previews
- Community theme sharing
- Improved import/export workflow
- Automatic theme updates
- More customization options

---

Happy theming! 🎨
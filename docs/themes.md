# Aurora Themes Documentation

Aurora supports custom themes that allow users to personalize the application without modifying Aurora's source code.

Themes are simple CSS files with metadata. Users can create, install, and share themes with the Aurora community.

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
├── catppuccin.css
├── tokyo-night.css
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
  "id": "my-theme",
  "name": "My Theme",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "A custom Aurora theme.",
  "variant": "dark"
}
*/

:root {
  --aurora-bg: #11111b;
  --aurora-surface: #181825;
  --aurora-surface-muted: #313244;

  --aurora-text: #cdd6f4;
  --aurora-text-muted: #a6adc8;

  --aurora-border: rgba(255,255,255,0.1);
}
```

The metadata block tells Aurora how to display the theme.

---

# Theme Metadata

Every theme should include an `@aurora-theme` metadata block.

## Required fields

### `id`

Unique identifier for the theme.

Example:

```json
"id": "catppuccin-macchiato"
```

Rules:

- Must be unique
- Use lowercase letters
- Use hyphens instead of spaces

---

### `name`

The display name shown in Aurora.

Example:

```json
"name": "Catppuccin Macchiato"
```

---

## Optional fields

### `author`

Theme creator.

Example:

```json
"author": "Catppuccin Community"
```

---

### `version`

Theme version.

Example:

```json
"version": "1.0.0"
```

---

### `description`

Short explanation of the theme.

Example:

```json
"description": "A soothing dark theme inspired by Catppuccin."
```

---

### `variant`

Theme type.

Supported values:

```json
"dark"
```

or

```json
"light"
```

Example:

```json
"variant": "dark"
```

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
--aurora-bg: #1e1e2e;
```

---

## Surface

```css
--aurora-surface
```

Cards, panels, and containers.

Example:

```css
--aurora-surface: #181825;
```

---

## Muted Surface

```css
--aurora-surface-muted
```

Secondary backgrounds.

Example:

```css
--aurora-surface-muted: #313244;
```

---

## Text

```css
--aurora-text
```

Primary text color.

Example:

```css
--aurora-text: #cdd6f4;
```

---

## Muted Text

```css
--aurora-text-muted
```

Secondary text.

Example:

```css
--aurora-text-muted: #a6adc8;
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

# Custom Component Styling

Themes can also override Aurora components directly.

Example:

```css
.aurora-card {
  border-radius: 12px;
}

.aurora-button-primary {
  background: #89b4fa;
}
```

Common classes:

| Class | Description |
|---|---|
| `.aurora-card` | Cards and containers |
| `.aurora-glass` | Glass panels |
| `.aurora-button` | Secondary buttons |
| `.aurora-button-primary` | Primary actions |
| `.aurora-input` | Inputs and text areas |
| `.aurora-sidebar-item` | Sidebar buttons |
| `.aurora-row` | List rows |

---

# Testing a Theme

1. Put your CSS file into the Aurora themes folder.
2. Restart Aurora.
3. Open:

```
Settings → Appearance → Theme
```

4. Select your theme.

Changes are applied immediately.

---

# Sharing Themes

To share a theme:

1. Create a `.css` file.
2. Add Aurora metadata.
3. Test it in Aurora.
4. Share the file.

Example:

```
aurora-tokyo-night.css
```

Users only need to place the file into their themes folder.

---

# Recommended Practices

## Use Aurora variables

Prefer:

```css
background: var(--aurora-surface);
```

over:

```css
background: #181825;
```

This keeps themes compatible with future Aurora updates.

---

## Avoid modifying global elements unnecessarily

Avoid:

```css
* {
  color: red;
}
```

Prefer targeted selectors:

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
- external imports
- tracking code

---

# Built-in Theme Examples

Aurora includes themes inspired by popular desktop environments:

- Aurora
- Light Aurora
- AMOLED
- Tokyo Night
- Catppuccin

Community themes can extend this collection.

---

# Future Theme Features

Planned improvements:

- Theme marketplace
- Theme preview images
- Automatic theme updates
- Theme import/export
- More customization variables
- Plugin-style extensions

---

Happy theming! 🎨
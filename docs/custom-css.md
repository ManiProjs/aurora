# Aurora Custom CSS Documentation

Aurora allows you to customize the appearance of the application using your own CSS. Custom CSS is applied on top of Aurora's default design system, allowing you to change colors, layouts, effects, and component styles without modifying the source code.

## Opening Custom CSS

1. Open **Settings**.
2. Go to **Appearance**.
3. Find the **Custom CSS** editor.
4. Write or paste your CSS.
5. Changes are applied automatically.

Aurora stores your CSS locally, so your customization remains after restarting the app.

---

# Aurora Design Variables

Aurora uses CSS variables for its core theme system.

You can override these variables to create complete themes.

```css
:root {
  --aurora-bg: #09090b;
  --aurora-surface: #18181b;
  --aurora-surface-muted: #27272a;

  --aurora-text: #ffffff;
  --aurora-text-muted: #a1a1aa;

  --aurora-border: rgba(255,255,255,0.1);
}
```

## Variables

| Variable | Description |
|---|---|
| `--aurora-bg` | Main application background |
| `--aurora-surface` | Cards and panels |
| `--aurora-surface-muted` | Secondary surfaces |
| `--aurora-text` | Primary text color |
| `--aurora-text-muted` | Secondary text color |
| `--aurora-border` | Border color |

Example:

```css
:root {
  --aurora-bg: #1e1e2e;
  --aurora-surface: #313244;
  --aurora-text: #cdd6f4;
}
```

---

# Aurora Classes

Aurora provides reusable classes that you can customize.

## Background

```css
.aurora-background {
  background: var(--aurora-bg);
}
```

Example:

```css
.aurora-background {
  background: linear-gradient(
    135deg,
    #1e1e2e,
    #181825
  );
}
```

---

## Cards

```css
.aurora-card
```

Used for album cards and content containers.

Example:

```css
.aurora-card {
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,.3);
}
```

---

## Glass Panels

```css
.aurora-glass
```

Used for translucent UI elements.

Example:

```css
.aurora-glass {
  backdrop-filter: blur(30px);
  background: rgba(255,255,255,.08);
}
```

---

## Buttons

Primary buttons:

```css
.aurora-button-primary
```

Normal buttons:

```css
.aurora-button
```

Example:

```css
.aurora-button-primary {
  background: #cba6f7;
  color: #11111b;
}
```

---

## Sidebar

Sidebar items:

```css
.aurora-sidebar-item
```

Active sidebar item:

```css
.aurora-sidebar-item-active
```

Example:

```css
.aurora-sidebar-item-active {
  background: rgba(203,166,247,.2);
}
```

---

# Creating a Theme

A theme is simply a collection of CSS overrides.

Example: Catppuccin Macchiato

```css
:root {
  --aurora-bg: #24273a;
  --aurora-surface: #363a4f;

  --aurora-text: #cad3f5;
  --aurora-text-muted: #a5adcb;

  --aurora-border: rgba(202,211,245,.12);
}
```

You can share themes by copying your Custom CSS content.

---

# Advanced Customization

## Animations

Aurora uses normal CSS animations.

Example:

```css
.aurora-card {
  transition: transform .3s ease;
}

.aurora-card:hover {
  transform: translateY(-5px);
}
```

---

## Changing Fonts

Example:

```css
body {
  font-family: "JetBrains Mono", monospace;
}
```

---

## Changing Scrollbars

Example:

```css
.aurora-scrollbar::-webkit-scrollbar-thumb {
  background: #cba6f7;
}
```

---

# Tips

- Use `!important` only when overriding Tailwind styles.
- Keep backups of your themes before making large changes.
- Test CSS changes gradually.
- Invalid CSS may be ignored by the browser.

---

# Example Themes

Aurora works well with:

- Catppuccin
- Tokyo Night
- Dracula
- Nord
- Gruvbox
- Solarized

Create your own theme and make Aurora yours.
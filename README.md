# Aurora

<div align="center">

## A beautiful, modern desktop client for Navidrome

Built with Electron, React, TypeScript, Tailwind CSS, and Framer Motion.

> ⚠️ Aurora is currently in **beta**. Features may change, bugs may exist, and breaking changes can happen between releases.

[Features](#features) •
[Customization](#customization) •
[Installation](#installation) •
[Development](#development) •
[Roadmap](#roadmap)

</div>

---

## ✨ About

Aurora is a modern desktop music player built specifically for **Navidrome**.

Instead of simply wrapping the Navidrome web interface, Aurora provides a native desktop experience with a beautiful interface, smooth animations, powerful playback controls, and deep customization.

Aurora focuses on making your personal music library feel like a first-class desktop application.

---

# Features

## 🎵 Music Playback

- Stream music directly from your Navidrome server
- Browse albums, artists, and songs
- Smart queue management
- Previous / next song controls
- Seek and volume control
- Continue listening history
- Automatic playback continuation

---

## 🎨 Modern Interface

- Glassmorphism-inspired design
- Dynamic album artwork backgrounds
- Smooth transitions and animations
- Responsive layouts
- Native desktop experience
- Custom themes
- Custom CSS support

---

## 📝 Lyrics

- Automatic synchronized lyrics
- LRCLIB integration
- Auto-scrolling lyrics
- Current lyric highlighting
- Click lyrics to seek playback

---

## 🎧 Queue Management

- View current queue
- Reorder songs
- Remove tracks
- Highlight currently playing song
- Animated queue updates

---

## 🔒 Secure Authentication

- Secure credential storage
- System keychain integration
- No plain-text password storage
- Persistent login sessions

---

## 💬 Integrations

### Discord Rich Presence

Aurora can display your currently playing song on Discord:

- Song title
- Artist
- Album information
- Playback activity

---

# 🎨 Customization

Aurora supports custom themes and CSS customization.

You can modify the interface directly from:

```
Settings → Appearance → Custom CSS
```

Example:

```css
.aurora-card {
  border-radius: 20px;
  backdrop-filter: blur(30px);
}

.aurora-button-primary {
  background: #89b4fa;
}
```

Custom CSS allows you to create your own themes, redesign components, and personalize Aurora.

---

# Screenshots

Coming soon.

---

# Installation

Download the latest release from GitHub Releases.

Supported platforms:

- macOS (Apple Silicon)
- Windows (x64)
- Linux (x64)

---

# Development

Clone the repository:

```bash
git clone https://github.com/ManiProjs/aurora.git

cd aurora
```

Install dependencies:

```bash
npm install
```

Start the development build:

```bash
npm run start
```

Create a production build:

```bash
npm run make
```

---

# Documentation

- [Custom CSS](/docs/custom-css.md)

# Tech Stack

Aurora is built using:

- Electron
- Electron Forge
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand
- Lucide Icons
- Navidrome API
- LRCLIB API

---

# Roadmap

## Planned Features

- Playlist management
- More theme presets
- Advanced custom CSS editor
- More customization options
- Improved library browsing
- More integrations

---

# Contributing

Contributions, bug reports, and feature requests are welcome.

You can help by:

- Reporting bugs
- Suggesting features
- Improving documentation
- Opening pull requests

---

# License

Aurora is released under the MIT License.

---

<div align="center">

Made with ❤️ by **Mani Arasteh**

If Aurora improves your music experience, consider giving the repository a ⭐.

</div>
# Locus TMDB Reviewer

<div align="center">

![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)
![TMDB API](https://img.shields.io/badge/TMDB-API_v3-01b4e4.svg)
![Type](https://img.shields.io/badge/Platform-Static_Web_App-blue.svg)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-emerald.svg)

**A sleek, self-hosted web app and 1-click browser bookmarklet to extract metadata from TMDB and assemble custom-formatted Markdown reviews.**

[Features](#features) • [Quick Start](#quick-start) • [Bookmarklet Setup](#bookmarklet-setup) • [Template Guide](#customizing-your-review-template) • [Licensing & TMDB](#license--attribution)

</div>

---

## Overview

**Locus TMDB Reviewer** turns any Movie or TV Show page on [The Movie Database (TMDB)](https://www.themoviedb.org/) into a structured Markdown review file ready for your digital garden, personal blog, or static site generator (Hugo, Jekyll, Astro, Obsidian, Quartz, Eleventy, etc.).

It was created because there were bookmarklets for TMDB, but none that were easy to use and customize for my own needs. Locus TMDB Reviewer lets you quickly review and rate movies and tv shows on the go, or at home, with just a few clicks.

### Scope & Evolution

Originally prototyped as `locus-movies`—a heavier full-stack Next.js, NextAuth, and Docker containerized setup—the project was radically simplified and refocused into **Locus TMDB Reviewer** (`locus-bookmarklet`). By eliminating complex backends, databases, and Docker overhead in favor of a lean, zero-dependency client-side architecture, Locus delivers an effortless 1-click review experience that runs on GitHub Pages, Cloudflare Pages, or a 1-line local server, storing your API keys and templates privately in your browser.

Locus TMDB Reviewer is built as a **pure client-side static web application**:

- **Zero Backend**: Runs on GitHub Pages, Cloudflare Pages, any web server, or locally on your machine.
- **100% Private**: Your TMDB API key and custom templates are stored securely in your browser's `localStorage`—they never touch an intermediary server.
- **1-Click Bookmarklet**: Click your bookmarklet while browsing TMDB to immediately pull metadata into your review template.
- **TMDB Compliant**: Includes an unobtrusive footer featuring project links and official TMDB API attribution.

---

## Features

- 📑 **Universal Template Engine**: Reads templates from `ttm-template/` or lets you live-edit and save templates directly in the browser preferences.
- ⚙️ **Collapsible Preferences Drawer**: Seamlessly configure your TMDB API key, auto-detect your generator URL, and customize templates without visual clutter.
- 📺 **Movies, TV Shows & Seasons**: Full support for both feature films and episodic television series (including season-specific posters, air dates, and titles).
- 🏷️ **Customizable Slug & Filenames**: Automatically derives clean slugs from titles and IDs (e.g. `dune-part-two-movie-693134`), fully editable before export.
- 📋 **1-Click Copy & Download**: Live Markdown syntax preview with instant clipboard copying or `.md` file download named `<premiereDate>-<slug>.md`.
- 🔖 **Smart Bookmarklet Companion**: Auto-detects your active hosting address and provides easy drag-and-drop or manual bookmark installation.

---

## Quick Start

### Option 1: Deploy to GitHub Pages (Recommended)

Host Locus TMDB Reviewer online for free so your bookmarklet works seamlessly across **Edge, Chrome, Safari, Firefox, and mobile** with zero setup:

1. Push this repository to GitHub (`git push origin main`).
2. In your repository on GitHub ([coach-punk/locus-bookmarklet](https://github.com/coach-punk/locus-bookmarklet)), go to **Settings &rarr; Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at: **[https://coach-punk.github.io/locus-bookmarklet/](https://coach-punk.github.io/locus-bookmarklet/)**.
5. Open your live URL, click the gear icon (**⚙️**) in the top-right, enter your free [TMDB v3 API Key](https://www.themoviedb.org/settings/api), and save!

### Option 2: Run on a Local Web Server

If you prefer running Locus locally on your computer:

1. In this project directory, run a lightweight HTTP server:

   ```bash
   python3 -m http.server 8000
   ```

2. Open **`http://localhost:8000/`** (or `http://localhost:8000/index.html`) in your browser.
3. Configure your TMDB API Key in Preferences (**⚙️**).

> [!TIP]
> **Why not open `index.html` directly via `file:///`?**
> Modern Chromium browsers (Microsoft Edge, Google Chrome, Brave) enforce strict security sandboxing that prevents JavaScript on HTTPS websites (like `themoviedb.org`) from opening local `file:///` URLs. Serving Locus over HTTP(S)—via GitHub Pages or localhost—ensures the bookmarklet launches cleanly every time.

---

## Bookmarklet Setup

The bookmarklet allows you to generate a markdown review in a single click while browsing any TMDB movie or TV series.

1. Open your hosted or local Locus page.
2. Click the gear icon (**⚙️**) &rarr; select the **Bookmarklet** tab.
3. Ensure your **Generator Target URL** matches where Locus is running (click **Auto-Detect** to fill automatically).
4. **Install**:
   - **Drag & Drop**: Drag the purple **TMDB to MD** button directly to your browser's Bookmarks/Favorites bar.
   - **Manual**: Click **Copy Bookmarklet Code**, create a new bookmark in your browser, and paste the code into the bookmark URL field.
5. **Usage**:
   - Navigate to any movie or TV show page on TMDB (e.g. `https://www.themoviedb.org/movie/271110` or `https://www.themoviedb.org/tv/1429`).
   - Click your bookmarklet.
   - Locus opens in a new tab with the title, posters, year, trailer, and metadata pre-loaded and formatted into your Markdown template!

*(If Edge or Chrome shows a "Pop-up blocked" icon in the address bar on your first click, simply click the icon and select "Always allow pop-ups and redirects from themoviedb.org".)*

---

## Customizing Your Review Template

Locus loads its starting layout from `ttm-template/<premiereDate>-<slug>.txt` (or `.md`). You can also edit and save your active template directly inside Preferences (**⚙️** &rarr; **Template**).

### Front Matter Freedom

The YAML front matter block between the `---` delimiters can be adapted to any schema:

- Add fields like `author`, `draft`, `tags`, `categories`, `layout`, or custom taxonomy.
- Rearrange, rename, or omit any keys.
- Place any of the supported template tags in the front matter or throughout the body.

### Default Template

```markdown
---
title: <title>
description: <original_title>
date: <release_date>
category: reviews
tags:
    - movies
    - reviews
trailer: <youtubeUrl>
rating: <rating_num>

---

## <user_rating>

### <tagline>

![Poster](<posterUrl>)

**Overview**

 > <overview>

**TMDB**: <tmdbUrl>

**Notes**: <user_notes>
```

### Supported Template Tags

#### User Input Tags

| Tag | Description | Example Output |
| :--- | :--- | :--- |
| `<user_rating>` | Your star rating | `★★★★` |
| `<rating_num>` | Your numeric rating (0–5) | `4` |
| `<user_notes>` | Personal notes or review commentary | `Superb direction and cinematography.` |
| `<slug>` | The editable slug for filenames and URLs | `oppenheimer-movie-872585` |

#### Core TMDB Metadata Tags

| Tag | Description | Example Output |
| :--- | :--- | :--- |
| `<title>` | Clean title (colons escaped with `&#58;` for YAML safety) | `Mission&#58; Impossible` |
| `<original_title>` | Original native title | `Mission: Impossible` |
| `<overview>` / `<description>` | Official plot synopsis | `An American agent, under false suspicion...` |
| `<release_date>` / `<premiereDate>` | Release date (YYYY-MM-DD) | `1996-05-22` |
| `<year>` | 4-digit release year | `1996` |
| `<tagline>` | Promotional tagline | `Expect the Impossible.` |
| `<posterUrl>` | High-resolution poster URL (`w500`) | `https://image.tmdb.org/t/p/w500/...jpg` |
| `<backdropUrl>` | Backdrop wallpaper URL (`w1280`) | `https://image.tmdb.org/t/p/w1280/...jpg` |
| `<youtubeUrl>` | Official YouTube trailer link | `https://www.youtube.com/watch?v=...` |
| `<tmdbUrl>` | Direct URL to the TMDB resource | `https://www.themoviedb.org/movie/954` |
| `<genres>` | Comma-separated genres | `Action, Adventure, Thriller` |
| `<voteAverage>` | TMDB community score | `7.0` |

#### Dynamic TMDB Fields

Any top-level property returned by the [TMDB API][tmdb-docs] can also be referenced inside angle brackets:

- `<runtime>` — Duration in minutes (e.g. `110`)
- `<budget>` — Production budget in USD (e.g. `80000000`)
- `<revenue>` — Global box office in USD (e.g. `457696359`)
- `<status>` — Release status (e.g. `Released`)
- `<imdb_id>` — IMDB identifier (e.g. `tt0117060`)
- `<homepage>` — Official movie website link

---

## Project Structure

```text
locus-bookmarklet/
├── index.html            # Main web application (GitHub Pages entry point)
├── tmdb-to-markdown.html # Web application (alternate entry point)
├── locus.js              # Standalone bookmarklet snippet
├── ttm-template/         # Default template directory
│   └── <premiereDate>-<slug>.txt
├── example/              # Sample generated review outputs
├── LICENSE               # MIT License & TMDB compliance notice
└── readme.md             # Project documentation
```

---

## License & Attribution

### Software License

This project is open-source software licensed under the [MIT License](LICENSE).

### TMDB Attribution

This product uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.

All film and television metadata, posters, artwork, and trademarks are the property of their respective copyright holders and are provided via [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api) under the [TMDB API Terms of Use](https://www.themoviedb.org/documentation/api/terms-of-use).

---

[tmdb-docs]: https://developer.themoviedb.org/reference/movie-details

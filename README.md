# Productiv

A personal productivity and knowledge management web application. Single-page app with a dark premium UI inspired by Linear and Notion.

## Features

- **Dashboard**: Quick inbox capture, daily task management with priorities, Pomodoro timer (25/5), weekly calendar with .ics import
- **Projects Portfolio**: Spaces > Projects > Tasks hierarchy, dynamic progress bars, status filtering (Active / On Hold / Done)
- **Notes & Meetings**: Rich notes with tags, markdown-lite formatting, meeting mode with participants/decisions/action items, convert text to tasks
- **Logbook**: Completed task history with time and project filters
- **Settings**: Full data export/import (JSON), masked API key storage
- **Authentication**: PIN-based owner access, read-only guest mode
- **Command Palette**: Global Ctrl+K for quick search and capture

## Tech Stack

- React 18 + TypeScript (Vite)
- Tailwind CSS
- Lucide React icons
- localStorage persistence
- Zero backend, 100% client-side

## Setup

```bash
npm install
npm run dev
```

## Deployment

Deployed automatically to GitHub Pages via GitHub Actions on push to `main`.

To deploy manually:

```bash
npm run build
```

The `dist/` folder contains the static build.

## Authentication

- **Owner mode**: Enter PIN `04101920` for full read/write access
- **Guest mode**: Browse all data in read-only mode

> PIN authentication will be moved to environment variable in a future update.

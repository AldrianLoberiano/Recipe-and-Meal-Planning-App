# Recipe and Meal Planning App

Recipe and Meal Planning App is a Vite + React single-page application for managing recipes, building weekly meal plans, and generating grocery lists.

## Overview

The project includes:

- A client app (React, React Router, Tailwind) with recipe CRUD, meal planning, templates, drag-and-drop, and nutrition summaries.
- A lightweight Node/Express API for syncing recipes to MySQL.
- SQL scripts for MySQL schema initialization (no default seed records).

## Current Features

- Public pages: home, login, register.
- App pages: dashboard, recipes, recipe detail, recipe form, recipe import, meal planner, grocery list, favorites.
- Recipe categories: breakfast, lunch, dinner, snack, drinks, dessert, fruits.
- Meal slots include all categories above.
- Meal planner drag-and-drop between slots/days.
- Slot-based recipe picker filtering:
  breakfast slot shows breakfast recipes only, lunch shows lunch only, dinner shows dinner only, and the same behavior applies to snack, drinks, dessert, and fruits.
- Weekly nutrition totals and daily averages.
- Grocery list generation from selected meals.
- Recipe import parser with editable parsed output.
- Optional recipe sync to MySQL through API endpoint.

## Account Access

Create an account from the Register page and sign in with your own credentials.

## Tech Stack

- React 18
- React Router 7
- Vite 6
- Tailwind CSS 4
- Radix UI component primitives
- React DnD
- Recharts
- Supabase client (frontend integration)
- Express + mysql2 (server)

## Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm 9+
- Optional: MySQL/XAMPP for local API + database workflow

## Environment Variables

Create `.env` from `.env.example`.

Required/used variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`
- `MYSQL_URL`
- `MYSQL_POOL_LIMIT`
- `MYSQL_DATABASE`
- `API_PORT`
- `DATABASE_URL` (kept for compatibility)
- `DATABASE_SSL` (kept for compatibility)

## Run Locally (Development)

1. Install dependencies.

```bash
npm install
```

2. Start the frontend dev server.

```bash
npm run dev
```

3. Start the backend API (optional but recommended for recipe sync).

```bash
npm run server
```

4. Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## Run with XAMPP (Production Build)

1. Build the app.

```bash
npm run build
```

2. Copy `dist` contents into `C:/xampp/htdocs/recipe-app`.

3. Add an Apache rewrite `.htaccess` in `recipe-app` for SPA routing.

4. Open `http://localhost/recipe-app/`.

## Available Scripts

- `npm run dev` starts Vite dev server.
- `npm run build` builds production assets into `dist/`.
- `npm run server` starts Express API server (`server/api.js`).

## API Endpoints

- `GET /api/health` checks API and database connectivity.
- `POST /api/recipes/sync` upserts a recipe payload into MySQL.

## Routes

Public:

- `/`
- `/login`
- `/register`

Protected/app layout routes:

- `/dashboard`
- `/recipes`
- `/recipes/new`
- `/recipes/import`
- `/recipes/:id`
- `/recipes/:id/edit`
- `/meal-planner`
- `/grocery-list`
- `/favorites`

## Complete Project Structure

```text
.
|-- .env
|-- .env.backup
|-- .env.example
|-- .gitignore
|-- ATTRIBUTIONS.md
|-- README.md
|-- index.html
|-- package-lock.json
|-- package.json
|-- postcss.config.mjs
|-- vite.config.ts
|-- guidelines/
|   `-- Guidelines.md
|-- public/
|   `-- favicon.svg
|-- server/
|   |-- api.js
|   |-- db.ts
|   |-- mysql-db.ts
|   `-- sql/
|       |-- mysql_import.sql
|       `-- recipe-and-meal-planner.sql
`-- src/
    |-- main.tsx
    |-- vite-env.d.ts
    |-- app/
    |   |-- App.tsx
    |   |-- data.ts
    |   |-- routes.ts
    |   |-- store.tsx
    |   |-- images/
    |   `-- components/
    |       |-- auth-pages.tsx
    |       |-- dashboard.tsx
    |       |-- favorites-page.tsx
    |       |-- grocery-list.tsx
    |       |-- homepage.tsx
    |       |-- layout.tsx
    |       |-- loading-screen.tsx
    |       |-- meal-planner.tsx
    |       |-- meal-templates.tsx
    |       |-- recipe-card.tsx
    |       |-- recipe-detail.tsx
    |       |-- recipe-form.tsx
    |       |-- recipe-import.tsx
    |       |-- recipe-share-modal.tsx
    |       |-- recipes-page.tsx
    |       |-- theme-toggle.tsx
    |       |-- figma/
    |       |   `-- ImageWithFallback.tsx
    |       `-- ui/
    |           |-- use-mobile.ts
    |           |-- utils.ts
    |           |-- data-display/
    |           |   |-- avatar.tsx
    |           |   |-- badge.tsx
    |           |   |-- calendar.tsx
    |           |   |-- carousel.tsx
    |           |   |-- chart.tsx
    |           |   |-- collapsible.tsx
    |           |   |-- table.tsx
    |           |   |-- toggle-group.tsx
    |           |   `-- toggle.tsx
    |           |-- feedback/
    |           |   |-- alert-dialog.tsx
    |           |   |-- alert.tsx
    |           |   |-- progress.tsx
    |           |   |-- skeleton.tsx
    |           |   `-- sonner.tsx
    |           |-- form/
    |           |   |-- button.tsx
    |           |   |-- checkbox.tsx
    |           |   |-- form.tsx
    |           |   |-- input-otp.tsx
    |           |   |-- input.tsx
    |           |   |-- label.tsx
    |           |   |-- radio-group.tsx
    |           |   |-- select.tsx
    |           |   |-- slider.tsx
    |           |   |-- switch.tsx
    |           |   `-- textarea.tsx
    |           |-- layout/
    |           |   |-- accordion.tsx
    |           |   |-- aspect-ratio.tsx
    |           |   |-- card.tsx
    |           |   |-- resizable.tsx
    |           |   |-- scroll-area.tsx
    |           |   |-- separator.tsx
    |           |   |-- sheet.tsx
    |           |   `-- sidebar.tsx
    |           |-- navigation/
    |           |   |-- breadcrumb.tsx
    |           |   |-- menubar.tsx
    |           |   |-- navigation-menu.tsx
    |           |   |-- pagination.tsx
    |           |   `-- tabs.tsx
    |           `-- overlay/
    |               |-- command.tsx
    |               |-- context-menu.tsx
    |               |-- dialog.tsx
    |               |-- drawer.tsx
    |               |-- dropdown-menu.tsx
    |               |-- hover-card.tsx
    |               |-- popover.tsx
    |               `-- tooltip.tsx
    |-- database/
    |   |-- database.ts
    |   `-- indexeddb.ts
    `-- styles/
        |-- fonts.css
        |-- index.css
        |-- tailwind.css
        `-- theme.css
```

## Notes

- `dist/` and `node_modules/` are generated/runtime directories and are not listed in the source tree above.
- Meal plan JSON export/import controls were intentionally removed from the planner UI.

## Git Ignore and Sensitive Files

The repository ignores sensitive and machine-local files through `.gitignore`.  

Important ignored categories:

- Environment files: `.env`, `.env.local`, `.env.*.local` (`.env.example` stays tracked).
- SQL dump/import artifacts: `*.sql`.
- Local databases and backups: `*.sqlite`, `*.sqlite3`, `*.db`, `*.bak`, `*.dump`.
- Secrets and certificates: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.crt`, `secrets.*`, `*.secret`.
- Local build/cache/log files: `dist/`, `.vite/`, `coverage/`, `*.log`.

Security reminder:

- Do not commit real credentials, connection strings, private keys, or production database dumps.
- If a sensitive file was already committed before adding ignore rules, rotate credentials and remove it from git history.

## Copyright Notice

Copyright © 2026 Aldrian Loberiano.
This project is intend:,,,
# Recipe and Meal Planning App

Recipe and Meal Planning App is a single-page React application for planning meals and organizing recipes in one place. It supports core day-to-day workflow features: browsing recipes, creating and editing recipe entries, importing recipes, scheduling meals, managing favorites, and generating grocery-list content.

## Project Description

This project is built as a modern front-end application with Vite and React Router. The UI combines app-specific components with reusable primitives from Radix UI and styling utilities from Tailwind CSS.

The app is organized around these product areas:

- Authentication entry pages (login/register)
- Recipe management (list, detail, create, edit, import)
- Meal planning and templates
- Grocery list support
- Favorites and dashboard views

## Features

- Home, login, and registration screens
- Dashboard view for app overview
- Full recipe flow: browse, view details, create, edit, import
- Meal planner and meal template screens
- Grocery list management page
- Favorites page
- Shared layout and reusable UI component library
- Theme-aware styling setup

## Tech Stack

- React 18
- Vite 6
- React Router 7
- Tailwind CSS 4
- Radix UI primitives
- Motion, Recharts, React Hook Form, and related UI support libraries

## Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm 9+

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown in terminal output (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` - Start the Vite development server.
- `npm run build` - Create a production build.

## Build for Production

Run:

```bash
npm run build
```

Vite outputs the production bundle to `dist/`.

## App Routes

Public routes:

- `/`
- `/login`
- `/register`

App routes:

- `/dashboard`
- `/recipes`
- `/recipes/new`
- `/recipes/import`
- `/recipes/:id`
- `/recipes/:id/edit`
- `/meal-planner`
- `/grocery-list`
- `/favorites`

## Project Structure

```text
.
|-- ATTRIBUTIONS.md
|-- README.md
|-- guidelines/
|   `-- Guidelines.md
|-- src/
|   |-- main.tsx
|   |-- app/
|   |   |-- App.tsx
|   |   |-- data.ts
|   |   |-- routes.ts
|   |   |-- store.tsx
|   |   `-- components/
|   |       |-- auth-pages.tsx
|   |       |-- dashboard.tsx
|   |       |-- favorites-page.tsx
|   |       |-- grocery-list.tsx
|   |       |-- homepage.tsx
|   |       |-- layout.tsx
|   |       |-- meal-planner.tsx
|   |       |-- meal-templates.tsx
|   |       |-- recipe-card.tsx
|   |       |-- recipe-detail.tsx
|   |       |-- recipe-form.tsx
|   |       |-- recipe-import.tsx
|   |       |-- recipe-share-modal.tsx
|   |       |-- recipes-page.tsx
|   |       |-- theme-toggle.tsx
|   |       |-- figma/
|   |       |   `-- ImageWithFallback.tsx
|   |       `-- ui/                # Shared Radix UI-based components
|   `-- styles/
|       |-- fonts.css
|       |-- index.css
|       |-- tailwind.css
|       `-- theme.css
|-- index.html
|-- package.json
|-- postcss.config.mjs
`-- vite.config.ts
```

## Notes

- This repository currently exposes `dev` and `build` scripts.
- Test and lint scripts are not yet configured in `package.json`.

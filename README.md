# Recipe and Meal Planning App

Recipe and Meal Planning App is a single-page React application for planning meals and organizing recipes in one place. It supports day-to-day workflow features including recipe management, weekly meal scheduling, nutrition tracking, grocery-list generation, and JSON backup/import for meal plans.

## Project Description

This project is built as a modern front-end application with Vite and React Router. The UI combines app-specific components with reusable primitives from Radix UI and styling utilities from Tailwind CSS.

The app is organized around these product areas:

- Authentication entry pages (login/register)
- Recipe management (list, detail, create, edit, import)
- Meal planning and templates (including drinks and dessert slots)
- Grocery list support
- Nutrition summary and plan backup/import tools
- Favorites and dashboard views

## Features

- Home, loading screen, login, and registration screens
- Dashboard view for app overview
- Full recipe flow: browse, view details, create, edit, import
- Step-by-step cooking mode with built-in per-step timer
- Recipe image URL + image upload support (create and import)
- Meal planner and meal template screens
- Meal slots for breakfast, lunch, dinner, snack, drinks, and dessert
- Weekly nutritional summary (totals and daily macro averages)
- Meal plan export/import as JSON
- Grocery list management page with empty-state warnings
- Favorites page
- Shared layout and reusable UI component library
- Theme-aware styling setup

## Tech Stack

- React 18
- Vite 6
- React Router 7
- Tailwind CSS 4
- Radix UI primitives
- Supabase JS client
- PostgreSQL client (`pg`) and MySQL client (`mysql2`) server modules
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

## Environment Variables

Create a local `.env` file (sample values are available in `.env.example`).

Frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Server/database modules:

- `DATABASE_URL`
- `DATABASE_SSL`
- `MYSQL_URL`
- `MYSQL_POOL_LIMIT`

## Demo: How to Use the System

Use this quick walkthrough to test the full app flow in under 10 minutes.

1. Open the app and sign in

- Go to `/login`.
- Enter any email and any password (demo mode accepts any credentials).
- Click Sign In to open the dashboard.

2. Explore recipe management

- Open Recipes to view existing entries.
- Open any recipe card to see details.
- In recipe details, try Step-by-Step Mode and use the built-in cooking timer.
- Add a recipe from `/recipes/new` or import one from `/recipes/import`.

3. Plan your weekly meals

- Open Meal Planner.
- Add meals to breakfast, lunch, dinner, snack, drinks, and dessert slots for each day.
- Drag and drop meals between slots and days.

4. View nutrition summary

- In Meal Planner, check Nutritional Summary.
- Review weekly total calories, protein, carbs, fat, and fiber.
- Review daily macro averages.

5. Export and import your meal plan

- In Meal Planner, click Export JSON to download a backup.
- Click Import JSON and choose a saved meal-plan file.

6. Generate and use grocery list

- In Meal Planner, click Generate Grocery List.
- Open Grocery List and mark items as purchased.
- Use Clear Purchased when needed.

7. Test empty-list warnings

- If your grocery list is empty, the app shows a warning banner.
- If you try to regenerate with no planned meals, the app shows a warning notification.

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
|-- .env.example
|-- guidelines/
|   `-- Guidelines.md
|-- public/
|   `-- favicon.svg
|-- server/
|   |-- db.ts
|   `-- mysql-db.ts
|-- src/
|   |-- main.tsx
|   |-- database/
|   |   |-- database.ts
|   |   `-- indexeddb.ts
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
|   |       |-- loading-screen.tsx
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

## Copyright Notice

Copyright © 2026 Aldrian Loberiano.
This project is intended strictly for personal use.
Any unauthorized commercial use, distribution, or copying of the code or materials in this repository is prohibited and may constitute copyright infringement.

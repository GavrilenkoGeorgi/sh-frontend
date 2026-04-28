# Sharlushka Frontend [![Netlify Status](https://api.netlify.com/api/v1/badges/0e514105-751d-43ee-9786-6685cd362085/deploy-status)](https://app.netlify.com/sites/sharlushka/deploys)

Simple dice game inspired by Yahtzee. This repository contains the frontend app.

## Tech Stack

- React 19 + TypeScript
- Redux Toolkit + RTK Query
- React Router 7
- dnd-kit (drag-and-drop dice board)
- react-hook-form + zod (form handling and validation)
- Recharts (stats charts)
- framer-motion (route and UI animations)
- Sass modules + global Sass
- Webpack 5 (custom config)
- PWA stack: WebpackPwaManifest + Workbox GenerateSW
- Netlify (SPA hosting with redirect fallback)

## What This App Does

- Play as anonymous user or authenticated user
- Game flow based on a Yahtzee-like scoring model
- Save results and view statistics when logged in
- Persist in-progress game state locally while playing
- Installable PWA with offline-ready service worker in production

## Project Structure

Main application code lives in `src`.

- `src/pages`: route pages
- `src/components`: UI blocks (forms, game, charts, layout)
- `src/store`: Redux store and slices
- `src/hooks`: custom hooks (drag handlers, board sync, persistence, PWA lifecycle)
- `src/routes`: route definitions, protected routes, auth loader
- `src/utils`: helpers (game scoring logic, service worker registration, etc.)
- `src/schemas`: zod validation schemas
- `src/styles`: shared Sass variables/mixins/colors

## Architecture Notes

### State Management

- Central state is managed in Redux Toolkit.
- The game domain state is in `shSlice`.
- Auth and notifications are managed in dedicated slices.
- Server communication uses RTK Query (`userApiSlice`, `gameApiSlice`).

### Routing

- Routes are configured with `createBrowserRouter`.
- Heavy pages (game/stats) are lazy loaded.
- Protected pages are wrapped by `ProtectedRoute`.

### Styling

- Component-level styles use Sass modules.
- Shared tokens are in `src/styles/variables.sass`, `colors.sass`, `mixins.sass`.

### PWA Setup

- Manifest is generated via `webpack-pwa-manifest`.
- Service worker is generated with Workbox in production builds.
- Service worker registration happens in `src/utils/serviceWorker.ts` and is disabled in development.

## Environment Variables

Create an `.env` file in project root:

```env
REACT_APP_USERS_URL=https://your-backend-domain/api/users
REACT_APP_GAME_URL=https://your-backend-domain/api/game
```

These are used by RTK Query slices:

- `REACT_APP_USERS_URL` for auth/profile/password endpoints
- `REACT_APP_GAME_URL` for game save/stats endpoints

## Local Setup

```bash
npm install
```

Run development server:

```bash
npm start
```

Build production bundle:

```bash
npm run build
```

Run TypeScript checks:

```bash
npm run type-check
```

## Multiplayer Board Debug Mode

When working on multiplayer board styles, you can force-render the board without
starting a real multiplayer game.

- open the multiplayer route with `?forceBoard=1`:
  `http://localhost:3000/multiplayer?forceBoard=1`
- or enable it via local storage in browser devtools:
  `localStorage.setItem('sh.forceMultiplayerBoard', '1')`

Notes:

- this is development-only (`NODE_ENV=development`)
- if there is no active game, the app renders a local preview game state for UI work
- disable with `localStorage.removeItem('sh.forceMultiplayerBoard')`

## Build and Deployment

- Production build is generated with Webpack in `dist`.
- Netlify redirect config (`netlify.toml`) supports SPA routing:
  all paths redirect to `index.html`.
- Sitemap and static assets are generated/copied during build.

## Game Rules (Short Version)

- Each turn allows up to 3 rolls.
- After each roll, player can hold/release dice and roll remaining dice.
- Score is saved into school/game combinations depending on current phase.
- Full run consists of training phase + main combinations phase.

## Notes

- Backend is a separate repository (Node.js + Express + TypeScript).
- This frontend expects backend cookie/session behavior for authenticated endpoints (`credentials: include`).

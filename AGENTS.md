# AGENTS.md

## Project Context

This repository is for **Despedida ViaRural Broker**, a mobile-first React webapp for a bachelor-party game where `Iñigo Capital S.A.` trades as a fictional market asset before its merger with `Rocío Holdings`.

The app is a parody broker/banking dashboard inspired by rural Spanish banking aesthetics and mobile trading apps. It must remain clearly fictional and must not copy official Caja Rural, Cajaviva, or other real banking marks.

Primary source documents live in `docs/`:

- `docs/arquitectura-aplicacion.md`: technical architecture, stack, persistence, engines, PWA, Firebase, and tests.
- `docs/funcional-aplicacion.md`: functional behavior, user flows, screens, business rules, and acceptance criteria.
- `docs/reglas-juego.md`: complete game rules, scoring, thresholds, Catalizadores de Mercado, bailout, and merger close.
- `docs/releases/`: release notes. Keep new release notes here instead of the repository root.

## Current Architecture

- React 18, TypeScript, Vite, React Router, Tailwind CSS.
- Frontend-only gameplay; no backend is required for rules or local state.
- `localStorage` is the source of truth for the playable session.
- Firebase Analytics is optional and deferred.
- Firestore sync is optional and best-effort; the app must keep working without Firebase config, network, or auth.
- PWA support uses `public/sw.js`, `public/manifest.webmanifest`, and runtime prefetch helpers.
- Production deploy targets Firebase Hosting.

## Repository Layout

Root is reserved for package metadata, tool entrypoints, deployment config, and agent instructions:

- `package.json`, `package-lock.json`
- `index.html`
- `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `tailwind.config.ts`, `postcss.config.js`, `vitest.setup.ts`
- `firebase.json`, `firestore.rules`
- `README.md`, `AGENTS.md`

Application code:

- `src/app/`: application shell, routes, providers, Firebase bootstrap, lazy loading, offline prefetch.
- `src/components/`: reusable UI grouped by app domain.
- `src/data/`: local editable game content and configuration.
- `src/domain/`: pure gameplay engines, types, constants, and storage helpers.
- `src/hooks/`: shared React hooks.
- `src/lang/`: UI copy and localization entrypoint.
- `src/pages/`: route-level screens.
- `src/pwa/`: service worker registration.
- `src/services/`: external integrations such as cloud sync.
- `src/styles/`: global Tailwind CSS.
- `test/`: all tests and fixtures. Do not place tests under `src/`.
- `docs/`: product, architecture, rules, and release documentation.
- `public/`: static assets served as-is.

Generated or local-only files must stay untracked:

- `node_modules/`
- `dist/`
- `.firebase/`
- `coverage/`
- `.env*` except `.env.example`
- `.DS_Store`

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production assets: `npm run build`
- Preview production build: `npm run preview`
- Run lint and type validation: `npm run lint`
- Type-check only: `npm run typecheck`
- Run tests once: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Deploy: `npm run deploy`

## Product Rules

- The app starts at 100 quote points.
- The default merger target is 190 points and can be changed in-app.
- `190+` or the configured target: trigger `Cierre de Fusión`.
- `130` to target minus 1: hot market.
- `90-129`: stable market.
- `71-89`: weak market.
- `41-70`: critical zone.
- `40 or less`: mandatory bailout.
- `0` or less defaults to broken negotiations.
- The final merger closes when at least 2 of 3 final phases are approved.
- Round scoring must include accumulated catalyst effects before persisting score and history.
- Positive catalysts can be used immediately or stored.
- Negative and mixed catalysts apply immediately and must be acknowledged by the player.
- Only one catalyst can be activated per round unless game rules explicitly change.

## Implementation Guidance

- Prefer small, explicit domain engines over UI-driven business logic.
- Keep game data in `src/data/` and domain rules in `src/domain/`.
- Keep React components focused on rendering and user interaction.
- Keep Firebase and sync failures non-blocking; local play must remain available.
- Treat `localStorage` as user-owned session state. Preserve versioning and migration behavior when state shape changes.
- Keep tests under `test/`, mirroring the source area they cover.
- Use existing component/domain patterns before introducing new abstractions.
- Avoid moving root config files unless the related tool is also updated and validated.
- Keep user-facing copy in Spanish unless there is a clear product reason to add another locale.

## Visual Direction

- Mobile-first dark trading/broker interface.
- Rural corporate green as the main accent.
- Sober financial UI patterns with humorous game content.
- Financial/banking iconography where useful: bank, card, chart, candlestick, bell, trend, alert.
- Touch controls must remain usable during a long in-person game session.
- Do not present the app as an official banking product.

Recommended palette:

- Background: `#06110B`, `#0B1F13`
- Surfaces: `#102017`, `#162A1E`, `#1E3527`
- Borders: `#2E4A38`
- Main greens: `#00843D`, `#005C2B`, `#2BAE66`, `#8CC63F`
- Text: `#F7FAF8`, `#B8C7BE`, `#7F9187`
- States: bullish `#00C853`, bearish `#FF5252`, warning `#FFC857`, info `#3BA7FF`
- Game accents: wildcard `#D6A84F`, audit `#B388FF`, merger `#00E5A8`

## Repository Hygiene

- Do not commit generated dependencies, build output, coverage, local Firebase cache, or local env files.
- Keep release notes in `docs/releases/`.
- Keep source docs in Spanish unless there is a clear reason to translate.
- Preserve the playful financial tone in user-facing copy.
- Avoid unrelated refactors; if reorganizing files, update imports, docs, tests, and run validation.

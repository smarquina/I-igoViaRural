# AGENTS.md

## Project Context

This repository is for **Despedida ViaRural Broker**, a mobile-first React webapp for a bachelor-party game about the fictional market value of `Iñigo Capital S.A.` before its merger with `Rocío Holdings`.

The app should feel like a parody broker/banking app inspired by rural Spanish banking aesthetics and mobile trading dashboards. It must not copy official Caja Rural/Cajaviva logos, marks, or product branding.

Primary source documents live in `docs/`:

- `docs/arquitectura-aplicacion.md`: technical architecture, implementation details, stack, persistence, state engines, and tests.
- `docs/reglas-juego.md`: complete game rules, scoring, thresholds, Catalizadores de Mercado, bailout, and merger close.
- `docs/funcional-aplicacion.md`: functional behavior, user flows, screens, business rules, and acceptance criteria.

## Target Architecture

- React frontend only.
- No backend.
- No authentication.
- Local configuration/data files for game content.
- `localStorage` persistence.
- Offline support through PWA/service worker.
- Mobile-first layout and interaction design.

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build production assets: `npm run build`
- Run tests once: `npm test`
- Type-check only: `npm run typecheck`

## Product Requirements

- The app starts at 100 quote points.
- The main goal is reaching 190 points, then completing the `Cierre de Fusión` final round.
- Critical gameplay thresholds:
  - `190+`: trigger merger close attempt.
  - `130-189`: hot market.
  - `90-129`: stable market.
  - `71-89`: weak market.
  - `70 or less`: critical zone.
  - `40 or less`: mandatory bailout.
- Each round should support question/event display, category, reward/penalty, optional wildcard use, result marking, score changes, drink penalties, accumulated effects, threshold checks, and next-round navigation.

## Visual Direction

- Mobile-first dark trading/broker interface.
- Rural corporate green as the main accent.
- Use sober financial UI patterns with humorous game content.
- Include financial/banking iconography where useful: bank, card, chart, candlestick, bell, trend, alert.
- Keep the fictional/parody identity clear. Do not present the app as an official bank product.

Recommended palette from the design doc:

- Background: `#06110B`, `#0B1F13`
- Surfaces: `#102017`, `#162A1E`, `#1E3527`
- Borders: `#2E4A38`
- Main greens: `#00843D`, `#005C2B`, `#2BAE66`, `#8CC63F`
- Text: `#F7FAF8`, `#B8C7BE`, `#7F9187`
- States: bullish `#00C853`, bearish `#FF5252`, warning `#FFC857`, info `#3BA7FF`
- Game accents: wildcard `#D6A84F`, audit `#B388FF`, merger `#00E5A8`

## Implementation Guidance

- Prefer simple, explicit state machines for round flow and threshold transitions.
- Keep game data separate from UI components, ideally as typed local config once TypeScript is available.
- Persist enough state to resume play after refresh or temporary offline use.
- Treat `localStorage` data as user-owned session state; version it if the shape can change.
- Keep UI controls usable on phones during an all-day intermittent game session.
- Avoid overbuilding backend-like abstractions; this is intentionally a local frontend app.

## Repository Hygiene

- Do not commit generated dependencies or build artifacts.
- Keep source docs in Spanish unless there is a clear reason to translate.
- Preserve the playful financial tone in user-facing copy.
- Avoid unrelated refactors when adding the initial scaffold or gameplay features.

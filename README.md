# Despedida ViaRural Broker

Mobile-first React webapp for a bachelor-party game where `Inigo Capital S.A.` trades as a fictional market asset before its merger with `Rocio Holdings`.

The app is a parody broker/banking dashboard inspired by rural Spanish banking aesthetics and mobile investment apps. It is not an official banking product and does not use official Caja Rural/Cajaviva marks.

## Live App

Firebase Hosting:

[https://ruralholdings-despedida.web.app](https://ruralholdings-despedida.web.app)

GitHub repository:

[https://github.com/smarquina/I-igoViaRural](https://github.com/smarquina/I-igoViaRural)

## Core Idea

The groom starts with a fictional quote value of 100 points. The group asks questions, resolves rounds, applies market effects, and tries to push the quote to the merger target.

Default goal:

- Reach 190 points.
- Unlock `Cierre de Fusion`.
- Pass at least 2 of 3 final phases to approve the merger.

The merger target can also be changed from the in-app menu and is persisted in `localStorage`.

## Main Features

- Mobile-first broker dashboard.
- Frontend-only gameplay with no backend for rules or state.
- Persistent game state with `localStorage`.
- PWA shell with manifest and service worker.
- Offline-first prefetch for route/chart chunks and entry assets.
- Randomized question order.
- Previously shown round IDs are stored to avoid repetition during a deck cycle.
- Hidden audit answers that can be revealed once per round.
- Automatic round advance after Failure, Partial, or Success.
- Animated round transition modal using `framer-motion`.
- Stock-style session chart using `lightweight-charts`.
- Current quote, session high, session low, and status thresholds.
- Configurable merger target.
- Market Catalysts system with positive and negative cards.
- Accumulated effects integrated in the catalysts panel.
- Firebase Hosting deployment.
- Firebase Analytics initialized from Vite environment variables.
- GitHub Actions CI.
- Dedicated win/loss result scenes with animated modal and post-dismiss stats.

## Game Concepts

### Market States

| Quote | State |
|---:|---|
| `>= merger target` | Merger close available |
| `130` to target minus 1 | Hot market |
| `90-129` | Stable market |
| `71-89` | Weak market |
| `41-70` | Critical zone |
| `<= 40` | Mandatory bailout |

### Round Results

Each round can be resolved as:

- Failure.
- Partial success, if allowed by the round.
- Success.

The score engine applies:

- Round reward or penalty.
- Drink penalties.
- Critical zone penalties.
- Active accumulated effects.
- Session history updates.

### Catalizadores de Mercado

Market Catalysts are spontaneous events that alter the quote, change round rules, or activate accumulated effects.

Rules:

- The game starts with 0 catalysts.
- One catalyst may be drawn at the start of each round.
- Only one catalyst can be activated per round.
- Positive catalysts can be kept or activated immediately.
- Negative and mixed catalysts apply immediately.
- Defensive catalysts can be blocked by limited liquidity.

## Tech Stack

- React 18.
- TypeScript.
- Vite.
- React Router.
- Tailwind CSS.
- Font Awesome.
- `lightweight-charts`.
- `framer-motion`.
- Firebase Web SDK / Analytics.
- Vitest.
- Testing Library.
- Firebase Hosting.

## Project Structure

```txt
src/
  app/             App routes, lazy loaders, Firebase and GameContext
  components/      UI components grouped by domain
  data/            Local JSON game content and config
  domain/          Pure game engines and types
  hooks/           Shared React hooks
  pages/           Route-level screens
  pwa/             Service worker registration
  styles/          Global Tailwind CSS
test/              Tests and fixtures
docs/
  arquitectura-aplicacion.md
  funcional-aplicacion.md
  reglas-juego.md
public/
  crazy_guy.avif
  due_diligence_approved_simpsom.avif
  icon.avif
  manifest.webmanifest
  resacon_toledo.avif
  sw.js
```

## Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

[http://localhost:5173](http://localhost:5173)

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
npm run deploy
```

Script details:

- `dev`: starts Vite on `0.0.0.0`.
- `lint`: runs TypeScript validation with `tsc --noEmit`.
- `typecheck`: runs `tsc --noEmit`.
- `test`: runs Vitest once.
- `build`: builds production assets into `dist/`.
- `preview`: previews the production build.
- `deploy`: builds and deploys Firebase Hosting to `ruralholdings-despedida`.

## Deployment

Firebase project:

```txt
ruralholdings-despedida
```

Manual deploy:

```bash
npm run deploy
```

Hosting URL:

[https://ruralholdings-despedida.web.app](https://ruralholdings-despedida.web.app)

Firebase Hosting config lives in:

```txt
firebase.json
```

The app is configured as an SPA and rewrites all routes to `index.html`.

## Environment Variables

Local development can use `.env.local`. This file is ignored by git.

Firebase web config variables used by Vite:

```txt
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

These values are injected at build time. They are client-side Firebase web config values, so they are not treated as private server secrets. Private deploy credentials must stay out of `VITE_*` variables.

Local deploy helpers:

```txt
FIREBASE_PROJECT_ID
GOOGLE_APPLICATION_CREDENTIALS
```

## CI

GitHub Actions workflow:

```txt
.github/workflows/ci.yml
```

The workflow runs on pushes and pull requests to `main`.

CI job:

- Checkout.
- Setup Node 24.
- Install dependencies.
- Lint.
- Test.
- Build.
- Upload `dist/` artifact.

The `VITE_FIREBASE_*` secrets are scoped to the `Build` step only.

Deploy job:

- Runs on push to `main`.
- Downloads the build artifact.
- Deploys to Firebase Hosting if `FIREBASE_SERVICE_ACCOUNT_RURALHOLDINGS` is configured.
- Skips deployment explicitly if the secret is missing.

## Persistence

The app stores local state in the browser.

Storage keys:

```txt
bachelor-market:game-state
bachelor-market:has-started-game
bachelor-market:settings
```

Persisted state includes:

- Current score.
- Current round index.
- Visible round number, sequential and independent from the randomized question index.
- Market status.
- Accumulated catalysts.
- Active effects.
- Score history.
- Timestamped score timeline.
- Total drinks.
- Success/failure counters.
- Used catalysts.
- Shown round IDs.
- Resolved round IDs.
- Game result.
- Current phase.
- Last event metadata.

## Data Files

Game data is local and editable:

```txt
src/data/config.json
src/data/rounds.json
src/data/bride-audit.json
src/data/wildcards.json
src/data/bailout-options.json
src/data/street-challenges.json
src/data/general-culture-questions.json
```

Important config values:

- `initialScore`.
- `negotiationBreakScore`.
- `mergerTargetScore`.
- `hotMarketScore`.
- `stableMarketScore`.
- `criticalZoneScore`.
- `bailoutScore`.
- `ordinaryMaxDrinks`.
- `maxWildcardsPerRound`.
- `dataVersion`.

`negotiationBreakScore` defaults to `0`, so weak market, critical zone, and bailout remain reachable in the normal game flow.

## Firebase Analytics

Firebase Analytics is initialized in `src/app/firebase.ts` and called from `src/main.tsx`.

Behavior:

- Firebase initializes only when all `VITE_FIREBASE_*` values are present.
- Analytics initializes only in supported browser contexts.
- Initialization failures are swallowed so offline-first gameplay is not blocked.
- No analytics code is required for tests or server-side contexts.

## Offline Behavior

The PWA uses `public/sw.js` plus runtime prefetch in `src/app/offlinePrefetch.ts`.

Offline support includes:

- App shell assets.
- Public images used by the intro and result screens.
- Lazy route chunks.
- Chart chunk.
- Entry JavaScript and CSS assets after the first production load.

## Documentation

Detailed documentation is split into three files:

- [Architecture](docs/arquitectura-aplicacion.md)
- [Functional Specification](docs/funcional-aplicacion.md)
- [Game Rules](docs/reglas-juego.md)

## Testing

Run the full suite:

```bash
npm test
```

Current test coverage includes:

- Market state thresholds.
- Score penalties.
- Random round selection.
- Quote ticker.
- Answer reveal behavior.
- Catalyst panel and draw modal.
- Round transition modal.
- Home redirect behavior.
- Rules page.
- Settings menu.
- Merger target settings form.
- Main game merger alert visibility.
- Result screens for approved merger and broken negotiations.

## Notes

- This is a local frontend app; session data does not sync across devices.
- There is no import/export state flow in the UI.
- Firebase Analytics is optional measurement only; it does not affect gameplay or persistence.
- Build currently emits a chunk-size warning due to animation/chart dependencies, but production build completes successfully.
- Keep user-facing copy in the playful financial tone of the game.

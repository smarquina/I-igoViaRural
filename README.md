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
- Local-only React app with no backend.
- Persistent game state with `localStorage`.
- PWA shell with manifest and service worker.
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
- GitHub Actions CI.

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
- Vitest.
- Testing Library.
- Firebase Hosting.

## Project Structure

```txt
src/
  app/             App routes and GameContext
  components/      UI components grouped by domain
  data/            Local JSON game content and config
  domain/          Pure game engines and types
  hooks/           Shared React hooks
  pages/           Route-level screens
  pwa/             Service worker registration
  styles/          Global Tailwind CSS
  test/            Test fixtures
docs/
  arquitectura-aplicacion.md
  funcional-aplicacion.md
  reglas-juego.md
public/
  icon.avif
  manifest.webmanifest
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
src/data/bride-audit-questions.json
src/data/wildcards.json
src/data/rules.md
```

Important config values:

- `initialScore`.
- `mergerTargetScore`.
- `hotMarketScore`.
- `stableMarketScore`.
- `criticalZoneScore`.
- `bailoutScore`.
- `ordinaryMaxDrinks`.
- `maxWildcardsPerRound`.
- `dataVersion`.

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

## Notes

- This is a local frontend app; session data does not sync across devices.
- There is no import/export state flow in the UI.
- Build currently emits a chunk-size warning due to animation/chart dependencies, but production build completes successfully.
- Keep user-facing copy in the playful financial tone of the game.

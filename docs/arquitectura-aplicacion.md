# Despedida ViaRural Broker - Arquitectura de la aplicacion

## 1. Vision tecnica

Despedida ViaRural Broker es una webapp React mobile-first para jugar una partida local de preguntas, puntuacion y eventos bursatiles ficticios. La aplicacion representa la cotizacion de `Inigo Capital S.A.` antes de su fusion con `Rocio Holdings`.

La arquitectura es deliberadamente frontend-only:

- No hay backend.
- No hay autenticacion.
- No hay base de datos remota.
- Todo el contenido se carga desde ficheros locales.
- El estado de partida se persiste en `localStorage`.
- La aplicacion funciona como PWA basica con manifest y service worker.

## 2. Stack

- React 18.
- TypeScript.
- Vite.
- React Router.
- Tailwind CSS.
- Font Awesome para iconografia.
- `lightweight-charts` para la grafica bursatil.
- `framer-motion` para animaciones de cambio de ronda.
- Vitest.
- Testing Library.
- PWA manual con `public/manifest.webmanifest`, `public/sw.js` y registro en `src/pwa/serviceWorkerRegistration.ts`.

Comandos principales:

```bash
npm install
npm run dev
npm run build
npm test
npm run typecheck
```

## 3. Estructura de carpetas

```txt
src/
  app/
    App.tsx
    GameContext.tsx
  components/
    effects/
    layout/
    market/
    onboarding/
    rounds/
    wildcards/
  data/
    bailout-options.json
    bride-audit-questions.json
    config.json
    general-culture-questions.json
    rounds.json
    street-challenges.json
    wildcards.json
  domain/
    constants.ts
    effectEngine.ts
    marketStatusEngine.ts
    roundEngine.ts
    scoreEngine.ts
    storage.ts
    types.ts
    wildcardEngine.ts
  hooks/
  pages/
  pwa/
  styles/
  test/
```

## 4. Capas de la aplicacion

### 4.1. Capa de aplicacion

`src/app/App.tsx` define las rutas.

Rutas actuales:

- `/`: entrada inicial. Si ya hay partida iniciada, redirige a `/game`.
- `/intro`: pantalla narrativa heredada.
- `/game`: pantalla principal del juego.
- `/rules`: reglas en formato onboarding reutilizado.
- `/settings`: menu superior.
- `/settings/fusion`: formulario para sobrescribir el valor de fusion.
- `/merger`: cierre de fusion.
- `/bailout`: rescate bancario.
- `/game-over`: resultado final.

`src/app/GameContext.tsx` centraliza:

- Carga de configuracion efectiva.
- Carga y guardado de partida.
- Mazo de rondas.
- Estado actual.
- Acciones de juego.
- Activacion de catalizadores.
- Configuracion persistida del valor de fusion.

### 4.2. Capa de dominio

La carpeta `src/domain` contiene la logica pura.

- `types.ts`: contratos de datos de partida, rondas, catalizadores, efectos y configuracion.
- `constants.ts`: constantes base y claves de storage.
- `marketStatusEngine.ts`: calcula el estado de mercado y el siguiente umbral.
- `scoreEngine.ts`: calcula puntuacion y tragos segun resultado y efectos activos.
- `effectEngine.ts`: aplica y expira efectos acumulados.
- `roundEngine.ts`: construye el mazo, inicializa estado, resuelve rondas, elige rondas aleatorias y aplica rescates/cierre.
- `wildcardEngine.ts`: clasifica y aplica Catalizadores de Mercado.
- `storage.ts`: persistencia, normalizacion de estados antiguos y configuracion guardada.

### 4.3. Capa de datos

Los datos locales viven en `src/data`.

- `config.json`: configuracion base del juego.
- `bailout-options.json`: opciones de rescate bancario, efectos de puntuacion, tragos y acciones especiales.
- `rounds.json`: rondas generales.
- `bride-audit-questions.json`: auditorias internas de Rocio.
- `wildcards.json`: Catalizadores de Mercado.
- `street-challenges.json`: retos de calle disponibles para la Due Diligence final.
- `general-culture-questions.json`: preguntas de cultura general para la Due Diligence final.

El mazo de juego se construye mezclando rondas generales y auditorias internas mediante `buildRoundDeck`.

### 4.4. Capa visual

Componentes principales:

- `MobileShell`: contenedor mobile-first.
- `MarketHeader`: navbar con icono de app y acceso al menu.
- `QuoteTicker`: cotizacion actual, grafica, estado y progreso.
- `MiniMarketChart`: grafica con `lightweight-charts`.
- `ScoreProgress`: barra de estados configurada con umbrales de `config`.
- `WildcardDeckPanel`: Catalizadores acumulados y efectos activos.
- `WildcardDrawModal`: decision al robar un catalizador positivo.
- `RoundCard`: pregunta de ronda y respuesta revelable.
- `RoundActionBar`: botones de fallo, parcial y acierto.
- `RoundAdvanceModal`: modal animada de nueva ronda.
- `GameRulesOnboarding`: reglas paso a paso reutilizadas en inicio y reglas.

## 5. Configuracion

`src/data/config.json` define:

- `gameTitle`.
- `groomName`.
- `brideName`.
- `initialScore`.
- `mergerTargetScore`.
- `hotMarketScore`.
- `stableMarketScore`.
- `criticalZoneScore`.
- `bailoutScore`.
- `ordinaryMaxDrinks`.
- `allowPartialSuccess`.
- `maxWildcardsPerRound`.
- `theme`.
- `dataVersion`.

El valor `mergerTargetScore` puede sobrescribirse desde `/settings/fusion`. La app lo guarda en `localStorage` bajo `bachelor-market:settings` y construye una configuracion efectiva combinando JSON base y ajustes locales.

## 6. Persistencia

Claves de `localStorage`:

- `bachelor-market:game-state`: estado completo de partida.
- `bachelor-market:has-started-game`: bandera de partida iniciada.
- `bachelor-market:settings`: ajustes locales, incluido `mergerTargetScore`.

El estado persistido incluye:

- Puntuacion actual.
- Indice de ronda actual.
- Numero visible de ronda (`roundNumber`), secuencial y separado del indice aleatorio de pregunta.
- Estado de mercado.
- Catalizadores acumulados.
- Efectos activos.
- Historial numerico.
- Timeline con timestamps.
- Tragos totales.
- Aciertos, parciales y fallos.
- Catalizadores aplicados.
- IDs de rondas mostradas (`shownRoundIds`).
- IDs de rondas resueltas (`resolvedRoundIds`).
- Resultado de partida.
- Fase de ronda.
- Ultimo delta, tragos y mensaje de evento.

`storage.ts` normaliza estados antiguos para:

- Crear `scoreTimeline` si solo existe `scoreHistory`.
- Inicializar `hasDrawnWildcardThisRound`.
- Inicializar `shownRoundIds`.
- Eliminar el mensaje antiguo `Se abre la sesion.`.

## 7. Flujo de estado

### 7.1. Inicio

La home muestra onboarding solo si no hay partida iniciada. Si `bachelor-market:has-started-game` esta activo, `/` redirige a `/game`.

### 7.2. Nueva partida

`startNewGame`:

- Marca la partida como iniciada.
- Limpia ofertas de catalizador pendientes.
- Crea un estado nuevo.
- Elige aleatoriamente la primera ronda.
- Guarda el primer ID en `shownRoundIds`.

### 7.3. Rondas aleatorias

Las rondas se muestran en orden aleatorio.

`getNextRandomRoundIndex`:

- Recibe el mazo y los IDs ya mostrados.
- Filtra rondas no mostradas.
- Selecciona aleatoriamente una disponible.
- Si no quedan rondas disponibles, abre un nuevo ciclo usando todo el mazo.

La app guarda `shownRoundIds` para evitar repeticiones al recargar.

### 7.4. Resolucion de ronda

Al pulsar Fallo, Parcial o Acierto:

- Se calcula delta de puntuacion.
- Se calculan tragos.
- Se aplican efectos activos.
- Se actualiza historial y timeline.
- Se registra el ID en `resolvedRoundIds`.
- Se elige la siguiente ronda aleatoria.
- Se incrementa `roundNumber`, que es el numero visible para el usuario.
- Se resetea el uso/robo de catalizador de la ronda.
- Se muestra modal animada de nueva ronda durante 4 segundos.

## 8. Motor de mercado

`marketStatusEngine.ts` calcula:

- `BAILOUT_REQUIRED` si la puntuacion es menor o igual al rescate.
- `MERGER_ATTEMPT` si la puntuacion alcanza el objetivo de fusion configurado.
- `CRITICAL_ZONE` si la puntuacion esta en zona critica.
- `HOT_MARKET` si alcanza mercado caliente.
- `STABLE_MARKET` si alcanza mercado estable.
- `WEAK_MARKET` en el resto de casos.

La prioridad de rescate esta por encima de zona critica.

El objetivo de fusion no esta hardcodeado en el motor cuando existe configuracion efectiva; se lee de `config.mergerTargetScore`.

## 9. Catalizadores de Mercado

Los Catalizadores de Mercado se cargan desde `wildcards.json`.

Tipos:

- `GOOD`.
- `BAD`.
- `MIXED`.
- `SPECIAL`.

La implementacion interna conserva el nombre tecnico `Wildcard` por compatibilidad de codigo, pero la interfaz y documentacion de producto usan `Catalizadores de Mercado`.

Reglas tecnicas:

- La partida empieza con 0 catalizadores.
- Al inicio de cada ronda se puede robar 1 catalizador.
- Si es positivo (`GOOD` o `SPECIAL`), se abre modal para guardarlo o activarlo.
- Si es negativo o mixto, se aplica inmediatamente.
- Solo se puede activar 1 catalizador por ronda.
- Un catalizador defensivo se bloquea si existe `Liquidez limitada`.
- `Reset de Mercado` elimina catalizadores y efectos sin cambiar la puntuacion.

## 10. Efectos acumulados

Los efectos activos se guardan en `activeEffects`.

Tipos soportados:

- `RISK_PREMIUM`.
- `VOLATILITY`.
- `BEAR_MARKET`.
- `BULL_MARKET`.
- `LEVERAGE`.
- `LIMITED_LIQUIDITY`.
- `LOSS_LIMIT`.

Los efectos pueden:

- Modificar puntos por acierto.
- Modificar puntos por fallo.
- Anadir tragos.
- Duplicar resultados.
- Limitar perdidas.
- Bloquear catalizadores defensivos.
- Expirar por rondas restantes.

## 11. Graficas y timeline

La app mantiene dos estructuras:

- `scoreHistory`: lista numerica para maximos, minimos y compatibilidad.
- `scoreTimeline`: puntos con `score`, `timestamp` y `event`.

`MiniMarketChart` usa `scoreTimeline` para representar la evolucion real de la sesion. Cada pregunta respondida o evento aplicado inserta un punto con timestamp real.

## 12. PWA

Incluye:

- `public/manifest.webmanifest`.
- `public/sw.js`.
- `serviceWorkerRegistration.ts`.
- Icono `public/icon.avif`.

La estrategia actual es cache-first basica para recursos GET.

## 13. Testing

Cobertura actual:

- Estado de mercado y umbrales configurables.
- Puntuacion y penalizacion de zona critica.
- Motor de rondas aleatorias y sin repeticion por ciclo.
- Ticker de cotizacion.
- Tarjeta de ronda y revelado de respuesta.
- Catalizadores y modal de robo.
- Home y redireccion a partida.
- Reglas.
- Menu.
- Formulario de valor de fusion.
- Modal de nueva ronda.

## 14. Consideraciones de implementacion

- No usar backend para datos o estado.
- No introducir dependencias de red en runtime.
- No copiar logos oficiales ni marcas de Caja Rural.
- Mantener datos de juego separados de componentes.
- Versionar/normalizar estado persistido cuando cambie la forma.
- Mantener controles tactiles y mobile-first.
- Evitar refactors no relacionados con el flujo de juego.

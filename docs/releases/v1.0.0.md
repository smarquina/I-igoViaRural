# Despedida ViaRural Broker v1.0.0

Primera release estable de **Despedida ViaRural Broker**, una webapp React mobile-first para dirigir la partida presencial de despedida de soltero donde `Iñigo Capital S.A.` cotiza antes de su fusión con `Rocío Holdings`.

## Highlights

- Experiencia principal mobile-first con estética de broker/banca rural ficticia.
- Partida local sin backend obligatorio para reglas ni estado de juego.
- Persistencia automática en `localStorage`.
- Soporte PWA con manifest, service worker y comportamiento offline-first.
- Sincronización cloud opcional con Firestore, manteniendo la app local-first.
- Firebase Analytics opcional, diferido para no bloquear el primer render.
- CI en GitHub Actions con lint, tests y build.
- Despliegue preparado para Firebase Hosting.

## Juego

- Cotización inicial de 100 puntos.
- Objetivo base de fusión en 190 puntos, configurable desde el menú.
- Estados de mercado: mercado caliente, estable, débil, zona crítica, rescate obligatorio y cierre de fusión.
- Rondas aleatorias sin repetición dentro del ciclo del mazo.
- Auditorías internas con respuesta oculta y revelado controlado.
- Resolución de rondas con fallo, parcial y acierto.
- Penalizaciones por tragos y efectos de zona crítica.
- Historial de cotización, máximos, mínimos y timeline con timestamp.
- Cierre de Fusión final con 3 fases y aprobación al superar al menos 2.
- Resultado alternativo de ruptura de negociaciones con pantalla propia.
- Rescate bancario con opciones configurables desde datos locales.

## Catalizadores de Mercado

- Sistema completo de catalizadores positivos, negativos, mixtos y especiales.
- Los catalizadores positivos pueden guardarse o activarse al momento.
- Los negativos y mixtos se aplican inmediatamente y se muestran en modal hasta confirmar.
- Efectos acumulados integrados en el cálculo de puntuación y tragos.
- Soporte de Stop Loss, Banco Central, Rally alcista, Reset de Mercado, Liquidez limitada, Prima de riesgo, Flash crash, Short squeeze y otros modificadores de ronda.
- Panel de cartera y efectos activos durante la partida.

## Interfaz

- Dashboard principal con cotización, estado de mercado, gráfico bursátil y progreso hacia fusión.
- Gráfico con `lightweight-charts`.
- Modales animadas con `framer-motion` para cambio de ronda, catalizadores y resultados.
- Pantalla inicial visual, onboarding de reglas y menú de ajustes.
- Escenas finales dedicadas para fusión aprobada y resacón en Toledo.
- Controles táctiles pensados para uso en móvil durante una partida larga.

## Arquitectura y rendimiento

- React 18, TypeScript, Vite, React Router y Tailwind CSS.
- Código de dominio separado para motores de mercado, rondas, puntuación, efectos, catalizadores y persistencia.
- Datos de juego separados en JSON local.
- Rutas, gráfico, Firebase y prefetch offline cargados de forma diferida.
- Service worker versionado con navegación network-first para evitar servir bundles antiguos.
- Lighthouse final sobre `/game`: Performance 100, Accessibility 100, Best Practices 100, SEO 100.

## Testing

- Suite Vitest y Testing Library agrupada bajo `test/`.
- Cobertura de umbrales de mercado, puntuación, rondas aleatorias, ticker, revelado de respuestas, catalizadores, modales, pantallas principales, configuración, rescate, cierre de fusión y resultados.

## Notas operativas

- La partida funciona sin login y sin backend para jugar.
- Firestore actúa como copia cloud best-effort cuando está configurado.
- Las variables `VITE_FIREBASE_*` son configuración web de Firebase inyectada en build.
- El estado local sigue siendo propiedad del navegador del usuario.

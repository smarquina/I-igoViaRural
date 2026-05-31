# Despedida ViaRural Broker - Reglas completas del juego

## 1. Concepto

Despedida ViaRural Broker es un juego de despedida de soltero en el que Iñigo cotiza como `Iñigo Capital S.A.` en el mercado de la solteria. El objetivo es alcanzar una cotizacion suficiente para cerrar la fusion con `Rocio Holdings`.

El mercado lo forman los jugadores, que leen preguntas, pruebas y eventos, escuchan a Iñigo y registran el resultado en la app.

## 2. Objetivo principal

El objetivo base es alcanzar 190 puntos de cotizacion.

Ese valor puede modificarse desde el menu en la pantalla `Valor de fusion`. Si se configura otro valor, ese nuevo objetivo sobrescribe el valor por defecto en el navegador.

Al alcanzar el objetivo de fusion, Iñigo no gana automaticamente. Se desbloquea el `Cierre de Fusion`.

## 3. Puntuacion inicial

La partida empieza con:

- 100 puntos de cotizacion.
- 0 Catalizadores de Mercado.
- 0 efectos activos.
- 0 tragos acumulados.
- 0 aciertos.
- 0 aciertos parciales.
- 0 fallos.

## 4. Estados de mercado

Los estados dependen de la cotizacion:

| Rango | Estado | Consecuencia |
|---:|---|---|
| `>= objetivo de fusion` | Cierre de Fusion disponible | Puede intentarse la prueba final. |
| `130-objetivo-1` | Mercado caliente | Iñigo esta cerca de cerrar la fusion. |
| `90-129` | Mercado estable | Zona normal de juego. |
| `71-89` | Mercado debil | Riesgo de entrar en zona critica. |
| `41-70` | Zona critica | Los fallos tienen penalizacion adicional. |
| `<= 40` | Rescate bancario obligatorio | Debe aplicarse un rescate. |

La prioridad del rescate es superior a la zona critica: si la puntuacion es 40 o menos, el estado es rescate.

## 5. Zona critica

Iñigo entra en Zona Critica con 70 puntos o menos.

Mientras este en Zona Critica:

- Cada fallo resta 5 puntos adicionales.
- Cada fallo suma 1 trago adicional.
- El maximo ordinario por fallo queda limitado por `ordinaryMaxDrinks`.
- Los catalizadores de recuperacion pasan a ser especialmente importantes.

Para salir de Zona Critica debe volver a 90 puntos o mas.

## 6. Rescate bancario

Si Iñigo cae a 40 puntos o menos, se activa rescate bancario obligatorio.

Opciones:

1. Rescate con liquidez:
   - Suma 20 puntos.
   - Suma 5 tragos.

2. Venta de activos:
   - Suma 25 puntos.
   - Elimina Catalizadores de Mercado acumulados.

3. Auditoria extraordinaria superada:
   - Sube directamente a 90 puntos.
   - No suma tragos.

4. Auditoria extraordinaria fallida:
   - Deja la cotizacion en 50 puntos.
   - Suma 5 tragos.

Despues del rescate, la partida continua.

## 7. Estructura de ronda

Cada ronda sigue esta secuencia:

1. La app muestra una pregunta, prueba o evento.
2. La app indica el tipo de ronda.
3. Al inicio de la ronda puede robarse 1 Catalizador de Mercado.
4. Antes de resolver, puede activarse como maximo 1 catalizador.
5. Iñigo responde o realiza la prueba.
6. Si la ronda tiene respuesta auditada, se puede revelar con el boton superior derecho.
7. El grupo marca Fallo, Parcial o Acierto.
8. La app suma o resta puntos.
9. La app suma tragos si corresponde.
10. Se aplican efectos activos.
11. Se comprueban umbrales de mercado.
12. La app avanza automaticamente a una nueva ronda aleatoria.

## 8. Orden de preguntas

Las preguntas salen en orden aleatorio.

La app guarda los IDs de las rondas ya mostradas en `shownRoundIds` para evitar repeticiones durante el ciclo actual del mazo.

Tambien guarda `resolvedRoundIds` para saber que rondas han sido contestadas.

Cuando todas las rondas disponibles han salido, el mazo puede abrir un nuevo ciclo.

## 9. Tipos de ronda

### 9.1. Auditoria interna de Rocio

Preguntas enviadas por Rocio, con respuesta correcta opcional.

Reglas:

- La pregunta se muestra inicialmente.
- La respuesta no se muestra al principio.
- El boton superior derecho revela la respuesta bajo la pregunta.
- Tras revelar, el boton queda deshabilitado hasta pasar de ronda.

Puntuacion habitual:

- Acierto exacto: puntos de `successScore`.
- Acierto parcial: puntos de `partialSuccessScore`.
- Fallo: resta `failureScorePenalty` y suma `failureDrinks`.

### 9.2. Mercado sentimental

Preguntas sobre relacion, convivencia, planes de futuro y vida de pareja.

### 9.3. Bolsa y banca

Preguntas o situaciones de banca, inversion, mercados o economia, mezcladas con humor sobre Iñigo.

### 9.4. OPA hostil

Preguntas o intervenciones de amigos que ponen presion al novio.

### 9.5. Pregunta de riesgo

Preguntas mas gamberras o comprometidas.

### 9.6. Roast de mercado

Rondas humoristicas en las que el grupo puede castigar o premiar segun respuesta.

### 9.7. Prueba de calle

Retos o acciones fuera de la respuesta verbal.

### 9.8. Evento de mercado

Eventos que pueden modificar puntuacion, efectos o reglas de ronda.

## 10. Resultados de ronda

Cada ronda puede resolverse como:

- Acierto.
- Acierto parcial, si `allowsPartial` es `true`.
- Fallo.

Reglas:

- El acierto suma `successScore`.
- El parcial suma `partialSuccessScore`.
- El fallo resta `failureScorePenalty`.
- El fallo suma `failureDrinks`.
- En Zona Critica, el fallo resta 5 puntos adicionales y suma 1 trago adicional.

## 11. Catalizadores de Mercado

Durante la partida, Iñigo puede recibir Catalizadores de Mercado: eventos espontaneos que alteran la cotizacion, modifican reglas de ronda o activan efectos acumulados.

Reglas:

- La partida empieza con 0 catalizadores.
- Al inicio de cada ronda se puede robar 1 catalizador.
- Solo puede activarse 1 catalizador por ronda.
- Tras activar uno, no se puede activar otro hasta la siguiente ronda.
- Cada catalizador tiene un boton `?` con informacion de ayuda.
- Los catalizadores defensivos se bloquean si existe `Liquidez limitada`.

## 12. Catalizadores positivos y negativos

Catalizadores positivos:

- Son de tipo `GOOD` o `SPECIAL`.
- Al robarlos se abre una modal.
- Iñigo puede guardarlos en cartera o activarlos al momento.

Catalizadores negativos o mixtos:

- Son de tipo `BAD` o `MIXED`.
- Se aplican inmediatamente al robarlos.
- No se pueden guardar.

## 13. Catalizadores incluidos

### Stop Loss

Limita la perdida de la ronda.

### Banco Central

Inyecta confianza inmediata en el mercado.

### Rally alcista

Durante dos rondas, los aciertos suman puntos adicionales.

### Reset de Mercado

Elimina catalizadores y efectos acumulados sin tocar la cotizacion.

### Liquidez limitada

Bloquea catalizadores defensivos durante dos rondas.

## 14. Reset de Mercado

Reset de Mercado elimina:

- Catalizadores guardados.
- Efectos activos positivos.
- Efectos activos negativos.
- Prima de riesgo.
- Volatilidad.
- Mercado alcista.
- Mercado bajista.
- Apalancamiento.
- Liquidez limitada.

No modifica la puntuacion.

Puede tener coste de tragos segun la definicion del catalizador.

## 15. Efectos acumulados

Los efectos pueden modificar varias rondas.

Efectos soportados:

- Prima de riesgo: suma tragos adicionales a fallos.
- Volatilidad: aumenta ganancias y perdidas.
- Mercado bajista: empeora fallos durante varias rondas.
- Mercado alcista: mejora aciertos durante varias rondas.
- Apalancamiento: duplica aciertos y fallos.
- Liquidez limitada: bloquea catalizadores defensivos.
- Stop Loss: limita perdida de puntos y tragos.

Los efectos expiran si tienen `remainingRounds`.

## 16. Cierre de Fusion

Al alcanzar el objetivo de fusion se desbloquea el intento final.

La prueba final tiene 3 fases:

1. Pregunta de Rocio.
2. Pregunta del mercado.
3. Declaracion de inversion.

Reglas:

- Si supera al menos 2 de 3 fases, la fusion queda aprobada.
- Si falla, pierde 25 puntos.
- Si falla, suma 5 tragos.
- Si falla, vuelve al mercado con la nueva cotizacion.

## 17. Victoria

Iñigo gana cuando:

- Alcanza el objetivo de fusion.
- Entra en Cierre de Fusion.
- Supera al menos 2 de las 3 fases finales.

Resultado:

- `MERGER_APPROVED`.
- Fin de partida.

## 18. Persistencia de reglas

La partida se guarda automaticamente.

Al recargar:

- Si no hay partida iniciada, se muestra onboarding.
- Si hay partida iniciada, `/` redirige a `/game`.
- La ronda actual, puntuacion, catalizadores, efectos y preguntas ya mostradas se restauran.

## 19. Ajustes permitidos

Desde el menu se puede cambiar el valor de fusion.

Reglas:

- Debe ser un entero.
- Debe ser mayor que `hotMarketScore`.
- Se guarda en `localStorage`.
- Recalcula el estado de mercado inmediatamente.
- Sobrescribe el valor por defecto de 190 puntos en ese navegador.

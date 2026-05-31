# Despedida ViaRural Broker - Documentacion funcional

## 1. Proposito

La aplicacion permite dirigir una partida presencial de despedida de soltero. El grupo usa el movil como panel de broker para gestionar la cotizacion ficticia de Iñigo, registrar respuestas, aplicar Catalizadores de Mercado, controlar efectos y llegar al Cierre de Fusion con Rocio.

## 2. Actores

- Iñigo: jugador principal.
- Rocio: origen de preguntas de auditoria interna.
- Grupo/Consejo de Administracion: lee preguntas, decide si la respuesta es correcta y registra el resultado.
- App: calcula puntos, tragos, estado de mercado, historial y persistencia.

## 3. Pantallas funcionales

### 3.1. Inicio

Si no hay partida iniciada, muestra el onboarding con reglas basicas:

1. Dinamica de rondas.
2. Objetivo de llegar al valor de fusion.
3. Zona critica y rescate.
4. Catalizadores y efectos.
5. Forma de jugar.

Acciones:

- Siguiente.
- Atras.
- Omitir explicacion.
- Comenzar partida.

Si ya hay partida iniciada, la ruta `/` redirige directamente a `/game`.

### 3.2. Juego

Pantalla principal.

Muestra:

- Navbar con icono y menu.
- Cotizacion actual.
- Maximo y minimo de sesion.
- Grafica bursatil.
- Estado de mercado.
- Siguiente umbral.
- Barra de estados con la puntuacion actual dentro.
- Catalizadores acumulados.
- Efectos acumulados.
- Mensaje de ultimo evento.
- Pregunta actual.
- Botones de Fallo, Parcial y Acierto.

### 3.3. Reglas

Muestra el mismo onboarding de inicio, reutilizando `GameRulesOnboarding`.

### 3.4. Menu

Permite:

- Abrir reglas.
- Abrir configuracion de valor de fusion.
- Reiniciar partida si hay partida iniciada.

No permite:

- Importar estado.
- Exportar estado.

### 3.5. Valor de fusion

Formulario para cambiar los puntos necesarios para el Cierre de Fusion.

Funcionamiento:

- Muestra el objetivo actual.
- Permite introducir un nuevo entero.
- Valida que sea mayor que el umbral de mercado caliente.
- Guarda el valor en `localStorage`.
- Recalcula el estado de mercado.

### 3.6. Cierre de Fusion

Pantalla final cuando se alcanza el objetivo.

El grupo marca cuantas fases se superan.

### 3.7. Rescate bancario

Pantalla de rescate cuando la cotizacion cae a 40 o menos.

Permite seleccionar una de las opciones de rescate.

### 3.8. Fin de partida

Muestra resultado, puntuacion y resumen.

## 4. Flujo de partida

1. El usuario abre la app.
2. Si no hay partida, lee u omite onboarding.
3. Pulsa comenzar.
4. La app inicia en 100 puntos.
5. La app elige una primera ronda aleatoria.
6. El grupo puede robar un catalizador al inicio de ronda.
7. Iñigo responde la pregunta o realiza la prueba.
8. Si hay respuesta auditada, el grupo puede revelarla.
9. El grupo marca Fallo, Parcial o Acierto.
10. La app calcula puntos y tragos.
11. La app registra la evolucion en la grafica.
12. La app guarda el ID de la ronda mostrada/resuelta.
13. La app elige la siguiente ronda aleatoria sin repetir.
14. Se muestra modal animada de nueva ronda durante 4 segundos.
15. El juego continua hasta rescate, cierre o fin.

## 5. Rondas

La app maneja rondas desde JSON local.

Campos funcionales:

- `id`: identificador unico.
- `type`: tipo de ronda.
- `title`: titulo.
- `text`: pregunta o prueba.
- `answer`: respuesta opcional.
- `successScore`: puntos por acierto.
- `partialSuccessScore`: puntos por parcial.
- `failureScorePenalty`: penalizacion por fallo.
- `failureDrinks`: tragos por fallo.
- `allowsPartial`: permite parcial.
- `requiresAnswerReveal`: respuesta oculta/revelable.

## 6. Preguntas aleatorias

Las preguntas no se recorren por orden.

Reglas funcionales:

- La primera pregunta de una partida nueva es aleatoria.
- Cada avance elige una ronda aleatoria no mostrada.
- El numero que ve el usuario empieza siempre en Ronda 1 y avanza de forma secuencial.
- El numero visible no se basa en el indice ni en el ID interno de la pregunta.
- Se guardan los IDs mostrados en `shownRoundIds`.
- Se guardan los IDs contestados en `resolvedRoundIds`.
- Si se recarga, no se pierde el historial de IDs.
- Si se agota el mazo, puede empezar un nuevo ciclo.

## 7. Respuesta oculta

En auditorias internas:

- La pregunta se ve siempre.
- La respuesta no aparece inicialmente.
- El boton superior derecho revela la respuesta.
- La respuesta se muestra bajo la pregunta.
- El boton queda deshabilitado hasta pasar de ronda.

## 8. Resolucion de ronda

El grupo decide:

- Fallo.
- Parcial, si esta permitido.
- Acierto.

Al resolver:

- Se actualiza puntuacion.
- Se actualiza mercado.
- Se actualizan tragos.
- Se aplica zona critica si corresponde.
- Se aplican efectos activos.
- Se registra punto en la grafica.
- Se pasa automaticamente a otra ronda.

## 9. Cotizacion y grafica

La cotizacion actual se muestra en la parte superior.

La seccion incluye:

- Valor actual.
- Maximo de sesion.
- Minimo de sesion.
- Grafica de evolucion.
- Estado de mercado.
- Siguiente umbral.
- Barra visual con limites.

Cada movimiento de puntuacion queda guardado con timestamp real en `scoreTimeline`.

## 10. Catalizadores de Mercado

Los Catalizadores son eventos espontaneos que alteran la cotizacion o las reglas.

Funcionamiento:

- La partida empieza con 0.
- Al inicio de cada ronda se puede robar 1.
- El robo queda bloqueado hasta la siguiente ronda.
- Si es positivo, se puede guardar o activar.
- Si es negativo o mixto, se aplica inmediatamente.
- Solo se puede activar 1 por ronda.
- La ayuda `?` explica su efecto.

## 11. Efectos acumulados

Los efectos aparecen dentro de la seccion de Catalizadores acumulados.

Cada efecto puede mostrar:

- Nombre.
- Nivel.
- Rondas restantes.

Los efectos se reducen al avanzar de ronda.

## 12. Estados especiales

### Zona critica

Se comunica mediante el estado de mercado y modifica fallos.

### Rescate

Debe usarse cuando la puntuacion es 40 o menos.

### Cierre de Fusion

Debe usarse cuando se alcanza el objetivo configurado.

## 13. Persistencia funcional

La aplicacion guarda automaticamente:

- Partida iniciada.
- Estado completo.
- Configuracion local.
- Valor de fusion personalizado.
- Preguntas mostradas.
- Preguntas resueltas.
- Catalizadores.
- Efectos.
- Historial de puntuacion.

El usuario puede recargar la pagina y continuar sin volver al onboarding.

## 14. Reinicio

Desde el menu se puede reiniciar si hay partida iniciada.

El reinicio:

- Pide confirmacion.
- Limpia estado de partida.
- Limpia bandera de partida iniciada.
- Crea estado nuevo en memoria.

## 15. Restricciones funcionales

- No hay login.
- No hay backend.
- No hay sincronizacion entre dispositivos.
- El estado vive en el navegador actual.
- No se importa ni exporta estado.
- La app debe ser usable en movil.
- La identidad visual debe ser ficticia y parodica.
- No debe parecer una app oficial de Caja Rural.

## 16. Criterios de aceptacion funcionales

- Nueva partida empieza en 100 puntos.
- Nueva partida empieza con 0 Catalizadores.
- Las preguntas salen aleatoriamente.
- No se repiten preguntas ya mostradas en el ciclo.
- La respuesta auditada empieza oculta.
- El boton de revelar respuesta se bloquea tras usarlo.
- Fallo, parcial y acierto avanzan de ronda.
- La grafica evoluciona con cada respuesta.
- Los maximos y minimos de sesion se calculan.
- El estado de mercado se calcula segun umbrales.
- El objetivo de fusion configurable se persiste.
- El menu permite abrir reglas, valor de fusion y reiniciar.
- Recargar `/` con partida iniciada lleva a `/game`.
- Los Catalizadores positivos abren modal de decision.
- Los Catalizadores negativos se aplican inmediatamente.
- Solo se activa 1 Catalizador por ronda.
- El build de produccion debe compilar.
- La suite de tests debe pasar.

import type { MarketStatus, Round } from "../domain/types";

export const es = {
  common: {
    pointsShort: "pts",
    back: "Volver",
    no: "No"
  },
  app: {
    gameTitle: "Despedida ViaRural Broker",
    appIconAlt: "Icono de Despedida ViaRural Broker",
    openSettings: "Abrir configuración",
    loadingMarket: "Cargando mercado..."
  },
  onboarding: {
    steps: [
      {
        eyebrow: "Dinámica",
        title: "Una sesión bursátil para Iñigo",
        text: "Cada ronda funciona como una operación de mercado: pregunta, prueba o evento. El Consejo marca acierto, parcial o fallo y la cotización se mueve al instante."
      },
      {
        eyebrow: "Objetivo",
        title: "Llegar a 190 puntos",
        text: "Iñigo Capital S.A. empieza en 100 puntos. Al alcanzar 190 se desbloquea el Cierre de Fusión con Rocío Holdings, pero todavía tendrá que superar la Due Diligence final."
      },
      {
        eyebrow: "Riesgo",
        title: "Zona crítica y rescate",
        text: "Si baja a 70 puntos entra en Zona Crítica: cada fallo sale más caro. Si cae a 40 o menos, el Banco Central exige un rescate obligatorio antes de seguir."
      },
      {
        eyebrow: "Herramientas",
        title: "Catalizadores de Mercado",
        text: "Durante la partida, Iñigo podrá recibir Catalizadores de Mercado: eventos espontáneos que alteran la cotización, modifican las reglas de la ronda o activan efectos acumulados. Solo puede activarse un catalizador por ronda."
      },
      {
        eyebrow: "Cómo jugar",
        title: "El mercado decide",
        text: "El grupo lee la carta, escucha la respuesta de Iñigo y registra el resultado. La app guarda puntos, tragos, rondas resueltas, máximos, mínimos y estado de mercado."
      }
    ],
    back: "Atrás",
    next: "Siguiente",
    skip: "Omitir explicación"
  },
  home: {
    initialExplanation: "Explicación inicial del juego",
    startGame: "Comenzar partida"
  },
  intro: {
    eyebrow: "Apertura de mercado",
    title: "La última sesión bursátil de Iñigo",
    paragraphs: [
      "Iñigo cotiza como valor independiente en el mercado de la soltería. Hoy el mercado se enfrenta a una operación histórica: la fusión entre Iñigo Capital S.A. y Rocío Holdings.",
      "El Consejo de Administración le someterá a preguntas, auditorías internas, pruebas, OPAs hostiles y eventos capaces de hundir o disparar la cotización.",
      "El objetivo es alcanzar 190 puntos y superar el Cierre de Fusión. Si el mercado pierde la confianza, habrá Zona Crítica, rescate bancario y tragos regulatorios."
    ],
    startSession: "Comenzar sesión"
  },
  settings: {
    title: "Menú",
    dataVersion: (version: string) => `Versión de datos ${version}`,
    rules: "Reglas",
    mergerValue: "Valor de fusión",
    restartGame: "Restablecer partida",
    restartConfirm: "¿Restablecer la partida y borrar todos los datos guardados en este navegador?"
  },
  mergerSettings: {
    title: "Valor de fusión",
    currentTarget: (score: number) => `Objetivo actual: ${score} puntos`,
    label: "Puntos necesarios para el Cierre de Fusión",
    help: "Este valor se guarda en el navegador y sobrescribe el objetivo por defecto de 190 puntos.",
    save: "Guardar valor",
    invalidScore: (score: number) => `Introduce un valor entero de ${score} puntos o más.`,
    savedScore: (score: number) => `Valor de fusión guardado en ${score} puntos.`
  },
  rules: {
    title: "Reglas del juego",
    backToMenu: "Volver al menú"
  },
  wildcards: {
    positiveCard: "Carta positiva",
    negativeCard: "Carta negativa",
    activeCatalyst: "Catalizador activo",
    keep: "Guardarla",
    useNow: "Activarlo ahora",
    dismiss: "Entendido",
    accumulated: "Catalizadores acumulados",
    inPortfolio: (count: number) => `${count} en cartera`,
    catalystDrawn: "catalizador robado",
    drawAtStart: "roba catalizador al inicio",
    draw: "Robar catalizador",
    empty: "Sin catalizadores acumulados.",
    helpFor: (name: string) => `Ver ayuda de ${name}`,
    activate: "Activar",
    accumulatedEffects: "Efectos acumulados",
    onlyAtRoundStart: "Solo se puede robar una carta al inicio de cada ronda.",
    deckEmpty: "No quedan catalizadores disponibles en el mazo local.",
    positiveDrawn: (name: string) => `Catalizador positivo robado: ${name}. Decide si guardarlo o activarlo ahora.`,
    negativeApplied: (name: string) => `Catalizador negativo aplicado inmediatamente: ${name}.`,
    saved: (name: string) => `Catalizador guardado en cartera: ${name}.`,
    typeLabels: {
      GOOD: "Positivo",
      BAD: "Negativo",
      MIXED: "Mixto",
      SPECIAL: "Especial"
    }
  },
  effects: {
    empty: "Sin efectos acumulados",
    active: "Efectos activos"
  },
  rounds: {
    round: (roundNumber: number) => `Ronda ${roundNumber}`,
    revealedAnswer: "Respuesta ya revelada",
    revealAnswer: "Revelar respuesta de Rocío",
    answerFromBride: "Respuesta de Rocío",
    pendingAnswer: "Respuesta pendiente de completar.",
    success: "Acierto",
    partial: "Parcial",
    failure: "Fallo",
    noPartial: "Sin parcial",
    nextRound: "Siguiente ronda",
    resolved: "Ronda resuelta. Avanza a la siguiente operación.",
    newOperation: "Nueva operación",
    marketOpening: "Apertura de mercado",
    marketOpeningTitle: "Se abren los mercados",
    marketOpeningText: "Empieza una nueva sesión bursátil.",
    typeLabels: {
      INTERNAL_AUDIT: "Auditoría interna",
      SENTIMENTAL_MARKET: "Mercado sentimental",
      BANKING_STOCK_MARKET: "Bolsa y banca",
      HOSTILE_TAKEOVER: "OPA hostil",
      GAMBLER_QUESTION: "Pregunta de riesgo",
      MARKET_ROAST: "Roast de mercado",
      STREET_CHALLENGE: "Prueba de calle",
      MARKET_EVENT: "Evento de mercado"
    } satisfies Record<Round["type"], string>
  },
  market: {
    maxShort: "Máx",
    minShort: "Mín",
    quote: "Cotización",
    status: "Estado",
    nextThreshold: "Siguiente umbral",
    progressToMerger: (score: number, target: number) => `Progreso hacia la fusión: ${score} de ${target} puntos`,
    currentValue: (score: number) => `Valor actual: ${score} puntos`,
    progressLabels: {
      bailout: "Rescate",
      critical: "Crítica",
      stable: "Estable",
      hot: "Caliente",
      merger: "Fusión"
    },
    chartExtremeMax: "Máx.",
    chartExtremeMin: "Mín.",
    chartEvolution: (max: number, min: number) => `Evolución de la cotización. Máximo ${max} puntos, mínimo ${min} puntos.`,
    sessionMax: "Máximo sesión",
    sessionMin: "Mínimo sesión",
    statusLabels: {
      MERGER_ATTEMPT: "Cierre de Fusión disponible",
      HOT_MARKET: "Mercado caliente",
      STABLE_MARKET: "Mercado estable",
      WEAK_MARKET: "Mercado débil",
      CRITICAL_ZONE: "Zona crítica",
      BAILOUT_REQUIRED: "Rescate bancario obligatorio"
    } satisfies Record<MarketStatus, string>,
    nextThresholds: {
      chooseBailout: "Elegir rescate",
      leaveSevereBankruptcy: (score: number) => `${score} pts para salir de quiebra severa`,
      stableMarket: (score: number) => `${score} pts para mercado estable`,
      hotMarket: (score: number) => `${score} pts para mercado caliente`,
      closeMerger: (score: number) => `${score} pts para cierre`,
      finalDueDiligence: "Due Diligence final"
    },
    banners: {
      criticalTitle: "Zona crítica",
      criticalText: "Cada fallo resta 5 puntos extra y añade 1 trago extra.",
      bailoutTitle: "Rescate obligatorio",
      bailoutText: "La cotización ha caído a 40 puntos o menos.",
      openBailout: "Abrir rescate bancario",
      mergerTitle: "Cierre de Fusión disponible",
      mergerText: "El Consejo puede activar la Due Diligence final.",
      tryMerger: "Intentar cerrar fusión"
    }
  },
  bailout: {
    eyebrow: "Banco Central",
    title: "Rescate Bancario",
    text: "La cotización ha caído a 40 puntos o menos. Elige una única medida urgente; al ejecutarla, el rescate queda resuelto.",
    execute: "Ejecutar rescate",
    executeChoice: (title: string) => `Ejecutar rescate: ${title}`,
    challengeSuccess: "Reto superado",
    challengeFailure: "Reto fallido",
    instructions: "Instrucciones",
    examplePitch: "Discurso sugerido",
    successCriteria: "Criterio de superación",
    failureCriteria: "Criterio de fallo",
    safetyNote: "Nota de seguridad"
  },
  merger: {
    eyebrow: "Due Diligence final",
    title: "Cierre de Fusión",
    text: "Para aprobar la operación debe superar al menos 2 de las 3 fases: una pregunta de Rocío, un reto y una pregunta de cultura general. Si no llega al mínimo, se aplican las penalizaciones de cada fallo.",
    phaseKinds: {
      BRIDE_QUESTION: "Pregunta de Rocío",
      STREET_CHALLENGE: "Reto",
      GENERAL_CULTURE: "Cultura general"
    },
    instructions: "Instrucciones",
    examples: "Ejemplos",
    examplePitch: "Discurso sugerido",
    successCriteria: "Criterio de acierto",
    failureCriteria: "Criterio de fallo",
    safetyNote: "Nota de seguridad",
    revealAnswer: "Revelar respuesta",
    answer: "Respuesta",
    pointsOnSuccess: (score: number) => `Acierto +${score} pts`,
    pointsOnPartial: (score: number) => `Parcial +${score} pts`,
    penaltyOnFailure: (score: number, drinks: number) => `Fallo -${score} pts · ${drinks} tragos`,
    markSuccess: "Marcar acierto",
    markPartial: "Marcar parcial",
    markFailure: "Marcar fallo",
    registerResult: (successful: number) => `Registrar resultado (${successful}/3)`
  },
  gameOver: {
    approvedEyebrow: "Operación aprobada",
    manualEyebrow: "Cierre manual",
    approvedTitle: "Fusión aprobada",
    manualTitle: "Partida cerrada",
    approvedText: "Iñigo Capital S.A. y Rocío Holdings quedan autorizadas para la operación.",
    manualText: "El Consejo de Administración ha cerrado la sesión bursátil.",
    stats: {
      score: "Puntuación",
      rounds: "Rondas",
      successes: "Aciertos",
      partials: "Parciales",
      failures: "Fallos",
      drinks: "Tragos",
      appliedCatalysts: "Catalizadores aplicados",
      maxQuote: "Mayor cotización"
    },
    newSession: "Nueva sesión",
    backHome: "Volver al inicio"
  },
  timeline: {
    sessionOpening: "Apertura de sesión",
    historicalMove: (index: number) => `Movimiento histórico ${index}`,
    roundEvent: (roundNumber: number, title: string) => `Ronda ${roundNumber}: ${title}`,
    mergerFailed: "Cierre de Fusión fallido",
    bailoutLiquidity: "Rescate con liquidez",
    assetSale: "Venta de activos",
    streetChallengeBailout: "Reto de recapitalización superado",
    extraordinaryGroupAudit: "Auditoría extraordinaria colectiva",
    groupBeerBailout: "Rescate colectivo de emergencia"
  },
  messages: {
    appliedEffects: (labels: string[]) => `Efectos aplicados: ${labels.join(", ")}.`,
    marketReset: "Reset de Mercado aplicado.",
    marketResetWithCost: (drinks: number) => `Reset de Mercado aplicado. Coste regulatorio: ${drinks} tragos.`,
    wildcardActivated: (name: string) => `${name} activado.`,
    wildcardLimitsLoss: (name: string) => `${name} limita la pérdida de esta ronda.`,
    wildcardApplied: (name: string) => `${name} aplicado.`,
    criticalZoneSurcharge: "Recargo por Zona Crítica",
    mergerApproved: "Fusión aprobada por el Consejo de Administración.",
    mergerFailed: "La fusión no se cierra todavía. Vuelve el mercado.",
    mergerFailedWithPenalty: (scorePenalty: number, successScore: number, drinks: number) =>
      `La fusión no se cierra todavía. Resultado neto: +${successScore} puntos por aciertos, -${scorePenalty} puntos por fallos y ${drinks} tragos.`,
    bailoutLiquidity: "Rescate con liquidez ejecutado.",
    assetSale: "Venta de activos ejecutada. Catalizadores liquidados.",
    streetChallengeBailout: "Reto de recapitalización superado. La cotización avanza a 80 puntos.",
    extraordinaryGroupAudit: "Auditoría extraordinaria colectiva ejecutada. Todo el grupo bebe media cerveza y la cotización queda en 60 puntos.",
    groupBeerBailout: "Rescate colectivo ejecutado. Todo el grupo bebe media cerveza y la cotización queda en 60 puntos.",
    oldSessionOpening: "Se abre la sesión."
  },
  gameContent: {
    rounds: {
          "round-014": {
                "title": "Mercado sentimental",
                "text": "¿Qué es lo mejor que te ha aportado Rocío desde que estáis juntos?"
          },
          "round-027": {
                "title": "Cultura financiera avanzada",
                "text": "¿Qué es un ETF y qué lo diferencia de un fondo de inversión tradicional?",
                "answer": "Un ETF, o fondo cotizado, es un fondo de inversión que se negocia en bolsa como si fuera una acción. A diferencia de muchos fondos tradicionales, puede comprarse y venderse durante la sesión bursátil a precio de mercado. Normalmente replica un índice, sector, materia prima o cesta de activos."
          },
          "round-004": {
                "title": "Pregunta gamberra",
                "text": "¿Qué amigo del grupo es más peligroso cuando hay barra libre? Di por qué."
          },
          "round-019": {
                "title": "Cultura financiera",
                "text": "¿Qué es un activo refugio?",
                "answer": "Un activo refugio es una inversión que tiende a conservar mejor su valor en momentos de incertidumbre o tensión del mercado, aunque no está libre de riesgo."
          },
          "round-009": {
                "title": "Rating del grupo",
                "text": "Elige a tres amigos: el más fiable, el más imprevisible y el que nunca debería tomar decisiones importantes después de medianoche."
          },
          "round-030": {
                "title": "Cultura financiera avanzada",
                "text": "¿Qué es la PAC y por qué puede ser relevante para una entidad financiera rural?",
                "answer": "La PAC es la Política Agrícola Común de la Unión Europea. Regula ayudas, pagos e intervenciones dirigidas al sector agrario y al desarrollo rural. Para una entidad financiera rural puede ser relevante porque afecta a agricultores, ganaderos, cooperativas, inversiones en explotaciones, financiación de campañas y anticipos de ayudas."
          },
          "round-001": {
                "title": "Mercado sentimental",
                "text": "¿Cuál fue uno de los primeros planes con Rocío en los que pensaste: “esto va en serio”?"
          },
          "round-022": {
                "title": "Cultura financiera",
                "text": "¿Qué significa que una empresa salga a bolsa?",
                "answer": "Salir a bolsa significa que una empresa empieza a cotizar en un mercado bursátil, de modo que sus acciones pueden comprarse y venderse por inversores."
          },
          "round-011": {
                "title": "Pregunta gamberra",
                "text": "Cuenta una noche de fiesta que acabó de una forma que nadie esperaba."
          },
          "round-028": {
                "title": "Cultura financiera avanzada",
                "text": "En una hipoteca, ¿qué diferencia hay entre tipo fijo, tipo variable y tipo mixto?",
                "answer": "En una hipoteca a tipo fijo, el interés y la cuota se mantienen estables durante toda la vida del préstamo. En una hipoteca variable, el interés se revisa periódicamente según un índice de referencia, como el euríbor, por lo que la cuota puede subir o bajar. En una hipoteca mixta, hay un primer periodo a tipo fijo y después pasa a tipo variable."
          },
          "round-023": {
                "title": "Cartera de amigos",
                "text": "Elige tres amigos: uno para un plan tranquilo, otro para una fiesta y otro para una emergencia. El grupo vota si has elegido bien."
          },
          "round-016": {
                "title": "Cultura financiera",
                "text": "¿Qué es la volatilidad en los mercados?",
                "answer": "La volatilidad mide cuánto varía el precio de un activo en un periodo de tiempo. A mayor volatilidad, mayores oscilaciones y mayor incertidumbre sobre su precio."
          },
          "round-006": {
                "title": "Prueba de calle",
                "text": "Consigue que alguien de fuera del grupo diga una razón por la que Rocío debería casarse contigo."
          },
          "round-024": {
                "title": "Cultura financiera",
                "text": "¿Qué es la prima de riesgo?",
                "answer": "La prima de riesgo es la rentabilidad adicional que se exige a una inversión por asumir más riesgo frente a otra considerada más segura."
          },
          "round-012": {
                "title": "OPA hostil",
                "text": "Cuenta una anécdota que tus amigos saben y Rocío quizá no conoce del todo."
          },
          "round-029": {
                "title": "Cultura financiera avanzada",
                "text": "¿Qué diferencia hay entre TIN y TAE en un préstamo?",
                "answer": "El TIN es el tipo de interés nominal, es decir, el precio que la entidad cobra por prestar el dinero. La TAE incluye el TIN y también otros costes asociados, como comisiones o gastos, expresados de forma anual. Por eso la TAE suele ser más útil para comparar préstamos."
          },
          "round-018": {
                "title": "Pregunta gamberra",
                "text": "¿Qué defecto tuyo debería conocer bien Rocío antes de casarse contigo?"
          },
          "round-013": {
                "title": "Cultura financiera",
                "text": "¿Qué significa diversificar una cartera de inversión?",
                "answer": "Diversificar consiste en repartir la inversión entre distintos activos, sectores o mercados para reducir el riesgo de depender demasiado de una sola posición."
          },
          "round-021": {
                "title": "OPA hostil",
                "text": "Di una cosa en la que Rocío suele tener razón, aunque te cueste admitirlo."
          },
          "round-031": {
                "title": "Cultura financiera avanzada",
                "text": "Un cliente pide un préstamo personal y otro una hipoteca. ¿Qué diferencias principales debería tener en cuenta el banco al analizar el riesgo?",
                "answer": "En una hipoteca suele existir una garantía real, normalmente la vivienda, y el plazo suele ser más largo. En un préstamo personal normalmente no hay garantía hipotecaria específica, por lo que el análisis se centra más en ingresos, estabilidad laboral, endeudamiento, historial de pagos y capacidad de devolución. En ambos casos se analiza solvencia, importe, plazo, tipo de interés y finalidad."
          },
          "round-005": {
                "title": "Roast de mercado",
                "text": "Divide al grupo en tres categorías: los tranquilos, los imprevisibles y los que son un peligro. El grupo decide si acepta tu clasificación."
          },
          "round-002": {
                "title": "Cultura financiera",
                "text": "¿Qué es una OPA?",
                "answer": "Una OPA, u Oferta Pública de Adquisición, es una operación en la que una persona o sociedad ofrece públicamente a los accionistas de una empresa cotizada comprar sus acciones u otros valores a un precio determinado."
          },
          "round-020": {
                "title": "Mercado sentimental",
                "text": "¿Qué cualidad de Rocío te ayuda más cuando tienes un mal día?"
          },
          "round-010": {
                "title": "Cultura financiera",
                "text": "¿Qué es un stop-loss?",
                "answer": "Un stop-loss es una orden o regla de gestión del riesgo que busca limitar pérdidas cerrando una posición cuando el precio alcanza un nivel previamente definido."
          },
          "round-026": {
                "title": "Prueba de calle",
                "text": "Pide a alguien que haga una recomendación rápida sobre ti: ¿Rocío debería elegirte, pensárselo o salir corriendo?"
          },
          "round-007": {
                "title": "Cultura financiera",
                "text": "¿Qué diferencia hay entre una OPA amistosa y una OPA hostil?",
                "answer": "Una OPA amistosa cuenta con la aceptación o acuerdo de los órganos de gobierno de la sociedad afectada. Una OPA hostil se presenta sin esa aceptación previa."
          },
          "round-015": {
                "title": "Consejo de administración",
                "text": "¿Qué amigo del grupo no debería ser responsable de organizar nada serio? Explica el motivo."
          },
          "round-008": {
                "title": "Mercado sentimental",
                "text": "¿Qué momento con Rocío recuerdas como uno de los más importantes de vuestra relación?"
          },
          "round-003": {
                "title": "OPA hostil",
                "text": "Cuenta una decisión de soltero de la que hoy no estarías especialmente orgulloso."
          },
          "round-017": {
                "title": "Prueba de calle",
                "text": "Haz un anuncio de 20 segundos explicando por qué Iñigo es una buena elección para casarse con Rocío."
          },
          "round-025": {
                "title": "Pregunta gamberra",
                "text": "¿Cuál diría Rocío que es tu mayor peligro como marido?"
          },
          "audit-001": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu película favorita?"
          },
          "audit-002": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué talla de pie usas?"
          },
          "audit-003": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué color de bragas prevalece en su armario?"
          },
          "audit-004": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién es responsable de preparar la comida en casa?"
          },
          "audit-005": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu programa de televisión favorito?"
          },
          "audit-006": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu bebida alcohólica favorita?"
          },
          "audit-007": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién de su familia te gusta menos?"
          },
          "audit-008": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién de sus familiares te gusta más?"
          },
          "audit-009": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es su plato favorito?"
          },
          "audit-010": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál era el nombre de tu primera pareja?"
          },
          "audit-011": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué edad tenías cuando besaste al primer chico?"
          },
          "audit-012": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu libro favorito?"
          },
          "audit-013": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu deporte favorito?"
          },
          "audit-014": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Te gusta bailar?"
          },
          "audit-015": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu color favorito?"
          },
          "audit-016": {
                "title": "Auditoría interna de Rocío",
                "text": "¿En qué país te gustaría vivir?"
          },
          "audit-017": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién es el más activo?"
          },
          "audit-018": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién fue tu mejor amigo de infancia?"
          },
          "audit-019": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál fue tu asignatura favorita en el colegio?"
          },
          "audit-020": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cómo le prefieres: en pinta deportiva, elegante para un matrimonio o en pijama?"
          },
          "audit-021": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué es lo que más te enoja: que se demore en arreglarse para salir, que no haga deporte u otra cosa?"
          },
          "audit-022": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu plan ideal?"
          },
          "audit-023": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué es lo que más te gusta del novio?"
          },
          "audit-024": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuándo fue el primer beso?"
          },
          "audit-025": {
                "title": "Auditoría interna de Rocío",
                "text": "¿En qué lugar os disteis el primer beso?"
          },
          "audit-026": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es la anécdota que más recuerdas?"
          },
          "audit-027": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuándo te pidió matrimonio?"
          },
          "audit-028": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué tipo de películas te gustan: romántica, drama, acción, comedia u otra?"
          },
          "audit-029": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué es lo que más te gusta hacer con tu pareja: deporte, cocinar, conversar de la vida u otra cosa?"
          },
          "audit-030": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué es lo que más te gusta de él: sus ojos, sus anchas espaldas, sus manos, su sonrisa u otra cosa?"
          },
          "audit-031": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es la cosa que más te enfada del novio?"
          },
          "audit-032": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu número de teléfono?"
          },
          "audit-033": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuántas veces al día te lavas los dientes?"
          },
          "audit-034": {
                "title": "Auditoría interna de Rocío",
                "text": "¿En qué posición duermes?"
          },
          "audit-035": {
                "title": "Auditoría interna de Rocío",
                "text": "¿A qué hora pones el primer despertador para ir a trabajar?"
          },
          "audit-036": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué tomas de desayuno usualmente?"
          },
          "audit-037": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál ha sido el regalo suyo que más te ha gustado?"
          },
          "audit-038": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué nombre es el que más te gusta que te diga?"
          },
          "audit-039": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu quinto apellido?"
          },
          "audit-040": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cada cuántos días te depilas?"
          },
          "audit-041": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cómo conseguiste su número de teléfono?"
          },
          "audit-042": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Dónde fue el primer beso?"
          },
          "audit-043": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es la anécdota que más veces le has contado a Sergio de tu infancia?"
          },
          "audit-044": {
                "title": "Auditoría interna de Rocío",
                "text": "¿En qué lugar disfrutas más con el sexo?"
          },
          "audit-045": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Dónde fue la primera cita?"
          },
          "audit-046": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién propuso la fecha de la boda?"
          },
          "audit-047": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es el pasatiempo favorito para hacer en conjunto?"
          },
          "audit-048": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién lleva los pantalones en la relación?"
          },
          "audit-049": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Esperáis tener hijos?"
          },
          "audit-050": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuántos hijos esperáis tener?"
          },
          "audit-051": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué tareas son de la novia y cuáles del novio?"
          },
          "audit-052": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién dio el primer beso?"
          },
          "audit-053": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién es mejor en la cocina?"
          },
          "audit-054": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién es más desordenado?"
          },
          "audit-055": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién se queda dormido en una película?"
          },
          "audit-056": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Quién suele llegar más tarde cuando quedáis?"
          },
          "audit-057": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál fue el primer regalo que le hiciste y cuál fue el último?"
          },
          "audit-058": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu actor favorito?"
          },
          "audit-059": {
                "title": "Auditoría interna de Rocío",
                "text": "Nombra una manía que tengas."
          },
          "audit-060": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál fue tu primer trabajo?"
          },
          "audit-061": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué sueles utilizar para dormir?"
          },
          "audit-062": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué día es la boda?"
          },
          "audit-063": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué nombre pondrías a tu hijo e hija?"
          },
          "audit-064": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Cuál es tu lado favorito en la cama?"
          },
          "audit-065": {
                "title": "Auditoría interna de Rocío",
                "text": "Si no ejercieses tu profesión actual, ¿a qué te gustaría dedicarte?"
          },
          "audit-066": {
                "title": "Auditoría interna de Rocío",
                "text": "¿Qué mata más la pasión con Iñigo?"
          }
    },
    wildcards: {
          "wildcard-stop-loss": {
                "name": "Stop Loss",
                "description": "Limita las pérdidas de esta ronda si Iñigo falla: como máximo perderá 5 puntos y beberá 1 trago."
          },
          "wildcard-banco-central": {
                "name": "Banco Central",
                "description": "El Banco Central inyecta liquidez en Iñigo Capital S.A.: suma 10 puntos inmediatamente y no añade tragos."
          },
          "wildcard-rally-alcista": {
                "name": "Rally alcista",
                "description": "Activa Mercado alcista durante 2 rondas. Mientras esté activo, los aciertos suman puntos adicionales según el nivel del efecto."
          },
          "wildcard-reset-mercado": {
                "name": "Reset de Mercado",
                "description": "Elimina todos los catalizadores acumulados y efectos activos. No modifica la puntuación, pero Iñigo bebe 3 tragos por costes regulatorios."
          },
          "wildcard-liquidez-limitada": {
                "name": "Liquidez limitada",
                "description": "Activa Liquidez limitada durante 2 rondas: Iñigo no puede usar catalizadores defensivos. No altera puntos directamente."
          },
          "wildcard-analista-externo": {
                "name": "Analista externo",
                "description": "Otra persona debe responder por Iñigo. Si acierta, Iñigo recibe los puntos de la ronda. Si falla, Iñigo pierde los puntos de la ronda y bebe 1 trago adicional. No puede usarse en preguntas personales."
          },
          "wildcard-profit-taking": {
                "name": "Recogida de beneficios",
                "description": "Si Iñigo acierta la pregunta, mantiene los puntos ganados en la ronda y puede mandar beber 3 tragos a otra persona."
          },
          "wildcard-seguro-de-credito": {
                "name": "Seguro de crédito",
                "description": "Si Iñigo falla, mantiene la pérdida de puntos de la ronda, pero otra persona del grupo bebe por él los tragos base de la penalización."
          },
          "wildcard-prima-de-riesgo": {
                "name": "Prima de riesgo",
                "description": "Activa Prima de riesgo durante 3 rondas. Cada fallo añade 1 trago extra. No altera puntos directamente."
          },
          "wildcard-flash-crash": {
                "name": "Flash crash",
                "description": "Caída repentina de mercado: Iñigo pierde 12 puntos inmediatamente y bebe 1 trago."
          },
          "wildcard-short-squeeze": {
                "name": "Short squeeze",
                "description": "Activa Volatilidad durante 1 ronda. La pregunta se vuelve más explosiva: los aciertos suman más puntos y los fallos restan más puntos según el nivel del efecto."
          },
          "wildcard-ampliacion-capital": {
                "name": "Ampliación de capital",
                "description": "Iñigo puede pedir ayuda a 2 personas del grupo antes de responder. Si acierta, recibe los puntos normales de la ronda. Si falla, pierde los puntos normales de la ronda y los 2 ayudantes beben 1 trago cada uno."
          },
          "wildcard-dividendo-extraordinario": {
                "name": "Dividendo extraordinario",
                "description": "Si Iñigo acierta esta ronda, suma 8 puntos adicionales además de los puntos normales de la pregunta. Si falla, no tiene efecto adicional."
          },
          "wildcard-opinion-segunda-firma": {
                "name": "Segunda firma",
                "description": "Iñigo puede responder y después pedir una segunda opinión a alguien del grupo. La respuesta final la decide Iñigo. No altera puntos directamente."
          }
    },
    effectLabels: {
          "effect-bull-market": "Mercado alcista",
          "effect-limited-liquidity": "Liquidez limitada"
    }
  },
  errors: {
    gameProviderRequired: "useGame must be used inside GameProvider",
    oneWildcardPerRound: "Only one wildcard can be used per round"
  }
};

export type LanguageCopy = typeof es;

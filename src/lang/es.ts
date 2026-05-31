import type { MarketStatus, Round } from "../domain/types";

export const es = {
  common: {
    pointsShort: "pts",
    back: "Volver",
    no: "No"
  },
  app: {
    openSettings: "Abrir configuración"
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
    restartGame: "Reiniciar partida",
    restartConfirm: "¿Reiniciar la partida y limpiar el estado guardado?"
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
    activeCatalyst: "Catalizador activo",
    keep: "Guardarla",
    useNow: "Activarlo ahora",
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
    saved: (name: string) => `Catalizador guardado en cartera: ${name}.`
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
    text: "La cotización ha caído a 40 puntos o menos. Elige una medida urgente para evitar la quiebra sentimental.",
    choices: {
      LIQUIDITY: {
        title: "Rescate con liquidez",
        detail: "Bebe media cerveza y recupera 20 puntos."
      },
      SELL_ASSETS: {
        title: "Venta de activos",
        detail: "Pierde todos los catalizadores acumulados y recupera 25 puntos."
      },
      EXTRA_AUDIT_SUCCESS: {
        title: "Auditoría extraordinaria superada",
        detail: "Sube directamente a 90 puntos."
      },
      EXTRA_AUDIT_FAILURE: {
        title: "Auditoría extraordinaria fallida",
        detail: "Bebe media cerveza y se queda en 50 puntos."
      }
    }
  },
  merger: {
    eyebrow: "Due Diligence final",
    title: "Cierre de Fusión",
    text: "Para aprobar la operación debe superar al menos 2 de las 3 fases exigidas por el Consejo.",
    phases: [
      "Pregunta de Rocío",
      "Pregunta del mercado",
      "Declaración de inversión"
    ],
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
    extraAuditSuccess: "Auditoría extraordinaria superada",
    extraAuditFailure: "Auditoría extraordinaria fallida"
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
    bailoutLiquidity: "Rescate con liquidez ejecutado.",
    assetSale: "Venta de activos ejecutada. Catalizadores liquidados.",
    extraAuditSuccess: "Auditoría extraordinaria superada.",
    extraAuditFailure: "Auditoría extraordinaria fallida.",
    oldSessionOpening: "Se abre la sesión."
  },
  errors: {
    gameProviderRequired: "useGame must be used inside GameProvider",
    oneWildcardPerRound: "Only one wildcard can be used per round"
  }
};

export type LanguageCopy = typeof es;

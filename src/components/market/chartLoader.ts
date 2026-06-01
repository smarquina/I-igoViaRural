export const loadMiniMarketChart = () =>
  import("./MiniMarketChart").then((module) => ({ default: module.MiniMarketChart }));

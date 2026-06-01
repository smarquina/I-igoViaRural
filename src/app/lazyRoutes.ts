export const loadBailoutPage = () => import("../pages/BailoutPage").then((module) => ({ default: module.BailoutPage }));
export const loadGameOverPage = () => import("../pages/GameOverPage").then((module) => ({ default: module.GameOverPage }));
export const loadGamePage = () => import("../pages/GamePage").then((module) => ({ default: module.GamePage }));
export const loadHomePage = () => import("../pages/HomePage").then((module) => ({ default: module.HomePage }));
export const loadHangoverPage = () => import("../pages/HangoverPage").then((module) => ({ default: module.HangoverPage }));
export const loadIntroPage = () => import("../pages/IntroPage").then((module) => ({ default: module.IntroPage }));
export const loadMergerAttemptPage = () =>
  import("../pages/MergerAttemptPage").then((module) => ({ default: module.MergerAttemptPage }));
export const loadMergerTargetSettingsPage = () =>
  import("../pages/MergerTargetSettingsPage").then((module) => ({ default: module.MergerTargetSettingsPage }));
export const loadRulesPage = () => import("../pages/RulesPage").then((module) => ({ default: module.RulesPage }));
export const loadSettingsPage = () => import("../pages/SettingsPage").then((module) => ({ default: module.SettingsPage }));

export const routeModuleLoaders = [
  loadHomePage,
  loadGamePage,
  loadHangoverPage,
  loadSettingsPage,
  loadRulesPage,
  loadMergerTargetSettingsPage,
  loadMergerAttemptPage,
  loadBailoutPage,
  loadGameOverPage,
  loadIntroPage
] as const;

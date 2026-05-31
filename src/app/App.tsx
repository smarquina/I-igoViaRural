import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./GameContext";
import { copy } from "../lang";

const BailoutPage = lazy(() => import("../pages/BailoutPage").then((module) => ({ default: module.BailoutPage })));
const GameOverPage = lazy(() => import("../pages/GameOverPage").then((module) => ({ default: module.GameOverPage })));
const GamePage = lazy(() => import("../pages/GamePage").then((module) => ({ default: module.GamePage })));
const HomePage = lazy(() => import("../pages/HomePage").then((module) => ({ default: module.HomePage })));
const IntroPage = lazy(() => import("../pages/IntroPage").then((module) => ({ default: module.IntroPage })));
const MergerAttemptPage = lazy(() => import("../pages/MergerAttemptPage").then((module) => ({ default: module.MergerAttemptPage })));
const MergerTargetSettingsPage = lazy(() => import("../pages/MergerTargetSettingsPage").then((module) => ({ default: module.MergerTargetSettingsPage })));
const RulesPage = lazy(() => import("../pages/RulesPage").then((module) => ({ default: module.RulesPage })));
const SettingsPage = lazy(() => import("../pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));

function RouteFallback() {
  return <div className="min-h-screen bg-broker-bg p-4 text-sm font-bold text-broker-muted">{copy.app.loadingMarket}</div>;
}

export function App() {
  return (
    <GameProvider>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/fusion" element={<MergerTargetSettingsPage />} />
          <Route path="/merger" element={<MergerAttemptPage />} />
          <Route path="/bailout" element={<BailoutPage />} />
          <Route path="/game-over" element={<GameOverPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </GameProvider>
  );
}

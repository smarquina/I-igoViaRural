import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./GameContext";
import {
  loadBailoutPage,
  loadGameOverPage,
  loadGamePage,
  loadHangoverPage,
  loadHomePage,
  loadIntroPage,
  loadMergerAttemptPage,
  loadMergerTargetSettingsPage,
  loadRulesPage,
  loadSettingsPage
} from "./lazyRoutes";
import { copy } from "../lang";

const BailoutPage = lazy(loadBailoutPage);
const GameOverPage = lazy(loadGameOverPage);
const GamePage = lazy(loadGamePage);
const HangoverPage = lazy(loadHangoverPage);
const HomePage = lazy(loadHomePage);
const IntroPage = lazy(loadIntroPage);
const MergerAttemptPage = lazy(loadMergerAttemptPage);
const MergerTargetSettingsPage = lazy(loadMergerTargetSettingsPage);
const RulesPage = lazy(loadRulesPage);
const SettingsPage = lazy(loadSettingsPage);

function RouteFallback() {
  return <div className="min-h-screen bg-broker-bg p-4 text-sm font-bold text-broker-ink">{copy.app.loadingMarket}</div>;
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
          <Route path="/resacon-toledo" element={<HangoverPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </GameProvider>
  );
}

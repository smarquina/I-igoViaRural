import { Navigate, Route, Routes } from "react-router-dom";
import { GameProvider } from "./GameContext";
import { BailoutPage } from "../pages/BailoutPage";
import { GameOverPage } from "../pages/GameOverPage";
import { GamePage } from "../pages/GamePage";
import { HomePage } from "../pages/HomePage";
import { IntroPage } from "../pages/IntroPage";
import { MergerAttemptPage } from "../pages/MergerAttemptPage";
import { MergerTargetSettingsPage } from "../pages/MergerTargetSettingsPage";
import { RulesPage } from "../pages/RulesPage";
import { SettingsPage } from "../pages/SettingsPage";

export function App() {
  return (
    <GameProvider>
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
    </GameProvider>
  );
}

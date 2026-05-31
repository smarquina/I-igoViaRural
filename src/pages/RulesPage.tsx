import { useNavigate } from "react-router-dom";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { GameRulesOnboarding } from "../components/onboarding/GameRulesOnboarding";

export function RulesPage() {
  const navigate = useNavigate();
  const returnToMenu = () => navigate("/settings");

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex flex-1 items-center overflow-y-auto px-5 py-6" aria-label="Reglas del juego">
        <GameRulesOnboarding finalLabel="Volver al menú" onComplete={returnToMenu} onSkip={returnToMenu} />
      </main>
    </MobileShell>
  );
}

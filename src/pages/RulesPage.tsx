import { useNavigate } from "react-router-dom";
import { MobileShell } from "../components/layout/MobileShell";
import { MarketHeader } from "../components/market/MarketHeader";
import { GameRulesOnboarding } from "../components/onboarding/GameRulesOnboarding";
import { copy } from "../lang";

export function RulesPage() {
  const navigate = useNavigate();
  const returnToMenu = () => navigate("/settings");

  return (
    <MobileShell>
      <MarketHeader />
      <main className="flex flex-1 items-center overflow-y-auto px-5 py-6" aria-label={copy.rules.title}>
        <GameRulesOnboarding finalLabel={copy.rules.backToMenu} onComplete={returnToMenu} onSkip={returnToMenu} />
      </main>
    </MobileShell>
  );
}

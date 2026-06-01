import { faHandshakeSlash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGame } from "../app/GameContext";
import { GameResultScene } from "../components/game/GameResultScene";
import { copy } from "../lang";

export function HangoverPage() {
  const { state, startNewGame } = useGame();
  const navigate = useNavigate();

  const handleRestart = () => {
    startNewGame();
    navigate("/intro");
  };

  return (
    <GameResultScene
      state={state}
      backgroundImage="/resacon_toledo.avif"
      eyebrow={copy.hangover.eyebrow}
      title={copy.hangover.title}
      text={copy.hangover.text}
      alert={copy.hangover.alert}
      modalTitle={copy.hangover.modalTitle}
      modalText={copy.hangover.modalText}
      dismissLabel={copy.hangover.dismiss}
      icon={faHandshakeSlash}
      alertIcon={faTriangleExclamation}
      modalId="hangover-modal-title"
      accentClassName="text-broker-bearish"
      alertClassName="bg-broker-bearish text-white"
      modalBorderClassName="border-broker-bearish"
      modalTitleClassName="text-broker-bearish"
      titleClassName="text-broker-bearish"
      textClassName="text-white"
      headerClassName="rounded-md border border-broker-bearish/60 bg-black/85 p-4 shadow-danger"
      onRestart={handleRestart}
    />
  );
}

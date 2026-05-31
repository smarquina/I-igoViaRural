import type { AppConfig } from "../../domain/types";

interface ScoreProgressProps {
  config: AppConfig;
  score: number;
}

export function ScoreProgress({ config, score }: ScoreProgressProps) {
  const mergerTarget = config.mergerTargetScore;
  const markers = [
    { value: config.bailoutScore, label: "Rescate" },
    { value: config.criticalZoneScore, label: "Crítica" },
    { value: config.stableMarketScore, label: "Estable" },
    { value: config.hotMarketScore, label: "Caliente" },
    { value: mergerTarget, label: "Fusión" }
  ];
  const bailoutWidth = (config.bailoutScore / mergerTarget) * 100;
  const criticalWidth = ((config.criticalZoneScore - config.bailoutScore) / mergerTarget) * 100;
  const weakWidth = ((config.stableMarketScore - config.criticalZoneScore) / mergerTarget) * 100;
  const stableWidth = ((config.hotMarketScore - config.stableMarketScore) / mergerTarget) * 100;
  const hotWidth = ((mergerTarget - config.hotMarketScore) / mergerTarget) * 100;
  const clampedScore = Math.max(0, Math.min(score, mergerTarget));
  const percent = (clampedScore / mergerTarget) * 100;
  const markerLeft = `clamp(28px, ${percent}%, calc(100% - 28px))`;

  return (
    <div aria-label={`Progreso hacia la fusión: ${score} de ${mergerTarget} puntos`}>
      <div className="relative h-8 overflow-hidden rounded-full bg-broker-border">
        <div className="absolute inset-y-0 left-0 bg-broker-bearish" style={{ width: `${bailoutWidth}%` }} />
        <div className="absolute inset-y-0 bg-red-800" style={{ left: `${bailoutWidth}%`, width: `${criticalWidth}%` }} />
        <div className="absolute inset-y-0 bg-broker-warning" style={{ left: `${bailoutWidth + criticalWidth}%`, width: `${weakWidth}%` }} />
        <div className="absolute inset-y-0 bg-broker-green" style={{ left: `${bailoutWidth + criticalWidth + weakWidth}%`, width: `${stableWidth}%` }} />
        <div className="absolute inset-y-0 bg-broker-lime" style={{ left: `${bailoutWidth + criticalWidth + weakWidth + stableWidth}%`, width: `${hotWidth}%` }} />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/30"
          style={{ width: `${percent}%` }}
        />
        <div
          className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-broker-bg px-2 py-0.5 text-[11px] font-black text-broker-ink shadow-sm"
          style={{ left: markerLeft }}
          aria-label={`Valor actual: ${score} puntos`}
        >
          {score} pts
        </div>
      </div>
      <div className="relative mt-2 h-10 text-[10px] text-broker-muted">
        {markers.map((marker, index) => {
          const left = `${Math.min((marker.value / mergerTarget) * 100, 100)}%`;

          return (
            <span
              key={marker.value}
              className={`absolute bottom-0 whitespace-nowrap ${index === markers.length - 1 ? "-translate-x-full text-right" : "-translate-x-1/2 text-center"}`}
              style={{ left }}
            >
              <span className="mx-auto block h-1 w-px bg-slate-500" />
              <span className="block font-black text-broker-ink">{marker.value}</span>
              <span className="block">{marker.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

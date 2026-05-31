import { createChart, AreaSeries, LineStyle, type IChartApi, type ISeriesApi, type UTCTimestamp } from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";
import type { ScoreTimelinePoint } from "../../domain/types";
import { copy } from "../../lang";

interface MiniMarketChartProps {
  history: number[];
  timeline?: ScoreTimelinePoint[];
  showExtremes?: boolean;
  showExtremeSummary?: boolean;
}

export function MiniMarketChart({
  history,
  timeline,
  showExtremes = false,
  showExtremeSummary = true
}: MiniMarketChartProps) {
  const values = timeline && timeline.length > 0
    ? timeline.map((point) => point.score)
    : history.length > 1
      ? history
      : [history[0] ?? 100, history[0] ?? 100];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);
  const trend = values[values.length - 1] >= values[0] ? "#007a5e" : "#d10b23";
  const chartData = useMemo(
    () => {
      if (timeline && timeline.length > 0) {
        return timeline.map((point, index) => {
          const parsedTime = Math.floor(new Date(point.timestamp).getTime() / 1000);

          return {
            time: (Number.isFinite(parsedTime) ? parsedTime : 1_700_000_000 + index * 300) as UTCTimestamp,
            value: point.score
          };
        });
      }

      return values.map((value, index) => ({
        time: (1_700_000_000 + index * 300) as UTCTimestamp,
        value
      }));
    },
    [timeline, values]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container || container.clientWidth === 0) {
      return undefined;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: showExtremes ? 192 : 64,
      layout: {
        background: { color: "transparent" },
        textColor: "#767676",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: "#ebeff2" }
      },
      rightPriceScale: {
        borderVisible: false,
        visible: showExtremes
      },
      timeScale: {
        borderVisible: false,
        visible: showExtremes,
        timeVisible: true
      },
      crosshair: {
        mode: 0
      },
      handleScroll: false,
      handleScale: false
    });

    const series = chart.addSeries(AreaSeries, {
      topColor: `${trend}33`,
      bottomColor: `${trend}00`,
      lineColor: trend,
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: false
    });

    series.setData(chartData);
    series.createPriceLine({
      price: max,
      color: "#6dc600",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: showExtremes,
      lineVisible: showExtremes,
      title: copy.market.chartExtremeMax
    });
    series.createPriceLine({
      price: min,
      color: "#d10b23",
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      axisLabelVisible: showExtremes,
      lineVisible: showExtremes,
      title: copy.market.chartExtremeMin
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;

    const resizeChart = () => {
      if (container.clientWidth > 0) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [chartData, max, min, showExtremes, trend]);

  return (
    <div>
      <div
        ref={containerRef}
        className={showExtremes ? "h-48 w-full" : "h-16 w-full"}
        role="img"
        aria-label={copy.market.chartEvolution(max, min)}
      />
      {showExtremes && showExtremeSummary ? (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-md bg-broker-soft px-3 py-2">
            <span className="block text-broker-muted">{copy.market.sessionMax}</span>
            <strong className="text-base text-broker-greenDark">{max} {copy.common.pointsShort}</strong>
          </div>
          <div className="rounded-md bg-broker-bg px-3 py-2">
            <span className="block text-broker-muted">{copy.market.sessionMin}</span>
            <strong className="text-base text-broker-bearish">{min} {copy.common.pointsShort}</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
}

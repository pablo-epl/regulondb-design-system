import { useMemo, type ReactNode } from "react";
import { cn, formatCoordinate } from "../../lib/utils";

/* ============================================================================
   GrowthChart
   ----------------------------------------------------------------------------
   Hand-rolled SVG line / stacked-area chart for cumulative-by-version data.
   No deps; uses the design system color tokens.

   Two modes:
     "line"    : each series rendered as a separate polyline (default).
     "stacked" : series stacked vertically as a stacked-area chart.

   Data shape:
     xLabels: string[]            — version labels along the x-axis
     series:  { label, color, values: number[] }[]
   Each `series.values` must have the same length as xLabels.
   ============================================================================ */

export type GrowthChartMode = "line" | "stacked";

export interface GrowthSeries {
  /** Series label shown in the legend + on hover. */
  label: ReactNode;
  /** Stroke / fill color. Use a token reference (var(--blue-2)) or hex. */
  color: string;
  /** Cumulative value at each x position. Length must match xLabels. */
  values: number[];
}

export interface GrowthChartProps {
  xLabels: string[];
  series: GrowthSeries[];
  mode?: GrowthChartMode;
  /** Optional title shown above the chart. */
  title?: ReactNode;
  /** Optional milestone annotations: { x: index, label: string }. */
  milestones?: { x: number; label: string }[];
  width?: number;
  height?: number;
  className?: string;
}

const PAD_TOP    = 20;
const PAD_RIGHT  = 24;
const PAD_BOTTOM = 36;
const PAD_LEFT   = 56;

export const GrowthChart = ({
  xLabels, series, mode = "line", title,
  milestones, width = 720, height = 320, className,
}: GrowthChartProps) => {
  const innerW = width - PAD_LEFT - PAD_RIGHT;
  const innerH = height - PAD_TOP - PAD_BOTTOM;

  // Compute per-x stacked totals when in stacked mode.
  const { points, yMax } = useMemo(() => {
    if (mode === "stacked") {
      const stacked = series.map((s) => s.values.map(() => 0));
      for (let xi = 0; xi < xLabels.length; xi++) {
        let acc = 0;
        for (let si = 0; si < series.length; si++) {
          acc += series[si].values[xi] ?? 0;
          stacked[si][xi] = acc;
        }
      }
      const yMax = Math.max(...stacked[stacked.length - 1] ?? [1], 1);
      return { points: stacked, yMax };
    }
    const yMax = Math.max(...series.flatMap((s) => s.values), 1);
    return { points: series.map((s) => s.values), yMax };
  }, [series, xLabels.length, mode]);

  const xScale = (i: number) =>
    PAD_LEFT + (xLabels.length === 1 ? innerW / 2 : (innerW * i) / (xLabels.length - 1));
  const yScale = (v: number) => PAD_TOP + innerH - (innerH * v) / yMax;

  // Y-axis ticks: round numbers below yMax.
  const tickStep = niceStep(yMax / 5);
  const ticks: number[] = [];
  for (let v = 0; v <= yMax + tickStep / 2; v += tickStep) ticks.push(v);

  // Build paths.
  const linePath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i).toFixed(1)} ${yScale(v).toFixed(1)}`).join(" ");

  const areaPath = (top: number[], bottom: number[]) =>
    `M ${xScale(0)} ${yScale(top[0])} ` +
    top.slice(1).map((v, i) => `L ${xScale(i + 1)} ${yScale(v)}`).join(" ") +
    ` L ${xScale(bottom.length - 1)} ${yScale(bottom[bottom.length - 1])} ` +
    bottom.slice(0, -1).reverse().map((v, i) => `L ${xScale(bottom.length - 2 - i)} ${yScale(v)}`).join(" ") +
    " Z";

  return (
    <div className={cn("growth-chart", className)}>
      <div className="growth-chart__head">
        {title && <div className="growth-chart__title">{title}</div>}
        <div className="growth-chart__legend">
          {series.map((s, i) => (
            <span key={i}>
              <span className="growth-chart__swatch" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={typeof title === "string" ? title : "Growth chart"}>
        {/* Y grid + tick labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD_LEFT} y1={yScale(t)} x2={width - PAD_RIGHT} y2={yScale(t)}
                  stroke="var(--border-subtle)" strokeWidth="1" />
            <text x={PAD_LEFT - 8} y={yScale(t) + 4} textAnchor="end"
                  fontFamily="Courier New, ui-monospace, monospace" fontSize="11"
                  fill="var(--text-tertiary)">
              {formatCoordinate(Math.round(t))}
            </text>
          </g>
        ))}
        {/* X labels */}
        {xLabels.map((label, i) => (
          <text key={i} x={xScale(i)} y={height - 12} textAnchor="middle"
                fontFamily="Courier New, ui-monospace, monospace" fontSize="11"
                fill="var(--text-tertiary)">
            {label}
          </text>
        ))}
        {/* Milestone annotations */}
        {milestones?.map((m, i) => (
          <g key={i}>
            <line x1={xScale(m.x)} y1={PAD_TOP} x2={xScale(m.x)} y2={height - PAD_BOTTOM}
                  stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
            <text x={xScale(m.x)} y={PAD_TOP - 6} textAnchor="middle"
                  fontFamily="Arial" fontWeight="700" fontSize="11" fill="var(--accent)">
              {m.label}
            </text>
          </g>
        ))}
        {/* Series */}
        {mode === "stacked"
          ? points.map((vals, i) => {
              const bottom = i === 0 ? vals.map(() => 0) : points[i - 1];
              return (
                <g key={i}>
                  <path d={areaPath(vals, bottom)} fill={series[i].color} opacity="0.85" />
                  <path d={linePath(vals)} fill="none" stroke={series[i].color} strokeWidth="1.5" />
                </g>
              );
            })
          : series.map((s, i) => (
              <g key={i}>
                <path d={linePath(s.values)} fill="none" stroke={s.color} strokeWidth="2" />
                {s.values.map((v, j) => (
                  <circle key={j} cx={xScale(j)} cy={yScale(v)} r="3" fill={s.color}>
                    <title>{`${s.label} · ${xLabels[j]} · ${formatCoordinate(v)}`}</title>
                  </circle>
                ))}
              </g>
            ))}
      </svg>
    </div>
  );
};

/** Round step size to a nice multiple of 1, 2, 2.5, or 5 × 10^n. */
function niceStep(rough: number): number {
  if (rough <= 0) return 1;
  const exp = Math.floor(Math.log10(rough));
  const f = rough / Math.pow(10, exp);
  const nice = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  return nice * Math.pow(10, exp);
}

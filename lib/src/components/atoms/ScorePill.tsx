import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/* ============================================================================
   ScorePill
   ----------------------------------------------------------------------------
   A pill that shows a 0–1 score with a colored band reflecting the value.
   Used by the Regulatory Rewiring Index (RRI) and any other compact metric
   where the visual cue matters as much as the number. The band hue is fixed
   to the project's evidence palette so a "0.34" reads consistently across
   pages.

   Bands (default thresholds; can be overridden via `band` prop):
     - low      ≤ 0.25  conserved / good — blue-2
     - medium   ≤ 0.55  partial          — accent
     - high     ≤ 0.80  rewired          — orange (warning)
     - extreme  >  0.80 highly rewired   — error
   ============================================================================ */

export type ScoreBand = "low" | "medium" | "high" | "extreme";

const BAND_FOR = (v: number): ScoreBand =>
  v <= 0.25 ? "low" : v <= 0.55 ? "medium" : v <= 0.80 ? "high" : "extreme";

export interface ScorePillProps {
  /** Score in [0, 1]. */
  value: number;
  /** Optional override band — defaults to a threshold of `value`. */
  band?: ScoreBand;
  /** Optional label rendered before the score (e.g. "RRI"). */
  label?: ReactNode;
  /** Optional aria-label override. */
  ariaLabel?: string;
  /** Number of decimals to render. Default 2. */
  digits?: number;
  className?: string;
}

export const ScorePill = ({
  value, band, label, ariaLabel, digits = 2, className,
}: ScorePillProps) => {
  const clamped = Math.max(0, Math.min(1, value));
  const b = band ?? BAND_FOR(clamped);
  const txt = clamped.toFixed(digits);
  return (
    <span
      className={cn("score-pill", `score-pill--${b}`, className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clamped}
      aria-label={ariaLabel ?? `${label ? `${typeof label === "string" ? label + " " : ""}` : ""}score ${txt}`}
    >
      {label && <span className="score-pill__label">{label}</span>}
      <span className="score-pill__bar" aria-hidden="true">
        <span className="score-pill__fill" style={{ width: `${clamped * 100}%` }} />
      </span>
      <span className="score-pill__value">{txt}</span>
    </span>
  );
};

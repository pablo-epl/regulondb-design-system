import type { ReactNode } from "react";
import { cn, formatCoordinate } from "../../lib/utils";

/* ============================================================================
   StatCardWithDelta
   ----------------------------------------------------------------------------
   A single headline metric for a release-history / dashboard top row:
   icon + label + current value + signed delta vs a reference version.

   Delta tone is computed from the sign:
     positive  → blue  (additions are good)
     negative  → error (regressions are visible)
     zero      → muted (no change)

   The component never decides what "good" means — pass `tone` to override
   if a positive number should be displayed as a regression (rare).
   ============================================================================ */

export interface StatCardWithDeltaProps {
  /** Icon node — typically <Icon name=".." /> at 18-24 px. */
  icon?: ReactNode;
  /** Short, sentence-case label (e.g. "Genes"). */
  label: ReactNode;
  /** Current value. Numbers are formatted with comma separators. */
  value: number | string;
  /** Signed delta. `null` hides the delta row. */
  delta?: number | null;
  /** Reference release the delta is computed against (e.g. "v13.5"). */
  deltaRef?: string;
  /** Override the auto-computed tone. */
  tone?: "neutral" | "positive" | "negative";
  className?: string;
}

const fmt = (v: number | string) =>
  typeof v === "number" ? formatCoordinate(v) : v;

const toneClass = (tone: NonNullable<StatCardWithDeltaProps["tone"]>) =>
  tone === "positive" ? "stat-delta--positive"
  : tone === "negative" ? "stat-delta--negative"
                        : "stat-delta--neutral";

export const StatCardWithDelta = ({
  icon, label, value, delta, deltaRef, tone, className,
}: StatCardWithDeltaProps) => {
  const resolvedTone = tone
    ?? (delta == null || delta === 0 ? "neutral" : delta > 0 ? "positive" : "negative");
  const deltaText = delta == null
    ? null
    : delta === 0
      ? `unchanged${deltaRef ? ` since ${deltaRef}` : ""}`
      : `${delta > 0 ? "+" : ""}${formatCoordinate(delta)}${deltaRef ? ` since ${deltaRef}` : ""}`;

  return (
    <div className={cn("stat-card-delta", className)}>
      {icon && <span className="stat-card-delta__icon" aria-hidden="true">{icon}</span>}
      <div className="stat-card-delta__body">
        <div className="stat-card-delta__label">{label}</div>
        <div className="stat-card-delta__value">{fmt(value)}</div>
        {deltaText && (
          <div className={cn("stat-card-delta__delta", toneClass(resolvedTone))}>
            {deltaText}
          </div>
        )}
      </div>
    </div>
  );
};

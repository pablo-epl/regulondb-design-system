import { useState, type ReactNode } from "react";
import { LevelPicker, type ExplainerLevel } from "../atoms/LevelPicker";
import { Spinner } from "../atoms/Decoration";
import { Button } from "../atoms/Button";
import { cn } from "../../lib/utils";

/* ============================================================================
   ExplainerPanel
   ----------------------------------------------------------------------------
   Page-side variant of the assistant — the "(c) per-page explainer" flavor.
   Lives inside an object page (gene, TF, regulon, …) and emits a single
   audience-tunable summary of what the user is looking at.

   The component is presentation-only: the consumer passes `levels`, a record
   from each ExplainerLevel to its rendered body. Switching the level swaps
   the visible body without re-fetching anything. `onRegenerate` triggers a
   call back to the data layer when the page-context changes (e.g. user
   navigates to a new gene).

   Slots
   - `cites` : citation chips strip rendered below the body
   - `actions` : optional extra buttons (e.g. "Open in chat", "Copy")
   ============================================================================ */

export interface ExplainerPanelProps {
  /** Body for each audience level. Missing keys disable that tab. */
  levels: Partial<Record<ExplainerLevel, ReactNode>>;
  /** Default level to show. */
  defaultLevel?: ExplainerLevel;
  /** Optional citation chips strip. */
  cites?: ReactNode;
  /** Loading state — replaces the body with a spinner. */
  loading?: boolean;
  /** Show a "Regenerate" button on the right of the level picker. */
  onRegenerate?: () => void;
  /** Extra trailing actions (after Regenerate). */
  actions?: ReactNode;
  /** Heading. */
  title?: ReactNode;
  className?: string;
}

export const ExplainerPanel = ({
  levels, defaultLevel = "postdoc", cites, loading,
  onRegenerate, actions, title = "About this page", className,
}: ExplainerPanelProps) => {
  const [level, setLevel] = useState<ExplainerLevel>(defaultLevel);
  const body = levels[level] ?? levels[defaultLevel] ?? null;

  return (
    <section className={cn("explainer-panel", className)} aria-label="Page summary">
      <div className="explainer-panel__head">
        <div className="explainer-panel__title">
          <span className="explainer-panel__sparkle" aria-hidden="true">✦</span>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)" }}>
          <LevelPicker value={level} onChange={setLevel} />
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading}>
              Regenerate
            </Button>
          )}
          {actions}
        </div>
      </div>
      <div className="explainer-panel__body">
        {loading ? <Spinner label="Generating summary" /> : body}
      </div>
      {cites && <div className="explainer-panel__cites">{cites}</div>}
    </section>
  );
};

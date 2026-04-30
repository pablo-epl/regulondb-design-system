import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/* ============================================================================
   ReleaseHighlight
   ----------------------------------------------------------------------------
   Color-coded one-liner banner for a "what changed" release item. Tones reuse
   the evidence palette so the page palette stays disciplined:
     feature    → curated  (blue)   — new capability
     data       → ht       (purple) — data ingest
     structural → predicted (accent) — schema / taxonomy change
     note       → weak     (error)  — breaking / deprecation note
   ============================================================================ */

export type ReleaseHighlightTone = "feature" | "data" | "structural" | "note";

export interface ReleaseHighlightProps {
  tone: ReleaseHighlightTone;
  /** One-line headline. */
  title: ReactNode;
  /** Optional second line (smaller, dim). */
  description?: ReactNode;
  /** Optional version tag prepended to the headline (e.g. "v12.0.3"). */
  version?: string;
  className?: string;
}

const TONE_CLASS: Record<ReleaseHighlightTone, string> = {
  feature:    "release-highlight--feature",
  data:       "release-highlight--data",
  structural: "release-highlight--structural",
  note:       "release-highlight--note",
};

export const ReleaseHighlight = ({
  tone, title, description, version, className,
}: ReleaseHighlightProps) => (
  <div className={cn("release-highlight", TONE_CLASS[tone], className)} role="note">
    {version && <span className="release-highlight__version">{version}</span>}
    <div className="release-highlight__body">
      <div className="release-highlight__title">{title}</div>
      {description && <div className="release-highlight__desc">{description}</div>}
    </div>
  </div>
);

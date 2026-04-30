import type { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import { cn } from "../../lib/utils";

/* ============================================================================
   ConservationCell
   ----------------------------------------------------------------------------
   A single cell in a pan-regulome / conservation grid. Each cell reports
   one (orthogroup × organism) intersection and tells the reader at a
   glance whether the regulator is conserved, divergent, or absent.

   States
     - conserved  : same regulator + same direction (✓)
     - divergent  : a regulator is present but is not the ortholog of the
                    reference one (e.g. AraR in B. subtilis vs AraC in
                    E. coli) — rendered with a "⤺" wrap arrow
     - absent     : no regulatory edge curated for this orthogroup in this
                    organism (—)
     - unknown    : the orthogroup is not curated yet in this organism (·)

   The cell is intentionally compact (single character + tooltip) so a
   pan-regulome of dozens of orthogroups across 3+ organisms still fits
   on a single screen. The full tooltip carries the regulator symbol +
   evidence so a curator can read the cell without leaving the grid.
   ============================================================================ */

export type ConservationState = "conserved" | "divergent" | "absent" | "unknown";

const ICON: Record<ConservationState, string> = {
  conserved: "✓",  // ✓
  divergent: "↺",  // ↺
  absent:    "—",  // —
  unknown:   "·",  // ·
};

const ARIA: Record<ConservationState, string> = {
  conserved: "Conserved",
  divergent: "Divergent regulator",
  absent:    "Absent",
  unknown:   "Not curated",
};

export interface ConservationCellProps {
  state: ConservationState;
  /** Regulator symbol for this cell, if any (rendered in the tooltip). */
  regulator?: ReactNode;
  /** Free-form tooltip content (supersedes the default tooltip). */
  tooltip?: ReactNode;
  className?: string;
}

export const ConservationCell = ({
  state, regulator, tooltip, className,
}: ConservationCellProps) => {
  const inner = (
    <span
      className={cn("cons-cell", `cons-cell--${state}`, className)}
      role="img"
      aria-label={`${ARIA[state]}${regulator ? ` (${typeof regulator === "string" ? regulator : ""})` : ""}`}
    >
      {ICON[state]}
    </span>
  );
  const tip = tooltip ?? (
    <>
      <strong>{ARIA[state]}</strong>
      {regulator && <> · regulator: {regulator}</>}
    </>
  );
  return <Tooltip label={tip}>{inner}</Tooltip>;
};

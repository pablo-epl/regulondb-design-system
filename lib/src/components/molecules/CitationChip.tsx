import type { ReactNode } from "react";
import { ObjectTypeTag, type ObjectType } from "./ObjectTypeTag";
import { cn } from "../../lib/utils";

/* ============================================================================
   CitationChip
   ----------------------------------------------------------------------------
   A compact pill linking back to the source object underlying an assistant
   answer. Clicking navigates to the gene/TF/regulon page. The dot color
   echoes the ObjectTypeTag palette so the chip is recognisable in a row.
   ============================================================================ */

export interface CitationChipProps {
  type: ObjectType;
  label: ReactNode;
  href: string;
  /** Optional smaller secondary label (e.g. organism: "E. coli"). */
  meta?: ReactNode;
  className?: string;
}

export const CitationChip = ({ type, label, href, meta, className }: CitationChipProps) => (
  <a href={href} className={cn("citation-chip", className)}>
    <ObjectTypeTag type={type} className="citation-chip__type" />
    <span className="citation-chip__label">{label}</span>
    {meta && <span className="citation-chip__meta">{meta}</span>}
  </a>
);

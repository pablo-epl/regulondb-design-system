import type { ReactNode } from "react";
import { EvidenceBadge, type EvidenceCode, type EvidenceCategory } from "./EvidenceBadge";

export type RegulatoryEffect = "activates" | "represses" | "binds" | "unknown";
const GLYPH: Record<RegulatoryEffect, ReactNode> = {
  activates: "→", represses: "⊣", binds: "≡", unknown: "?",
};

export interface EvidencePairProps {
  code: EvidenceCode | string;
  category?: EvidenceCategory;
  effect: RegulatoryEffect;
  label?: ReactNode;
}

export const EvidencePair = ({ code, category, effect, label }: EvidencePairProps) => (
  <span className="ev-pair">
    <EvidenceBadge code={code} category={category} showTooltip={false} />
    <span className="glyph" aria-hidden="true">{GLYPH[effect]}</span>
    <span>{label ?? effect}</span>
  </span>
);

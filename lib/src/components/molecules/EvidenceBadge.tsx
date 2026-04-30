import { Tooltip } from "./Tooltip";
import { cn } from "../../lib/utils";

export type EvidenceCategory = "curated" | "predicted" | "ht" | "weak";
export type EvidenceCode =
  | "IDA" | "IEP" | "IPI" | "IGI" | "IMP" | "IC" | "TAS"
  | "IEA" | "HT" | "NAS";

const PHRASE: Record<EvidenceCode, string> = {
  IDA: "Inferred from Direct Assay",
  IEP: "Inferred from Expression Pattern",
  IPI: "Inferred from Physical Interaction",
  IGI: "Inferred from Genetic Interaction",
  IMP: "Inferred from Mutant Phenotype",
  IC:  "Inferred by Curator",
  TAS: "Traceable Author Statement",
  IEA: "Inferred from Electronic Annotation",
  HT:  "High-throughput dataset",
  NAS: "Non-traceable / weak",
};
const CATEGORY: Record<EvidenceCode, EvidenceCategory> = {
  IDA: "curated", IEP: "curated", IPI: "curated", IGI: "curated", IMP: "curated", IC: "curated", TAS: "curated",
  IEA: "predicted", HT: "ht", NAS: "weak",
};

export interface EvidenceBadgeProps {
  code: EvidenceCode | string;
  category?: EvidenceCategory;
  showTooltip?: boolean;
  className?: string;
}

export const EvidenceBadge = ({ code, category, showTooltip = true, className }: EvidenceBadgeProps) => {
  const cat = category ?? CATEGORY[code as EvidenceCode] ?? "curated";
  const phrase = PHRASE[code as EvidenceCode];
  const badge = <span className={cn("ev-badge", `ev-badge--${cat}`, className)}>{code}</span>;
  return showTooltip && phrase ? <Tooltip label={phrase}>{badge}</Tooltip> : badge;
};

import { GeneContextStrip, type StripGene, type StripPromoter, type StripOperator, type StripTFBS } from "./GeneContextStrip";

/* ============================================================================
   PromoterArchitectureDiagram
   ----------------------------------------------------------------------------
   Specialization of GeneContextStrip for the three canonical multi-gene
   promoter topologies.

       divergent  ←gene_A  P→  P←  gene_B→
       convergent gene_A→  →P  P←  ←gene_B
       tandem     gene_A→  P→  gene_B→  P→ gene_C→

   The diagram renders each gene + its labeled promoter and any associated
   operators / TFBSs. Topology is informational — it picks default strand
   orientations and centers the layout — but the user may always override.
   ============================================================================ */

export type PromoterTopology = "divergent" | "convergent" | "tandem";

export interface PromoterArchPair {
  /** Gene symbol on the LEFT side of the locus. */
  geneLeft:  string;
  /** Gene symbol on the RIGHT side of the locus. */
  geneRight: string;
  /** Optional 3rd gene for `tandem`. */
  geneRight2?: string;
  /** Promoter labels in canonical order (varies by topology). */
  promoterLabels?: string[];
  /** Optional operator boxes pinned between the genes. */
  operators?: { label: string; factor?: string }[];
  /** Optional TFBS marks (CRP, IHF, etc). */
  tfbs?: { factor: string; label?: string }[];
}

export interface PromoterArchitectureDiagramProps {
  topology: PromoterTopology;
  data: PromoterArchPair;
  height?: number;
  width?: number;
}

/** Lays out genes/promoters/operators on a synthetic 0–1000 bp axis based on topology. */
function layout(t: PromoterTopology, d: PromoterArchPair): {
  span: { start: number; end: number };
  genes: StripGene[];
  promoters: StripPromoter[];
  operators: StripOperator[];
  tfbs: StripTFBS[];
} {
  const span = { start: 0, end: 1000 };

  const operators: StripOperator[] = (d.operators ?? []).map((o, i) => ({
    id: `op-${i}`,
    start: 470 + i * 18, end: 484 + i * 18,
    label: o.label, factor: o.factor, evidence: "curated",
  }));
  const tfbs: StripTFBS[] = (d.tfbs ?? []).map((t, i) => ({
    factor: t.factor, label: t.label, position: 560 + i * 30,
  }));

  switch (t) {
    case "divergent": {
      // gene_A is reverse-strand on the left, gene_B is forward-strand on the right.
      // Two promoters meet head-to-head between them.
      return {
        span,
        genes: [
          { symbol: d.geneLeft,  start: 80,  end: 460, strand: "-", focal: true },
          { symbol: d.geneRight, start: 540, end: 920, strand: "+", focal: true },
        ],
        promoters: [
          { id: "pl", position: 470, direction: "-", label: d.promoterLabels?.[0] ?? `P_${d.geneLeft}` },
          { id: "pr", position: 530, direction: "+", label: d.promoterLabels?.[1] ?? `P_${d.geneRight}` },
        ],
        operators, tfbs,
      };
    }
    case "convergent": {
      // gene_A → →P then P← ← gene_B (3' ends face each other)
      return {
        span,
        genes: [
          { symbol: d.geneLeft,  start: 80,  end: 440, strand: "+", focal: true },
          { symbol: d.geneRight, start: 560, end: 920, strand: "-", focal: true },
        ],
        promoters: [
          { id: "pl", position: 70,  direction: "+", label: d.promoterLabels?.[0] ?? `P_${d.geneLeft}` },
          { id: "pr", position: 930, direction: "-", label: d.promoterLabels?.[1] ?? `P_${d.geneRight}` },
        ],
        operators, tfbs,
      };
    }
    case "tandem": {
      // gene_A → ; P → gene_B → ; P → gene_C →   (all forward)
      const right2 = d.geneRight2 ?? `${d.geneRight}'`;
      return {
        span: { start: 0, end: 1500 },
        genes: [
          { symbol: d.geneLeft,   start:   60, end:  420, strand: "+", focal: true },
          { symbol: d.geneRight,  start:  500, end:  900, strand: "+", focal: true },
          { symbol: right2,       start:  970, end: 1430, strand: "+", focal: true },
        ],
        promoters: [
          { id: "p0", position:  50, direction: "+", label: d.promoterLabels?.[0] ?? `P_${d.geneLeft}` },
          { id: "p1", position: 480, direction: "+", label: d.promoterLabels?.[1] ?? `P_${d.geneRight}` },
          { id: "p2", position: 950, direction: "+", label: d.promoterLabels?.[2] ?? `P_${right2}` },
        ],
        operators: operators.map((o, i) => ({ ...o, start: 460 + i * 30, end: 472 + i * 30 })),
        tfbs:      tfbs.map((t, i) => ({ ...t, position: 920 + i * 30 })),
      };
    }
  }
}

const TOPOLOGY_TITLE: Record<PromoterTopology, string> = {
  divergent:  "Divergent promoters",
  convergent: "Convergent promoters",
  tandem:     "Tandem promoters",
};

export const PromoterArchitectureDiagram = ({
  topology, data, height = 220, width,
}: PromoterArchitectureDiagramProps) => {
  const laid = layout(topology, data);
  return (
    <figure style={{ margin: 0 }}>
      <figcaption style={{
        fontSize: "var(--fs-mono-sm)", textTransform: "uppercase",
        letterSpacing: "0.06em", color: "var(--text-tertiary)", fontWeight: 700,
        marginBottom: "var(--sp-2)",
      }}>
        {TOPOLOGY_TITLE[topology]}
      </figcaption>
      <GeneContextStrip
        span={laid.span}
        genes={laid.genes}
        promoters={laid.promoters}
        operators={laid.operators}
        tfbs={laid.tfbs}
        width={width ?? (topology === "tandem" ? 1100 : 800)}
        height={height}
      />
    </figure>
  );
};

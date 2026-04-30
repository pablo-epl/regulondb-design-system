import { useMemo } from "react";
import { formatCoordinate } from "../../lib/utils";

/* ============================================================================
   GeneContextStrip
   ----------------------------------------------------------------------------
   Hand-drawn-feeling SVG of a chromosomal locus: backbone, neighbor genes,
   the focal gene(s), promoters with their −10/−35 if known, operators (TFBSs)
   and effector tags (e.g. CRP). The canonical reference is the `araC` SVG
   in spec/05-organisms.html — this component reproduces the same geometry,
   parameterized for any locus.

   Coordinates are real bp values; the component scales them linearly to the
   pixel viewport. All elements have ARIA labels so the picture is readable
   to a screen reader.
   ============================================================================ */

export type Strand = "+" | "-";
export type EvidenceCat = "curated" | "predicted" | "ht";

export interface StripGene {
  symbol: string;
  start: number;        // bp
  end: number;          // bp
  strand: Strand;
  /** True for the locus' focal gene(s). */
  focal?: boolean;
  color?: string;       // override fill
}
export interface StripPromoter {
  id: string;
  position: number;     // bp (TSS)
  direction: Strand;
  label?: string;       // e.g. "P_BAD"
}
export interface StripOperator {
  id: string;
  start: number;
  end: number;
  label?: string;       // e.g. "araI1"
  factor?: string;      // e.g. "AraC"
  evidence?: EvidenceCat;
}
export interface StripTFBS {
  factor: string;       // "CRP"
  position: number;     // bp center
  label?: string;
}

export interface GeneContextStripProps {
  /** Inclusive bp range to render. */
  span: { start: number; end: number };
  genes: StripGene[];
  promoters?: StripPromoter[];
  operators?: StripOperator[];
  tfbs?: StripTFBS[];
  /** Pixel height; width is responsive. */
  height?: number;
  /** Width of the SVG viewBox in user units (not pixels). */
  width?: number;
}

const COLORS = {
  focal: "var(--accent)",
  fwd:   "var(--blue-2)",
  rev:   "var(--blue-2)",
  neighbor: "var(--grey-3)",
  operator: "var(--obj-tf)",
  tfbs:     "var(--obj-regulon)",
  promoter: "var(--blue-3)",
  promoterReverse: "var(--accent)",
} as const;

const tickValues = (start: number, end: number, count = 5) => {
  const out: number[] = [];
  const step = (end - start) / (count - 1);
  for (let i = 0; i < count; i++) out.push(Math.round(start + i * step));
  return out;
};

export const GeneContextStrip = ({
  span, genes, promoters = [], operators = [], tfbs = [],
  height = 200, width = 800,
}: GeneContextStripProps) => {
  const { start, end } = span;
  const px = useMemo(() => {
    const margin = 40;
    const usable = width - margin * 2;
    return {
      x: (bp: number) => margin + ((bp - start) / (end - start)) * usable,
      backboneY: height / 2,
      geneTop:    height / 2 - 20,
      geneBottom: height / 2 + 20,
    };
  }, [start, end, width, height]);

  // Arrow polygon for a gene, oriented by strand.
  const geneShape = (g: StripGene) => {
    const x1 = px.x(g.start), x2 = px.x(g.end);
    const head = 14;
    if (g.strand === "+") {
      return `M${x1},${px.geneTop} L${x2 - head},${px.geneTop} L${x2},${px.backboneY} L${x2 - head},${px.geneBottom} L${x1},${px.geneBottom} Z`;
    }
    return `M${x1 + head},${px.geneTop} L${x2},${px.geneTop} L${x2},${px.geneBottom} L${x1 + head},${px.geneBottom} L${x1},${px.backboneY} Z`;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Genomic context from ${formatCoordinate(start)} to ${formatCoordinate(end)} bp; ${genes.length} genes, ${promoters.length} promoters, ${operators.length} operators`}
      style={{ width: "100%", display: "block", height }}
    >
      <title>Gene context strip</title>

      {/* Backbone + ticks */}
      <line x1={px.x(start)} y1={px.backboneY} x2={px.x(end)} y2={px.backboneY}
            stroke="var(--text-primary)" strokeWidth="2" />
      <g fontFamily="Courier New" fontSize="10" fill="var(--text-tertiary)">
        {tickValues(start, end, 5).map((bp) => (
          <g key={bp}>
            <line x1={px.x(bp)} y1={px.backboneY - 4} x2={px.x(bp)} y2={px.backboneY + 4} stroke="var(--text-tertiary)" />
            <text x={px.x(bp)} y={px.backboneY + 22} textAnchor="middle">{formatCoordinate(bp)}</text>
          </g>
        ))}
      </g>

      {/* Genes */}
      {genes.map((g) => {
        const fill = g.color
          ?? (g.focal ? COLORS.focal : g.strand === "+" ? COLORS.fwd : COLORS.rev);
        return (
          <g key={`${g.symbol}-${g.start}`}>
            <path d={geneShape(g)} fill={fill} stroke={g.focal ? "var(--accent-light)" : "none"} strokeWidth="1" opacity={g.focal ? 1 : 0.85}>
              <title>{`${g.symbol} · ${formatCoordinate(g.start)}…${formatCoordinate(g.end)} · ${g.strand}`}</title>
            </path>
            <text x={(px.x(g.start) + px.x(g.end)) / 2} y={px.backboneY + 4}
                  textAnchor="middle" fontFamily="Arial" fontSize="13" fontStyle="italic"
                  fill="#fff">
              {g.symbol}
            </text>
          </g>
        );
      })}

      {/* Promoters — angle bracket above (forward) / below (reverse) */}
      {promoters.map((p) => {
        const x = px.x(p.position);
        const fwd = p.direction === "+";
        const baseY = fwd ? px.geneTop - 18 : px.geneBottom + 22;
        const tipY  = fwd ? px.geneTop - 2  : px.geneBottom + 2;
        const arrowX = fwd ? x + 14 : x - 14;
        const color = fwd ? COLORS.promoter : COLORS.promoterReverse;
        return (
          <g key={p.id}>
            <line x1={x} y1={baseY} x2={x} y2={tipY} stroke={color} strokeWidth="2"/>
            <line x1={x} y1={tipY} x2={arrowX} y2={tipY} stroke={color} strokeWidth="2"/>
            {p.label && (
              <text x={arrowX + (fwd ? 4 : -4)} y={tipY - 6}
                    textAnchor={fwd ? "start" : "end"}
                    fontFamily="Arial" fontWeight="700" fontSize="11" fill={color}>
                {p.label} {fwd ? "→" : "←"}
              </text>
            )}
          </g>
        );
      })}

      {/* Operators — small rects below the backbone */}
      {operators.map((op) => {
        const x1 = px.x(op.start), x2 = px.x(op.end);
        const y = px.geneBottom + 36;
        const w = Math.max(8, x2 - x1);
        const evColor = op.evidence === "predicted"
          ? "var(--accent)"
          : op.evidence === "ht" ? "var(--evidence-ht)" : COLORS.operator;
        return (
          <g key={op.id}>
            <rect x={x1} y={y} width={w} height={12}
                  fill={evColor} rx="2"
                  stroke={op.evidence === "predicted" ? "var(--accent-light)" : "none"}
                  strokeDasharray={op.evidence === "predicted" ? "3 2" : undefined}>
              <title>{`${op.factor ?? "operator"}${op.label ? " " + op.label : ""} · ${formatCoordinate(op.start)}…${formatCoordinate(op.end)}`}</title>
            </rect>
            {op.label && (
              <text x={(x1 + x2) / 2} y={y + 26}
                    textAnchor="middle" fontFamily="Courier New" fontSize="10" fill={evColor}>
                {op.label}
              </text>
            )}
          </g>
        );
      })}

      {/* TFBS marks (auxiliary single points like CRP) */}
      {tfbs.map((t) => {
        const x = px.x(t.position);
        const y = px.geneBottom + 52;
        return (
          <g key={`${t.factor}-${t.position}`}>
            <circle cx={x} cy={y} r="6" fill={COLORS.tfbs}>
              <title>{`${t.factor} binding site at ${formatCoordinate(t.position)}`}</title>
            </circle>
            <text x={x} y={y + 18} textAnchor="middle" fontFamily="Courier New" fontSize="10" fill={COLORS.tfbs}>
              {t.label ?? t.factor}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ----------------------------------------------------------------------------
   Sample dataset — the canonical araC locus.
   Use it as fixture for stories or as a regression target against the SVG
   embedded in spec/05-organisms.html.
   ---------------------------------------------------------------------------- */
export const ARAC_LOCUS: GeneContextStripProps = {
  span: { start: 70200, end: 71400 },
  genes: [
    { symbol: "yaaJ", start: 70200, end: 70370, strand: "+" }, // (illustrative)
    { symbol: "araC", start: 70387, end: 71265, strand: "-", focal: true },
    { symbol: "araB", start: 71300, end: 72100, strand: "+" }, // truncated for illustration
  ],
  promoters: [
    { id: "pBAD", position: 71300, direction: "+", label: "P_BAD" },
    { id: "pC",   position: 71290, direction: "-", label: "P_C" },
  ],
  operators: [
    { id: "araO1", start: 71270, end: 71288, label: "araO1", factor: "AraC", evidence: "curated" },
    { id: "araO2", start: 70380, end: 70400, label: "araO2", factor: "AraC", evidence: "curated" },
    { id: "araI1", start: 71292, end: 71305, label: "araI1", factor: "AraC", evidence: "curated" },
    { id: "araI2", start: 71306, end: 71318, label: "araI2", factor: "AraC", evidence: "curated" },
  ],
  tfbs: [
    { factor: "CRP", position: 71325, label: "CRP" },
  ],
};

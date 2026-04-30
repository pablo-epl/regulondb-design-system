import { TaxonName } from "../atoms/Scientific";
import { Link } from "../atoms/Typography";
import { formatCoordinate } from "../../lib/utils";

export interface ActiveOrganismCardProps {
  taxon: string;          // "Escherichia coli"
  strain?: string;        // "K-12 MG1655"
  stats: { genes: number; tfs: number; operons: number; regulons: number };
  onSwitch?: () => void;
}

export const ActiveOrganismCard = ({ taxon, strain, stats, onSwitch }: ActiveOrganismCardProps) => (
  <div className="active-org-card">
    <Link className="switch-link" onClick={onSwitch}>Switch organism →</Link>
    <div style={{ color: "var(--blue-4)", textTransform: "uppercase", letterSpacing: "0.06em",
                  fontSize: "var(--fs-mono-sm)", fontWeight: 700 }}>Active organism</div>
    <h2 style={{ color: "#fff", margin: "var(--sp-1) 0 var(--sp-3)" }}>
      <TaxonName strain={strain}>{taxon}</TaxonName>
    </h2>
    <div className="stats">
      <div className="stat"><span className="num">{formatCoordinate(stats.genes)}</span><span className="lbl">Genes</span></div>
      <div className="stat"><span className="num">{formatCoordinate(stats.tfs)}</span><span className="lbl">TFs</span></div>
      <div className="stat"><span className="num">{formatCoordinate(stats.operons)}</span><span className="lbl">Operons</span></div>
      <div className="stat"><span className="num">{formatCoordinate(stats.regulons)}</span><span className="lbl">Regulons</span></div>
    </div>
  </div>
);

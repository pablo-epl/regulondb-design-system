import { TaxonName } from "../atoms/Scientific";
import { formatCoordinate } from "../../lib/utils";

export interface OrganismPillProps {
  symbol: string;          // "Ec", "Se", "Bs"
  taxon: string;           // "E. coli", "S. enterica"
  strain?: string;         // "K-12 MG1655"
  count?: number;
  color?: string;
}

export const OrganismPill = ({ symbol, taxon, strain, count, color }: OrganismPillProps) => (
  <span className="org-pill">
    <span className="symbol" style={color ? { background: color } : undefined}>{symbol}</span>
    <TaxonName>{taxon}</TaxonName>
    {strain && <span className="strain">{strain}</span>}
    {count != null && <span className="count">{formatCoordinate(count)}</span>}
  </span>
);

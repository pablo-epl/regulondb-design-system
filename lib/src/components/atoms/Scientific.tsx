import type { ReactNode } from "react";
import { toSuperscript, formatCoordinate, cn } from "../../lib/utils";

/* The 7 scientific atoms.
   They look small but they are the brand's strongest identity contract:
   their existence as components — not raw <span>s — is what guarantees the
   nomenclature rules are actually applied across the product. */

/** Gene symbol — italic, lowercase. */
export const Gene = ({ children, className }: { children: ReactNode; className?: string }) =>
  <em className={cn("gene", className)}>{children}</em>;

/** Operon notation — italic, letters fused. */
export const OperonNotation = ({ children, className }: { children: ReactNode; className?: string }) =>
  <em className={cn("operon-notation", className)}>{children}</em>;

/** Protein symbol — roman, first letter uppercase. */
export const ProteinSymbol = ({ children, className }: { children: ReactNode; className?: string }) =>
  <span className={cn("protein", className)}>{children}</span>;

/** Taxonomic name — italic; optional roman strain follows. */
export const TaxonName = ({
  children, strain, className,
}: { children: ReactNode; strain?: string; className?: string }) => (
  <em className={cn("taxon", className)}>
    {children}
    {strain ? <> <span className="strain">{strain}</span></> : null}
  </em>
);

/** σ factor with Unicode superscript. <SigmaFactorLabel value={70} /> → σ⁷⁰ */
export const SigmaFactorLabel = ({ value }: { value: number }) =>
  <span className="sigma">σ{toSuperscript(value)}</span>;

/** Promoter position — Unicode minus + monospace. */
export const PromoterPositionLabel = ({ pos }: { pos: number }) =>
  <span className="promoter-pos">{pos < 0 ? `−${Math.abs(pos)}` : `+${pos}`}</span>;

/** Genomic coordinate — monospace + comma-thousand separator. */
export const Coordinate = ({ value, className }: { value: number; className?: string }) =>
  <span className={cn("coordinate", className)}>{formatCoordinate(value)}</span>;

import type { ReactNode } from "react";
import { Card } from "./Card";
import { Tag } from "../atoms/Decoration";
import { Button } from "../atoms/Button";
import { DOIBadge } from "../atoms/DOIBadge";
import { cn } from "../../lib/utils";

/* ============================================================================
   DatasetCard
   ----------------------------------------------------------------------------
   One row in the Datasets & Downloads page. Each card represents a citable
   artefact (gold-standard set, PWM library, pan-regulome TSV, reprocessed
   HT BigWigs, …) with its own DOI and version. The card composes existing
   primitives — Card + Tag chips for formats + DOIBadge — so curators get a
   consistent surface for "what is this, how do I cite it, where do I get
   it" without each release rolling its own page.

   Format chips render as Tag (not ObjectTypeTag) because formats aren't
   biological objects; "TSV" / "JSON-LD" / "RDF Turtle" / "BigWig" are
   serialisations.
   ============================================================================ */

export interface DatasetCardProps {
  id: string;             // e.g. "D-1"
  title: ReactNode;
  description: ReactNode;
  version: string;        // e.g. "v1.0"
  releaseDate: string;    // ISO yyyy-mm-dd
  doi: string;            // "10.5281/zenodo.123456"
  formats: string[];      // ["TSV", "JSON-LD", "RDF Turtle", "BigWig"]
  /** Human file size summary (e.g. "12 MB · 6 files"). */
  size?: string;
  /** License short label (e.g. "CC-BY 4.0"). */
  license?: string;
  /** Primary download href. */
  downloadHref?: string;
  /** Citation copy handler (typically opens a modal or copies BibTeX). */
  onCite?: () => void;
  className?: string;
}

export const DatasetCard = ({
  id, title, description, version, releaseDate, doi,
  formats, size, license, downloadHref, onCite, className,
}: DatasetCardProps) => (
  <Card variant="default" className={cn("dataset-card", className)}>
    <div className="dataset-card__head">
      <span className="dataset-card__id">{id}</span>
      <DOIBadge doi={doi} />
    </div>
    <h3 className="dataset-card__title">{title}</h3>
    <p className="dataset-card__desc">{description}</p>
    <dl className="dataset-card__meta">
      <div><dt>Version</dt><dd>{version}</dd></div>
      <div><dt>Released</dt><dd>{releaseDate}</dd></div>
      {size    && <div><dt>Size</dt><dd>{size}</dd></div>}
      {license && <div><dt>License</dt><dd>{license}</dd></div>}
    </dl>
    <div className="dataset-card__formats">
      {formats.map((f) => <Tag key={f}>{f}</Tag>)}
    </div>
    <div className="dataset-card__actions">
      <Button variant="primary" size="sm"
              {...(downloadHref ? { onClick: () => { window.location.href = downloadHref; } } : {})}>
        Download
      </Button>
      <Button variant="ghost" size="sm" onClick={onCite}>Cite this release</Button>
    </div>
  </Card>
);

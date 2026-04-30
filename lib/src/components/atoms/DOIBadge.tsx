import { cn } from "../../lib/utils";

/* ============================================================================
   DOIBadge
   ----------------------------------------------------------------------------
   A small monospace pill rendering a citable DOI ("10.5281/zenodo.XXXXXX").
   Used on release rows, dataset cards, and any artefact that has its own
   FAIR identifier. Clicking the badge opens https://doi.org/<doi> in a
   new tab; the leading "DOI" prefix doubles as a label and an external-
   link affordance. The badge is intentionally compact so it can sit
   inline next to a release version or a dataset title.
   ============================================================================ */

export interface DOIBadgeProps {
  /** DOI string without the resolver prefix, e.g. "10.5281/zenodo.123456". */
  doi: string;
  /** Optional override label, default "DOI". */
  label?: string;
  className?: string;
}

export const DOIBadge = ({ doi, label = "DOI", className }: DOIBadgeProps) => (
  <a
    className={cn("doi-badge", className)}
    href={`https://doi.org/${doi}`}
    target="_blank"
    rel="noreferrer noopener"
    aria-label={`Open DOI ${doi} in a new tab`}
  >
    <span className="doi-badge__label" aria-hidden="true">{label}</span>
    <code className="doi-badge__id">{doi}</code>
  </a>
);

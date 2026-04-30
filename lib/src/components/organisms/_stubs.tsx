/* Remaining low-API organisms.
   The interactive overlays (Dialog, OrganismDrawer, CommandPalette) and
   PromoterArchitectureDiagram, GeneContextStrip have moved out of this file
   and into their own modules — see the corresponding *.tsx alongside.

   The exports below are still light-weight: they have minimal APIs that real
   page composers can call, and they will grow features without breaking
   consumers. */

import type { ReactNode } from "react";
import { Card } from "../molecules/Card";

export const FacetedSidebar = ({ children }: { children: ReactNode }) =>
  <aside className="facet-side" aria-label="Filters">{children}</aside>;

export const ResultsList = ({ children }: { children: ReactNode }) => <div role="list">{children}</div>;

export const ObjectSummaryCard = ({ children }: { children: ReactNode }) => <Card>{children}</Card>;

export const ThemeToggle = ({ value = "auto", onChange }: { value?: "auto" | "light" | "dark"; onChange?: (v: "auto" | "light" | "dark") => void }) => (
  <div className="tabs tabs--segmented" role="tablist">
    {(["auto", "light", "dark"] as const).map((v) => (
      <button key={v} role="tab" aria-selected={v === value} onClick={() => onChange?.(v)}>{v}</button>
    ))}
  </div>
);

export const TweaksPanel = ({ children }: { children?: ReactNode }) =>
  <Card variant="sunken" header="Tweaks">{children ?? <p style={{ color: "var(--text-secondary)", margin: 0 }}>Layout · organism selector · accent · theme</p>}</Card>;

export interface CrossDBLinksProps { uniprot?: string; ecocyc?: string; ncbi?: string; alphafold?: string; pdb?: string }
export const CrossDBLinks = (p: CrossDBLinksProps) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    {p.uniprot   && <a className="link" href={p.uniprot}>UniProt</a>}
    {p.ecocyc    && <a className="link" href={p.ecocyc}>EcoCyc</a>}
    {p.ncbi      && <a className="link" href={p.ncbi}>NCBI Gene</a>}
    {p.alphafold && <a className="link" href={p.alphafold}>AlphaFold</a>}
    {p.pdb       && <a className="link" href={p.pdb}>PDB</a>}
  </div>
);

export const TaxonomicBreadcrumb = ({ path }: { path: string[] }) => (
  <nav className="breadcrumb" aria-label="Taxonomic breadcrumb">
    {path.map((p, i) => (
      <span key={i}>
        <span style={{ color: i === path.length - 1 ? "var(--text-primary)" : "var(--text-link)" }}>{p}</span>
        {i < path.length - 1 && <span className="sep" aria-hidden="true">›</span>}
      </span>
    ))}
  </nav>
);

export const EvidenceSummaryPanel = ({ counts }: { counts: { curated: number; predicted: number; ht: number; weak?: number } }) => {
  const total = counts.curated + counts.predicted + counts.ht + (counts.weak ?? 0);
  const seg = (n: number) => (total ? (n / total) * 100 : 0);
  return (
    <Card>
      <div style={{ height: 10, borderRadius: 999, overflow: "hidden", display: "flex", border: "1px solid var(--border-default)" }}>
        <span style={{ width: `${seg(counts.curated)}%`,   background: "var(--evidence-curated)" }} />
        <span style={{ width: `${seg(counts.predicted)}%`, background: "var(--evidence-predicted)" }} />
        <span style={{ width: `${seg(counts.ht)}%`,        background: "var(--evidence-ht)" }} />
        {counts.weak ? <span style={{ width: `${seg(counts.weak)}%`, background: "var(--evidence-weak)" }} /> : null}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: "var(--fs-mono-sm)", color: "var(--text-secondary)" }}>
        <span>Curated · {counts.curated}</span>
        <span>Predicted · {counts.predicted}</span>
        <span>HT · {counts.ht}</span>
        {counts.weak != null && <span>Weak · {counts.weak}</span>}
      </div>
    </Card>
  );
};

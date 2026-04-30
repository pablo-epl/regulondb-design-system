import type { Meta, StoryObj } from "@storybook/react";
import { ScorePill } from "../components/atoms/ScorePill";
import { DOIBadge } from "../components/atoms/DOIBadge";
import { ConservationCell } from "../components/molecules/ConservationCell";
import { DatasetCard } from "../components/molecules/DatasetCard";

const meta: Meta = { title: "Comparative/Catalog" };
export default meta;

/* -------------------------- atoms -------------------------- */

export const ScorePillBands: StoryObj = {
  name: "ScorePill bands",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <ScorePill value={0.08} label="RRI" />
      <ScorePill value={0.34} label="RRI" />
      <ScorePill value={0.62} label="RRI" />
      <ScorePill value={0.95} label="RRI" />
      <ScorePill value={0.50} label="Conservation" />
    </div>
  ),
};

export const DOIBadges: StoryObj = {
  name: "DOIBadge",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <DOIBadge doi="10.5281/zenodo.10874321" />
      <DOIBadge doi="10.5281/zenodo.10874322" label="Zenodo" />
    </div>
  ),
};

/* -------------------------- molecules -------------------------- */

export const ConservationCells: StoryObj = {
  name: "ConservationCell states",
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <ConservationCell state="conserved" regulator="LexA" />
      <ConservationCell state="divergent" regulator="LexA (DinR)" />
      <ConservationCell state="absent" />
      <ConservationCell state="unknown" />
    </div>
  ),
};

export const PanRegulomeRow: StoryObj = {
  name: "ConservationCell — pan-regulome row",
  render: () => (
    <table style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 8 }}>Orthogroup</th>
          <th style={{ padding: 8 }}>E. coli</th>
          <th style={{ padding: 8 }}>S. Typhimurium</th>
          <th style={{ padding: 8 }}>B. subtilis</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: 8 }}><code>OG_recA</code> · recA</td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="conserved" regulator="LexA" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="conserved" regulator="LexA" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="divergent" regulator="LexA (DinR)" /></td>
        </tr>
        <tr>
          <td style={{ padding: 8 }}><code>OG_araC</code> · araC</td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="conserved" regulator="AraC" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="conserved" regulator="AraC" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="divergent" regulator="AraR" /></td>
        </tr>
        <tr>
          <td style={{ padding: 8 }}><code>OG_invF</code> · invF</td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="absent" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="conserved" regulator="HilA + InvF" /></td>
          <td style={{ padding: 8, textAlign: "center" }}><ConservationCell state="absent" /></td>
        </tr>
      </tbody>
    </table>
  ),
};

export const DatasetCards: StoryObj = {
  name: "DatasetCard",
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24, maxWidth: 800 }}>
      <DatasetCard
        id="D-1"
        title="Gold-standard TF–target set v1"
        description="Manually curated TF–target interactions with strong experimental evidence (IDA / IPI / IMP) across the three organisms. Splits stratified by orthogroup ready for ML."
        version="v1.0"
        releaseDate="2026-03-14"
        doi="10.5281/zenodo.10874321"
        formats={["TSV", "JSON-LD", "RDF Turtle"]}
        size="4.8 MB · 6 files"
        license="CC-BY 4.0"
        onCite={() => alert("BibTeX copied")}
      />
      <DatasetCard
        id="D-3"
        title="Pan-regulome table"
        description="Pivot of orthogroup × organism × regulator × evidence × conservation across the curated regulome."
        version="v0.9"
        releaseDate="2026-03-14"
        doi="10.5281/zenodo.10874323"
        formats={["TSV", "Parquet"]}
        size="2.1 MB · 1 file"
        license="CC-BY 4.0"
      />
    </div>
  ),
};

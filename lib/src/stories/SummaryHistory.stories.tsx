import type { Meta, StoryObj } from "@storybook/react";
import { StatCardWithDelta } from "../components/molecules/StatCardWithDelta";
import { ReleaseHighlight } from "../components/molecules/ReleaseHighlight";
import { ReleaseTimeline } from "../components/organisms/ReleaseTimeline";
import { GrowthChart } from "../components/organisms/GrowthChart";
import { SummaryHistoryPage, type SummaryHistoryRelease } from "../components/pages/SummaryHistoryPage";
import { Icon } from "../components/atoms/Icon";

const meta: Meta = { title: "Summary history" };
export default meta;

// ----- Molecules ------------------------------------------------------------
export const StatCards: StoryObj = {
  name: "StatCardWithDelta",
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))" }}>
      <StatCardWithDelta icon={<Icon name="dna" size={20} />}     label="Genes"        value={4639} delta={342}  deltaRef="v13.5" />
      <StatCardWithDelta icon={<Icon name="tf" size={20} />}      label="TFs"          value={335}  delta={12}   deltaRef="v13.5" />
      <StatCardWithDelta icon={<Icon name="regulon" size={20} />} label="Regulons"     value={214}  delta={6}    deltaRef="v13.5" />
      <StatCardWithDelta icon={<Icon name="operon" size={20} />}  label="Interactions" value={9870} delta={1210} deltaRef="v13.5" />
      <StatCardWithDelta icon={<Icon name="dataset" size={20} />} label="HT datasets"  value={47}   delta={0}    deltaRef="v13.5" />
      <StatCardWithDelta icon={<Icon name="info" size={20} />}    label="Removed"      value={12}   delta={-3}   deltaRef="v13.5" />
    </div>
  ),
};

export const Highlights: StoryObj = {
  name: "ReleaseHighlight",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ReleaseHighlight tone="feature"    version="v12.0.3" title="GENSOR units for amino-acid biosynthesis" description="12 new GENSOR units linking metabolic state to transcriptional response." />
      <ReleaseHighlight tone="data"       version="v12.0.1" title="gSELEX dataset import (170 conditions)" description="Ishihama lab gSELEX panel ingested as HT dataset." />
      <ReleaseHighlight tone="structural" version="v11.0"   title="New evidence taxonomy" description="Curated / Predicted / High-throughput / Weak categories formalized." />
      <ReleaseHighlight tone="note"       version="v10.0"   title="Deprecation: legacy ID format" description="Old `bnumber` route returns 410. Use the new `/gene/{symbol}` resource." />
    </div>
  ),
};

// ----- Organisms ------------------------------------------------------------
export const Timeline: StoryObj = {
  name: "ReleaseTimeline",
  render: () => (
    <div style={{ maxWidth: 320, padding: 16, border: "1px solid var(--border-default)", borderRadius: 6, background: "var(--surface-raised)" }}>
      <ReleaseTimeline entries={[
        { id: "1", version: "v12.0.3", date: "2026-03-14", title: "84 new TF–gene interactions",   organism: "E. coli K-12" },
        { id: "2", version: "v12.0.2", date: "2025-12-08", title: "GENSOR units for amino-acid biosynthesis", organism: "E. coli K-12" },
        { id: "3", version: "v12.0",   date: "2024-11-04", title: "RegulonDB v12 release",          organism: "E. coli K-12", major: true },
        { id: "4", version: "v1.4",    date: "2026-02-02", title: "Salmonella reaches 172 regulons", organism: "S. Typhimurium" },
        { id: "5", version: "v1.0",    date: "2024-09-15", title: "B. subtilis seed release",       organism: "B. subtilis", major: true },
      ]} />
    </div>
  ),
};

export const GrowthLine: StoryObj = {
  name: "GrowthChart · line",
  render: () => (
    <GrowthChart
      title="Regulatory interactions over time"
      xLabels={["2019","2020","2021","2022","2023","2024","2025","2026"]}
      series={[
        { label: "E. coli K-12",  color: "var(--blue-2)",        values: [7440, 7800, 8210, 8730, 9210, 9540, 9786, 9870] },
        { label: "S. Typhimurium",color: "var(--accent)",        values: [0, 0, 0, 0, 0, 3210, 4920, 5720] },
        { label: "B. subtilis",   color: "var(--evidence-ht)",   values: [0, 0, 0, 0, 0, 3120, 4180, 4910] },
      ]}
    />
  ),
};

export const GrowthStacked: StoryObj = {
  name: "GrowthChart · stacked",
  render: () => (
    <GrowthChart mode="stacked"
      title="Cumulative interactions, stacked"
      xLabels={["2019","2020","2021","2022","2023","2024","2025","2026"]}
      milestones={[{ x: 5, label: "Multi-organism (2024)" }]}
      series={[
        { label: "E. coli K-12",   color: "var(--blue-3)",       values: [7440, 7800, 8210, 8730, 9210, 9540, 9786, 9870] },
        { label: "S. Typhimurium", color: "var(--accent-light)", values: [0, 0, 0, 0, 0, 3210, 4920, 5720] },
        { label: "B. subtilis",    color: "var(--evidence-ht)",  values: [0, 0, 0, 0, 0, 3120, 4180, 4910] },
      ]}
    />
  ),
};

// ----- Page -----------------------------------------------------------------
const SAMPLE: SummaryHistoryRelease[] = [
  { id: "1",  version: "v12.0.3", date: "2026-03-14", org: "ecoli-k12",              organismLabel: "E. coli K-12 MG1655",        tone: "data",
    title: "84 new TF–gene interactions from recent ChIP-exo",
    body:  "Incorporates Ishihama lab 2025 ChIP-exo dataset; 84 new interactions with strong evidence, 19 re-annotated.",
    stats: { genes: 4639, tfs: 335, operons: 2783, promoters: 4174, regulons: 214, datasets: 47, interactions: 9870, tfbss: 12560 } },
  { id: "2",  version: "v12.0.2", date: "2025-12-08", org: "ecoli-k12",              organismLabel: "E. coli K-12 MG1655",        tone: "feature",
    title: "GENSOR units for amino-acid biosynthesis",
    body:  "Added 12 new GENSOR units linking metabolic state to transcriptional response.",
    stats: { genes: 4639, tfs: 335, operons: 2783, promoters: 4170, regulons: 214, datasets: 45, interactions: 9786, tfbss: 12498 } },
  { id: "3",  version: "v12.0",   date: "2024-11-04", org: "ecoli-k12",              organismLabel: "E. coli K-12 MG1655",        tone: "feature",
    title: "RegulonDB v12 release",
    body:  "Major curation pass; sigma-factor reassignment, evidence ontology cleanup.",
    stats: { genes: 4636, tfs: 328, operons: 2769, promoters: 4096, regulons: 212, datasets: 41, interactions: 9540, tfbss: 12090 } },
  { id: "4",  version: "v1.4",    date: "2026-02-02", org: "salmonella-typhimurium", organismLabel: "S. enterica Typhimurium LT2", tone: "data",
    title: "Salmonella reaches 172 regulons",
    body:  "New curation on SPI-1/SPI-2 regulatory regions.",
    stats: { genes: 4556, tfs: 284, operons: 2491, promoters: 3120, regulons: 172, datasets: 18, interactions: 5720, tfbss: 6810 } },
  { id: "5",  version: "v1.2",    date: "2026-01-20", org: "bacillus-subtilis",      organismLabel: "B. subtilis 168",            tone: "feature",
    title: "B. subtilis sporulation cascade fully curated",
    body:  "Spo0A, σ^F, σ^E, σ^G, σ^K cascade imported.",
    stats: { genes: 4245, tfs: 258, operons: 2110, promoters: 2687, regulons: 149, datasets: 11, interactions: 4910, tfbss: 5320 } },
];

export const Page: StoryObj = {
  name: "Page · SummaryHistory",
  parameters: { layout: "fullscreen" },
  render: () => <SummaryHistoryPage releases={SAMPLE} />,
};

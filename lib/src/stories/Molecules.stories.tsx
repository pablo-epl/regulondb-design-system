import type { Meta, StoryObj } from "@storybook/react";
import { EvidenceBadge } from "../components/molecules/EvidenceBadge";
import { ObjectTypeTag } from "../components/molecules/ObjectTypeTag";
import { Card } from "../components/molecules/Card";
import { Tabs } from "../components/molecules/Tabs";
import { Toast } from "../components/molecules/Toast";
import { OrganismPill } from "../components/molecules/OrganismPill";
import { ConservationBar } from "../components/molecules/ConservationBar";
import { TaxonName } from "../components/atoms/Scientific";

const meta: Meta = { title: "Molecules/Catalog" };
export default meta;

export const EvidenceBadges: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <EvidenceBadge code="IDA" /><EvidenceBadge code="IPI" /><EvidenceBadge code="IEP" /><EvidenceBadge code="IC" />
      <EvidenceBadge code="IEA" /><EvidenceBadge code="HT" /><EvidenceBadge code="NAS" />
    </div>
  ),
};
export const ObjectTags: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {(["gene","operon","tf","regulon","promoter","dataset"] as const).map((t) => <ObjectTypeTag key={t} type={t} />)}
    </div>
  ),
};
export const Cards: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, 1fr)", padding: 16, background: "var(--surface-section)" }}>
      <Card header="Default">White surface.</Card>
      <Card variant="sunken" header="Sunken">Grey-5 surface.</Card>
      <Card variant="section" header="Section">Blue-5 surface.</Card>
      <Card variant="note" header="Curator note">Postit yellow — reserved.</Card>
    </div>
  ),
};
export const TabsStory: StoryObj = {
  name: "Tabs",
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Tabs items={[
        { id: "summary", label: "Summary" }, { id: "regulation", label: "Regulation" },
        { id: "sequence", label: "Sequence" }, { id: "evidence", label: "Evidence" }, { id: "references", label: "References" },
      ]} defaultValue="summary" />
      <Tabs segmented items={[
        { id: "curated", label: "Curated" }, { id: "predicted", label: "Predicted" }, { id: "ht", label: "High-throughput" },
      ]} defaultValue="curated" />
    </div>
  ),
};
export const Toasts: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Toast title="Set saved" description='"SOS targets" — 14 genes' />
      <Toast tone="success" title="Export complete" description="lexA-targets.tsv (14 rows)" />
      <Toast tone="warning" title="No ortholog data" description="B. subtilis: distinct family (AraR)" />
      <Toast tone="error"   title="Connection lost" description="Retry · view status" />
    </div>
  ),
};
export const OrgPills: StoryObj = {
  name: "OrganismPill",
  render: () => (
    <div style={{ background: "var(--blue-1)", padding: 16, borderRadius: 8, display: "flex", gap: 12, flexWrap: "wrap" }}>
      <OrganismPill symbol="Ec" taxon="E. coli"      strain="K-12 MG1655" count={4639} />
      <OrganismPill symbol="Se" taxon="S. enterica" strain="LT2"          count={4489} color="#6B2F64" />
      <OrganismPill symbol="Bs" taxon="B. subtilis" strain="168"          count={4176} color="#2F6B48" />
    </div>
  ),
};
export const ConservationBars: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <ConservationBar pct={92} label={<>vs <TaxonName>E. coli</TaxonName></>} />
      <ConservationBar pct={73} label={<>vs <TaxonName>S. enterica</TaxonName></>} />
      <ConservationBar pct={41} label={<>vs <TaxonName>B. subtilis</TaxonName></>} />
    </div>
  ),
};

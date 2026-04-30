import { useState } from "react";
import { AppShellTemplate, TFTemplate, RegulonTemplate, CompareTemplate, FacetedSearchTemplate, EmptyStateTemplate } from "../templates";
import { ProteinSymbol, TaxonName, Gene } from "../atoms/Scientific";
import { Card } from "../molecules/Card";
import { Skeleton } from "../atoms/Decoration";
import { EmptyState } from "../molecules/EmptyState";
import { RegulonRadial } from "../organisms/RegulonRadial";
import { OrthologMatrix } from "../organisms/OrthologMatrix";

export const TFLexAPage = () => {
  const [tab, setTab] = useState("Summary");
  return (
    <AppShellTemplate organism={{ symbol: "Ec", taxon: "E. coli", strain: "K-12" }} primaryNavCurrent="TFs">
      <TFTemplate
        breadcrumb={[
          { label: <><TaxonName>E. coli</TaxonName> K-12</>, href: "#" },
          { label: "Transcription factors", href: "#" },
          { label: <ProteinSymbol>LexA</ProteinSymbol> },
        ]}
        objectType="tf"
        title={<ProteinSymbol>LexA</ProteinSymbol>}
        tagline={<>Master repressor of the SOS response to DNA damage. Auto-cleaves under RecA-mediated DNA damage signal, releasing target operators.</>}
        tabs={[{ id: "Summary", label: "Summary" }, { id: "Targets", label: "Targets (14)" }, { id: "Domains", label: "Domains" }, { id: "Effectors", label: "Effectors" }]}
        activeTab={tab}
        onTabChange={setTab}>
        <Card>{tab === "Targets" ? "Targets table…" : `Tab "${tab}" panel placeholder.`}</Card>
      </TFTemplate>
    </AppShellTemplate>
  );
};

export const RegulonAraCPage = () => {
  const [tab, setTab] = useState("Radial");
  return (
    <AppShellTemplate>
      <RegulonTemplate
        breadcrumb={[{ label: <><TaxonName>E. coli</TaxonName></>, href: "#" }, { label: "Regulons", href: "#" }, { label: "AraC regulon" }]}
        objectType="regulon" title="AraC regulon"
        tagline="4 target operons, 1 autoregulation, co-regulator CRP."
        tabs={[{ id: "Radial", label: "Radial" }, { id: "Members", label: "Members" }]}
        activeTab={tab} onTabChange={setTab}>
        <Card>
          <RegulonRadial tf="AraC" targets={[
            { symbol: "araBAD", effect: "activates" },
            { symbol: "araE",   effect: "activates" },
            { symbol: "araFGH", effect: "activates" },
            { symbol: "araC",   effect: "represses" },
          ]} />
        </Card>
      </RegulonTemplate>
    </AppShellTemplate>
  );
};

export const CompareLexAPage = () => (
  <AppShellTemplate>
    <CompareTemplate
      summaries={[
        <Card header={<TaxonName>E. coli</TaxonName>}>14 targets · 100% identity reference</Card>,
        <Card header={<TaxonName>S. enterica</TaxonName>}>13 targets · 88–96% identity</Card>,
        <Card header={<TaxonName>B. subtilis</TaxonName>}>distinct repressor (DinR / Cheo box)</Card>,
      ]}
      matrix={<Card header="Conservation matrix">
        <OrthologMatrix
          organisms={[{ id: "ec", taxon: "E. coli" }, { id: "se", taxon: "S. enterica" }, { id: "bs", taxon: "B. subtilis" }]}
          rows={[
            { target: "recA", identities: { ec: 100, se: 96, bs: 62 } },
            { target: "uvrA", identities: { ec: 100, se: 82, bs: 38 } },
            { target: "sulA", identities: { ec: 100, se: 79, bs: null } },
            { target: "dinB", identities: { ec: 100, se: 93, bs: 55 } },
          ]} />
      </Card>}
    />
  </AppShellTemplate>
);

export const SearchResultsLexAPage = () => (
  <AppShellTemplate>
    <FacetedSearchTemplate
      sidebar={<Card variant="sunken">Filters · object type · evidence · organism</Card>}
      results={<Card>14 results for "lexA". Top hit: <Gene>lexA</Gene>.</Card>} />
  </AppShellTemplate>
);

export const NotFoundPage = () => (
  <AppShellTemplate>
    <EmptyStateTemplate>
      <EmptyState title="Gene not found" description="The gene you're looking for isn't in this organism. Check the spelling or switch organisms." />
    </EmptyStateTemplate>
  </AppShellTemplate>
);

export const OrganismLoadingPage = () => (
  <AppShellTemplate>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 640 }}>
      <Skeleton width="30%" height={28} />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
      <Skeleton width="100%" height={120} />
    </div>
  </AppShellTemplate>
);

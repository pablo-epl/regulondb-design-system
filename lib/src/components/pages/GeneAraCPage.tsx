import { useState } from "react";
import { AppShellTemplate, GeneTemplate } from "../templates";
import { Gene, TaxonName, Coordinate } from "../atoms/Scientific";
import { EvidenceBadge } from "../molecules/EvidenceBadge";
import { Card } from "../molecules/Card";
import { CrossDBLinks } from "../organisms/_stubs";

export const GeneAraCPage = () => {
  const [tab, setTab] = useState("Summary");
  return (
    <AppShellTemplate organism={{ symbol: "Ec", taxon: "E. coli", strain: "K-12", count: 4639 }} primaryNavCurrent="Genes">
      <GeneTemplate
        breadcrumb={[
          { label: <><TaxonName>E. coli</TaxonName> K-12 MG1655</>, href: "#home" },
          { label: "Genes", href: "#genes" },
          { label: <Gene>araC</Gene> },
        ]}
        objectType="gene"
        title={<Gene>araC</Gene>}
        tagline={<>Dual regulator of the L-arabinose utilization system; activates the <Gene>araBAD</Gene>, <Gene>araE</Gene> and <Gene>araFGH</Gene> operons in the presence of arabinose and represses <Gene>araC</Gene> in its absence.</>}
        badges={<><EvidenceBadge code="IDA" /><EvidenceBadge code="IPI" /><EvidenceBadge code="HT" /><EvidenceBadge code="IEA" /></>}
        tabs={[
          { id: "Summary", label: "Summary" },
          { id: "Regulation", label: "Regulation" },
          { id: "Sequence", label: "Sequence" },
          { id: "Evidence", label: "Evidence" },
          { id: "References", label: "References" },
        ]}
        activeTab={tab}
        onTabChange={setTab}>
        <Card header={tab}>
          {tab === "Summary" && (
            <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 24, rowGap: 8, margin: 0 }}>
              <dt style={{ color: "var(--text-secondary)" }}>b-number</dt><dd style={{ margin: 0, fontFamily: "var(--font-mono)" }}>b0064</dd>
              <dt style={{ color: "var(--text-secondary)" }}>Position</dt><dd style={{ margin: 0 }}><Coordinate value={70387} />…<Coordinate value={71265} /></dd>
              <dt style={{ color: "var(--text-secondary)" }}>Strand</dt><dd style={{ margin: 0 }}>−</dd>
              <dt style={{ color: "var(--text-secondary)" }}>Length</dt><dd style={{ margin: 0 }}>879 bp</dd>
              <dt style={{ color: "var(--text-secondary)" }}>Cross-DB</dt><dd style={{ margin: 0 }}><CrossDBLinks uniprot="#" ecocyc="#" ncbi="#" alphafold="#" pdb="#" /></dd>
            </dl>
          )}
          {tab !== "Summary" && <p style={{ color: "var(--text-secondary)", margin: 0 }}>Tab "{tab}" panel placeholder.</p>}
        </Card>
      </GeneTemplate>
    </AppShellTemplate>
  );
};

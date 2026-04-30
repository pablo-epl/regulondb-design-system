import { AppShellTemplate, HomeTemplate } from "../templates";
import { ActiveOrganismCard } from "../organisms/ActiveOrganismCard";
import { Card } from "../molecules/Card";
import { SearchInput } from "../molecules/SearchInput";

export const HomePage = () => (
  <AppShellTemplate organism={{ symbol: "Ec", taxon: "E. coli", strain: "K-12", count: 4639 }} primaryNavCurrent="Genes">
    <HomeTemplate
      hero={<Card><h2 style={{ margin: 0 }}>Search RegulonDB MG</h2><div style={{ marginTop: 12 }}><SearchInput placeholder="Genes, TFs, operons, regulons" /></div></Card>}
      activeOrgCard={<ActiveOrganismCard taxon="Escherichia coli" strain="K-12 MG1655"
        stats={{ genes: 4639, tfs: 335, operons: 2783, regulons: 214 }} />}
    />
  </AppShellTemplate>
);

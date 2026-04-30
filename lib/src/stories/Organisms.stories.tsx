import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../components/organisms/Header";
import { PrimaryNav } from "../components/organisms/PrimaryNav";
import { ActiveOrganismCard } from "../components/organisms/ActiveOrganismCard";
import { RegulonRadial } from "../components/organisms/RegulonRadial";
import { OrthologMatrix } from "../components/organisms/OrthologMatrix";

const meta: Meta = { title: "Organisms/Catalog" };
export default meta;

export const HeaderShell: StoryObj = {
  name: "Header + PrimaryNav",
  render: () => (
    <div style={{ border: "1px solid var(--border-default)", borderRadius: 8, overflow: "hidden" }}>
      <Header organism={{ symbol: "Ec", taxon: "E. coli", strain: "K-12", count: 4639 }} />
      <PrimaryNav current="Genes" />
    </div>
  ),
};

export const ActiveOrg: StoryObj = {
  name: "ActiveOrganismCard",
  render: () => <ActiveOrganismCard taxon="Escherichia coli" strain="K-12 MG1655"
                  stats={{ genes: 4639, tfs: 335, operons: 2783, regulons: 214 }} />,
};

export const Radial: StoryObj = {
  name: "RegulonRadial — LexA",
  render: () => <RegulonRadial tf="LexA" targets={[
    { symbol: "recA", effect: "represses" }, { symbol: "uvrA", effect: "represses" },
    { symbol: "sulA", effect: "represses" }, { symbol: "dinB", effect: "represses" },
    { symbol: "umuD", effect: "activates", category: "predicted" },
    { symbol: "lexA", effect: "represses" }, { symbol: "ssb",  effect: "represses", category: "ht" },
    { symbol: "ruvA", effect: "represses" },
  ]} />,
};

export const Matrix: StoryObj = {
  name: "OrthologMatrix — SOS",
  render: () => <OrthologMatrix
    organisms={[{ id: "ec", taxon: "E. coli" }, { id: "se", taxon: "S. enterica" }, { id: "bs", taxon: "B. subtilis" }]}
    rows={[
      { target: "recA", identities: { ec: 100, se: 96, bs: 62 } },
      { target: "uvrA", identities: { ec: 100, se: 82, bs: 38 } },
      { target: "sulA", identities: { ec: 100, se: 79, bs: null } },
      { target: "dinB", identities: { ec: 100, se: 93, bs: 55 } },
      { target: "umuD", identities: { ec: 100, se: 88, bs: null } },
      { target: "lexA", identities: { ec: 100, se: 94, bs: 61 } },
    ]} />,
};

import type { Meta, StoryObj } from "@storybook/react";
import { GeneContextStrip, ARAC_LOCUS } from "../components/organisms/GeneContextStrip";
import { PromoterArchitectureDiagram } from "../components/organisms/PromoterArchitectureDiagram";
import { Card } from "../components/molecules/Card";

const meta: Meta = { title: "Organisms/Genome diagrams" };
export default meta;

export const AraC: StoryObj = {
  name: "GeneContextStrip · araC",
  render: () => <Card><GeneContextStrip {...ARAC_LOCUS} /></Card>,
};

export const Divergent: StoryObj = {
  name: "Promoter architecture · divergent",
  render: () => <Card><PromoterArchitectureDiagram topology="divergent" data={{
    geneLeft: "araC", geneRight: "araB",
    operators: [{ label: "araI1", factor: "AraC" }, { label: "araI2", factor: "AraC" }],
    tfbs: [{ factor: "CRP" }],
  }}/></Card>,
};

export const Convergent: StoryObj = {
  name: "Promoter architecture · convergent",
  render: () => <Card><PromoterArchitectureDiagram topology="convergent" data={{
    geneLeft: "yfiQ", geneRight: "yfiR",
  }}/></Card>,
};

export const Tandem: StoryObj = {
  name: "Promoter architecture · tandem",
  render: () => <Card><PromoterArchitectureDiagram topology="tandem" data={{
    geneLeft: "yhdJ", geneRight: "yhdK", geneRight2: "yhdL",
  }}/></Card>,
};

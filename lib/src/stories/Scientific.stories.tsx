import type { Meta, StoryObj } from "@storybook/react";
import { Gene, OperonNotation, ProteinSymbol, TaxonName, SigmaFactorLabel, PromoterPositionLabel, Coordinate } from "../components/atoms/Scientific";

const meta: Meta = {
  title: "Atoms/Scientific",
  parameters: { docs: { description: { component: "The brand's scientific contract: italic genes, roman proteins, σ Unicode, − Unicode, comma-thousand coordinates." } } },
};
export default meta;

export const Gallery: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12, fontSize: "var(--fs-body-lg)" }}>
      <span style={{ color: "var(--text-secondary)" }}>Gene</span>            <Gene>araC</Gene>
      <span style={{ color: "var(--text-secondary)" }}>Operon</span>          <OperonNotation>lacZYA</OperonNotation>
      <span style={{ color: "var(--text-secondary)" }}>Taxon + strain</span>  <TaxonName strain="K-12 MG1655">Escherichia coli</TaxonName>
      <span style={{ color: "var(--text-secondary)" }}>Protein</span>         <ProteinSymbol>AraC</ProteinSymbol>
      <span style={{ color: "var(--text-secondary)" }}>Sigma factor</span>    <SigmaFactorLabel value={70} />
      <span style={{ color: "var(--text-secondary)" }}>Promoter position</span><PromoterPositionLabel pos={-10} />
      <span style={{ color: "var(--text-secondary)" }}>Coordinate</span>      <Coordinate value={3923882} />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/atoms/Button";
import { Dialog } from "../components/organisms/Dialog";
import { OrganismDrawer } from "../components/organisms/OrganismDrawer";
import { CommandPalette } from "../components/organisms/CommandPalette";
import { Gene, ProteinSymbol, TaxonName } from "../components/atoms/Scientific";

const meta: Meta = { title: "Organisms/Overlays" };
export default meta;

export const DialogStory: StoryObj = {
  name: "Dialog (focus-trapped)",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}
                title="Save current set"
                description={<>Save the current selection of <Gene>lexA</Gene> targets as a named set you can re-use across organisms.</>}
                actions={<>
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={() => setOpen(false)}>Save</Button>
                </>}>
          <input className="input" placeholder="Set name" autoFocus />
        </Dialog>
      </>
    );
  },
};

export const OrganismDrawerStory: StoryObj = {
  name: "OrganismDrawer",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <OrganismDrawer
          open={open}
          onClose={() => setOpen(false)}
          onSelect={(id) => alert(`Selected ${id}`)}
          organisms={[
            { id: "ec",  symbol: "Ec", taxon: "Escherichia coli",       strain: "K-12 MG1655", count: 4639, active: true },
            { id: "se",  symbol: "Se", taxon: "Salmonella enterica",    strain: "LT2",         count: 4489, color: "#6B2F64" },
            { id: "bs",  symbol: "Bs", taxon: "Bacillus subtilis",      strain: "168",         count: 4176, color: "#2F6B48" },
            { id: "pa",  symbol: "Pa", taxon: "Pseudomonas aeruginosa", strain: "PAO1",        count: 5572, color: "#3D4A7A" },
            { id: "vc",  symbol: "Vc", taxon: "Vibrio cholerae",        strain: "O1 N16961",   count: 3886, color: "#7C5295" },
          ]}/>
      </>
    );
  },
};

export const CommandPaletteStory: StoryObj = {
  name: "CommandPalette (⌘K)",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)} leadingIcon={<span style={{ fontFamily: "var(--font-mono)" }}>⌘K</span>}>Open palette</Button>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          groups={[
            { id: "genes", title: "Genes", items: [
              { id: "araC", label: <Gene>araC</Gene>, hint: "L-arabinose regulator", onSelect: () => alert("araC") },
              { id: "lexA", label: <Gene>lexA</Gene>, hint: "SOS repressor",        onSelect: () => alert("lexA") },
              { id: "recA", label: <Gene>recA</Gene>, hint: "Recombinase",          onSelect: () => alert("recA") },
            ]},
            { id: "tfs", title: "Transcription factors", items: [
              { id: "AraC", label: <ProteinSymbol>AraC</ProteinSymbol>, onSelect: () => alert("AraC") },
              { id: "LexA", label: <ProteinSymbol>LexA</ProteinSymbol>, onSelect: () => alert("LexA") },
              { id: "CRP",  label: <ProteinSymbol>CRP</ProteinSymbol>,  onSelect: () => alert("CRP") },
            ]},
            { id: "actions", title: "Actions", items: [
              { id: "go-home",   label: "Go to home",     shortcut: ["g", "h"], onSelect: () => alert("home") },
              { id: "go-search", label: "Go to search",   shortcut: ["g", "s"], onSelect: () => alert("search") },
              { id: "switch",    label: "Switch organism", onSelect: () => alert("switch") },
            ]},
            { id: "organisms", title: "Organisms", items: [
              { id: "ec", label: <TaxonName strain="K-12 MG1655">Escherichia coli</TaxonName>, onSelect: () => alert("E. coli") },
              { id: "se", label: <TaxonName strain="LT2">Salmonella enterica</TaxonName>,      onSelect: () => alert("S. enterica") },
            ]},
          ]} />
      </>
    );
  },
};

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TypingIndicator } from "../components/atoms/TypingIndicator";
import { LevelPicker } from "../components/atoms/LevelPicker";
import { ChatMessage } from "../components/molecules/ChatMessage";
import { ChatComposer } from "../components/molecules/ChatComposer";
import { CitationChip } from "../components/molecules/CitationChip";
import { ChatPanel } from "../components/organisms/ChatPanel";
import { ExplainerPanel } from "../components/organisms/ExplainerPanel";
import { Button } from "../components/atoms/Button";

const meta: Meta = { title: "Assistant/Catalog" };
export default meta;

/* -------------------------- atoms -------------------------- */

export const Typing: StoryObj = {
  name: "TypingIndicator",
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <TypingIndicator />
      <span style={{ color: "var(--text-secondary)" }}>three-dot bounce, honours prefers-reduced-motion</span>
    </div>
  ),
};

export const Levels: StoryObj = {
  name: "LevelPicker",
  render: () => {
    const [v, setV] = useState<"pi"|"postdoc"|"undergrad"|"public">("postdoc");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <LevelPicker value={v} onChange={setV} />
        <code style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>level = "{v}"</code>
      </div>
    );
  },
};

/* -------------------------- molecules -------------------------- */

export const Messages: StoryObj = {
  name: "ChatMessage roles",
  render: () => (
    <div style={{ maxWidth: 520, display: "flex", flexDirection: "column" }}>
      <ChatMessage role="system">Switched to Agent mode</ChatMessage>
      <ChatMessage role="user">What is LexA and the SOS response?</ChatMessage>
      <ChatMessage role="assistant"
        footer={
          <>
            <CitationChip type="tf" label="LexA" href="#/ecoli-k12/tf/LexA" meta="E. coli" />
            <CitationChip type="regulon" label="LexA regulon" href="#/ecoli-k12/regulon/LexA" />
            <CitationChip type="gene" label={<em className="gene">recA</em>} href="#/ecoli-k12/gene/recA" />
          </>
        }>
        <p><strong>LexA</strong> is the master repressor of the SOS response. Under normal growth it sits on the SOS box <code>CTGT-N₈-ACAG</code> upstream of ~40 genes…</p>
      </ChatMessage>
      <ChatMessage role="assistant"><TypingIndicator /></ChatMessage>
    </div>
  ),
};

export const Composer: StoryObj = {
  name: "ChatComposer",
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <ChatComposer
        onSubmit={(v) => alert("submit: " + v)}
        suggestions={[
          "What is LexA and the SOS response?",
          "Compare araC orthologs",
          "How is evidence classified?",
        ]}
      />
    </div>
  ),
};

export const Citations: StoryObj = {
  name: "CitationChip variants",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 520 }}>
      <CitationChip type="gene"     label={<em className="gene">recA</em>} href="#" meta="E. coli" />
      <CitationChip type="tf"       label="LexA"      href="#" meta="E. coli" />
      <CitationChip type="regulon"  label="LexA"      href="#" />
      <CitationChip type="operon"   label="umuDC"     href="#" />
      <CitationChip type="promoter" label="lexAp"     href="#" />
      <CitationChip type="dataset"  label="ChIP-exo LexA (Ishihama 2025)" href="#" />
    </div>
  ),
};

/* -------------------------- organisms -------------------------- */

export const Panel: StoryObj = {
  name: "ChatPanel (slide-in)",
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open assistant</Button>
        <ChatPanel
          open={open}
          onClose={() => setOpen(false)}
          subtitle="scripted answers"
          onSubmit={(v) => alert("submit: " + v)}
          suggestions={["Tell me about LexA", "Compare araC orthologs"]}
        >
          <ChatMessage role="user">What is LexA?</ChatMessage>
          <ChatMessage role="assistant"
            footer={<CitationChip type="tf" label="LexA" href="#" meta="E. coli" />}>
            <p>LexA is the master repressor of the SOS response in E. coli K-12.</p>
          </ChatMessage>
        </ChatPanel>
      </div>
    );
  },
};

export const Explainer: StoryObj = {
  name: "ExplainerPanel",
  render: () => (
    <div style={{ maxWidth: 800 }}>
      <ExplainerPanel
        title={<>About <em className="gene">araC</em></>}
        defaultLevel="postdoc"
        levels={{
          pi:        <p><em className="gene">araC</em> (b0064, 879 nt, 292 aa, − strand) encodes the dual regulator AraC. Under apo conditions AraC bridges <code>aroO2</code> and <code>araI1</code> as a DNA loop, repressing <em>araBAD</em>. Arabinose binding flips dimer geometry and (with CRP-cAMP) activates <em>araBAD</em>, <em>araE</em> and <em>araFGH</em>. Auto-represses <em>araC</em> when unliganded.</p>,
          postdoc:   <p><em className="gene">araC</em> codes for AraC, the regulator of L-arabinose catabolism. Without arabinose AraC represses <em>araBAD</em> via DNA looping. With arabinose it activates <em>araBAD</em>, <em>araE</em> and <em>araFGH</em>; CRP-cAMP is required for full activation.</p>,
          undergrad: <p>The gene <em className="gene">araC</em> makes a protein, AraC, that decides whether the cell turns on its arabinose-eating genes.</p>,
          public:    <p><em>araC</em> is a "switch" gene in <em>E. coli</em>. It senses the sugar arabinose and tells the cell when to start digesting it.</p>,
        }}
        cites={
          <>
            <CitationChip type="gene"    label={<em className="gene">araC</em>} href="#" />
            <CitationChip type="tf"      label="AraC"  href="#" />
            <CitationChip type="regulon" label="AraC"  href="#" />
          </>
        }
        onRegenerate={() => alert("regenerate")}
      />
    </div>
  ),
};

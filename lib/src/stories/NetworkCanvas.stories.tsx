import type { Meta, StoryObj } from "@storybook/react";
import { NetworkCanvas } from "../components/organisms/NetworkCanvas";

const meta: Meta = { title: "Organisms/NetworkCanvas" };
export default meta;

export const SOS: StoryObj = {
  name: "Force-directed · SOS regulon",
  render: () => (
    <NetworkCanvas
      width={720} height={480}
      nodes={[
        { id: "LexA", label: "LexA", kind: "tf" },
        { id: "recA", label: "recA", kind: "gene" },
        { id: "uvrA", label: "uvrA", kind: "gene" },
        { id: "sulA", label: "sulA", kind: "gene" },
        { id: "dinB", label: "dinB", kind: "gene" },
        { id: "umuD", label: "umuD", kind: "gene" },
        { id: "umuC", label: "umuC", kind: "gene" },
        { id: "ruvA", label: "ruvA", kind: "gene" },
        { id: "ruvB", label: "ruvB", kind: "gene" },
        { id: "ssb",  label: "ssb",  kind: "gene" },
        { id: "polB", label: "polB", kind: "gene" },
        { id: "lexA", label: "lexA", kind: "gene" },
      ]}
      edges={[
        { source: "LexA", target: "recA", effect: "represses", kind: "curated" },
        { source: "LexA", target: "uvrA", effect: "represses", kind: "curated" },
        { source: "LexA", target: "sulA", effect: "represses", kind: "curated" },
        { source: "LexA", target: "dinB", effect: "represses", kind: "predicted" },
        { source: "LexA", target: "umuD", effect: "represses", kind: "ht" },
        { source: "LexA", target: "umuC", effect: "represses", kind: "ht" },
        { source: "LexA", target: "ruvA", effect: "represses", kind: "curated" },
        { source: "LexA", target: "ruvB", effect: "represses", kind: "curated" },
        { source: "LexA", target: "ssb",  effect: "represses", kind: "curated" },
        { source: "LexA", target: "polB", effect: "represses", kind: "predicted" },
        { source: "LexA", target: "lexA", effect: "represses", kind: "curated" },
      ]}
    />
  ),
};

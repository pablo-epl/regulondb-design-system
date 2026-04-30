import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../components/atoms/Button";
import { Input, Textarea } from "../components/atoms/Input";
import { Checkbox, Radio, Switch } from "../components/atoms/Toggles";
import { Tag, Kbd, Spinner, Skeleton } from "../components/atoms/Decoration";
import { Gene, OperonNotation, ProteinSymbol, TaxonName, SigmaFactorLabel, PromoterPositionLabel, Coordinate } from "../components/atoms/Scientific";

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------
const buttonMeta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Compare across organisms", variant: "primary", size: "md" },
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost", "destructive", "link"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default buttonMeta;
type Story = StoryObj<typeof Button>;
export const Primary: Story = {};
export const Secondary: Story   = { args: { variant: "secondary", children: "Compare" } };
export const Outline: Story     = { args: { variant: "outline",   children: "Add to set" } };
export const Ghost: Story       = { args: { variant: "ghost",     children: "Cancel" } };
export const Destructive: Story = { args: { variant: "destructive", children: "Delete set" } };
export const Loading: Story     = { args: { loading: true, children: "Saving" } };
export const Disabled: Story    = { args: { disabled: true } };

// Hint: see Atoms.Toggles, Atoms.Tag, etc. as separate story files for richer
// catalogues. This file only covers Button defaults; the other atoms are
// exercised via the showcase preview and follow the identical pattern.

// Render combinators (kept here so the file is self-sufficient if a maintainer
// is reading just one stories.tsx)
export const AllStates: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Compare</Button>
      <Button variant="outline">Add to set</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">View references</Button>
      <Button variant="primary" disabled>Disabled</Button>
      <Button variant="primary" loading>Saving</Button>
    </div>
  ),
};

// Re-exports of related atoms — Storybook will auto-detect their `Meta` if
// re-declared in their own stories file. The exports below are
// catalog-rendered in the showcase but left for a richer Storybook pass.
export const _refs = { Input, Textarea, Checkbox, Radio, Switch, Tag, Kbd, Spinner, Skeleton, Gene, OperonNotation, ProteinSymbol, TaxonName, SigmaFactorLabel, PromoterPositionLabel, Coordinate };

import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "../components/atoms/Logo";

const meta: Meta<typeof Logo> = {
  title: "Atoms/Logo",
  component: Logo,
  args: { variant: "wordmark", height: 40 },
  argTypes: {
    variant: { control: "select", options: ["wordmark", "wordmark-dark", "mark"] },
    height: { control: { type: "range", min: 12, max: 120, step: 2 } },
  },
};
export default meta;

type Story = StoryObj<typeof Logo>;

export const Wordmark: Story    = {};
export const OnDark: Story      = {
  args: { variant: "wordmark-dark", height: 40 },
  parameters: { backgrounds: { default: "header" } },
};
export const CompactMark: Story = { args: { variant: "mark", height: 32 } };

export const SizeRange: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
      {[16, 20, 28, 40, 64].map((h) => (
        <div key={h} style={{ textAlign: "center" }}>
          <Logo height={h} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-mono-sm)", color: "var(--text-tertiary)", marginTop: 6 }}>{h}px</div>
        </div>
      ))}
    </div>
  ),
};

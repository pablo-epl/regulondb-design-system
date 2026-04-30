import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = { title: "Foundations/Color" };
export default meta;

const Swatch = ({ name, value, role }: { name: string; value: string; role?: string }) => (
  <div style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--surface-raised)" }}>
    <div style={{ background: value, height: 80 }} />
    <div style={{ padding: 12, fontSize: "var(--fs-body)" }}>
      <strong>{name}</strong>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-mono-sm)", color: "var(--text-secondary)" }}>{value}</div>
      {role && <div style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-mono-sm)" }}>{role}</div>}
    </div>
  </div>
);

export const Brand: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))" }}>
      <Swatch name="--blue-1" value="var(--blue-1)" role="Headers, brand" />
      <Swatch name="--blue-2" value="var(--blue-2)" role="Links, primary CTA" />
      <Swatch name="--blue-3" value="var(--blue-3)" role="Hover, focus" />
      <Swatch name="--blue-4" value="var(--blue-4)" role="Soft highlight" />
      <Swatch name="--blue-5" value="var(--blue-5)" role="Surface, section" />
    </div>
  ),
};

export const Reserved: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))" }}>
      <Swatch name="--accent"       value="var(--accent)" role="Compare CTA, predicted" />
      <Swatch name="--accent-light" value="var(--accent-light)" />
      <Swatch name="--postit"       value="var(--postit)" role="Curator notes, mark" />
      <Swatch name="--error"        value="var(--error)" role="Repression, weak, errors" />
    </div>
  ),
};

export const Evidence: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))" }}>
      {(["curated", "predicted", "ht", "weak"] as const).map((cat) => (
        <div key={cat} style={{ border: "1px solid var(--border-default)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ background: `var(--evidence-${cat}-bg)`, color: `var(--evidence-${cat}-fg)`, padding: 12, fontWeight: 700 }}>
            {cat[0].toUpperCase() + cat.slice(1)}
          </div>
          <div style={{ padding: 12, fontFamily: "var(--font-mono)", fontSize: "var(--fs-mono-sm)", color: "var(--text-secondary)" }}>
            --evidence-{cat}, --evidence-{cat}-bg, --evidence-{cat}-fg
          </div>
        </div>
      ))}
    </div>
  ),
};

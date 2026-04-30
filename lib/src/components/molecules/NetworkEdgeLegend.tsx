export interface NetworkEdgeLegendProps {
  items?: { kind: "solid" | "dashed" | "dotted"; label: string }[];
}

const DEFAULT = [
  { kind: "solid",  label: "Curated" },
  { kind: "dashed", label: "Predicted" },
  { kind: "dotted", label: "High-throughput" },
] as const;

export const NetworkEdgeLegend = ({ items = DEFAULT as unknown as NetworkEdgeLegendProps["items"] }: NetworkEdgeLegendProps) => (
  <div className="net-legend" role="list">
    {items!.map((it) => (
      <span className="item" role="listitem" key={it.label}>
        <span className={`line ${it.kind}`} aria-hidden="true" />
        {it.label}
      </span>
    ))}
  </div>
);

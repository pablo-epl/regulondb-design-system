export interface PrimaryNavProps {
  current?: string;
  items?: { label: string; href: string }[];
}

const DEFAULT = [
  { label: "Genes", href: "#genes" },
  { label: "Operons", href: "#operons" },
  { label: "Regulons", href: "#regulons" },
  { label: "TFs", href: "#tfs" },
  { label: "Promoters", href: "#promoters" },
  { label: "Datasets", href: "#datasets" },
  { label: "Tools", href: "#tools" },
  { label: "Downloads", href: "#downloads" },
];

export const PrimaryNav = ({ current = "Genes", items = DEFAULT }: PrimaryNavProps) => (
  <nav className="primary-nav" role="navigation" aria-label="Primary">
    {items.map((it) => (
      <a key={it.label} href={it.href} aria-current={current === it.label ? "page" : undefined}>{it.label}</a>
    ))}
  </nav>
);

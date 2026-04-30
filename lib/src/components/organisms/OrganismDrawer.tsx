import { useId, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap, useBodyScrollLock } from "../../lib/useFocusTrap";
import { SearchInput } from "../molecules/SearchInput";
import { OrganismPill } from "../molecules/OrganismPill";
import { TaxonName } from "../atoms/Scientific";
import { formatCoordinate } from "../../lib/utils";

export interface OrganismRow {
  id: string;
  symbol: string;
  taxon: string;
  strain?: string;
  count?: number;
  color?: string;
  active?: boolean;
}

export interface OrganismDrawerProps {
  open: boolean;
  onClose: () => void;
  organisms: OrganismRow[];
  onSelect: (id: string) => void;
  title?: ReactNode;
}

export const OrganismDrawer = ({
  open, onClose, organisms, onSelect, title = "Switch organism",
}: OrganismDrawerProps) => {
  const labelId = useId();
  const [q, setQ] = useState("");
  const trapRef = useFocusTrap<HTMLElement>(open, onClose);
  useBodyScrollLock(open);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return organisms;
    return organisms.filter(
      (o) => o.taxon.toLowerCase().includes(t)
          || o.symbol.toLowerCase().includes(t)
          || (o.strain ?? "").toLowerCase().includes(t),
    );
  }, [q, organisms]);

  if (!open) return null;

  const node = (
    <>
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        ref={trapRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        <header>
          <strong id={labelId}>{title}</strong>
          <button className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close drawer">×</button>
        </header>
        <div className="body">
          <div style={{ marginBottom: "var(--sp-4)" }}>
            <SearchInput
              autoFocus
              placeholder="Filter organisms…"
              value={q}
              onChange={(e) => setQ(e.currentTarget.value)}
              onClear={() => setQ("")}
            />
          </div>
          <ul role="listbox" aria-label="Organisms" style={{ display: "grid", gap: "var(--sp-2)", listStyle: "none", padding: 0, margin: 0 }}>
            {filtered.length === 0 && (
              <li role="status" style={{ color: "var(--text-secondary)", padding: "var(--sp-4)" }}>
                No matches for &quot;{q}&quot;.
              </li>
            )}
            {filtered.map((o) => (
              <li
                key={o.id}
                role="option"
                aria-selected={o.active ? true : undefined}
                tabIndex={0}
                onClick={() => { onSelect(o.id); onClose(); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(o.id); onClose(); } }}
                style={{
                  padding: "var(--sp-3) var(--sp-4)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  background: o.active ? "var(--surface-section)" : "var(--surface-raised)",
                  borderColor: o.active ? "var(--blue-3)" : "var(--border-default)",
                  cursor: "pointer",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="org-pill" style={{ background: "transparent", color: "var(--text-primary)", border: "none", padding: 0 }}>
                      <span className="symbol" style={o.color ? { background: o.color } : undefined}>{o.symbol}</span>
                      <TaxonName>{o.taxon}</TaxonName>
                    </span>
                    {o.strain && <span style={{ color: "var(--text-secondary)", fontSize: "var(--fs-mono-sm)" }}>{o.strain}</span>}
                  </div>
                  {o.count != null && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-mono-sm)", color: "var(--text-tertiary)" }}>
                      {formatCoordinate(o.count)} genes
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--text-tertiary)", fontSize: "var(--fs-mono-sm)" }}>
          <span>{filtered.length} of {organisms.length}</span>
          <span>Esc to close</span>
        </footer>
      </aside>
    </>
  );

  return typeof document !== "undefined" ? createPortal(node, document.body) : node;
};

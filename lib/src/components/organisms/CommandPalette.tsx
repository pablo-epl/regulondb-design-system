import { useId, useMemo, useRef, useState, useEffect, type ReactNode, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap, useBodyScrollLock } from "../../lib/useFocusTrap";
import { Kbd } from "../atoms/Decoration";
import { Icon } from "../atoms/Icon";

export interface CommandItem {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  keywords?: string[];
  shortcut?: string[];        // e.g. ["g", "h"]
  onSelect: () => void;
}
export interface CommandGroup {
  id: string;
  title: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyLabel?: ReactNode;
}

const matches = (q: string, item: CommandItem) => {
  if (!q) return true;
  const t = q.toLowerCase();
  const labelStr = typeof item.label === "string" ? item.label : "";
  return labelStr.toLowerCase().includes(t)
      || item.id.toLowerCase().includes(t)
      || (item.keywords ?? []).some((k) => k.toLowerCase().includes(t));
};

export const CommandPalette = ({
  open, onClose, groups, placeholder = "Type a gene, TF, or command…",
  emptyLabel = "No results",
}: CommandPaletteProps) => {
  const labelId = useId();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const trapRef = useFocusTrap<HTMLDivElement>(open, onClose);
  useBodyScrollLock(open);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state every time the palette is opened.
  useEffect(() => { if (open) { setQ(""); setActive(0); } }, [open]);

  // Flatten + filter into a single ordered list, but remember group boundaries.
  const { flat, sections } = useMemo(() => {
    let i = 0;
    const sections: { title: string; items: { item: CommandItem; index: number }[] }[] = [];
    const flat: CommandItem[] = [];
    for (const g of groups) {
      const items: { item: CommandItem; index: number }[] = [];
      for (const it of g.items) {
        if (!matches(q, it)) continue;
        items.push({ item: it, index: i });
        flat.push(it);
        i++;
      }
      if (items.length) sections.push({ title: g.title, items });
    }
    return { flat, sections };
  }, [groups, q]);

  // Clamp active index when filtered results change.
  useEffect(() => {
    if (active >= flat.length) setActive(Math.max(0, flat.length - 1));
  }, [flat.length, active]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, Math.max(0, flat.length - 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter")   { e.preventDefault(); flat[active]?.onSelect(); onClose(); }
  };

  if (!open) return null;

  const node = (
    <div className="dialog-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="dialog-panel"
        style={{ width: "min(640px, calc(100% - 32px))", padding: 0, overflow: "hidden" }}
        onKeyDown={onKey}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--sp-4)", borderBottom: "1px solid var(--border-default)" }}>
          <Icon name="search" size={18} aria-hidden />
          <input
            ref={inputRef}
            id={labelId}
            className="input"
            style={{ border: "none", padding: 0, fontSize: "var(--fs-body-lg)", boxShadow: "none" }}
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            aria-controls={`${labelId}-list`}
            aria-activedescendant={flat[active] ? `${labelId}-opt-${active}` : undefined}
            autoFocus
          />
          <Kbd>Esc</Kbd>
        </div>

        <div id={`${labelId}-list`} role="listbox" aria-label="Commands" style={{ maxHeight: 360, overflowY: "auto" }}>
          {sections.length === 0 && (
            <div style={{ padding: "var(--sp-6)", color: "var(--text-secondary)", textAlign: "center" }}>
              {emptyLabel}
            </div>
          )}
          {sections.map((sec) => (
            <div key={sec.title}>
              <div style={{ padding: "var(--sp-2) var(--sp-4)", fontSize: "var(--fs-mono-sm)", textTransform: "uppercase",
                            letterSpacing: "0.06em", color: "var(--text-tertiary)", fontWeight: 700,
                            background: "var(--surface-sunken)" }}>
                {sec.title}
              </div>
              {sec.items.map(({ item, index }) => (
                <div
                  key={item.id}
                  id={`${labelId}-opt-${index}`}
                  role="option"
                  aria-selected={active === index}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => { item.onSelect(); onClose(); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12,
                    padding: "var(--sp-3) var(--sp-4)",
                    cursor: "pointer",
                    background: active === index ? "var(--surface-section)" : "transparent",
                    borderLeft: active === index ? "3px solid var(--blue-2)" : "3px solid transparent",
                  }}>
                  <div style={{ minWidth: 0 }}>
                    <div>{item.label}</div>
                    {item.hint && <div style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-mono-sm)" }}>{item.hint}</div>}
                  </div>
                  {item.shortcut && (
                    <div style={{ display: "flex", gap: 4 }}>
                      {item.shortcut.map((k, i) => <Kbd key={i}>{k}</Kbd>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <footer style={{ padding: "var(--sp-2) var(--sp-4)", display: "flex", justifyContent: "space-between",
                         color: "var(--text-tertiary)", fontSize: "var(--fs-mono-sm)", borderTop: "1px solid var(--border-default)",
                         background: "var(--surface-sunken)" }}>
          <span>{flat.length} {flat.length === 1 ? "result" : "results"}</span>
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate · <Kbd>Enter</Kbd> select · <Kbd>Esc</Kbd> close</span>
        </footer>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(node, document.body) : node;
};

import {
  useEffect, useId, useMemo, useRef, useState,
  type KeyboardEvent, type ReactNode,
} from "react";
import { Icon } from "../atoms/Icon";
import { ObjectTypeTag, type ObjectType } from "../molecules/ObjectTypeTag";

export interface AutocompleteResult {
  id: string;
  type: ObjectType;
  /** Display label — typically a `<Gene>` / `<ProteinSymbol>` element. */
  label: ReactNode;
  /** Plain-text version of the label, used for the highlight + ARIA. */
  text: string;
  meta?: ReactNode;
}

export interface AutocompleteState {
  query: string;
  results: AutocompleteResult[];
  loading: boolean;
  error?: string;
}

/** Async fetch — returns results for a query. May throw to surface as error. */
export type AutocompleteFetch =
  (query: string, signal: AbortSignal) => Promise<AutocompleteResult[]>;

export interface SearchAutocompleteProps {
  fetch: AutocompleteFetch;
  onSelect: (result: AutocompleteResult) => void;
  placeholder?: string;
  debounceMs?: number;
  /** Group results by `type`. Defaults true. */
  groupByType?: boolean;
  ariaLabel?: string;
}

const TYPE_ORDER: ObjectType[] = ["gene", "operon", "tf", "regulon", "promoter", "dataset"];
const TYPE_TITLE: Record<ObjectType, string> = {
  gene: "Genes", operon: "Operons", tf: "Transcription factors",
  regulon: "Regulons", promoter: "Promoters", dataset: "Datasets",
};

/** Inserts <mark> tokens around case-insensitive `q` matches in `text`. */
const highlight = (text: string, q: string): ReactNode => {
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx < 0) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
};

export const SearchAutocomplete = ({
  fetch, onSelect, placeholder = "Search genes, TFs, operons…",
  debounceMs = 180, groupByType = true, ariaLabel = "Search",
}: SearchAutocompleteProps) => {
  const id = useId();
  const listId = `${id}-list`;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [state, setState] = useState<AutocompleteState>({ query: "", results: [], loading: false });
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced async fetch with abort.
  useEffect(() => {
    if (!q.trim()) {
      setState({ query: "", results: [], loading: false });
      return;
    }
    const ctrl = new AbortController();
    const handle = setTimeout(async () => {
      setState((s) => ({ ...s, query: q, loading: true, error: undefined }));
      try {
        const results = await fetch(q, ctrl.signal);
        if (!ctrl.signal.aborted) setState({ query: q, results, loading: false });
      } catch (err) {
        if (!ctrl.signal.aborted) setState({ query: q, results: [], loading: false, error: (err as Error).message ?? "Failed" });
      }
    }, debounceMs);
    return () => { clearTimeout(handle); ctrl.abort(); };
  }, [q, fetch, debounceMs]);

  // Group + flatten so we can navigate with one index across groups.
  const { sections, flat } = useMemo(() => {
    if (!groupByType) {
      return { sections: [{ type: "all" as const, items: state.results.map((r, i) => ({ r, i })) }], flat: state.results };
    }
    const byType = new Map<ObjectType, AutocompleteResult[]>();
    for (const r of state.results) {
      const list = byType.get(r.type) ?? [];
      list.push(r);
      byType.set(r.type, list);
    }
    const flat: AutocompleteResult[] = [];
    const sections: { type: ObjectType; items: { r: AutocompleteResult; i: number }[] }[] = [];
    for (const t of TYPE_ORDER) {
      const items = byType.get(t);
      if (!items?.length) continue;
      const indexed = items.map((r) => { const i = flat.length; flat.push(r); return { r, i }; });
      sections.push({ type: t, items: indexed });
    }
    return { sections, flat };
  }, [state.results, groupByType]);

  useEffect(() => { setActive(0); }, [flat.length]);
  useEffect(() => { if (q && flat.length) setOpen(true); }, [q, flat.length]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, Math.max(0, flat.length - 1))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter")   { e.preventDefault(); if (flat[active]) { onSelect(flat[active]); setOpen(false); } }
    else if (e.key === "Escape")  { setOpen(false); }
    else if (e.key === "Tab")     { setOpen(false); }
  };

  const showDropdown = open && q.trim().length > 0;
  const status = state.loading ? "loading" : state.error ? "error" : flat.length ? "results" : "empty";

  return (
    <div role="combobox"
         aria-expanded={showDropdown}
         aria-haspopup="listbox"
         aria-owns={listId}
         className="search-input"
         style={{ position: "relative" }}>
      <span className="icon-search"><Icon name="search" size={16} /></span>
      <input
        ref={inputRef}
        type="search"
        className="input"
        aria-label={ariaLabel}
        aria-controls={listId}
        aria-activedescendant={showDropdown && flat[active] ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        value={q}
        onChange={(e) => { setQ(e.currentTarget.value); setOpen(true); }}
        onFocus={() => { if (q) setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={onKey}
      />
      {q && (
        <button type="button" className="clear" aria-label="Clear search"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setQ(""); setOpen(false); inputRef.current?.focus(); }}>
          ×
        </button>
      )}

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          aria-label={`${ariaLabel} results`}
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "var(--surface-raised)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-sm)",
            maxHeight: 380, overflowY: "auto",
            zIndex: 50,
          }}>
          {status === "loading" && <div style={{ padding: "var(--sp-4)", color: "var(--text-secondary)" }}>Searching…</div>}
          {status === "error"   && <div style={{ padding: "var(--sp-4)", color: "var(--text-error)" }}>Search failed: {state.error}</div>}
          {status === "empty"   && <div style={{ padding: "var(--sp-4)", color: "var(--text-secondary)" }}>No results for &quot;{q}&quot;.</div>}
          {status === "results" && sections.map((sec) => (
            <div key={"type" in sec ? sec.type : "all"}>
              {groupByType && "type" in sec && (
                <div style={{ padding: "var(--sp-2) var(--sp-4)", fontSize: "var(--fs-mono-sm)",
                              textTransform: "uppercase", letterSpacing: "0.06em",
                              color: "var(--text-tertiary)", fontWeight: 700,
                              background: "var(--surface-sunken)" }}>
                  {TYPE_TITLE[sec.type]}
                </div>
              )}
              {sec.items.map(({ r, i }) => (
                <div
                  key={r.id}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={active === i}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); onSelect(r); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "var(--sp-3) var(--sp-4)",
                    cursor: "pointer",
                    background: active === i ? "var(--surface-section)" : "transparent",
                    borderLeft: active === i ? "3px solid var(--blue-2)" : "3px solid transparent",
                  }}>
                  {!groupByType && <ObjectTypeTag type={r.type} />}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div>{q ? highlight(r.text, q) : r.label}</div>
                    {r.meta && <div style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-mono-sm)" }}>{r.meta}</div>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

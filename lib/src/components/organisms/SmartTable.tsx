import { useMemo, useState, type ReactNode } from "react";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Toggles";
import { Tag } from "../atoms/Decoration";
import { Icon } from "../atoms/Icon";
import { DropdownMenu } from "../molecules/DropdownMenu";

export interface SmartColumn<T> {
  key: string;
  header: ReactNode;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /** Plain value used for sort/export — falls back to JSON of the cell render. */
  value?: (row: T) => string | number | null | undefined;
  align?: "left" | "right";
  sortable?: boolean;
  defaultHidden?: boolean;
}

export type SetOp = "intersect" | "union" | "save";

export interface SmartTableProps<T> {
  columns: SmartColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Title shown in the toolbar. */
  title?: ReactNode;
  /** When provided, show export button(s); receives the visible+selected rows. */
  onExport?: (format: "tsv" | "csv" | "json", rows: T[]) => void;
  /** Called when the user runs a set operation against the current selection. */
  onSetOp?: (op: SetOp, rows: T[]) => void;
  density?: "compact" | "comfortable";
  /** Disable selection column. */
  selectable?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Default export: writes a Blob and triggers a download.                    */
/* -------------------------------------------------------------------------- */
const defaultExport = <T,>(columns: SmartColumn<T>[], rows: T[], format: "tsv" | "csv" | "json", baseName = "regulondb-export") => {
  const valueOf = (col: SmartColumn<T>, row: T): string => {
    const v = col.value?.(row);
    if (v != null) return String(v);
    // Fallback: render the cell to string. JSX cells render as [object Object];
    // callers should provide `value` to get clean exports.
    return String(col.cell(row) ?? "");
  };
  let body = "";
  let mime = "text/plain";
  let ext  = format;

  if (format === "json") {
    body = JSON.stringify(rows.map((r) => Object.fromEntries(columns.map((c) => [c.key, valueOf(c, r)]))), null, 2);
    mime = "application/json";
  } else {
    const sep = format === "csv" ? "," : "\t";
    const escape = (s: string) =>
      format === "csv" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    const headerRow = columns.map((c) => escape(typeof c.header === "string" ? c.header : c.key));
    const lines = [headerRow.join(sep)];
    for (const r of rows) lines.push(columns.map((c) => escape(valueOf(c, r))).join(sep));
    body = lines.join("\n");
    mime = format === "csv" ? "text/csv" : "text/tab-separated-values";
  }

  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}.${ext}`;
  a.click();
  URL.revokeObjectURL(url);
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */
export function SmartTable<T>({
  columns, rows, rowKey, title, onExport, onSetOp,
  density = "comfortable", selectable = true,
}: SmartTableProps<T>) {
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [hidden, setHidden]       = useState<Set<string>>(new Set(columns.filter((c) => c.defaultHidden).map((c) => c.key)));
  const [sort, setSort]           = useState<{ key: string; dir: 1 | -1 } | null>(null);

  const visibleCols = useMemo(() => columns.filter((c) => !hidden.has(c.key)), [columns, hidden]);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const valueOf = (r: T) => col.value?.(r) ?? null;
    return [...rows].sort((a, b) => {
      const va = valueOf(a), vb = valueOf(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * sort.dir;
      return String(va).localeCompare(String(vb)) * sort.dir;
    });
  }, [rows, columns, sort]);

  const allSelected = sortedRows.length > 0 && sortedRows.every((r) => selected.has(rowKey(r)));
  const someSelected = !allSelected && sortedRows.some((r) => selected.has(rowKey(r)));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(sortedRows.map(rowKey)));
  };
  const toggleOne = (k: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k); else n.add(k);
      return n;
    });
  };

  const onSort = (key: string) => {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: 1 };
      if (s.dir === 1)    return { key, dir: -1 };
      return null;
    });
  };

  const selectedRows = useMemo(() => sortedRows.filter((r) => selected.has(rowKey(r))), [sortedRows, selected, rowKey]);
  const exportRows = selectedRows.length ? selectedRows : sortedRows;

  const doExport = (fmt: "tsv" | "csv" | "json") => {
    if (onExport) onExport(fmt, exportRows);
    else defaultExport(visibleCols, exportRows, fmt);
  };

  const visibilityItems = columns.map((c) => ({
    id: c.key,
    label: (
      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <Checkbox
          checked={!hidden.has(c.key)}
          onChange={() => setHidden((s) => { const n = new Set(s); n.has(c.key) ? n.delete(c.key) : n.add(c.key); return n; })}
        />
        {typeof c.header === "string" ? c.header : c.key}
      </label>
    ),
  }));

  return (
    <div className="smart-table" style={{ border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)" }}>
      {/* Toolbar */}
      <div role="toolbar" aria-label="Table toolbar"
           style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--sp-3) var(--sp-4)",
                    borderBottom: "1px solid var(--border-default)", background: "var(--surface-sunken)" }}>
        {title && <strong style={{ marginRight: "auto" }}>{title}</strong>}
        {!title && <span style={{ marginRight: "auto" }} />}
        {selected.size > 0 && (
          <>
            <Tag><span style={{ fontFamily: "var(--font-mono)" }}>{selected.size}</span> selected</Tag>
            {onSetOp && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onSetOp("intersect", selectedRows)}>Intersect</Button>
                <Button variant="ghost" size="sm" onClick={() => onSetOp("union", selectedRows)}>Union</Button>
                <Button variant="ghost" size="sm" onClick={() => onSetOp("save", selectedRows)}>Save as set</Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </>
        )}
        <DropdownMenu trigger={<Button variant="outline" size="sm" leadingIcon={<Icon name="sliders" size={14} />}>Columns</Button>}
                      items={visibilityItems} />
        <DropdownMenu trigger={<Button variant="outline" size="sm" leadingIcon={<Icon name="download" size={14} />}>Export</Button>}
                      items={[
                        { id: "tsv",  label: "TSV", onClick: () => doExport("tsv") },
                        { id: "csv",  label: "CSV", onClick: () => doExport("csv") },
                        { id: "json", label: "JSON", onClick: () => doExport("json") },
                      ]} />
      </div>

      {/* Table */}
      <table className={`data ${density === "compact" ? "compact" : ""}`}>
        <thead>
          <tr>
            {selectable && (
              <th style={{ width: 36 }} aria-label="Select all">
                <Checkbox
                  checked={allSelected}
                  onChange={toggleAll}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                />
              </th>
            )}
            {visibleCols.map((c) => {
              const isSorted = sort?.key === c.key;
              return (
                <th key={c.key} scope="col" style={{ textAlign: c.align ?? "left", cursor: c.sortable ? "pointer" : undefined }}
                    aria-sort={isSorted ? (sort!.dir === 1 ? "ascending" : "descending") : undefined}
                    onClick={c.sortable ? () => onSort(c.key) : undefined}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {c.header}
                    {c.sortable && (
                      <span aria-hidden="true" style={{ color: isSorted ? "var(--text-link)" : "var(--text-tertiary)" }}>
                        {isSorted ? (sort!.dir === 1 ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => {
            const k = rowKey(row);
            const isSelected = selected.has(k);
            return (
              <tr key={k} aria-selected={isSelected || undefined}
                  style={isSelected ? { background: "rgba(213,226,234,0.30)" } : undefined}>
                {selectable && (
                  <td>
                    <Checkbox checked={isSelected} onChange={() => toggleOne(k)}
                              aria-label={`Select row ${k}`} />
                  </td>
                )}
                {visibleCols.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? "left" }}>{c.cell(row)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

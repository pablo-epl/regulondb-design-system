import type { ReactNode, TableHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
}
export interface TableProps<T> extends Omit<TableHTMLAttributes<HTMLTableElement>, "children"> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T, i: number) => string;
  density?: "compact" | "comfortable";
  caption?: ReactNode;
}

export function Table<T>({ columns, rows, rowKey, density = "comfortable", caption, className, ...rest }: TableProps<T>) {
  return (
    <table className={cn("data", density === "compact" && "compact", className)} {...rest}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>{columns.map((c) => <th key={c.key} scope="col" style={{ textAlign: c.align ?? "left" }}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={rowKey(row, i)}>
            {columns.map((c) => <td key={c.key} style={{ textAlign: c.align ?? "left" }}>{c.cell(row)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

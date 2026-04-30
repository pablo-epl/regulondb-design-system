export interface PaginationProps {
  page: number;
  total: number;
  onChange?: (page: number) => void;
  ariaLabel?: string;
}

export const Pagination = ({ page, total, onChange, ariaLabel = "Pagination" }: PaginationProps) => (
  <nav className="pagination" aria-label={ariaLabel}>
    <button disabled={page === 1} onClick={() => onChange?.(page - 1)}>← Prev</button>
    {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
      <button
        key={p}
        aria-current={p === page ? "page" : undefined}
        onClick={() => onChange?.(p)}
      >{p}</button>
    ))}
    <button disabled={page === total} onClick={() => onChange?.(page + 1)}>Next →</button>
  </nav>
);

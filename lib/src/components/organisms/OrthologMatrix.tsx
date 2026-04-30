import { Gene, TaxonName } from "../atoms/Scientific";

export interface OrthologRow { target: string; identities: Record<string, number | null> }
export interface OrthologMatrixProps {
  organisms: { id: string; taxon: string }[];
  rows: OrthologRow[];
}

const colorFor = (id: number | null) =>
  id == null ? "var(--surface-sunken)"
  : id >= 85 ? "var(--blue-2)"
  : id >= 65 ? "var(--blue-3)"
  : id >= 40 ? "var(--blue-4)"
              : "var(--blue-5)";

export const OrthologMatrix = ({ organisms, rows }: OrthologMatrixProps) => (
  <table className="data" aria-label="Ortholog conservation matrix">
    <thead>
      <tr>
        <th scope="col">Target</th>
        {organisms.map((o) => <th key={o.id} scope="col"><TaxonName>{o.taxon}</TaxonName></th>)}
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r.target}>
          <td><Gene>{r.target}</Gene></td>
          {organisms.map((o) => {
            const v = r.identities[o.id];
            return (
              <td key={o.id}
                  style={{ background: colorFor(v), color: v != null && v >= 65 ? "#fff" : "var(--text-primary)" }}>
                {v == null ? "N/A" : `${v}%`}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

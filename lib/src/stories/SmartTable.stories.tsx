import type { Meta, StoryObj } from "@storybook/react";
import { SmartTable, type SmartColumn } from "../components/organisms/SmartTable";
import { Gene, Coordinate } from "../components/atoms/Scientific";
import { EvidenceBadge } from "../components/molecules/EvidenceBadge";

interface Row {
  gene: string;
  position: number;
  strand: "+" | "-";
  length: number;
  evidence: "IDA" | "IPI" | "IEA" | "HT";
}
const ROWS: Row[] = [
  { gene: "recA", position: 2820830, strand: "+", length: 1062, evidence: "IDA" },
  { gene: "uvrA", position: 4266402, strand: "+", length: 2823, evidence: "IDA" },
  { gene: "sulA", position: 1043002, strand: "-", length: 510,  evidence: "IPI" },
  { gene: "dinB", position: 242310,  strand: "+", length: 1053, evidence: "IEA" },
  { gene: "umuD", position: 1228001, strand: "+", length: 420,  evidence: "HT"  },
  { gene: "ssb",  position: 4275310, strand: "+", length: 537,  evidence: "IDA" },
  { gene: "ruvA", position: 1942100, strand: "+", length: 609,  evidence: "IDA" },
  { gene: "ruvB", position: 1942710, strand: "+", length: 1011, evidence: "IDA" },
  { gene: "umuC", position: 1228422, strand: "+", length: 1269, evidence: "IEA" },
  { gene: "polB", position: 64900,   strand: "+", length: 2349, evidence: "HT"  },
];

const columns: SmartColumn<Row>[] = [
  { key: "gene", header: "Gene", cell: (r) => <Gene>{r.gene}</Gene>, value: (r) => r.gene, sortable: true },
  { key: "position", header: "Position", cell: (r) => <Coordinate value={r.position} />, value: (r) => r.position, sortable: true, align: "right" },
  { key: "strand", header: "Strand", cell: (r) => r.strand, value: (r) => r.strand, sortable: true },
  { key: "length", header: "Length", cell: (r) => `${r.length} bp`, value: (r) => r.length, sortable: true, align: "right" },
  { key: "evidence", header: "Evidence",
    cell: (r) => <EvidenceBadge code={r.evidence} category={r.evidence === "IEA" ? "predicted" : r.evidence === "HT" ? "ht" : "curated"} />,
    value: (r) => r.evidence, sortable: true },
];

const meta: Meta = { title: "Organisms/SmartTable" };
export default meta;

export const Default: StoryObj = {
  render: () => (
    <SmartTable
      title="LexA targets"
      columns={columns}
      rows={ROWS}
      rowKey={(r) => r.gene}
      onSetOp={(op, rows) => alert(`${op} on ${rows.length} rows: ${rows.map((r) => r.gene).join(", ")}`)}
    />
  ),
};

import { Fragment } from "react";

export interface SequenceBlock { pos: number; seq: string }
export interface SequenceProps {
  blocks: SequenceBlock[];
  highlight?: string | null;
}

export const Sequence = ({ blocks, highlight }: SequenceProps) => (
  <pre className="sequence">
    {blocks.map((row, i) => (
      <div key={i}>
        <span className="num">{String(row.pos).padStart(7, " ")}</span>{"  "}
        {row.seq.split(" ").map((b, j) => (
          <Fragment key={j}>
            {highlight && highlight === b ? <mark>{b}</mark> : b}
            {j < row.seq.split(" ").length - 1 ? " " : ""}
          </Fragment>
        ))}
      </div>
    ))}
  </pre>
);

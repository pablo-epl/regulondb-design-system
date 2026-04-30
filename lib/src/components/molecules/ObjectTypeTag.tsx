import { cn } from "../../lib/utils";

export type ObjectType = "gene" | "operon" | "tf" | "regulon" | "promoter" | "dataset";

const LABEL: Record<ObjectType, string> = {
  gene: "Gene", operon: "Operon", tf: "TF",
  regulon: "Regulon", promoter: "Promoter", dataset: "Dataset",
};

export interface ObjectTypeTagProps { type: ObjectType; className?: string }

export const ObjectTypeTag = ({ type, className }: ObjectTypeTagProps) => (
  <span className={cn("obj-tag", `obj-tag--${type}`, className)}>{LABEL[type]}</span>
);

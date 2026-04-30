import type { ReactNode } from "react";

export interface ConservationBarProps {
  pct: number;
  label?: ReactNode;
  ariaLabel?: string;
}

export const ConservationBar = ({ pct, label, ariaLabel }: ConservationBarProps) => (
  <span className="cons-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={ariaLabel ?? `${pct}% identity`}>
    <span className="track"><span className="fill" style={{ width: `${pct}%` }} /></span>
    <span>{pct}% {label}</span>
  </span>
);

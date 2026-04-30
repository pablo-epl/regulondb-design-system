import type { ReactNode } from "react";

export interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
}

export const Tooltip = ({ label, children }: TooltipProps) => (
  <span className="tooltip" tabIndex={0}>
    {children}
    <span className="tooltip-content" role="tooltip">{label}</span>
  </span>
);

import type { ReactNode } from "react";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const EmptyState = ({ icon = "○", title, description, action }: EmptyStateProps) => (
  <div className="empty">
    <div className="icon" aria-hidden="true">{icon}</div>
    <h4>{title}</h4>
    {description && <p>{description}</p>}
    {action && <div className="actions">{action}</div>}
  </div>
);

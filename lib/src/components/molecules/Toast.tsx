import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export type ToastTone = "info" | "success" | "warning" | "error";

export interface ToastProps {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export const Toast = ({ tone = "info", title, description, action }: ToastProps) => (
  <div
    className={cn("toast", tone !== "info" && `toast--${tone}`)}
    role={tone === "error" || tone === "warning" ? "alert" : "status"}
  >
    <div className="body">
      <div className="title">{title}</div>
      {description && <div className="desc">{description}</div>}
    </div>
    {action}
  </div>
);

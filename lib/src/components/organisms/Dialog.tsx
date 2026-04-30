import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap, useBodyScrollLock } from "../../lib/useFocusTrap";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Element that names the dialog (announced to screen readers). */
  title?: ReactNode;
  /** Element that describes the dialog (announced after the name). */
  description?: ReactNode;
  /** Buttons row at the bottom of the panel. */
  actions?: ReactNode;
  children?: ReactNode;
  /** Click outside the panel closes the dialog. Default true. */
  dismissOnOverlay?: boolean;
  /** ESC closes the dialog. Default true. */
  dismissOnEscape?: boolean;
  /** Optional class for the panel. */
  className?: string;
  /** Width preset; falls back to design-system default. */
  size?: "sm" | "md" | "lg";
}

const SIZE_WIDTHS: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "min(420px, calc(100% - 32px))",
  md: "min(560px, calc(100% - 32px))",
  lg: "min(800px, calc(100% - 32px))",
};

export const Dialog = ({
  open, onClose, title, description, actions, children,
  dismissOnOverlay = true, dismissOnEscape = true,
  size = "md", className,
}: DialogProps) => {
  const titleId = useId();
  const descId  = useId();

  const trapRef = useFocusTrap<HTMLDivElement>(open, dismissOnEscape ? onClose : undefined);
  useBodyScrollLock(open);

  if (!open) return null;

  const panel = (
    <div className="dialog-overlay"
         onMouseDown={(e) => { if (dismissOnOverlay && e.target === e.currentTarget) onClose(); }}>
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        className={`dialog-panel ${className ?? ""}`}
        style={{ width: SIZE_WIDTHS[size] }}
      >
        {title && <h3 id={titleId}>{title}</h3>}
        {description && <p id={descId} style={{ color: "var(--text-secondary)", margin: "0 0 var(--sp-3)" }}>{description}</p>}
        <div>{children}</div>
        {actions && <div className="actions">{actions}</div>}
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(panel, document.body) : panel;
};

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sunken" | "section" | "note";
  header?: ReactNode;
  footer?: ReactNode;
}

export const Card = ({ variant = "default", header, footer, className, children, ...rest }: CardProps) => (
  <div className={cn("card", variant !== "default" && `card--${variant}`, className)} {...rest}>
    {header && <header>{header}</header>}
    {children}
    {footer && <footer>{footer}</footer>}
  </div>
);

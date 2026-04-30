import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "solid" | "accent";
  children?: ReactNode;
}
export const Tag = ({ variant = "neutral", className, children, ...rest }: TagProps) => (
  <span className={cn("tag", variant !== "neutral" && `tag--${variant}`, className)} {...rest}>{children}</span>
);

export const Kbd = ({ children }: { children: ReactNode }) => <span className="kbd">{children}</span>;

export const Spinner = ({ label = "Loading" }: { label?: string }) => (
  <span className="spinner" role="status" aria-label={label} />
);

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}
export const Skeleton = ({ width = "100%", height = 12, className }: SkeletonProps) => (
  <span className={cn("skeleton", className)} style={{ width, height }} aria-hidden="true" />
);

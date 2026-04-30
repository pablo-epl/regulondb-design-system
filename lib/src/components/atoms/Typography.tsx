import type { LabelHTMLAttributes, ReactNode, HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const Label = ({ className, children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("label", className)} {...rest}>{children}</label>
);

export interface HelperTextProps extends HTMLAttributes<HTMLDivElement> { error?: boolean }
export const HelperText = ({ error, className, children, ...rest }: HelperTextProps) => (
  <div className={cn("helper-text", error && "helper-text--error", className)} {...rest}>{children}</div>
);

export const VisuallyHidden = ({ children }: { children: ReactNode }) => (
  <span style={{
    position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px",
    overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0,
  }}>{children}</span>
);

export const Divider = () => <hr className="divider" />;

export const Link = ({ className, href, children, ...rest }: HTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
  <a className={cn("link", className)} href={href} {...rest}>{children}</a>
);

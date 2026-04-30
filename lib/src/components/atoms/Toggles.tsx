import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ToggleProps = InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...rest }, ref) => <input ref={ref} type="checkbox" className={cn("checkbox", className)} {...rest} />
);
Checkbox.displayName = "Checkbox";

export const Radio = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...rest }, ref) => <input ref={ref} type="radio" className={cn("radio", className)} {...rest} />
);
Radio.displayName = "Radio";

export const Switch = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, ...rest }, ref) => <input ref={ref} type="checkbox" role="switch" className={cn("switch", className)} {...rest} />
);
Switch.displayName = "Switch";

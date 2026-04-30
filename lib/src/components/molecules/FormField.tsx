import { useId, type ReactNode, cloneElement, isValidElement } from "react";
import { Label, HelperText } from "../atoms/Typography";

export interface FormFieldProps {
  label: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

/** Wires up label/input ids and aria-describedby. The input is the only child. */
export const FormField = ({ label, helper, error, children }: FormFieldProps) => {
  const id = useId();
  const helpId = `${id}-help`;
  const errId  = `${id}-err`;
  const child = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-describedby": [helper && helpId, error && errId].filter(Boolean).join(" ") || undefined,
        "aria-invalid": error ? true : undefined,
      } as Record<string, unknown>)
    : children;
  return (
    <div className="form-field">
      <Label htmlFor={id}>{label}</Label>
      {child}
      {error  && <HelperText id={errId} error>{error}</HelperText>}
      {helper && !error && <HelperText id={helpId}>{helper}</HelperText>}
    </div>
  );
};

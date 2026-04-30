import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Dialog } from "./Dialog";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { HelperText, Label } from "../atoms/Typography";

/* ============================================================================
   PromptDialog & ConfirmDialog
   ----------------------------------------------------------------------------
   Branded replacements for `window.prompt()` and `window.confirm()`.
   Both are thin specializations of the focus-trapped <Dialog> primitive — the
   shared focus-trap, body-scroll lock, ESC + click-outside dismissal, and
   role/aria-modal/aria-labelledby wiring all come from there.

   Two consumption styles, pick the one that fits your call site:

     1. Controlled: <PromptDialog open onSubmit onCancel … /> — straightforward.
     2. Imperative: const ask = usePromptDialog();
                    const name = await ask({ title: "…" });
        Returns string | null. Mounts the dialog from a hook so callers can
        replace `prompt(…)` one line at a time.
   ============================================================================ */

// ---------------------------------------------------------------- Controlled

export interface PromptDialogProps {
  open: boolean;
  /** Title shown inside the dialog header (also used for aria-labelledby). */
  title: ReactNode;
  /** Optional descriptive text above the input. */
  description?: ReactNode;
  /** Label for the input. Defaults to the title — set explicitly when title is React-y. */
  inputLabel?: ReactNode;
  /** Pre-filled value when the dialog opens. */
  defaultValue?: string;
  placeholder?: string;
  /** Validate the value as the user types. Return a string error or null. */
  validate?: (value: string) => string | null;
  /** Called with the trimmed value on confirm; nothing on cancel. */
  onSubmit: (value: string) => void;
  onCancel: () => void;
  confirmLabel?: ReactNode;     // default "Save"
  cancelLabel?:  ReactNode;     // default "Cancel"
  /** Variant of confirm button. Default "primary"; use "destructive" for delete. */
  tone?: "primary" | "destructive";
}

export const PromptDialog = ({
  open, title, description, inputLabel,
  defaultValue = "", placeholder, validate,
  onSubmit, onCancel,
  confirmLabel = "Save", cancelLabel = "Cancel",
  tone = "primary",
}: PromptDialogProps) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state every time the dialog is opened.
  useEffect(() => {
    if (!open) return;
    setValue(defaultValue);
    setError(null);
    queueMicrotask(() => inputRef.current?.select());
  }, [open, defaultValue]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    const err = validate ? validate(trimmed) : null;
    if (err) { setError(err); return; }
    onSubmit(trimmed);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      actions={
        <>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={tone === "destructive" ? "destructive" : "primary"} onClick={() => submit()}>
            {confirmLabel}
          </Button>
        </>
      }>
      <form onSubmit={submit}>
        {inputLabel && <Label htmlFor="prompt-dialog-input">{inputLabel}</Label>}
        <Input
          id="prompt-dialog-input"
          ref={inputRef}
          value={value}
          placeholder={placeholder}
          onChange={(e) => { setValue(e.currentTarget.value); if (error) setError(null); }}
          invalid={!!error}
        />
        {error && <HelperText error>{error}</HelperText>}
      </form>
    </Dialog>
  );
};

// ---------------------------------------------------------------- Confirm

export interface ConfirmDialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: ReactNode;
  cancelLabel?:  ReactNode;
  tone?: "primary" | "destructive";
}

export const ConfirmDialog = ({
  open, title, description, onConfirm, onCancel,
  confirmLabel = "Confirm", cancelLabel = "Cancel", tone = "primary",
}: ConfirmDialogProps) => (
  <Dialog
    open={open}
    onClose={onCancel}
    title={title}
    description={description}
    size="sm"
    actions={
      <>
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant={tone === "destructive" ? "destructive" : "primary"} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  />
);

// ---------------------------------------------------------------- Imperative

type PromptOpts = Omit<PromptDialogProps, "open" | "onSubmit" | "onCancel">;
type ConfirmOpts = Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel">;

/**
 * Returns `[ask, dialogElement]`. Render `dialogElement` somewhere stable
 * (typically near the consumer, just inside the route). `ask` is a function
 * that opens the prompt and resolves with the entered string, or null on
 * cancel.
 *
 * Example:
 *   const [askName, nameDialog] = usePromptDialog();
 *   const onSave = async () => {
 *     const name = await askName({ title: "Name this set" });
 *     if (name) saveSet(name);
 *   };
 *   return <>{nameDialog}<Button onClick={onSave}>Save</Button></>;
 */
export function usePromptDialog(): [(opts: PromptOpts) => Promise<string | null>, ReactNode] {
  const [state, setState] = useState<{ open: boolean; opts?: PromptOpts; resolve?: (v: string | null) => void }>({ open: false });

  const ask = useCallback((opts: PromptOpts) =>
    new Promise<string | null>((resolve) => setState({ open: true, opts, resolve })),
  []);

  const close = (val: string | null) => {
    state.resolve?.(val);
    setState({ open: false });
  };

  const dialog = state.opts ? (
    <PromptDialog
      {...state.opts}
      open={state.open}
      onSubmit={(v) => close(v)}
      onCancel={() => close(null)}
    />
  ) : null;

  return [ask, dialog];
}

export function useConfirmDialog(): [(opts: ConfirmOpts) => Promise<boolean>, ReactNode] {
  const [state, setState] = useState<{ open: boolean; opts?: ConfirmOpts; resolve?: (v: boolean) => void }>({ open: false });

  const ask = useCallback((opts: ConfirmOpts) =>
    new Promise<boolean>((resolve) => setState({ open: true, opts, resolve })),
  []);

  const close = (val: boolean) => {
    state.resolve?.(val);
    setState({ open: false });
  };

  const dialog = state.opts ? (
    <ConfirmDialog
      {...state.opts}
      open={state.open}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  ) : null;

  return [ask, dialog];
}

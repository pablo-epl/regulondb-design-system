import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "../atoms/Button";
import { Kbd } from "../atoms/Decoration";
import { cn } from "../../lib/utils";

/* ============================================================================
   ChatComposer
   ----------------------------------------------------------------------------
   Auto-growing textarea + submit button + ⌘Enter hint. The composer is
   controlled internally; it calls `onSubmit` with the trimmed value when the
   user presses Enter (no Shift) or clicks the send button. Empty submits are
   ignored.
   ============================================================================ */

export interface ChatComposerProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  /** Disable the entire composer (e.g. while the assistant is responding). */
  disabled?: boolean;
  /** Optional list of suggestion chips shown above the composer. */
  suggestions?: string[];
  className?: string;
  autoFocus?: boolean;
}

export const ChatComposer = ({
  placeholder = "Ask about a gene, TF, regulon, or any concept…",
  onSubmit, disabled, suggestions, className, autoFocus,
}: ChatComposerProps) => {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height.
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [value]);

  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);

  const send = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSubmit(v);
    setValue("");
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className={cn("chat-composer", className)}>
      {suggestions && suggestions.length > 0 && (
        <div className="chat-composer__suggestions">
          {suggestions.map((s) => (
            <button key={s} type="button" className="chat-composer__suggestion"
                    disabled={disabled}
                    onClick={() => { setValue(s); ref.current?.focus(); }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="chat-composer__row">
        <textarea
          ref={ref}
          rows={1}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          className="chat-composer__input"
        />
        <Button variant="primary" size="sm" onClick={send} disabled={disabled || !value.trim()}>
          Send
        </Button>
      </div>
      <div className="chat-composer__hint">
        <Kbd>↵</Kbd> send · <Kbd>Shift</Kbd>+<Kbd>↵</Kbd> newline
      </div>
    </div>
  );
};

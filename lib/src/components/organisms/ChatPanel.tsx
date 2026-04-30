import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../lib/useFocusTrap";
import { ChatComposer } from "../molecules/ChatComposer";
import { cn } from "../../lib/utils";

/* ============================================================================
   ChatPanel
   ----------------------------------------------------------------------------
   Slide-in right drawer that hosts the assistant. The panel is a controlled
   component: parents own the message list and pass it as `children`. The
   composer at the bottom relays user input via `onSubmit`.

   - Focus is trapped inside the panel while open (Escape calls `onClose`).
   - Body scroll is NOT locked and the overlay is fully transparent — the
     page beneath stays visible and uninhibited (no dim, no backdrop blur),
     since the panel is a side drawer rather than a modal. The overlay
     exists purely to catch click-outside-to-close.
   - The messages region auto-scrolls to the bottom whenever its children
     change — this is what makes the assistant feel alive while streaming
     replies.
   ============================================================================ */

export interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  /** Heading shown in the panel header. */
  title?: ReactNode;
  /** Smaller text shown next to the title (e.g. flavor / mode badge). */
  subtitle?: ReactNode;
  /** Conversation history — typically a list of <ChatMessage>s. */
  children: ReactNode;
  /** Called when the user submits a message via the composer. */
  onSubmit: (value: string) => void;
  /** Disable the composer (assistant is responding). */
  busy?: boolean;
  /** Suggestion chips shown above the composer. */
  suggestions?: string[];
  /** Composer placeholder. */
  placeholder?: string;
  className?: string;
}

export const ChatPanel = ({
  open, onClose, title = "RegulonDB Assistant", subtitle,
  children, onSubmit, busy, suggestions, placeholder, className,
}: ChatPanelProps) => {
  const labelId = useId();
  const trapRef = useFocusTrap<HTMLElement>(open, onClose);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when message list changes.
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [children]);

  if (!open) return null;

  const node = (
    <>
      <div className="chat-panel-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        ref={trapRef}
        className={cn("chat-panel", className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
      >
        <header className="chat-panel__header">
          <h3 id={labelId}>
            <span aria-hidden="true">✦</span>
            {title}
            {subtitle && <small>{subtitle}</small>}
          </h3>
          <button
            type="button"
            className="chat-panel__close"
            onClick={onClose}
            aria-label="Close assistant"
          >
            ×
          </button>
        </header>
        <div className="chat-panel__messages" ref={messagesRef}>
          {children}
        </div>
        <ChatComposer
          onSubmit={onSubmit}
          disabled={busy}
          suggestions={suggestions}
          placeholder={placeholder}
        />
      </aside>
    </>
  );

  return typeof document !== "undefined" ? createPortal(node, document.body) : node;
};

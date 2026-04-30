import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/* ============================================================================
   ChatMessage
   ----------------------------------------------------------------------------
   A single bubble in the assistant chat. Roles:
     - user      : aligned right, blue background
     - assistant : aligned left, grey-5 surface
     - system    : full-width muted notice (e.g. "Cleared chat", error tone)
   Content is freeform — typically text, but can hold CitationChip rows
   or a TypingIndicator while the assistant is composing.
   ============================================================================ */

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageProps {
  role: ChatRole;
  /** Optional avatar override. Defaults to "U" / "RDB" / "·" by role. */
  avatar?: ReactNode;
  /** Message body. */
  children: ReactNode;
  /** Optional citation chips, footnotes — rendered below the body. */
  footer?: ReactNode;
  /** Optional timestamp (ISO 8601 or pre-formatted). */
  timestamp?: string;
  className?: string;
}

const DEFAULT_AVATARS: Record<ChatRole, string> = {
  user:      "U",
  assistant: "RDB",
  system:    "·",
};

export const ChatMessage = ({
  role, avatar, children, footer, timestamp, className,
}: ChatMessageProps) => (
  <div className={cn("chat-msg", `chat-msg--${role}`, className)} role="article">
    <span className="chat-msg__avatar" aria-hidden="true">{avatar ?? DEFAULT_AVATARS[role]}</span>
    <div className="chat-msg__body">
      <div className="chat-msg__bubble">{children}</div>
      {footer && <div className="chat-msg__footer">{footer}</div>}
      {timestamp && <time className="chat-msg__time" dateTime={timestamp}>{timestamp}</time>}
    </div>
  </div>
);

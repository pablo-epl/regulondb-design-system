import { cn } from "../../lib/utils";

/**
 * Three-dot animated typing indicator for chat assistant "thinking" states.
 * Honours prefers-reduced-motion via the global tokens.css rule.
 */
export interface TypingIndicatorProps {
  label?: string;
  className?: string;
}

export const TypingIndicator = ({ label = "Assistant is thinking", className }: TypingIndicatorProps) => (
  <span className={cn("typing-indicator", className)} role="status" aria-label={label}>
    <span /><span /><span />
  </span>
);

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE = [
  "a[href]", "area[href]", "input:not([disabled])", "select:not([disabled])",
  "textarea:not([disabled])", "button:not([disabled])", "iframe", "object",
  "embed", '[tabindex]:not([tabindex="-1"])', "[contenteditable]",
].join(",");

const tabbables = (root: HTMLElement) =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
       .filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

/**
 * Trap focus inside a container while it is mounted/active.
 *
 * - Captures the previously-focused element on activation; restores on deactivation.
 * - Tab / Shift+Tab loop within the container.
 * - Optionally calls `onEscape` when Escape is pressed.
 * - Auto-focuses the first focusable element (or the container itself).
 *
 * Returns the ref to attach to the trap container.
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  active: boolean,
  onEscape?: () => void,
): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    const container = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Initial focus — first tabbable, or the container itself.
    const first = tabbables(container)[0] ?? container;
    if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
    queueMicrotask(() => first.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) { e.stopPropagation(); onEscape(); return; }
      if (e.key !== "Tab") return;
      const list = tabbables(container);
      if (list.length === 0) { e.preventDefault(); container.focus(); return; }
      const firstEl = list[0];
      const lastEl  = list[list.length - 1];
      const active$ = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active$ === firstEl || active$ === container)) {
        e.preventDefault(); lastEl.focus();
      } else if (!e.shiftKey && active$ === lastEl) {
        e.preventDefault(); firstEl.focus();
      }
    };
    container.addEventListener("keydown", onKey);

    return () => {
      container.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [active, onEscape]);

  return ref;
}

/** Lock body scroll while a modal is open. Returns a cleanup-running effect. */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

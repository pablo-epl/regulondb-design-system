import { useState, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";

export interface TabsProps {
  items: { id: string; label: ReactNode }[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  segmented?: boolean;
  ariaLabel?: string;
}

export const Tabs = ({ items, value, defaultValue, onChange, segmented, ariaLabel }: TabsProps) => {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  const current = value ?? internal;

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = items.findIndex((it) => it.id === current);
    if (i < 0) return;
    if (e.key === "ArrowRight") select(items[(i + 1) % items.length].id);
    else if (e.key === "ArrowLeft") select(items[(i - 1 + items.length) % items.length].id);
    else if (e.key === "Home") select(items[0].id);
    else if (e.key === "End")  select(items[items.length - 1].id);
  };

  return (
    <div className={cn("tabs", segmented && "tabs--segmented")} role="tablist" aria-label={ariaLabel}>
      {items.map((it) => (
        <button
          key={it.id}
          role="tab"
          tabIndex={current === it.id ? 0 : -1}
          aria-selected={current === it.id}
          onClick={() => select(it.id)}
          onKeyDown={onKey}
        >{it.label}</button>
      ))}
    </div>
  );
};

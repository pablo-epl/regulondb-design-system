import { useState, type ReactNode } from "react";

export interface MenuItem { id: string; label: ReactNode; onClick?: () => void }

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
}

/** Minimal — lib/ Storybook will replace this with shadcn/ui's primitive
    once added; the API stays identical. */
export const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span onClick={() => setOpen((s) => !s)}>{trigger}</span>
      {open && (
        <div className="menu" role="menu" style={{ position: "absolute", top: "100%", left: 0, marginTop: 4 }}>
          {items.map((it) => (
            <div key={it.id} role="menuitem" tabIndex={0}
                 onClick={() => { it.onClick?.(); setOpen(false); }}>
              {it.label}
            </div>
          ))}
        </div>
      )}
    </span>
  );
};

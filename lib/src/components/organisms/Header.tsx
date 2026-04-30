import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import { Kbd } from "../atoms/Decoration";
import { Logo } from "../atoms/Logo";
import { SearchInput } from "../molecules/SearchInput";
import { OrganismPill, type OrganismPillProps } from "../molecules/OrganismPill";

export interface HeaderProps {
  organism?: OrganismPillProps;
  onSearch?: (q: string) => void;
  rightActions?: ReactNode;
}

export const Header = ({ organism, onSearch, rightActions }: HeaderProps) => (
  <header className="app-header" role="banner">
    <a className="brand-lockup" href="#" aria-label="RegulonDB home">
      <Logo variant="wordmark-dark" height={28} />
      <span className="brand-name brand-name--strap">
        <small>Multi-genomic</small>
      </span>
    </a>
    <div className="global-search" style={{ flex: 1, maxWidth: 480 }}>
      <SearchInput placeholder="Search genes, TFs, operons" onChange={(e) => onSearch?.(e.currentTarget.value)} />
    </div>
    <div className="right">
      {organism && <OrganismPill {...organism} />}
      <button className="icon-btn" aria-label="Toggle theme"><Icon name="theme" size={16} /></button>
      <button className="icon-btn" aria-label="Open command palette">
        <Kbd>⌘K</Kbd>
      </button>
      {rightActions}
    </div>
  </header>
);

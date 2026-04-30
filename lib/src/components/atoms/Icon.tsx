import type { SVGProps } from "react";

/**
 * Hand-rolled icons. 24×24 viewBox, currentColor, stroke-width 2, square caps —
 * matches the diagrammatic feel of the genomic-context SVGs.
 */
const PATHS: Record<string, JSX.Element> = {
  search:    <><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="22" y2="22"/></>,
  chevronDown:<polyline points="6 9 12 15 18 9"/>,
  chevronRight:<polyline points="9 6 15 12 9 18"/>,
  close:     <><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>,
  download:  <><path d="M12 4v12"/><polyline points="6 12 12 18 18 12"/><line x1="4" y1="20" x2="20" y2="20"/></>,
  external:  <><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M20 14v6h-6"/><path d="M4 14V4h6"/></>,
  plus:      <><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/></>,
  minus:     <line x1="4" y1="12" x2="20" y2="12"/>,
  info:      <><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="12" y1="7" x2="12.01" y2="7"/></>,
  help:      <><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2.5-2.5 4"/><line x1="12" y1="17.5" x2="12.01" y2="17.5"/></>,
  sliders:   <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2"/><circle cx="14" cy="12" r="2"/><circle cx="7" cy="18" r="2"/></>,
  theme:     <><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></>,
  // Object icons
  dna:       <><path d="M5 4c0 6 14 8 14 16"/><path d="M5 20c0-6 14-8 14-16"/></>,
  operon:    <><rect x="3"  y="9" width="6" height="6"/><rect x="11" y="9" width="6" height="6"/><line x1="9" y1="12" x2="11" y2="12"/></>,
  regulon:   <><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></>,
  tf:        <><rect x="4" y="9" width="16" height="6"/><line x1="9" y1="4" x2="9" y2="9"/><line x1="15" y1="4" x2="15" y2="9"/></>,
  promoter:  <><polyline points="4 16 12 16 12 8"/><polyline points="9 11 12 8 15 11"/></>,
  dataset:   <><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>,
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof PATHS;
  size?: number;
}

export const Icon = ({ name, size = 16, ...rest }: IconProps) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="square"
    aria-hidden={!rest["aria-label"]}
    {...rest}
  >{PATHS[name] ?? null}</svg>
);

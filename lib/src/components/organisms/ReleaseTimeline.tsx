import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

/* ============================================================================
   ReleaseTimeline
   ----------------------------------------------------------------------------
   Vertical, chronological list of releases. Each entry: dot + version + date
   + one-line title + optional organism tag. The dot is `is-major` for
   x.0 releases and accented otherwise; consumers can override via `major`.
   ============================================================================ */

export interface ReleaseTimelineEntry {
  /** Stable id, also used as the React key. */
  id: string;
  version: string;          // "v12.0", "v1.2"
  date: string;             // ISO 8601 — rendered as-is, format upstream
  title: ReactNode;
  organism?: string;        // "E. coli K-12", "S. enterica" — display label
  major?: boolean;          // forces the major-release dot styling
  href?: string;            // optional anchor target
}

export interface ReleaseTimelineProps {
  entries: ReleaseTimelineEntry[];
  /** Optional click handler; `entry` is the row clicked. */
  onSelect?: (entry: ReleaseTimelineEntry) => void;
  className?: string;
}

const isMajor = (e: ReleaseTimelineEntry) =>
  e.major ?? /\.0(\.0)?$/.test(e.version);    // v12.0 or v1.0.0 etc.

export const ReleaseTimeline = ({ entries, onSelect, className }: ReleaseTimelineProps) => (
  <ul className={cn("release-timeline", className)} aria-label="Release history">
    {entries.map((e) => {
      const major = isMajor(e);
      return (
        <li key={e.id} className={cn(major && "is-major")}>
          <a
            href={e.href ?? "#"}
            onClick={(ev) => { if (onSelect) { ev.preventDefault(); onSelect(e); } }}
            style={{ display: "block", textDecoration: "none", color: "inherit", borderBottom: "none" }}>
            <div className="release-timeline__head">
              <span className="release-timeline__version">{e.version}</span>
              <span className="release-timeline__date">{e.date}</span>
            </div>
            <div className="release-timeline__title">{e.title}</div>
            {e.organism && <span className="release-timeline__org">{e.organism}</span>}
          </a>
        </li>
      );
    })}
  </ul>
);

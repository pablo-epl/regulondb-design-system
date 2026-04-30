import type { ReactNode } from "react";

/* ============================================================================
   SummaryHistoryTemplate
   ----------------------------------------------------------------------------
   Layout for a release-history / summary dashboard:
     row 1: page title + lede + actions (export, view toggle)
     row 2: stat cards (full width, grid of 5–6)
     row 3: 3-col main — timeline (240) · chart+table (1fr) · right rail (280)
   The middle column uses minmax(0, 1fr) at the CSS level so the table can
   scroll horizontally instead of widening the track and pushing the right
   rail under the chart.
   ============================================================================ */

export interface SummaryHistoryTemplateProps {
  title: ReactNode;
  lede?: ReactNode;
  topActions?: ReactNode;
  stats: ReactNode;        // a row of <StatCardWithDelta>
  chart: ReactNode;        // <GrowthChart>
  sidebar: ReactNode;      // <ReleaseTimeline> + filter
  rightRail?: ReactNode;   // about / export / api
  table: ReactNode;        // <SmartTable>
}

export const SummaryHistoryTemplate = ({
  title, lede, topActions, stats, chart, sidebar, rightRail, table,
}: SummaryHistoryTemplateProps) => (
  <div className="summary-history">
    <header className="summary-history__head">
      <div>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: 0, color: "var(--text-title)" }}>{title}</h1>
        {lede && <p style={{ color: "var(--text-secondary)", maxWidth: "70ch", margin: "8px 0 0", fontSize: "var(--fs-body-lg)" }}>{lede}</p>}
      </div>
      {topActions && <div className="summary-history__actions">{topActions}</div>}
    </header>

    <section className="summary-history__stats">{stats}</section>

    <section className="summary-history__main">
      <aside className="summary-history__sidebar">{sidebar}</aside>
      <div className="summary-history__chart-area">
        {chart}
        <div className="summary-history__table">{table}</div>
      </div>
      {rightRail && (
        <aside className="summary-history__right" aria-label="Metadata, exports, and highlights">
          {rightRail}
        </aside>
      )}
    </section>
  </div>
);

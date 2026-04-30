import { useMemo, useState } from "react";
import { AppShellTemplate, SummaryHistoryTemplate } from "../templates";
import { GrowthChart } from "../organisms/GrowthChart";
import { ReleaseTimeline, type ReleaseTimelineEntry } from "../organisms/ReleaseTimeline";
import { SmartTable, type SmartColumn } from "../organisms/SmartTable";
import { StatCardWithDelta } from "../molecules/StatCardWithDelta";
import { ReleaseHighlight } from "../molecules/ReleaseHighlight";
import { Card } from "../molecules/Card";
import { Tabs } from "../molecules/Tabs";
import { Button } from "../atoms/Button";
import { Tag } from "../atoms/Decoration";
import { Icon } from "../atoms/Icon";

/* ============================================================================
   SummaryHistoryPage
   ----------------------------------------------------------------------------
   Cross-organism release-history dashboard. Composed entirely from existing
   library primitives; the only fresh ones are StatCardWithDelta /
   ReleaseHighlight (molecules) and ReleaseTimeline / GrowthChart (organisms).

   The component takes its data via props, so the same page can be wired up
   in Storybook with synthetic data and in the prototype with the real
   `D.releases` array.
   ============================================================================ */

export interface SummaryHistoryRelease {
  id: string;
  version: string;          // "v12.0.3"
  date: string;             // ISO 8601
  org: string;              // "ecoli-k12" | "salmonella-typhimurium" | …
  organismLabel: string;    // "E. coli K-12"
  title: string;
  body: string;
  tone: "feature" | "data" | "structural" | "note";
  stats: {
    genes: number; tfs: number; operons: number; promoters: number;
    regulons: number; datasets: number; interactions: number; tfbss: number;
  };
}

export interface SummaryHistoryPageProps {
  releases: SummaryHistoryRelease[];
}

const ORG_COLOR: Record<string, string> = {
  "ecoli-k12":              "var(--blue-2)",
  "salmonella-typhimurium": "var(--accent)",
  "bacillus-subtilis":      "var(--evidence-ht)",
};

export const SummaryHistoryPage = ({ releases }: SummaryHistoryPageProps) => {
  const [view, setView] = useState<"chart" | "table">("chart");

  // Sort newest-first for display lists.
  const sortedDesc = useMemo(
    () => [...releases].sort((a, b) => b.date.localeCompare(a.date)),
    [releases],
  );

  // The "current" headline numbers come from the most recent release across
  // the dataset; deltas reference the previous release within the same org.
  const latest = sortedDesc[0];
  const previousInSameOrg = useMemo(() => {
    const idx = releases.findIndex((r) => r.id === latest.id);
    return releases.slice(idx + 1).find((r) => r.org === latest.org);
  }, [releases, latest]);

  // Aggregate latest-per-organism for the cumulative cross-organism totals.
  const totals = useMemo(() => {
    const byOrg = new Map<string, SummaryHistoryRelease>();
    for (const r of sortedDesc) if (!byOrg.has(r.org)) byOrg.set(r.org, r);
    const sum = (key: keyof SummaryHistoryRelease["stats"]) =>
      Array.from(byOrg.values()).reduce((acc, r) => acc + r.stats[key], 0);
    return {
      genes:        sum("genes"),
      tfs:          sum("tfs"),
      operons:      sum("operons"),
      regulons:     sum("regulons"),
      interactions: sum("interactions"),
      tfbss:        sum("tfbss"),
      datasets:     sum("datasets"),
    };
  }, [sortedDesc]);

  // Delta for the headline — interactions added in the most-recent E. coli
  // release vs the previous one in the same organism.
  const delta = previousInSameOrg
    ? {
        genes:        latest.stats.genes        - previousInSameOrg.stats.genes,
        tfs:          latest.stats.tfs          - previousInSameOrg.stats.tfs,
        regulons:     latest.stats.regulons     - previousInSameOrg.stats.regulons,
        interactions: latest.stats.interactions - previousInSameOrg.stats.interactions,
        tfbss:        latest.stats.tfbss        - previousInSameOrg.stats.tfbss,
        datasets:     latest.stats.datasets     - previousInSameOrg.stats.datasets,
      }
    : null;
  const deltaRef = previousInSameOrg?.version;

  // Growth-chart data: one series per organism, x-axis = release versions.
  // We re-bucket each org's releases into a shared timeline by date.
  const chartData = useMemo(() => {
    const sortedAsc = [...releases].sort((a, b) => a.date.localeCompare(b.date));
    const xLabels = Array.from(new Set(sortedAsc.map((r) => r.date.slice(0, 4)))); // year buckets
    const orgs = Array.from(new Set(sortedAsc.map((r) => r.org)));
    const series = orgs.map((org) => {
      const orgEntries = sortedAsc.filter((r) => r.org === org);
      // Carry-forward the latest interaction count seen by year.
      let last = 0;
      const values = xLabels.map((year) => {
        const inYear = orgEntries.filter((r) => r.date.slice(0, 4) === year);
        if (inYear.length) last = inYear[inYear.length - 1].stats.interactions;
        return last;
      });
      return {
        label: orgEntries[0]?.organismLabel ?? org,
        color: ORG_COLOR[org] ?? "var(--blue-3)",
        values,
      };
    });
    return { xLabels, series };
  }, [releases]);

  const timelineEntries: ReleaseTimelineEntry[] = sortedDesc.map((r) => ({
    id: r.id,
    version: r.version,
    date: r.date,
    title: r.title,
    organism: r.organismLabel,
  }));

  // SmartTable columns for the per-release detail table.
  const tableColumns: SmartColumn<SummaryHistoryRelease>[] = [
    { key: "version", header: "Version",   cell: (r) => <code>{r.version}</code>, value: (r) => r.version, sortable: true },
    { key: "date",    header: "Released",  cell: (r) => r.date, value: (r) => r.date, sortable: true },
    { key: "org",     header: "Organism",  cell: (r) => r.organismLabel, value: (r) => r.organismLabel, sortable: true },
    { key: "genes",   header: "Genes",     cell: (r) => r.stats.genes.toLocaleString(),        value: (r) => r.stats.genes,        sortable: true, align: "right" },
    { key: "tfs",     header: "TFs",       cell: (r) => r.stats.tfs.toLocaleString(),          value: (r) => r.stats.tfs,          sortable: true, align: "right" },
    { key: "regulons",header: "Regulons",  cell: (r) => r.stats.regulons.toLocaleString(),     value: (r) => r.stats.regulons,     sortable: true, align: "right" },
    { key: "interactions", header: "Reg. interactions",
                          cell: (r) => r.stats.interactions.toLocaleString(), value: (r) => r.stats.interactions, sortable: true, align: "right" },
    { key: "tfbss",   header: "TFBSs",     cell: (r) => r.stats.tfbss.toLocaleString(),        value: (r) => r.stats.tfbss,        sortable: true, align: "right" },
    { key: "datasets",header: "HT datasets", cell: (r) => r.stats.datasets, value: (r) => r.stats.datasets, sortable: true, align: "right" },
    { key: "title",   header: "Headline",  cell: (r) => r.title,                                value: (r) => r.title, defaultHidden: true },
  ];

  return (
    <AppShellTemplate>
      <SummaryHistoryTemplate
        title="Summary history"
        lede={<>Evolution of curated transcriptional regulation across releases. Counts reflect cumulative content per organism; cross-organism totals are summed across the most-recent release per organism.</>}
        topActions={
          <>
            <Tabs items={[{ id: "chart", label: "Chart" }, { id: "table", label: "Table" }]}
                  value={view} onChange={(v) => setView(v as "chart" | "table")} segmented />
            <Button variant="outline" size="sm" leadingIcon={<Icon name="download" size={14}/>}>
              Export data
            </Button>
          </>
        }
        stats={
          <>
            <StatCardWithDelta icon={<Icon name="dna" size={20} />}
              label="Genes" value={totals.genes}
              delta={delta?.genes} deltaRef={deltaRef} />
            <StatCardWithDelta icon={<Icon name="tf" size={20} />}
              label="Transcription factors" value={totals.tfs}
              delta={delta?.tfs} deltaRef={deltaRef} />
            <StatCardWithDelta icon={<Icon name="regulon" size={20} />}
              label="Regulons" value={totals.regulons}
              delta={delta?.regulons} deltaRef={deltaRef} />
            <StatCardWithDelta icon={<Icon name="operon" size={20} />}
              label="Reg. interactions" value={totals.interactions}
              delta={delta?.interactions} deltaRef={deltaRef} />
            <StatCardWithDelta icon={<Icon name="dataset" size={20} />}
              label="HT datasets" value={totals.datasets}
              delta={delta?.datasets} deltaRef={deltaRef} />
          </>
        }
        sidebar={
          <>
            <h3 style={{ fontSize: "var(--fs-h4)", margin: "0 0 var(--sp-3)", color: "var(--text-title)" }}>Major releases</h3>
            <ReleaseTimeline entries={timelineEntries.slice(0, 8)} />
          </>
        }
        rightRail={
          <>
            <Card header="About this summary">
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "var(--fs-body)" }}>
                Cumulative content as of each release across {Array.from(new Set(releases.map((r) => r.org))).length} organisms. Counts are computed at curation freeze time; numbers may shift retroactively if past evidence is re-categorized.
              </p>
            </Card>
            <Card header="Data export">
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Button variant="outline" size="sm" leadingIcon={<Icon name="download" size={14}/>}>Export CSV</Button>
                <Button variant="outline" size="sm" leadingIcon={<Icon name="download" size={14}/>}>Export TSV</Button>
                <Button variant="outline" size="sm" leadingIcon={<Icon name="download" size={14}/>}>Export JSON</Button>
              </div>
            </Card>
            <Card header="Latest highlight">
              <ReleaseHighlight tone={latest.tone} version={latest.version}
                                title={latest.title} description={latest.body} />
            </Card>
          </>
        }
        chart={
          view === "chart" ? (
            <GrowthChart
              title="Regulatory interactions over time"
              xLabels={chartData.xLabels}
              series={chartData.series}
              mode="line"
            />
          ) : (
            <Card><p style={{ margin: 0, color: "var(--text-secondary)" }}>Chart hidden (Table view selected).</p></Card>
          )
        }
        table={
          <SmartTable
            title={<>Content changes by release <Tag>{releases.length}</Tag></>}
            columns={tableColumns}
            rows={sortedDesc}
            rowKey={(r) => r.id}
            density="compact"
          />
        }
      />
    </AppShellTemplate>
  );
};

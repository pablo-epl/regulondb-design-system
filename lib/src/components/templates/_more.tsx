import type { ReactNode } from "react";
import { Card } from "../molecules/Card";
import { Tabs } from "../molecules/Tabs";
import { Breadcrumb, type BreadcrumbItem } from "../molecules/Breadcrumb";
import { ObjectTypeTag, type ObjectType } from "../molecules/ObjectTypeTag";

export interface ObjectPageTemplateProps {
  breadcrumb: BreadcrumbItem[];
  objectType: ObjectType;
  title: ReactNode;
  tagline?: ReactNode;
  badges?: ReactNode;
  tabs: { id: string; label: ReactNode }[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
  // Optional pre-tabs slot (used by GeneTemplate for the GeneContextStrip)
  preTabs?: ReactNode;
}
export const ObjectPageTemplate = ({
  breadcrumb, objectType, title, tagline, badges, tabs, activeTab, onTabChange, children, preTabs,
}: ObjectPageTemplateProps) => (
  <div>
    <Breadcrumb items={breadcrumb} />
    <div style={{ height: "var(--sp-3)" }} />
    <Card>
      <ObjectTypeTag type={objectType} />
      <h1 style={{ margin: "var(--sp-1) 0 var(--sp-2)" }}>{title}</h1>
      {tagline && <p style={{ color: "var(--text-secondary)", margin: 0, maxWidth: "70ch" }}>{tagline}</p>}
      {badges && <div style={{ display: "flex", gap: 8, marginTop: "var(--sp-3)", flexWrap: "wrap" }}>{badges}</div>}
    </Card>
    {preTabs && <div style={{ marginTop: "var(--sp-4)" }}>{preTabs}</div>}
    <div style={{ marginTop: "var(--sp-4)" }}>
      <Tabs items={tabs} value={activeTab} onChange={onTabChange} />
    </div>
    <div style={{ marginTop: "var(--sp-4)" }}>{children}</div>
  </div>
);

export const GeneTemplate     = ObjectPageTemplate;        // alias — same shell
export const TFTemplate       = ObjectPageTemplate;
export const RegulonTemplate  = ObjectPageTemplate;

export const HomeTemplate = ({ hero, activeOrgCard, releaseNotes, quickGrid }:
  { hero: ReactNode; activeOrgCard: ReactNode; releaseNotes?: ReactNode; quickGrid?: ReactNode }) => (
  <div style={{ display: "grid", gap: "var(--sp-7)" }}>
    {hero}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--sp-5)" }}>
      <div>{activeOrgCard}</div>
      <div>{releaseNotes}</div>
    </div>
    {quickGrid}
  </div>
);

export const CompareTemplate = ({ summaries, matrix }: { summaries: ReactNode[]; matrix: ReactNode }) => (
  <div style={{ display: "grid", gap: "var(--sp-5)" }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${summaries.length}, 1fr)`, gap: "var(--sp-4)" }}>
      {summaries.map((s, i) => <div key={i}>{s}</div>)}
    </div>
    <div>{matrix}</div>
  </div>
);

export const FacetedSearchTemplate = ({ sidebar, results }: { sidebar: ReactNode; results: ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "var(--sidebar-width) 1fr", gap: "var(--sp-5)" }}>
    {sidebar}{results}
  </div>
);

export const NetworkTemplate = ({ canvas, side }: { canvas: ReactNode; side: ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr var(--right-panel-width)", gap: "var(--sp-5)", height: "calc(100vh - 200px)" }}>
    <div>{canvas}</div><aside>{side}</aside>
  </div>
);

export const EmptyStateTemplate = ({ children }: { children: ReactNode }) => (
  <div style={{ display: "grid", placeItems: "center", padding: "var(--sp-10) var(--sp-5)" }}>
    {children}
  </div>
);

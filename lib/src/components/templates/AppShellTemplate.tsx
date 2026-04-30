import type { ReactNode } from "react";
import { Header, PrimaryNav, Footer } from "../organisms";

export interface AppShellTemplateProps {
  organism?: { symbol: string; taxon: string; strain?: string; count?: number };
  primaryNavCurrent?: string;
  children: ReactNode;
}

export const AppShellTemplate = ({ organism, primaryNavCurrent, children }: AppShellTemplateProps) => (
  <div className="app-shell">
    <Header organism={organism} />
    <PrimaryNav current={primaryNavCurrent} />
    <main role="main" style={{ maxWidth: "var(--container-wide)", margin: "0 auto", padding: "var(--sp-6) var(--sp-5)" }}>
      {children}
    </main>
    <Footer />
  </div>
);

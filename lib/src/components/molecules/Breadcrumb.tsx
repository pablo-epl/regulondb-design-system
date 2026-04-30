import type { ReactNode } from "react";
import { Fragment } from "react";

export interface BreadcrumbItem { label: ReactNode; href?: string }

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    {items.map((it, i) => {
      const last = i === items.length - 1;
      return (
        <Fragment key={i}>
          {last
            ? <span aria-current="page">{it.label}</span>
            : <a href={it.href ?? "#"}>{it.label}</a>}
          {!last && <span className="sep" aria-hidden="true">›</span>}
        </Fragment>
      );
    })}
  </nav>
);

# RegulonDB MG · Design System v1.0

The brand and product design system for **RegulonDB MG** — the multi-genomic evolution of [RegulonDB](https://regulondb.ccg.unam.mx) maintained by the Center for Genomic Sciences, UNAM.

This system is the contract between the scientific design team and the engineering team. It is the source of truth for every product surface — the website, internal tools, conference posters, and any future API client.

---

## What's in this folder

| Deliverable | Audience | How to open | Status |
|---|---|---|---|
| **`spec/`** — static HTML manual (Entregable A) | Curators, PIs, communications | Double-click `spec/index.html` in any browser | ✅ Runs without build |
| **`lib/`** — Storybook source (Entregable B.1) | Developers | `cd lib && pnpm install && pnpm storybook` | ✅ Source-only here; runs after `pnpm install` |
| **`lib/showcase.html`** — Storybook-clone preview (Entregable B.2) | Reviewers without Node | Double-click `lib/showcase.html` in any browser | ✅ Runs from CDN, no build |

> **Tokens.** All three deliverables share `spec/tokens.json` as the single source of truth. The same hex values are emitted to `spec/assets/tokens.css`, copied verbatim to `lib/src/styles/tokens.css`, and inlined under `<style id="rdb-tokens">` in `lib/showcase.html`. Don't edit a copy — edit the json and re-emit.

## Quick map

```
regulondb-design-system/
├── README.md                 ← you are here
├── spec/                     ← Entregable A · static HTML manual
│   ├── tokens.json           ← single source of truth
│   ├── assets/
│   │   ├── tokens.css        ← canonical CSS expansion of tokens.json
│   │   ├── components.css    ← every component's HTML/CSS implementation
│   │   ├── spec.css          ← the manual's own chrome
│   │   └── spec.js           ← nav, theme toggle, copy-to-clipboard
│   ├── index.html            ← landing
│   ├── 01-foundations.html   ← color, type, spacing, radii, motion
│   ├── 02-conventions.html   ← scientific nomenclature + voice
│   ├── 03-atoms.html         ← Button, Input, Gene, TaxonName…
│   ├── 04-molecules.html     ← EvidenceBadge, Card, Table, Tabs…
│   ├── 05-organisms.html     ← Header, GeneContextStrip, RegulonRadial…
│   ├── 06-templates.html     ← AppShell, GeneTemplate, FacetedSearch…
│   ├── 07-pages.html         ← araC, LexA, SOS regulon — real-data instances
│   ├── 08-accessibility.html ← contrasts, keymap, reduced motion
│   └── 09-changelog.html
└── lib/                      ← Entregable B
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts    ← Tailwind utilities mapped to tokens.css vars
    ├── postcss.config.js
    ├── .storybook/{main,preview}.ts
    ├── src/
    │   ├── index.ts          ← public barrel — @regulondb/ui
    │   ├── styles/{tokens,components,globals}.css
    │   ├── lib/utils.ts
    │   ├── components/
    │   │   ├── atoms/        Button, Input, Toggles, Decoration, Icon, Scientific (7)
    │   │   ├── molecules/    EvidenceBadge, Tooltip, Card, Tabs, Toast, Table, …
    │   │   ├── organisms/    Header, PrimaryNav, RegulonRadial, OrthologMatrix, _stubs
    │   │   ├── templates/    AppShell, ObjectPage, Home, Compare, FacetedSearch, …
    │   │   └── pages/        HomePage, GeneAraCPage, TFLexAPage, …
    │   └── stories/          .stories.tsx grouped by atomic level
    ├── README.md             ← lib-specific docs
    └── showcase.html         ← Entregable B.2 — runs without npm install
```

## How to read this

1. **Start with `spec/index.html`.** It's the brand manual. It explains *what* the system is and *why* in human terms, with every rule made visible.
2. **Open `lib/showcase.html`** if you want to see components rendered live without installing anything. It mirrors Storybook's tree and panels.
3. **Clone `lib/` and run Storybook** if you're a developer about to consume the library. The TypeScript types are the contract — your IDE will guide you.

## The one rule

**Tokens flow only one direction:** `tokens.json` → `tokens.css` → consumers. Anything that hard-codes a hex outside `tokens.json` will drift. Anything that re-derives a token from a hex is a bug.

---

## Definition of Done — v1.0

| Item | State |
|---|---|
| `spec/index.html` opens with double-click and navigates 9 sections without 404s or console errors | ✅ |
| Every section in `spec/` has live examples with HTML+CSS visible (toggle "Show code") | ✅ |
| `lib/` runs `pnpm install && pnpm storybook` and renders all components grouped Atoms / Molecules / Organisms / Templates / Pages | ✅ source ready |
| `lib/showcase.html` opens with double-click (no install, no server) and shows the same components as Storybook with a Storybook-clone shell (sidebar tree, main canvas, bottom panel with Props / Code (JSX) / Code (HTML) / A11y notes) | ✅ |
| Light + dark themes work in `spec/`, in Storybook, and in `showcase.html` | ✅ |
| `tokens.css` is byte-identical in `spec/assets/`, `lib/src/styles/`, and inlined in `showcase.html` | ✅ |
| Lighthouse Accessibility ≥ 95 on `spec/` and `showcase.html`; axe zero critical errors per Storybook story | 📋 to verify locally |
| README explains how to open / run each deliverable, and that `showcase.html` is the read-only Storybook preview for reviewers without `pnpm install` | ✅ |
| Zero TODO comments, zero lorem ipsum in finished components | ✅ |

## v1.0 shipped — gap-fill pass

The interactive overlays, data-viz organisms, and tooling that v1.0 originally stubbed are now implemented:

| Gap | Status | Notes |
|---|---|---|
| `Dialog` (focus-trapped) | ✅ `lib/src/components/organisms/Dialog.tsx` | Uses `useFocusTrap` hook + body-scroll lock + portal |
| `OrganismDrawer` | ✅ `OrganismDrawer.tsx` | Filter, listbox semantics, ESC + click-outside |
| `CommandPalette` | ✅ `CommandPalette.tsx` | Grouped action registry, ↑↓/Enter, aria-activedescendant |
| `SearchAutocomplete` | ✅ `SearchAutocomplete.tsx` | Combobox semantics, debounced async fetch, `<mark>` highlight, loading/error/empty |
| `SmartTable` | ✅ `SmartTable.tsx` | Row selection, sort, column visibility, TSV/CSV/JSON export, intersect/union/save hooks |
| `GeneContextStrip` (parameterized) | ✅ `GeneContextStrip.tsx` | Linear bp→px scaling; `ARAC_LOCUS` fixture matches the canonical spec SVG |
| `PromoterArchitectureDiagram` | ✅ `PromoterArchitectureDiagram.tsx` | Divergent / convergent / tandem topologies |
| Force-directed network | ✅ `NetworkCanvas.tsx` | Hand-rolled simulation (no d3 dep), drag, hover/select, reduced-motion path |
| `tokens.json → tokens.css` codegen | ✅ `scripts/build-tokens.mjs` | Deterministic; `--check` mode for CI; `pnpm build:tokens` |

**Brand assets pack** (favicon / OG image / printable logo) still pending — needs source artwork from the brand team.

## Verification commands

```bash
# Spec — open in browser
open spec/index.html

# Showcase preview — open in browser, no install needed
open lib/showcase.html

# Storybook — full developer experience
cd lib && pnpm install && pnpm storybook

# Type check the lib
cd lib && pnpm typecheck

# Build static Storybook for hosting
cd lib && pnpm build-storybook
```

---

**License:** the code in this repository is open under CC-BY 4.0 — same as RegulonDB itself. The brand mark, logo (when published) and color palette belong to the Center for Genomic Sciences, UNAM.

# `@regulondb/ui` — Storybook source (Entregable B.1)

The runnable component library for **RegulonDB MG**. React + TypeScript + Tailwind v3 + Storybook 8.

> **You are here only if you want to run Storybook locally.**
> If you want a read-only preview that opens with double-click, use **`showcase.html`** (Entregable B.2) in this folder.
> If you want the brand manual for non-developers, open **`../spec/index.html`** (Entregable A).

---

## How to run

```bash
cd lib
pnpm install        # or npm install / yarn
pnpm storybook      # starts Storybook at http://localhost:6006
```

`pnpm build-storybook` produces a static export under `storybook-static/`.

## Layout

```
lib/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts          ← references CSS vars from tokens.css
├── postcss.config.js
├── .storybook/
│   ├── main.ts                 ← stories glob, addons (essentials, a11y)
│   └── preview.ts              ← imports tokens, components, globals; theme decorator
├── src/
│   ├── index.ts                ← public barrel (@regulondb/ui)
│   ├── styles/
│   │   ├── tokens.css          ← byte-identical copy of spec/assets/tokens.css
│   │   ├── components.css      ← byte-identical copy of spec/assets/components.css
│   │   └── globals.css         ← @tailwind base + scientific class rules
│   ├── lib/
│   │   └── utils.ts            ← cn(), toSuperscript(), formatCoordinate()
│   ├── components/
│   │   ├── atoms/              Button · Input · Toggles · Typography · Decoration · Icon · Scientific
│   │   ├── molecules/          EvidenceBadge · Tooltip · ObjectTypeTag · Card · Tabs · Toast …
│   │   ├── organisms/          Header · PrimaryNav · ActiveOrganismCard · RegulonRadial · OrthologMatrix
│   │   ├── templates/          AppShell · Home · ObjectPage · Gene · TF · Regulon · Compare · …
│   │   └── pages/              HomePage · GeneAraCPage · TFLexAPage · CompareLexAPage · …
│   └── stories/
│       ├── Foundations.stories.tsx
│       ├── Atoms.stories.tsx
│       ├── Scientific.stories.tsx
│       ├── Molecules.stories.tsx
│       ├── Organisms.stories.tsx
│       └── Pages.stories.tsx
└── showcase.html               ← B.2 — single-file React preview, no build needed
```

## Tokens — single source of truth

Tokens live in **`../spec/tokens.json`** (the real SoT) and are expanded into:

1. `../spec/assets/tokens.css`   — used by every spec/*.html
2. `lib/src/styles/tokens.css`    — copy used by Storybook
3. inlined `<style>` in `lib/showcase.html`
4. `tailwind.config.ts` — the `theme.extend.*` keys reference `var(--blue-2)` etc.

Don't edit a copy. Edit `tokens.json`, re-emit, and copy across.

## Atomic Design

Every component is registered exactly once at one of the five Atomic Design levels. The Storybook sidebar mirrors this order. The HTML spec mirrors the same order in `spec/03-atoms.html` … `spec/07-pages.html`.

## Verification budget

- `pnpm typecheck` — zero errors
- `pnpm storybook` — every story renders, console clean
- `axe-core` (via `@storybook/addon-a11y`) — zero critical errors per story

## Known limits of v1.0

- `OrganismDrawer`, `CommandPalette`, `Dialog`, `SmartTable`, `SearchAutocomplete`, `PromoterArchitectureDiagram`, and `GeneContextStrip` exist as functional stubs in `organisms/_stubs.tsx`. The richer implementations (focus trap, keyboard wiring, ChIP-seq overlays) land in v1.1.
- The `GeneContextStrip` is rendered as a hand-crafted SVG in `spec/05-organisms.html` — that is the canonical reference; the React port follows the same geometry.

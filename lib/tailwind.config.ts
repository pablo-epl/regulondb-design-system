import type { Config } from "tailwindcss";

/**
 * Tailwind config for @regulondb/ui.
 * Tokens are kept in CSS via tokens.css — Tailwind utilities below reference
 * those CSS vars so there is exactly one source of truth.
 *
 * SOURCE: spec/tokens.json (root tokens) → spec/assets/tokens.css → consumed here.
 */
export default {
  content: ["./src/**/*.{ts,tsx,html}", "./.storybook/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        "blue-1":  "var(--blue-1)",
        "blue-2":  "var(--blue-2)",
        "blue-3":  "var(--blue-3)",
        "blue-4":  "var(--blue-4)",
        "blue-5":  "var(--blue-5)",
        "grey-1":  "var(--grey-1)",
        "grey-2":  "var(--grey-2)",
        "grey-3":  "var(--grey-3)",
        "grey-4":  "var(--grey-4)",
        "grey-5":  "var(--grey-5)",
        accent:        "var(--accent)",
        "accent-light":"var(--accent-light)",
        postit:        "var(--postit)",
        error:         "var(--error)",
        // semantic
        canvas:   "var(--surface-canvas)",
        raised:   "var(--surface-raised)",
        sunken:   "var(--surface-sunken)",
        section:  "var(--surface-section)",
        note:     "var(--surface-note)",
        "header-surface": "var(--surface-header)",
        // text
        "text-primary":   "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary":  "var(--text-tertiary)",
        "text-link":      "var(--text-link)",
        "text-title":     "var(--text-title)",
        // evidence
        "ev-curated":   "var(--evidence-curated)",
        "ev-predicted": "var(--evidence-predicted)",
        "ev-ht":        "var(--evidence-ht)",
        "ev-weak":      "var(--evidence-weak)",
      },
      fontFamily: {
        sans:     "var(--font-sans)",
        citation: "var(--font-citation)",
        mono:     "var(--font-mono)",
      },
      fontSize: {
        h1:        ["var(--fs-h1)",      { lineHeight: "var(--lh-h1)" }],
        h2:        ["var(--fs-h2)",      { lineHeight: "var(--lh-h2)" }],
        h3:        ["var(--fs-h3)",      { lineHeight: "var(--lh-h3)" }],
        h4:        ["var(--fs-h4)",      { lineHeight: "var(--lh-h4)" }],
        "body-lg": ["var(--fs-body-lg)", { lineHeight: "var(--lh-body-lg)" }],
        body:      ["var(--fs-body)",    { lineHeight: "var(--lh-body)" }],
        mono:      ["var(--fs-mono)",    { lineHeight: "var(--lh-mono)" }],
        "mono-sm": ["var(--fs-mono-sm)", { lineHeight: "var(--lh-mono-sm)" }],
      },
      spacing: {
        1: "var(--sp-1)", 2: "var(--sp-2)", 3: "var(--sp-3)", 4: "var(--sp-4)",
        5: "var(--sp-5)", 6: "var(--sp-6)", 7: "var(--sp-7)", 8: "var(--sp-8)",
        9: "var(--sp-9)", 10: "var(--sp-10)",
      },
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      transitionDuration: {
        micro:    "var(--dur-micro)",
        standard: "var(--dur-standard)",
        page:     "var(--dur-page)",
      },
      transitionTimingFunction: { standard: "var(--ease-standard)" },
    },
  },
  plugins: [],
} satisfies Config;

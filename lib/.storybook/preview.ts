import type { Preview } from "@storybook/react";
import "../src/styles/tokens.css";
import "../src/styles/components.css";
import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    options: {
      storySort: {
        order: [
          "Foundations", ["Color", "Typography", "Spacing", "Radii & Shadow", "Motion"],
          "Conventions",
          "Atoms",
          "Molecules",
          "Organisms",
          "Templates",
          "Pages",
        ],
      },
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas",  value: "var(--surface-canvas)" },
        { name: "sunken",  value: "var(--surface-sunken)" },
        { name: "section", value: "var(--surface-section)" },
        { name: "header",  value: "var(--surface-header)" },
      ],
    },
    a11y: { config: { rules: [{ id: "color-contrast", enabled: true }] } },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light / dark token mapping",
      defaultValue: "auto",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "auto",  title: "Auto" },
          { value: "light", title: "Light" },
          { value: "dark",  title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const t = ctx.globals.theme as string;
      const root = document.documentElement;
      if (t === "auto") root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", t);
      return Story();
    },
  ],
};
export default preview;

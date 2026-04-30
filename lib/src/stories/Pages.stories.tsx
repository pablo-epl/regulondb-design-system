import type { Meta, StoryObj } from "@storybook/react";
import { HomePage } from "../components/pages/HomePage";
import { GeneAraCPage } from "../components/pages/GeneAraCPage";
import { TFLexAPage, RegulonAraCPage, CompareLexAPage, SearchResultsLexAPage, NotFoundPage, OrganismLoadingPage } from "../components/pages/_more";

const meta: Meta = {
  title: "Pages",
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Home: StoryObj = { render: () => <HomePage /> };
export const GeneAraC: StoryObj = { name: "Gene · araC", render: () => <GeneAraCPage /> };
export const TFLexA: StoryObj = { name: "TF · LexA", render: () => <TFLexAPage /> };
export const RegulonAraC: StoryObj = { name: "Regulon · AraC", render: () => <RegulonAraCPage /> };
export const CompareLexA: StoryObj = { name: "Compare · LexA cross-organism", render: () => <CompareLexAPage /> };
export const SearchLexA: StoryObj  = { name: "Search · 'lexA'", render: () => <SearchResultsLexAPage /> };
export const NotFound: StoryObj    = { render: () => <NotFoundPage /> };
export const Loading: StoryObj     = { name: "Organism loading", render: () => <OrganismLoadingPage /> };

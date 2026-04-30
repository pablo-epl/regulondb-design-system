import type { Meta, StoryObj } from "@storybook/react";
import { SearchAutocomplete, type AutocompleteResult } from "../components/organisms/SearchAutocomplete";

const meta: Meta = { title: "Organisms/SearchAutocomplete" };
export default meta;

const SAMPLE: AutocompleteResult[] = [
  { id: "araC", type: "gene", text: "araC", label: <em className="gene">araC</em>, meta: "L-arabinose regulator" },
  { id: "araB", type: "gene", text: "araB", label: <em className="gene">araB</em>, meta: "ribulokinase" },
  { id: "araA", type: "gene", text: "araA", label: <em className="gene">araA</em>, meta: "L-arabinose isomerase" },
  { id: "araD", type: "gene", text: "araD", label: <em className="gene">araD</em>, meta: "L-ribulose-5-P 4-epimerase" },
  { id: "lexA", type: "gene", text: "lexA", label: <em className="gene">lexA</em>, meta: "SOS repressor" },
  { id: "recA", type: "gene", text: "recA", label: <em className="gene">recA</em>, meta: "DNA recombinase" },
  { id: "AraC", type: "tf",   text: "AraC", label: "AraC", meta: "Dual regulator (HTH + arabinose-binding)" },
  { id: "LexA", type: "tf",   text: "LexA", label: "LexA", meta: "Repressor; auto-cleaves under DNA damage" },
  { id: "CRP",  type: "tf",   text: "CRP",  label: "CRP",  meta: "cAMP receptor protein" },
  { id: "araBAD", type: "operon", text: "araBAD", label: <em className="operon-notation">araBAD</em>, meta: "L-arabinose catabolism" },
  { id: "lacZYA", type: "operon", text: "lacZYA", label: <em className="operon-notation">lacZYA</em>, meta: "Lactose catabolism" },
  { id: "AraC-regulon", type: "regulon", text: "AraC regulon", label: "AraC regulon", meta: "4 target operons" },
  { id: "LexA-regulon", type: "regulon", text: "LexA regulon", label: "LexA regulon", meta: "14 targets" },
  { id: "P_BAD", type: "promoter", text: "P_BAD", label: "P_BAD", meta: "L-arabinose-induced" },
];

const fakeFetch = (q: string, signal: AbortSignal): Promise<AutocompleteResult[]> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      if (signal.aborted) return reject(new Error("aborted"));
      const ql = q.toLowerCase();
      resolve(SAMPLE.filter((r) => r.text.toLowerCase().includes(ql)));
    }, 250); // simulate latency
    signal.addEventListener("abort", () => { clearTimeout(t); reject(new Error("aborted")); });
  });

export const Default: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <SearchAutocomplete fetch={fakeFetch} onSelect={(r) => alert(`Selected ${r.id}`)} />
    </div>
  ),
};

/** Concatenate class names, ignoring falsy ones. Tiny replacement for clsx. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Convert a non-negative integer to its Unicode-superscript string. */
const SUP: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};
export const toSuperscript = (n: number): string =>
  String(n).split("").map((d) => SUP[d] ?? d).join("");

/** Format a genomic coordinate with comma thousand separators. */
export const formatCoordinate = (n: number): string => n.toLocaleString("en-US");

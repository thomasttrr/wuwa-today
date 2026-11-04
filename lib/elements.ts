/** Resonance element palette. Every element sits at the same perceived
 * lightness (OKLCH L ~0.80) so text contrast is identical whichever element
 * the page is tuned to. These drive the site-wide `--el` accent: the
 * featured banner sets it in the root layout, character pages override it
 * via <ElementTheme>, and dots/rings/pills read it directly. */
export const ELEMENT_COLORS: Record<string, string> = {
  Spectro: "#f0d46a",
  Havoc: "#ec6aa6",
  Aero: "#5fd9aa",
  Fusion: "#f5824f",
  Glacio: "#6fc3f2",
  Electro: "#b28cf6",
};

export const ELEMENT_FALLBACK = "#a7a9b4";

/** Element color for a tile/hero, falling back to neutral gray. */
export function elementColor(element: string): string {
  return ELEMENT_COLORS[element] ?? ELEMENT_FALLBACK;
}

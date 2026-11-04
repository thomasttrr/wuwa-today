/** Game-element accent colors — the Resonance tint system (DESIGN.md).
 * All six share one HSL lightness (~72%), so text contrast and accent
 * weight feel identical whichever element themes the page. Spectro is
 * the game's yellow (an earlier map had it as fuchsia — corrected).
 * (Moved out of components/TeamCard.tsx so hub tiles + hero can share it.) */
export const ELEMENT_COLORS: Record<string, string> = {
  Electro: "#b79cff",
  Aero: "#63dfae",
  Havoc: "#f77ca6",
  Spectro: "#f7d154",
  Glacio: "#6ed0fa",
  Fusion: "#ffa25e",
};

export const ELEMENT_FALLBACK = "#6e6e73";

/** Element color for a tile/hero, falling back to neutral gray. */
export function elementColor(element: string): string {
  return ELEMENT_COLORS[element] ?? ELEMENT_FALLBACK;
}

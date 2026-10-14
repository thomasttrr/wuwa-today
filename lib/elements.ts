/** Game-element accent colors for dots, rings, and pills.
 * The page itself stays dark; color appears only as these accents.
 * (Moved out of components/TeamCard.tsx so hub tiles + hero can share it.) */
export const ELEMENT_COLORS: Record<string, string> = {
  Electro: "#a78bfa",
  Aero: "#6ee7a0",
  Havoc: "#f472b6",
  Spectro: "#e879f9",
  Glacio: "#7dd3fc",
  Fusion: "#fb923c",
};

export const ELEMENT_FALLBACK = "#6e6e73";

/** Element color for a tile/hero, falling back to neutral gray. */
export function elementColor(element: string): string {
  return ELEMENT_COLORS[element] ?? ELEMENT_FALLBACK;
}

/**
 * Echo sets covered by the /echo-sets guide, by in-game name → anchor id.
 * Keep in sync with the `id`s of the SETS list in app/echo-sets/page.tsx
 * (each card renders as `#set-<id>`).
 */
export const ECHO_GUIDE_ANCHORS: Record<string, string> = {
  "Heart of Sworn Vigil": "sworn-vigil",
  "Flash of Electric Reflection": "electric-reflection",
  "Flower of Tinged Yearning": "tinged-yearning",
};

export function echoGuideHref(setName: string): string | null {
  const id = ECHO_GUIDE_ANCHORS[setName];
  return id ? `/echo-sets#set-${id}` : null;
}

import prefarmRaw from "../data/prefarm.json";

export interface PrefarmTip {
  heading: string;
  body: string;
}

export interface PrefarmSource {
  label: string;
  url: string;
}

export interface PrefarmGuide {
  slug: string;
  character_slug: string;
  character: string;
  title: string;
  description: string;
  banner: string;
  publishedAt: string;
  /** true when the character hasn't launched yet — all numbers provisional. */
  prerelease: boolean;
  /** Material names (matching data/characters materials entries) farmable before launch. */
  farmNow: string[];
  /** Material names locked until the character's patch. Empty for live characters. */
  waitForLaunch: string[];
  tips: PrefarmTip[];
  sources: PrefarmSource[];
}

export const prefarmGuides = (prefarmRaw as { guides: PrefarmGuide[] }).guides;

export function getPrefarmGuide(slug: string): PrefarmGuide | undefined {
  return prefarmGuides.find((g) => g.slug === slug);
}

export function prefarmSlugs(): string[] {
  return prefarmGuides.map((g) => g.slug);
}

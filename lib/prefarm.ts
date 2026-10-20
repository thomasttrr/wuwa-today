import prefarmRaw from "../data/prefarm.json";

export interface PrefarmTip {
  heading: string;
  body: string;
}

export interface PrefarmSource {
  label: string;
  url: string;
}

export interface PrefarmEchoFarm {
  /** Echo set name, e.g. "Flower of Tinged Yearning (5-pc)". */
  name: string;
  /** Where the set drops today. */
  farm: string;
  /** Set bonuses + why it is (or isn't) safe to farm before the kit reveal. */
  note: string;
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
  /**
   * true for a PARTIAL guide: the kit and material lists have not been
   * revealed yet, so the page renders confirmed facts + echo farming only —
   * no material tables. Set only while data/characters/<slug>.json has no
   * `materials` block; the full guide replaces it at the kit reveal.
   */
  partial?: boolean;
  /** Partial guides only: facts backed by two or more independent sources. */
  confirmed?: string[];
  /** Partial guides only: echo set(s) farmable today, with drop locations. */
  echoFarm?: PrefarmEchoFarm[];
  /** Partial guides only: what is still unrevealed and lands at the broadcast. */
  pending?: string[];
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

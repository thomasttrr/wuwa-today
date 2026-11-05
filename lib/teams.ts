/**
 * Team compositions for /teams (data/teams.json).
 *
 * The JSON names each team's three members in slot order — Main DPS,
 * Sub-DPS, Support — and nothing else about them. Element, rarity and slug
 * come from the file's own character index, so a Resonator's facts live in
 * one place. Unknown names fail the build rather than rendering a blank slot.
 */
import raw from "@/data/teams.json";
import { getCharacter } from "./characters";

export const TEAM_ROLES = ["Main DPS", "Sub-DPS", "Support"] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export interface TeamCharacter {
  name: string;
  slug: string;
  element: string;
  rarity: number;
  /** True when /characters/[slug] exists, so the portrait can link there. */
  hasPage: boolean;
}

export interface TeamMember extends TeamCharacter {
  role: TeamRole;
}

export type BadgeTone = "best" | "warn" | "note";

export interface Team {
  /** Stable, unique across the page (section + index). */
  id: string;
  name: string;
  /** Parenthetical qualifier, e.g. "Chisa" in "Aero Erosion (Chisa)". */
  variant?: string;
  /** Budget section only: F2P / Standard / Classic. */
  tag?: string;
  tier?: string;
  badge?: { text: string; tone: BadgeTone };
  members: TeamMember[];
  how: string;
  /** Tower only: the other towers listing this exact trio (derived). */
  alsoIn?: string[];
}

export interface Tower {
  id: string;
  name: string;
  position: string;
  floors?: string;
  effects: string[];
  resist: { label: string; elements: string[] }[];
  teams: Team[];
}

export interface TeamsModel {
  version: string;
  versionNote: string;
  characters: (TeamCharacter & { teamCount: number })[];
  general: Team[];
  variants: Team[];
  tower: {
    resetStart: string;
    resetEnd: string;
    nextReset: string;
    resetLine: string;
    notes: string[];
    towers: Tower[];
    keepOut: { element: string; text: string }[];
  };
  wastes: {
    resetStart: string;
    resetEnd: string;
    nextReset: string;
    resetLine: string;
    teamsLine: string;
    tokens: { name: string; text: string }[];
    stageEffect: string;
    harder: { elements: string[]; text: string };
    halves: { name: string; teams: Team[] }[];
  };
  budget: Team[];
}

interface RawTeam {
  name: string;
  variant?: string;
  tag?: string;
  tier?: string;
  badge?: { text: string; tone: string };
  members: string[];
  how: string;
}

/** "Yangyang: Xuanling" -> "yangyang-xuanling", matching the character hub. */
export function teamSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const index = new Map<string, TeamCharacter>(
  raw.characters.map((c) => {
    const slug = teamSlug(c.name);
    return [c.name, { name: c.name, slug, element: c.element, rarity: c.rarity, hasPage: Boolean(getCharacter(slug)) }];
  })
);

function toTeam(t: RawTeam, id: string): Team {
  if (t.members.length !== TEAM_ROLES.length) {
    throw new Error(`teams.json: "${t.name}" (${id}) needs exactly ${TEAM_ROLES.length} members`);
  }
  const members = t.members.map((name, i) => {
    const c = index.get(name);
    if (!c) throw new Error(`teams.json: "${name}" in "${t.name}" (${id}) is not in the character index`);
    return { ...c, role: TEAM_ROLES[i] };
  });
  const tone = t.badge?.tone;
  if (tone && tone !== "best" && tone !== "warn" && tone !== "note") {
    throw new Error(`teams.json: unknown badge tone "${tone}" on "${t.name}" (${id})`);
  }
  return {
    id,
    name: t.name,
    variant: t.variant,
    tag: t.tag,
    tier: t.tier,
    badge: t.badge ? { text: t.badge.text, tone: tone as BadgeTone } : undefined,
    members,
    how: t.how,
  };
}

const list = (teams: RawTeam[], prefix: string) => teams.map((t, i) => toTeam(t, `${prefix}-${i}`));

export function buildTeamsModel(): TeamsModel {
  const general = list(raw.general, "best");
  const variants = list(raw.variants, "var");
  const towers: Tower[] = raw.tower.towers.map((tw) => ({ ...tw, teams: list(tw.teams, `toa-${tw.id}`) }));
  // The same trio can be listed in two towers as alternatives, but a full
  // clear spends each character once — point each copy at the other.
  const trio = (t: Team) => t.members.map((m) => m.slug).sort().join("/");
  const towerLabel = (tw: Tower) => (tw.floors ? `${tw.name} · ${tw.floors}` : tw.name);
  for (const tw of towers) {
    for (const t of tw.teams) {
      const others = towers.filter((o) => o !== tw && o.teams.some((x) => trio(x) === trio(t))).map(towerLabel);
      if (others.length > 0) t.alsoIn = others;
    }
  }
  const halves = raw.wastes.halves.map((h, i) => ({ name: h.name, teams: list(h.teams, `ww-${i + 1}`) }));
  const budget = list(raw.budget, "f2p");

  const all = [...general, ...variants, ...towers.flatMap((t) => t.teams), ...halves.flatMap((h) => h.teams), ...budget];
  const counts = new Map<string, number>();
  for (const t of all) for (const m of t.members) counts.set(m.slug, (counts.get(m.slug) ?? 0) + 1);

  return {
    version: raw.version,
    versionNote: raw.versionNote,
    characters: [...index.values()].map((c) => ({ ...c, teamCount: counts.get(c.slug) ?? 0 })),
    general,
    variants,
    tower: { ...raw.tower, towers },
    wastes: { ...raw.wastes, halves },
    budget,
  };
}

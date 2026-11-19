/**
 * Compact wire format for the /teams explorer.
 *
 * The full TeamsModel repeats each member's whole record (name, element,
 * rarity, thumbnail srcset...) in every team they appear in: about 240 copies
 * of 49 Resonators, all serialized into the page for the client explorer.
 * packTeams() sends each Resonator once and teams list member slugs (slot
 * order = role order); unpackTeams() rebuilds the same TeamsModel in the
 * browser. Pure and data-free, so the client bundle doesn't pull in
 * data/teams.json.
 */
import type { Team, TeamCharacter, TeamMember, TeamRole, TeamsModel } from "./teams";

export const TEAM_ROLES = ["Main DPS", "Sub-DPS", "Support"] as const satisfies readonly TeamRole[];

type PackedTeam = Omit<Team, "members"> & { members: string[] };

export interface PackedTeamsModel extends Omit<TeamsModel, "characters" | "general" | "variants" | "budget" | "tower" | "wastes" | "matrix"> {
  /** Every Resonator that appears anywhere on the page, once. */
  cast: Record<string, TeamCharacter>;
  characters: { slug: string; teamCount: number }[];
  general: PackedTeam[];
  variants: PackedTeam[];
  budget: PackedTeam[];
  tower: Omit<TeamsModel["tower"], "towers"> & { towers: (Omit<TeamsModel["tower"]["towers"][number], "teams"> & { teams: PackedTeam[] })[] };
  wastes: Omit<TeamsModel["wastes"], "halves"> & { halves: { name: string; teams: PackedTeam[] }[] };
  matrix: Omit<TeamsModel["matrix"], "stages"> & { stages: (Omit<TeamsModel["matrix"]["stages"][number], "teams"> & { teams: PackedTeam[] })[] };
}

const strip = (m: TeamMember | (TeamCharacter & { teamCount: number })): TeamCharacter => ({
  name: m.name,
  slug: m.slug,
  element: m.element,
  rarity: m.rarity,
  hasPage: m.hasPage,
  thumb: m.thumb,
});

export function packTeams(m: TeamsModel): PackedTeamsModel {
  const cast: Record<string, TeamCharacter> = {};
  const pack = (teams: Team[]): PackedTeam[] =>
    teams.map((t) => {
      for (const mem of t.members) cast[mem.slug] ??= strip(mem);
      return { ...t, members: t.members.map((mem) => mem.slug) };
    });
  for (const c of m.characters) cast[c.slug] ??= strip(c);
  return {
    ...m,
    cast,
    characters: m.characters.map((c) => ({ slug: c.slug, teamCount: c.teamCount })),
    general: pack(m.general),
    variants: pack(m.variants),
    budget: pack(m.budget),
    tower: { ...m.tower, towers: m.tower.towers.map((tw) => ({ ...tw, teams: pack(tw.teams) })) },
    wastes: { ...m.wastes, halves: m.wastes.halves.map((h) => ({ ...h, teams: pack(h.teams) })) },
    matrix: { ...m.matrix, stages: m.matrix.stages.map((s) => ({ ...s, teams: pack(s.teams) })) },
  };
}

export function unpackTeams(p: PackedTeamsModel): TeamsModel {
  const unpack = (teams: PackedTeam[]): Team[] =>
    teams.map((t) => ({ ...t, members: t.members.map((slug, i) => ({ ...p.cast[slug], role: TEAM_ROLES[i] })) }));
  const { cast, ...rest } = p;
  return {
    ...rest,
    characters: p.characters.map((c) => ({ ...cast[c.slug], teamCount: c.teamCount })),
    general: unpack(p.general),
    variants: unpack(p.variants),
    budget: unpack(p.budget),
    tower: { ...p.tower, towers: p.tower.towers.map((tw) => ({ ...tw, teams: unpack(tw.teams) })) },
    wastes: { ...p.wastes, halves: p.wastes.halves.map((h) => ({ ...h, teams: unpack(h.teams) })) },
    matrix: { ...p.matrix, stages: p.matrix.stages.map((s) => ({ ...s, teams: unpack(s.teams) })) },
  };
}

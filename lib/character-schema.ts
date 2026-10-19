/**
 * Per-character record schema for WuWa Today character pages.
 *
 * Migrated from the site repo's data/guides.json (pull / build / team guides)
 * and data/tier-list.json. All facts are copied verbatim or near-verbatim from
 * those source guides — nothing is invented.
 *
 * The `teams` field is intentionally shaped to match the TeamCard component's
 * `Team` type in site/components/TeamCard.tsx (via site/lib/guides.ts), so
 * migrated teams can be passed straight to <TeamCard team={...} />.
 *
 * Every data section carries its own `uncertain_or_prerelease` boolean.
 * JSON Schema equivalent: character-schema.json.
 */

export interface MaterialEntry {
  name: string;
  qty: string;
  farm: string;
}

export interface CharacterMaterials {
  /** Optional caveat, e.g. pre-release sourcing. */
  note?: string;
  ascension: MaterialEntry[];
  forte: MaterialEntry[];
}

export interface CharacterRecord {
  /** URL-safe character identifier, e.g. "hsin". */
  slug: string;
  /** Display name, e.g. "Hsin". */
  name: string;
  /** Game version the data describes, e.g. "3.7". */
  game_version: string;
  profile: CharacterProfile;
  pull_verdict: PullVerdict;
  build: CharacterBuild;
  /** Ascension + forte material lists; present only when researched. */
  materials?: CharacterMaterials;
  /** Team comps, verbatim from the team guide — TeamCard compatible. */
  teams: CharacterTeam[];
  teams_meta: TeamsMeta;
  /** Tier placement from tier-list.json; null when no entry exists. */
  tier_badge: TierBadge | null;
  /** Resonance Chain coverage; present only when researched (pilot: Hsin). */
  sequences?: CharacterSequences;
  /** Provenance: every source record this file was migrated from. */
  sources: SourceRef[];
}

export interface SequenceNode {
  n: 1 | 2 | 3 | 4 | 5 | 6;
  /** Official node name, e.g. "A Boat to Cross the Rising Tide". */
  name: string;
  /** One-line core effect. */
  effect: string;
  /** Pull priority: key (chase), value (good stop), comfort, skip, whale. */
  priority: "key" | "value" | "comfort" | "skip" | "whale";
}

export interface SequenceStop {
  /** Stop point, e.g. "S0", "S2". */
  stop: string;
  /** Tag label, e.g. "F2P baseline", "First real jump", "Best value stop", "Whale ceiling". */
  tag: string;
  /** One-line reason this stop matters. */
  why: string;
}

export interface CharacterSequences {
  /** verified: node effects + priorities confirmed by two independent aggregators. */
  status: "verified" | "partial" | "official_only" | "missing";
  /** One-line aim summary, e.g. "S0 is complete; aim S3 first, S6 for whales." */
  verdict: string;
  /** Ordered aim path: which stop to go for first, then next. */
  pull_path: SequenceStop[];
  /** All six nodes, S1-S6. */
  nodes: SequenceNode[];
  /** Signature weapon vs dupes guidance, one line. */
  weapon_vs_dupes: string;
  /** Aggregators backing the data, e.g. ["wuthering.gg", "gurugamer"]. */
  sources: string[];
}

export interface CharacterProfile {
  /** Site-relative portrait path. Follows the TeamCard convention: /images/chars/<slug>.png */
  portrait_url: string;
  element: "Electro" | "Aero" | "Havoc" | "Spectro" | "Glacio" | "Fusion";
  /** Weapon class, e.g. "Rectifier", "Sword", "Broadblade", "Gauntlets", "Pistols". */
  weapon_type: string;
  rarity: 4 | 5;
  /** Primary combat role, e.g. "Main DPS", "Sub-DPS", "Support". */
  role: string;
  /** Optional: alternate playstyles or role nuance from the guides. */
  role_note?: string;
  uncertain_or_prerelease: boolean;
}

export interface PullVerdict {
  /** Full verdict text from the pull guide. Editorial opinion, never data. */
  verdict: string;
  verdict_label: string;
  /** Banner this verdict was written for, e.g. "3.7-phase-1". */
  banner_id: string;
  /** Guide publish date, YYYY-MM-DD. */
  published_at: string;
  /** Slug of the source pull guide in data/guides.json. */
  source_guide: string;
  uncertain_or_prerelease: boolean;
}

export interface RankedWeapon {
  rank: number;
  name: string;
  rarity: 4 | 5;
  signature: boolean;
  /** Local verified weapon icon, e.g. "/images/weapons/variation.png". */
  icon?: string;
  /** Why this weapon ranks here, condensed from the guide. */
  note: string;
}

export interface EchoSetEntry {
  /** Echo set name, e.g. "Heart of Sworn Vigil". */
  name: string;
  /** How the set is worn, e.g. "5-pc", "3-pc + 2-pc". */
  pieces: string;
  /** When to use: "best-in-slot", "alternative", "placeholder", or a mode name. */
  usage: string;
  /** Recommended main-slot Echo, when the guide names one. */
  main_echo?: string;
  /** Key mechanics of the set, condensed from the guide. */
  note: string;
}

export interface StatPriority {
  /** Cost piece, e.g. "4-cost", "3-cost", "1-cost". */
  piece: string;
  main_stat: string;
  alternates?: string[];
  note?: string;
}

export interface CharacterBuild {
  /** One-paragraph fast build summary from the guide's short version. */
  fast_path: string;
  ranked_weapons: RankedWeapon[];
  echo_sets: EchoSetEntry[];
  /** Optional one-line note rendered under the echo-set plates. */
  echo_set_note?: string;
  /** Echo cost layout, e.g. "4-3-3-1-1". */
  cost_layout: string;
  stat_priorities: StatPriority[];
  /** Substat priority order, best first. */
  substat_priority: string[];
  /** Energy Regen guidance, e.g. "118-125%" or "not needed". */
  energy_regen_target: string;
  /** Optional: what to use when no ranked weapon is available. */
  weapon_filler_note?: string;
  uncertain_or_prerelease: boolean;
}

/** Matches TeamCard's Team type in site/components/TeamCard.tsx. */
export interface CharacterTeam {
  name: string;
  /** Badge shown on the card: Premium, Budget, Alternative, etc. */
  tag: string;
  members: CharacterTeamMember[];
  rotation: string;
}

/** Matches TeamCard's TeamMember type. Portrait resolves to /images/chars/<slug>.png. */
export interface CharacterTeamMember {
  name: string;
  slug: string;
  role: string;
  element: string;
  note: string;
}

export interface TeamsMeta {
  /** Slug of the source team guide in data/guides.json. */
  source_guide: string;
  uncertain_or_prerelease: boolean;
}

export interface TierBadge {
  tier: string;
  label: string;
  note: string;
  uncertain_or_prerelease: boolean;
}

export type SourceType = "pull_guide" | "build_guide" | "team_guide" | "tier_list";

export interface SourceRef {
  file: string;
  record: string;
  type: SourceType;
}

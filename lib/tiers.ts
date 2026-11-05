/**
 * Tier list view model. Joins the two tier sources (Prydwen community
 * lists + our editorial list) onto the character hub records so the client
 * explorer gets one compact, serialisable list. Placements are copied
 * verbatim from the data files: nothing here re-ranks anyone.
 */
import prydwen from "@/data/tier-list-prydwen.json";
import editorial from "@/data/tier-list.json";
import { characters } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

export type TierRole = "DPS" | "Hybrid" | "Support";
export type SourceKey = "prydwen" | "value" | "ours";

export const PRYDWEN_TIERS = ["T0", "T0.5", "T1", "T1.5", "T2", "T3", "T4"];
export const OUR_TIERS = editorial.tiers.map((t) => t.tier);
export const OUR_TIER_LABELS: Record<string, string> = Object.fromEntries(
  editorial.tiers.map((t) => [t.tier, t.label])
);

/** One placement: a tier inside one role, for one mode. */
export interface Placement {
  role: TierRole;
  tier: string;
}

export interface TierChar {
  slug: string;
  name: string;
  element: string;
  color: string;
  portrait: string | null;
  weapon: string;
  role: string;
  rarity: number;
  inHub: boolean;
  /** source -> mode -> placements (a character can hold several roles). */
  prydwen: Record<string, Placement[]>;
  value: Record<string, Placement[]>;
  ours: { tier: string; label: string; note: string } | null;
}

export interface TierModel {
  chars: TierChar[];
  modes: Record<"prydwen" | "value", string[]>;
  meta: {
    prydwenPatch: string;
    prydwenUpdated: string;
    valuePatch: string;
    valueUpdated: string;
    sourceUrl: string;
    oursVersion: string;
    oursUpdated: string;
    oursNote: string;
  };
  unranked: { slug: string; name: string }[];
}

const SPECIAL: Record<string, string> = {
  "the shorekeeper": "shorekeeper",
  "rover (havoc)": "havoc-rover",
  "rover (spectro)": "spectro-rover",
  "rover (aero)": "aero-rover",
  "rover (electro)": "electro-rover",
};

export function prydwenNameToSlug(name: string): string {
  const lower = name.toLowerCase();
  return SPECIAL[lower] ?? lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type ModeTable = Record<string, Record<string, Record<string, string[]>>>;

function collect(table: ModeTable, into: Map<string, Record<string, Placement[]>>, names: Map<string, string>) {
  for (const [mode, roles] of Object.entries(table)) {
    for (const [role, tiers] of Object.entries(roles)) {
      for (const [tier, list] of Object.entries(tiers)) {
        for (const name of list) {
          const slug = prydwenNameToSlug(name);
          if (!names.has(slug)) names.set(slug, name);
          const rec = into.get(slug) ?? {};
          (rec[mode] ??= []).push({ role: role as TierRole, tier });
          into.set(slug, rec);
        }
      }
    }
  }
}

export function buildTierModel(): TierModel {
  const bySlug = new Map(characters.map((c) => [c.slug, c]));
  const names = new Map<string, string>();
  const normal = new Map<string, Record<string, Placement[]>>();
  const value = new Map<string, Record<string, Placement[]>>();
  collect(prydwen.modes as ModeTable, normal, names);
  collect(prydwen.valueModes as ModeTable, value, names);

  const ours = new Map<string, { tier: string; label: string; note: string }>();
  for (const row of editorial.tiers) {
    for (const m of row.members) ours.set(m.slug, { tier: row.tier, label: row.label, note: m.note });
  }

  const slugs = new Set<string>([...normal.keys(), ...value.keys(), ...ours.keys()]);
  const chars: TierChar[] = [...slugs].map((slug) => {
    const c = bySlug.get(slug);
    const element = c?.profile.element ?? "";
    return {
      slug,
      name: c?.name ?? names.get(slug) ?? slug,
      element,
      color: elementColor(element),
      portrait: c?.profile.portrait_url ?? null,
      weapon: c?.profile.weapon_type ?? "",
      role: c?.profile.role ?? "",
      rarity: c?.profile.rarity ?? 0,
      inHub: Boolean(c),
      prydwen: normal.get(slug) ?? {},
      value: value.get(slug) ?? {},
      ours: ours.get(slug) ?? null,
    };
  });
  chars.sort((a, b) => a.name.localeCompare(b.name));

  const ranked = new Set(slugs);
  const unranked = characters
    .filter((c) => !ranked.has(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name }));

  return {
    chars,
    modes: {
      prydwen: Object.keys(prydwen.modes),
      value: Object.keys(prydwen.valueModes),
    },
    meta: {
      prydwenPatch: prydwen.patch,
      prydwenUpdated: prydwen.lastUpdated,
      valuePatch: prydwen.valuePatch,
      valueUpdated: prydwen.valueLastUpdated,
      sourceUrl: prydwen.sourceUrl,
      oursVersion: editorial.version,
      oursUpdated: editorial.updatedAt,
      oursNote: editorial.note,
    },
    unranked,
  };
}

let cached: Map<string, TierChar> | null = null;

/** One character's placements, from the same model the tier list renders.
 * The single source of truth for tiers anywhere on the site: the per-
 * character `tier_badge` fields predate the October 2026 re-tier. */
export function tierFor(slug: string): {
  ours: TierChar["ours"];
  community: string | null;
} {
  cached ??= new Map(buildTierModel().chars.map((c) => [c.slug, c]));
  const c = cached.get(slug);
  const ps = c?.prydwen["Tower of Adversity"] ?? [];
  const best = ps.length
    ? ps.reduce((a, b) => (PRYDWEN_TIERS.indexOf(b.tier) < PRYDWEN_TIERS.indexOf(a.tier) ? b : a))
    : null;
  return { ours: c?.ours ?? null, community: best ? `${best.tier} ${best.role}` : null };
}

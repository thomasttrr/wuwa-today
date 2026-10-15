/**
 * Typed loader for the staged per-character records (data/characters/*.json).
 *
 * Staged schema: lib/character-schema.ts. The loader type extends it with the two
 * known data anomalies documented in the validation report (2026-10-14):
 *  - encore: build.echo_sets[2].main_echo is null  -> main_echo?: string | null
 *  - phrolova: teams_meta carries an extra `note` -> teams_meta.note?: string
 * Facts are rendered verbatim; flags below drive honest caveat labels in the UI.
 */
import type {
  CharacterBuild,
  CharacterRecord,
  EchoSetEntry,
  TeamsMeta,
} from "./character-schema";

/** Echo set entry as actually present in the staged data. */
export interface EchoSetLoose extends Omit<EchoSetEntry, "main_echo"> {
  /** Null in encore's placeholder set (no named main echo). Render as absent. */
  main_echo?: string | null;
}

/** Full character record as actually present in the staged data. */
export interface CharacterRecordLoose
  extends Omit<CharacterRecord, "build" | "teams_meta"> {
  build: Omit<CharacterBuild, "echo_sets"> & { echo_sets: EchoSetLoose[] };
  /** phrolova's teams_meta carries a researcher caveat note (shown under teams). */
  teams_meta: TeamsMeta & { note?: string };
}

import c_aemeath from "@/data/characters/aemeath.json";
import c_augusta from "@/data/characters/augusta.json";
import c_buling from "@/data/characters/buling.json";
import c_camellya from "@/data/characters/camellya.json";
import c_cantarella from "@/data/characters/cantarella.json";
import c_carlotta from "@/data/characters/carlotta.json";
import c_cartethyia from "@/data/characters/cartethyia.json";
import c_changli from "@/data/characters/changli.json";
import c_chisa from "@/data/characters/chisa.json";
import c_ciaccona from "@/data/characters/ciaccona.json";
import c_denia from "@/data/characters/denia.json";
import c_electro_rover from "@/data/characters/electro-rover.json";
import c_encore from "@/data/characters/encore.json";
import c_galbrena from "@/data/characters/galbrena.json";
import c_hiyuki from "@/data/characters/hiyuki.json";
import c_hsin from "@/data/characters/hsin.json";
import c_iuno from "@/data/characters/iuno.json";
import c_jingran from "@/data/characters/jingran.json";
import c_jinhsi from "@/data/characters/jinhsi.json";
import c_jiyan from "@/data/characters/jiyan.json";
import c_lucilla from "@/data/characters/lucilla.json";
import c_lucy from "@/data/characters/lucy.json";
import c_lupa from "@/data/characters/lupa.json";
import c_luuk_herssen from "@/data/characters/luuk-herssen.json";
import c_lynae from "@/data/characters/lynae.json";
import c_mornye from "@/data/characters/mornye.json";
import c_mortefi from "@/data/characters/mortefi.json";
import c_phoebe from "@/data/characters/phoebe.json";
import c_phrolova from "@/data/characters/phrolova.json";
import c_qingxiao from "@/data/characters/qingxiao.json";
import c_qiuyuan from "@/data/characters/qiuyuan.json";
import c_rebecca from "@/data/characters/rebecca.json";
import c_sanhua from "@/data/characters/sanhua.json";
import c_shorekeeper from "@/data/characters/shorekeeper.json";
import c_sigrika from "@/data/characters/sigrika.json";
import c_spectro_rover from "@/data/characters/spectro-rover.json";
import c_suisui from "@/data/characters/suisui.json";
import c_suoming from "@/data/characters/suoming.json";
import c_verina from "@/data/characters/verina.json";
import c_xiangli_yao from "@/data/characters/xiangli-yao.json";
import c_yangyang_xuanling from "@/data/characters/yangyang-xuanling.json";
import c_zani from "@/data/characters/zani.json";
import c_zhezhi from "@/data/characters/zhezhi.json";
import c_brant from "@/data/characters/brant.json";
import c_calcharo from "@/data/characters/calcharo.json";
import c_jianxin from "@/data/characters/jianxin.json";
import c_lingyang from "@/data/characters/lingyang.json";
import c_roccia from "@/data/characters/roccia.json";
import c_yinlin from "@/data/characters/yinlin.json";
import c_aalto from "@/data/characters/aalto.json";
import c_baizhi from "@/data/characters/baizhi.json";
import c_chixia from "@/data/characters/chixia.json";
import c_danjin from "@/data/characters/danjin.json";
import c_lumi from "@/data/characters/lumi.json";
import c_taoqi from "@/data/characters/taoqi.json";
import c_yangyang from "@/data/characters/yangyang.json";
import c_youhu from "@/data/characters/youhu.json";
import c_yuanwu from "@/data/characters/yuanwu.json";
import c_aero_rover from "@/data/characters/aero-rover.json";
import c_havoc_rover from "@/data/characters/havoc-rover.json";
import c_lily from "@/data/characters/lily.json";

const ALL: CharacterRecordLoose[] = [
  c_hsin as CharacterRecordLoose,
  c_iuno as CharacterRecordLoose,
  c_lynae as CharacterRecordLoose,
  c_lucilla as CharacterRecordLoose,
  c_shorekeeper as CharacterRecordLoose,
  c_mornye as CharacterRecordLoose,
  c_aemeath as CharacterRecordLoose,
  c_hiyuki as CharacterRecordLoose,
  c_sigrika as CharacterRecordLoose,
  c_suisui as CharacterRecordLoose,
  c_jingran as CharacterRecordLoose,
  c_chisa as CharacterRecordLoose,
  c_augusta as CharacterRecordLoose,
  c_cartethyia as CharacterRecordLoose,
  c_ciaccona as CharacterRecordLoose,
  c_verina as CharacterRecordLoose,
  c_electro_rover as CharacterRecordLoose,
  c_carlotta as CharacterRecordLoose,
  c_sanhua as CharacterRecordLoose,
  c_mortefi as CharacterRecordLoose,
  c_buling as CharacterRecordLoose,
  c_spectro_rover as CharacterRecordLoose,
  c_jinhsi as CharacterRecordLoose,
  c_yangyang_xuanling as CharacterRecordLoose,
  c_denia as CharacterRecordLoose,
  c_qingxiao as CharacterRecordLoose,
  c_phrolova as CharacterRecordLoose,
  c_lupa as CharacterRecordLoose,
  c_galbrena as CharacterRecordLoose,
  c_luuk_herssen as CharacterRecordLoose,
  c_qiuyuan as CharacterRecordLoose,
  c_zani as CharacterRecordLoose,
  c_jiyan as CharacterRecordLoose,
  c_lucy as CharacterRecordLoose,
  c_rebecca as CharacterRecordLoose,
  c_suoming as CharacterRecordLoose,
  c_phoebe as CharacterRecordLoose,
  c_cantarella as CharacterRecordLoose,
  c_xiangli_yao as CharacterRecordLoose,
  c_encore as CharacterRecordLoose,
  c_changli as CharacterRecordLoose,
  c_camellya as CharacterRecordLoose,
  c_zhezhi as CharacterRecordLoose,  c_brant as CharacterRecordLoose,
  c_calcharo as CharacterRecordLoose,
  c_jianxin as CharacterRecordLoose,
  c_lingyang as CharacterRecordLoose,
  c_roccia as CharacterRecordLoose,
  c_yinlin as CharacterRecordLoose,
  c_aalto as CharacterRecordLoose,
  c_baizhi as CharacterRecordLoose,
  c_chixia as CharacterRecordLoose,
  c_danjin as CharacterRecordLoose,
  c_lumi as CharacterRecordLoose,
  c_taoqi as CharacterRecordLoose,
  c_yangyang as CharacterRecordLoose,
  c_youhu as CharacterRecordLoose,
  c_yuanwu as CharacterRecordLoose,
  c_aero_rover as CharacterRecordLoose,
  c_havoc_rover as CharacterRecordLoose,
  c_lily as CharacterRecordLoose,

];

/** All characters in roster order. */
export const characters: CharacterRecordLoose[] = ALL;

/** Slug -> record lookup. */
const bySlug = new Map<string, CharacterRecordLoose>(ALL.map((c) => [c.slug, c]));

export function getCharacter(slug: string): CharacterRecordLoose | undefined {
  return bySlug.get(slug);
}

export function characterSlugs(): string[] {
  return ALL.map((c) => c.slug);
}

/** Prev/next navigation following roster order. */
export function prevNextCharacter(slug: string): {
  prev: CharacterRecordLoose | null;
  next: CharacterRecordLoose | null;
} {
  const i = ALL.findIndex((c) => c.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? ALL[i - 1] : null,
    next: i < ALL.length - 1 ? ALL[i + 1] : null,
  };
}

/** Filter option lists, derived from the data. */
const ELEMENT_ORDER = ["Fusion", "Glacio", "Aero", "Electro", "Havoc", "Spectro"];
export const CHARACTER_ELEMENTS = ELEMENT_ORDER.filter((e) =>
  ALL.some((c) => c.profile.element === e)
);
export const CHARACTER_WEAPONS = [...new Set(ALL.map((c) => c.profile.weapon_type))].sort();
export const CHARACTER_ROLES = [...new Set(ALL.map((c) => c.profile.role))];
export const CHARACTER_RARITIES = [...new Set(ALL.map((c) => c.profile.rarity))].sort((a, b) => b - a);

/** True when every section of the record is flagged pre-release (Suoming). */
export function isPreRelease(c: CharacterRecordLoose): boolean {
  return (
    c.profile.uncertain_or_prerelease &&
    c.pull_verdict.uncertain_or_prerelease &&
    c.build.uncertain_or_prerelease &&
    c.teams_meta.uncertain_or_prerelease &&
    (c.tier_badge?.uncertain_or_prerelease ?? false)
  );
}

export type { CharacterRecord, CharacterBuild, EchoSetEntry, TeamsMeta };
export type {
  CharacterProfile,
  PullVerdict,
  RankedWeapon,
  StatPriority,
  CharacterTeam,
  TierBadge,
} from "./character-schema";

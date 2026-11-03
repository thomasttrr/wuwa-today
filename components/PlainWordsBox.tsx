import Link from "next/link";
import type { CharacterRecordLoose } from "@/lib/characters";

/**
 * Build in plain words: the same verified build as the detailed section
 * below, restated in short everyday sentences. Every name, stat, and pick
 * comes from the character's data file — nothing here invents a fact.
 * A line is left out whenever its data is missing.
 */

/** Plain translations of the site's role labels. */
function plainRole(role: string): string {
  switch (role) {
    case "Main DPS":
    case "On-field carry":
      return "main damage dealer";
    case "Sub-DPS":
      return "second damage dealer";
    case "Support":
      return "helper";
    default:
      return role.toLowerCase();
  }
}

export default function PlainWordsBox({ char }: { char: CharacterRecordLoose }) {
  const p = char.profile;
  const build = char.build;
  const bestWeapon = build.ranked_weapons[0];
  const backupWeapon = build.ranked_weapons[1];
  const echoSet =
    build.echo_sets.find((s) => s.usage === "best-in-slot") ?? build.echo_sets[0];
  const stats = build.stat_priorities;
  const substats = build.substat_priority;

  const weaponClause = p.weapon_type
    ? ` who uses ${/s$/.test(p.weapon_type) ? p.weapon_type : `a ${p.weapon_type}`}`
    : "";
  const article = /^[aeiou]/i.test(p.element) ? "an" : "a";
  const roleLine = p.role
    ? `${char.name} is ${article} ${p.element} ${plainRole(p.role)}${weaponClause}.`
    : `${char.name} is ${article} ${p.element} character${weaponClause}.`;

  const hasBuild = Boolean(bestWeapon || echoSet || stats.length > 0);

  return (
    <div className="og-plain-box">
      <p>{roleLine}</p>
      {bestWeapon ? (
        <p>
          Best weapon: {bestWeapon.name}.
          {bestWeapon.signature ? ` This is ${char.name}'s own special weapon.` : ""}
          {backupWeapon ? ` Good backup: ${backupWeapon.name}.` : ""}
        </p>
      ) : null}
      {echoSet ? (
        <p>
          Echo set: {echoSet.name} ({echoSet.pieces}).
          {echoSet.main_echo ? ` Put ${echoSet.main_echo} in the main slot.` : ""}
        </p>
      ) : null}
      {stats.length > 0 ? (
        <p>
          Stats to look for:{" "}
          {stats.map((sp) => `${sp.piece}: ${sp.main_stat}`).join("; ")}.
        </p>
      ) : null}
      {substats.length > 0 ? (
        <p>Bonus stats to want, in order: {substats.join(", ")}.</p>
      ) : null}
      {hasBuild ? (
        <p>
          Do this first:{" "}
          {bestWeapon && echoSet
            ? `get ${bestWeapon.name} and the ${echoSet.name} set. The rest can come later.`
            : bestWeapon
              ? `get ${bestWeapon.name}. The rest can come later.`
              : `get the ${echoSet?.name} set. The rest can come later.`}
        </p>
      ) : (
        <p>No build published yet.</p>
      )}
      <p>
        <Link href="/glossary">Words you don&apos;t know? See the plain-words glossary →</Link>
      </p>
    </div>
  );
}

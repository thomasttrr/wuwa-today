import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import UpdatedStamp from "@/components/UpdatedStamp";
import {
  characters,
  toCharacterHubTile,
  CHARACTER_ELEMENTS,
  type CharacterHubTile,
} from "@/lib/characters";
import { elementColor } from "@/lib/elements";

export const metadata: Metadata = {
  title: "Characters — Builds, Weapons, Echoes & Teams",
  description:
    "Every Wuthering Waves character in one hub: builds, ranked weapons, echo sets, stat priorities, team comps, pull verdicts, and tier placements — current as of version 3.7.",
  alternates: { canonical: "/characters" },
};

/**
 * The roster (DESIGN.md §14, the author's index): every character as a
 * ruled line, grouped by element, with plain anchor links at the top —
 * a kept list, not a filter machine. ⌘K covers finding one name fast.
 */
export default function CharactersPage() {
  const tiles = characters.map(toCharacterHubTile);
  const groups = CHARACTER_ELEMENTS.map((element) => ({
    element,
    members: tiles
      .filter((t) => t.element === element)
      .sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name)),
  })).filter((g) => g.members.length > 0);

  return (
    <>
      <OgPageHero
        kicker={`Version 3.7 · ${tiles.length} characters`}
        title="Characters"
        lede="Builds, ranked weapons, echo sets, team comps, and pull verdicts for every Resonator — the whole roster, grouped by element."
        meta={<UpdatedStamp />}
      />

      <nav className="mosaic-bar" aria-label="Jump to an element">
        {groups.map((g) => (
          <a key={g.element} href={`#element-${g.element.toLowerCase()}`}>
            {g.element} · {g.members.length}
          </a>
        ))}
      </nav>

      {groups.map((g) => (
        <section
          key={g.element}
          id={`element-${g.element.toLowerCase()}`}
          className="mosaic-group"
        >
          <h2 className="mosaic-head">
            <span
              className="element-dot"
              style={{ background: elementColor(g.element) }}
              aria-hidden="true"
            />
            {g.element}
            <span className="og-count">{g.members.length}</span>
          </h2>
          <div className="mosaic">
            {g.members.map((t: CharacterHubTile) => (
              <Link
                key={t.slug}
                href={`/characters/${t.slug}`}
                className="mosaic-item"
              >
                {t.preRelease && (
                  <span className="mosaic-flag">Pre-release</span>
                )}
                <Image
                  src={t.portrait_url}
                  alt={`${t.name} portrait`}
                  width={500}
                  height={500}
                  loading="lazy"
                  decoding="async"
                />
                <span className="mosaic-plate">
                  <span className="mosaic-name">{t.name}</span>
                  <span className="mosaic-meta">
                    {t.element} · {t.role}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

import type { Metadata } from "next";
import ObsidianCharactersExplorer from "@/components/ObsidianCharactersExplorer";
import {
  characters,
  toCharacterHubTile,
  CHARACTER_ELEMENTS,
  CHARACTER_RARITIES,
  CHARACTER_ROLES,
  CHARACTER_WEAPONS,
} from "@/lib/characters";

export const metadata: Metadata = {
  title: "Characters — Builds, Weapons, Echoes & Teams",
  description:
    "Every Wuthering Waves character in one hub: builds, ranked weapons, echo sets, stat priorities, team comps, pull verdicts, and tier placements — current as of version 3.7.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
  return (
    <>
      <div className="og-page-hero">
        <p className="og-page-kicker">
          Version 3.7 · {characters.length} characters
        </p>
        <h1 className="og-page-title og-display">Characters</h1>
        <p className="og-page-lede">
          Builds, ranked weapons, echo sets, team comps, and pull verdicts for
          every Resonator — filter by element, weapon, rarity, or role.
        </p>
      </div>
      <ObsidianCharactersExplorer
        chars={characters.map(toCharacterHubTile)}
        elements={CHARACTER_ELEMENTS}
        weapons={CHARACTER_WEAPONS}
        rarities={CHARACTER_RARITIES}
        roles={CHARACTER_ROLES}
      />
    </>
  );
}

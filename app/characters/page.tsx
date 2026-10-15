import type { Metadata } from "next";
import ObsidianCharactersExplorer from "@/components/ObsidianCharactersExplorer";
import OgPageHero from "@/components/OgPageHero";
import ShareButton from "@/components/ShareButton";
import UpdatedStamp from "@/components/UpdatedStamp";
import {
  characters,
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
      <OgPageHero
        kicker={`Version 3.7 · ${characters.length} characters`}
        title="Characters"
        lede="Builds, ranked weapons, echo sets, team comps, and pull verdicts for every Resonator — filter by element, weapon, rarity, or role."
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />
      <ObsidianCharactersExplorer
        chars={characters}
        elements={CHARACTER_ELEMENTS}
        weapons={CHARACTER_WEAPONS}
        rarities={CHARACTER_RARITIES}
        roles={CHARACTER_ROLES}
      />
    </>
  );
}

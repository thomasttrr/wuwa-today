import type { Metadata } from "next";
import Link from "next/link";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";

export function generateMetadata(): Metadata {
  return {
    title: "Plain-words glossary — WuWa Today",
    description:
      "Every build word on WuWa Today, explained in short everyday sentences.",
    alternates: { canonical: "/glossary" },
  };
}

function Group({ title, terms }: { title: string; terms: [string, string][] }) {
  return (
    <>
      <h3 className="og-sub-h">{title}</h3>
      {terms.map(([term, def]) => (
        <p key={term} className="og-gloss-term">
          <strong>{term}.</strong> {def}
        </p>
      ))}
    </>
  );
}

export default function GlossaryPage() {
  return (
    <>
      <Link href="/characters" className="og-back">
        ← Characters
      </Link>

      <section className="og-section" aria-label="Plain-words glossary">
        <ObsidianSectionHead
          id="glossary"
          title="Plain-words glossary"
          blurb="Every build word on this site, explained the way you would explain it to someone who has never played."
        />
        <Group
          title="Jobs in a team"
          terms={[
            [
              "Main DPS",
              "The main damage dealer. This is the character who stays in the fight and does most of the damage.",
            ],
            [
              "Sub-DPS",
              "The second damage dealer. They come in, help out, and step back so the main damage dealer can return.",
            ],
            [
              "Support",
              "The helper. They heal the team, shield it, or make the rest of the team stronger.",
            ],
          ]}
        />
        <Group
          title="The numbers"
          terms={[
            [
              "ATK",
              "Attack power. Bigger hits start here.",
            ],
            [
              "ATK%",
              "Attack power as a percentage boost, added on top of what the character already has.",
            ],
            [
              "HP",
              "Health. How much damage a character can take before falling.",
            ],
            [
              "HP%",
              "Health as a percentage boost, added on top of what the character already has.",
            ],
            [
              "DEF",
              "Defense. It lowers the damage a character takes.",
            ],
            [
              "Crit Rate",
              "How often hits land as extra-strong hits. Higher means it happens more often.",
            ],
            [
              "Crit DMG",
              "How much harder those extra-strong hits land.",
            ],
            [
              "Healing Bonus",
              "Makes healing stronger.",
            ],
            [
              "Energy Regen",
              "How fast a character gets their biggest special attack back.",
            ],
          ]}
        />
        <Group
          title="Damage words"
          terms={[
            [
              "Elemental DMG Bonus",
              "Extra damage for attacks of one element. Havoc DMG Bonus means extra damage for Havoc attacks, Glacio DMG Bonus for Glacio attacks, and so on.",
            ],
            [
              "Basic ATK DMG Bonus",
              "Extra damage for normal attacks.",
            ],
            [
              "Heavy ATK DMG Bonus",
              "Extra damage for heavy attacks.",
            ],
            [
              "Resonance Skill DMG",
              "Extra damage for the character's skill attack.",
            ],
            [
              "Resonance Liberation DMG",
              "Extra damage for the character's biggest special attack.",
            ],
          ]}
        />
        <Group
          title="Echoes"
          terms={[
            [
              "Echo",
              "A creature you collect and equip. Each character wears five echoes.",
            ],
            [
              "Echo set",
              "A matching group of echoes. Wearing a full set gives a bonus.",
            ],
            [
              "Main Echo",
              "The first echo in the set. It gives you an extra skill to use in a fight.",
            ],
            [
              "Cost",
              "The size of an echo. Bigger echoes go in bigger slots. A full set is usually one 4-cost, two 3-cost, and two 1-cost echoes.",
            ],
            [
              "pc",
              "Short for pieces. A 5-pc set means five matching echoes.",
            ],
          ]}
        />
        <Group
          title="Other words"
          terms={[
            [
              "BiS",
              "Short for best in slot. It means the best choice for that spot.",
            ],
            [
              "Signature weapon",
              "The weapon made for that character. It usually fits them best.",
            ],
            [
              "Forte",
              "A character's skill tree. You spend materials to make their skills stronger.",
            ],
            [
              "Resonance Chain",
              "Extra copies of a character. Each copy unlocks a small bonus.",
            ],
            [
              "Intro",
              "What happens when a character enters the fight.",
            ],
            [
              "Outro",
              "What happens when a character leaves the fight and the next one comes in. Some characters give the next one a boost as they leave.",
            ],
          ]}
        />
      </section>
    </>
  );
}

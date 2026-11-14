import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return {
    title: "Wuthering Waves glossary — build words in plain words",
    description:
      "Every Wuthering Waves build word explained in plain words: DPS, Crit, Echo sets, Forte, Resonance Chain, BiS and more — short everyday sentences, no jargon.",
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

      <header className="og-page-hero">
        <p className="og-page-kicker">Glossary</p>
        <h1 className="og-page-title">Plain words</h1>
        <p className="og-page-lede">
          Every build word on this site, explained the way you would explain it
          to someone who has never played.
        </p>
      </header>

      <section className="og-section" id="glossary" aria-label="Plain-words glossary">
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
            [
              "Unison",
              "A special swap state (a golden glow on the character's icon). Switching a Unison character out fires their farewell skill and the next character's entry skill at the same time, without spending the team's swap meter. Partners who answer the swap build Unison Boon: +3% team damage per stack. Hsin, Suoming, Jinhsi, and Lily play around it.",
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
            [
              "Negative Status",
              "A weakening effect that certain attacks stick on an enemy. Each element has its own (below). They also chew through a boss's Vibration Strength fast, which is why the Calamity Effigy fight rewards bringing them.",
            ],
            [
              "Electro Flare",
              "Electro's Negative Status. Stacks up to 10 and weakens the enemy's attack power (up to −10%). Applied by Hsin, Electro Rover, and Buling.",
            ],
            [
              "Havoc Bane",
              "Havoc's Negative Status. Its stacks build up on their own; at full stacks it bursts for Havoc damage and spreads to nearby enemies. Yangyang: Xuanling's whole kit is built on it.",
            ],
            [
              "Glacio Chafe",
              "Glacio's Negative Status. Each stack deals Glacio damage and slows the enemy; at 10 stacks the target freezes solid. Applied by Suisui, Lucilla, and Hiyuki.",
            ],
            [
              "Spectro Frazzle",
              "Spectro's Negative Status. It deals Spectro damage over time and burns one of its own stacks away with each tick. Applied by Spectro Rover, Phoebe, and Zani.",
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

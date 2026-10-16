import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianTeamCard from "@/components/ObsidianTeamCard";
import Reveal from "@/components/Reveal";
import ShareButton from "@/components/ShareButton";
import UpdatedStamp from "@/components/UpdatedStamp";
import type { Team } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Your First Teams — F2P Starter Teams | WuWa Today",
  description:
    "F2P-friendly Wuthering Waves starter teams from free characters and beginner-banner picks, with simple rotations for new players.",
  alternates: { canonical: "/beginner/first-teams" },
};

const TEAMS: Team[] = [
  {
    name: "Day-one roster",
    tag: "All free",
    members: [
      {
        name: "Spectro Rover",
        slug: "spectro-rover",
        role: "Main DPS",
        element: "Spectro",
        note: "Your protagonist — starts Spectro and gets stronger through the main story.",
      },
      {
        name: "Yangyang",
        slug: "yangyang",
        role: "Sub-DPS",
        element: "Aero",
        note: "Free from the Prologue; brings Aero support and fills the sub-DPS slot.",
      },
      {
        name: "Baizhi",
        slug: "baizhi",
        role: "Support",
        element: "Glacio",
        note: "Healer from the tutorial convene — keeps a fresh team alive.",
      },
    ],
    rotation:
      "Rover leads and deals the damage. Swap to Yangyang for her support contribution, then to Baizhi whenever the team needs healing. Rotate skills as they come off cooldown — no strict combo to memorize.",
  },
  {
    name: "Beginner's Choice upgrade",
    tag: "Beginner banners",
    members: [
      {
        name: "Calcharo",
        slug: "calcharo",
        role: "Main DPS",
        element: "Electro",
        note: "Pick him on Beginner's Choice Convene (or land Encore) — your first real 5-star carry.",
      },
      {
        name: "Sanhua",
        slug: "sanhua",
        role: "Sub-DPS",
        element: "Glacio",
        note: "Free on day 5 of login; a strong sub-DPS who amplifies the on-field carry.",
      },
      {
        name: "Baizhi",
        slug: "baizhi",
        role: "Support",
        element: "Glacio",
        note: "Heals and holds the support slot until you pull Verina.",
      },
    ],
    rotation:
      "Sanhua sets up with her skills, then Calcharo takes the field for his main damage window while Sanhua's support effects are live. Swap to Baizhi to heal and rebuff, then loop back.",
  },
  {
    name: "Tower unlock crew",
    tag: "All free",
    members: [
      {
        name: "Chixia",
        slug: "chixia",
        role: "Main DPS",
        element: "Fusion",
        note: "Free from the Prologue — a real ranged DPS who carries the early game.",
      },
      {
        name: "Yuanwu",
        slug: "yuanwu",
        role: "Sub-DPS",
        element: "Electro",
        note: "Clear the Tower of Adversity's Stable Zone to recruit him.",
      },
      {
        name: "Baizhi",
        slug: "baizhi",
        role: "Support",
        element: "Glacio",
        note: "Healer — your safety net on every team until a 5-star support arrives.",
      },
    ],
    rotation:
      "Yuanwu drops his coordinated damage, then Chixia takes over at range for her main damage window. Baizhi swaps in to heal and keep the team topped off.",
  },
];

export default function BeginnerFirstTeams() {
  return (
    <>
      <Link href="/beginner" className="og-back">
        ← Beginner guides
      </Link>

      <OgPageHero
        kicker="Beginner guides · First teams"
        title="Your first teams"
        lede="Three teams you can build without spending a cent — two are fully free, the third just needs your Beginner's Choice pick. Pick one, invest only in it, and don't spread resources across the bench."
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="teams"
          title="Three starter teams"
          blurb="Visual-first: portraits lead, roles and notes follow. Rotations are simple on purpose — you're learning the game, not memorizing combos."
        />
        <div className="grid grid-2">
          {TEAMS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 70}>
              <ObsidianTeamCard team={t} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="rules"
          title="Team rules for beginners"
          blurb="The principles behind every team above."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Team rules">
              <ul className="og-q-list">
                <li>
                  <strong>Every team needs a healer.</strong> Baizhi covers
                  every team above until you pull a 5-star support (Verina,
                  available on the beginner selector, is the most common
                  next step).
                </li>
                <li>
                  <strong>One carry, one support, one healer.</strong> Feed
                  your limited materials to those three — leveling a fourth or
                  fifth character early just starves the core team.
                </li>
                <li>
                  <strong>Pick your Beginner&apos;s Choice unit to fill your
                  hole.</strong> The five options are Calcharo, Encore,
                  Jianxin, Lingyang, and Verina — a carry (Calcharo, Encore)
                  or universal healer (Verina) covers the most common gaps on
                  a fresh roster. See the{" "}
                  <Link href="/beginner/convene-guide">Convene guide</Link>{" "}
                  for how the selector works.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <p className="og-version-note">
        Roles, elements, and rarities match the character records on this
        site; acquisition paths are verified in the{" "}
        <Link href="/beginner/start-here">Start here</Link> guide. Rotations
        are simplified for new players.
      </p>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import { getCharacter } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Start Here — Your First Week in Wuthering Waves | WuWa Today",
  description:
    "Your free roster, the first things to unlock, and the Union Level milestones that matter — a beginner's first-week checklist for Wuthering Waves.",
  alternates: { canonical: "/beginner/start-here" },
};

const FREE_SLugs = [
  { slug: "spectro-rover", how: "Your protagonist — follow the main story to unlock new elemental forms." },
  { slug: "yangyang", how: "Joins you during the Prologue, alongside Chixia." },
  { slug: "chixia", how: "Joins you during the Prologue, alongside Yangyang." },
  { slug: "baizhi", how: "Tutorial convene at Huaxu Academy (talk to Mortefi). Reported by reroll guides; second source pending." },
  { slug: "sanhua", how: "Launch-era 5-day login reward (\"Gifts of Thawing Frost\", day 5) — how Sanhua is earned today may vary by patch; check the current login events in-game." },
  { slug: "yuanwu", how: "Clear the Stable Zone in the Tower of Adversity." },
];

const UL_MILESTONES = [
  { ul: "5", reward: "Lustrous Tide ×5 + Astrite ×200", note: "Awakening Journey; unlocks the New Voyage Companions convene with story progress." },
  { ul: "15", reward: "Lustrous Tide ×5 + Astrite ×400", note: "Keep pushing the main story — it's the fastest UL source." },
  { ul: "25", reward: "Lustrous Tide ×15 + Crystal Solvent ×2", note: "Hold the Solvent for now (see Mistakes)." },
  { ul: "35", reward: "Lustrous Tide ×15 + Crystal Solvent ×4", note: "Still too early to refill — patience pays." },
  { ul: "45", reward: "1000 Astrite + 5-star Weapon Selector", note: "Winter Brume chest — a free 5-star weapon, once per account." },
];

const UNLOCKS = [
  { ul: "8", what: "Daily activities / Guidebook" },
  { ul: "10", what: "Tacet Fields (echo farming)" },
  { ul: "14", what: "Main Quest Ch. 1 Act 4" },
  { ul: "20", what: "SOL3 Phase Ascension I quest" },
  { ul: "22", what: "Co-op" },
  { ul: "40", what: "SOL3 Phase II" },
  { ul: "60", what: "SOL3 Phase III" },
];

export default function BeginnerStartHere() {
  return (
    <>
      <Link href="/beginner" className="og-back">
        ← Beginner guides
      </Link>

      <OgPageHero
        kicker="Beginner guides · Start here"
        title="Your first week"
        lede="Six free characters, the unlocks that matter, and the milestones that actually gate your power. Do the main story, claim everything free, and don't rush — the game rewards patience more than speed."
        meta={
          <>
            <UpdatedStamp />
          </>
        }
      />

      <ObsidianToolbar
        label="On this page"
        items={[
          { href: "#roster", label: "Free roster" },
          { href: "#milestones", label: "Union Level milestones" },
          { href: "#echoes", label: "Echoes & Data Bank" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="roster"
          title="Your free roster"
          blurb="Every one of these is earnable without spending — a full team before you touch a single banner."
        />
        <div className="grid grid-2">
          {FREE_SLugs.map((f, i) => {
            const char = getCharacter(f.slug);
            if (!char) return null;
            const p = char.profile;
            return (
              <Reveal key={f.slug} delay={(i % 2) * 70}>
                <div className="og-pick-row">
                  <Image
                    src={p.portrait_url}
                    alt={`${char.name} portrait`}
                    width={64}
                    height={64}
                    className="og-pick-portrait"
                  />
                  <div className="og-pick-body">
                    <p className="og-pick-name">
                      <Link href={`/characters/${f.slug}`}>{char.name}</Link>
                    </p>
                    <p className="og-pick-why">
                      {p.element} · {p.weapon_type} ·{" "}
                      {"★".repeat(p.rarity)} · {p.role}
                    </p>
                    <p className="og-pick-desc">{f.how}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="og-version-note">
          Rover starts Spectro; more elemental forms unlock as you follow the
          main story. Yangyang is shown as the day-one Prologue pickup.
        </p>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="milestones"
          title="Union Level milestones"
          blurb="Union Level is your account level — it gates content, echoes, and some of the best free pulls."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Union Level rewards">
              <span className="og-kicker">Claimed from the Awakening Journey</span>
              <h3>Reward milestones</h3>
              <ul className="og-q-list">
                {UL_MILESTONES.map((m) => (
                  <li key={m.ul}>
                    <strong>UL {m.ul}:</strong> {m.reward} — {m.note}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Content unlocks">
              <span className="og-kicker">Gated by Union Level</span>
              <h3>Content unlocks</h3>
              <ul className="og-q-list">
                {UNLOCKS.map((u) => (
                  <li key={u.ul}>
                    <strong>UL {u.ul}:</strong> {u.what}
                  </li>
                ))}
              </ul>
              <p className="og-pick-desc">
                The fastest way up is the main story quest — side content and
                exploration fill the gaps.
              </p>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="echoes"
          title="Echoes & the Data Bank"
          blurb="The one system beginners underestimate — and the one that gates your gear quality."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Echo basics">
              <span className="og-kicker">Echo basics</span>
              <h3>What to know first</h3>
              <ul className="og-q-list">
                <li>
                  <strong>Costs:</strong> Common echoes cost 1, Elites 3,
                  Overlords and Calamities 4. Standard layouts: 4-3-3-1-1 or
                  4-4-1-1-1 across five slots.
                </li>
                <li>
                  <strong>Rarity:</strong> green 2★ → blue 3★ → purple 4★ →
                  gold 5★. A gold echo can be leveled to 25 and holds five
                  substats.
                </li>
                <li>
                  <strong>Substats:</strong> they roll every 5 levels with
                  Tuners — invest in purple and gold echoes, not greens.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Data Bank progression chain">
              <span className="og-kicker">The progression chain</span>
              <h3>Data Bank is the gate</h3>
              <ul className="og-q-list">
                <li>
                  <strong>Union Level → SOL3 Phase → Data Bank → echo
                  quality.</strong> Raise UL, complete ascension quests, then
                  level the Data Bank.
                </li>
                <li>
                  <strong>4-star echoes</strong> need roughly Phase 3;{" "}
                  <strong>5-star echoes</strong> need roughly Phase 4.
                </li>
                <li>
                  Parked on a low world phase? Your echo rarity is capped no
                  matter how much you farm.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <p className="og-version-note">
        Sources: Game8 (Beginner&apos;s Choice, Union Level), Rock Paper
        Shotgun (pity/voucher), beebom (Echo System, launch events), Pocket
        Tactics &amp; Siliconera (Union Level rewards). Baizhi&apos;s
        tutorial-convene acquisition currently has one strong source — noted
        above. Echo details verified as of version 3.7.
      </p>
    </>
  );
}

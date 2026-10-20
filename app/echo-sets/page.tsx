import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";

export const metadata: Metadata = {
  title: "3.7 Echo Sets Guide — Sworn Vigil, Electric Reflection, Tinged Yearning | WuWa Today",
  description:
    "Version 3.7 added three Sonata Effects to Wuthering Waves: Heart of Sworn Vigil, Flash of Electric Reflection, and Flower of Tinged Yearning. Full set bonuses, every member echo by cost, where to farm them, and who each set is actually for.",
  alternates: { canonical: "/echo-sets" },
};

interface MemberEcho {
  name: string;
  icon?: string;
}

interface EchoSet {
  id: string;
  name: string;
  icon: string;
  role: string;
  pill: string;
  pillBis: boolean;
  twoPc: string;
  fivePc: string;
  who: string;
  members: { cost: string; echoes: MemberEcho[] }[];
  farm: string;
  stats: string;
}

const SETS: EchoSet[] = [
  {
    id: "sworn-vigil",
    name: "Heart of Sworn Vigil",
    icon: "/images/echoes/heart-of-sworn-vigil.webp",
    role: "Electro main DPS",
    pill: "Best-in-slot — Hsin · Suoming",
    pillBis: true,
    twoPc: "Electro DMG +10%.",
    fivePc:
      "Inflicting Electro Flare, gaining Unison, or triggering a Unison Response grants +15% Crit Rate and +22.5% Electro DMG for 30s.",
    who: "The Electro carry set. Hsin triggers it in both of her Resonance Modes, so one build covers Electro Flare and Unison play; Suoming triggers it through Unison in her normal rotation. If you pulled either of 3.7's new Electro Resonators, this is the set you farm — it is best-in-slot for both, and nothing else is close.",
    members: [
      {
        cost: "4-cost",
        echoes: [
          {
            name: "Reminiscence: Suhsin the Inevitable",
            icon: "/images/echoes/reminiscence-suhsin-the-inevitable.webp",
          },
        ],
      },
      {
        cost: "3-cost",
        echoes: [
          { name: "Formrender", icon: "/images/echoes/formrender.webp" },
          { name: "Soulfrayer", icon: "/images/echoes/soulfrayer.webp" },
        ],
      },
      {
        cost: "1-cost",
        echoes: [
          { name: "Jade Nether Serpent", icon: "/images/echoes/jade-nether-serpent.webp" },
          { name: "Bloomburst Puppet", icon: "/images/echoes/bloomburst-puppet.webp" },
          { name: "Kernel Puppet: Joy" },
          { name: "Fog Lionarch: Body" },
          { name: "Fog Lionarch: Head" },
        ],
      },
    ],
    farm: "Heart of Flames Tacet Field in the Simulacrum Nexus of Mengzhou (the 3.7 field for the two Electro sets), the Simulacrum Nexus Tacet Discord Nest, and overworld spawns of the member echoes across the Nexus. The 4-cost is the exception: Reminiscence: Suhsin the Inevitable drops from the Ordinance of the Inevitable weekly boss, unlocked through the 3.7 main story — not from any field.",
    stats:
      "4-3-3-1-1 layout. 4-cost: Crit DMG (Crit Rate if your weapon and substats leave the ratio short — the set, passives, and Crit weapons already supply a lot of Crit Rate). 3-costs: Electro DMG Bonus on both; the consensus member picks are Formrender and Soulfrayer. 1-costs: ATK% on both (Kernel Puppet: Joy and Fog Lionarch: Body are the usual picks). Substats: Crit Rate / Crit DMG first, then ATK% and Resonance Skill DMG, with roughly 120% Energy Regen as a comfort target on Hsin.",
  },
  {
    id: "electric-reflection",
    name: "Flash of Electric Reflection",
    icon: "/images/echoes/flash-of-electric-reflection.webp",
    role: "Electro sub-DPS",
    pill: "Sub-DPS — Electro Rover · Hsin",
    pillBis: false,
    twoPc: "Electro DMG +10%.",
    fivePc:
      "Inflicting Electro Flare grants +10% Electro DMG Bonus for 15s. While that effect is active, casting Outro Skill grants the incoming Resonator +25% Electro DMG Bonus for 15s.",
    who: "The swap-out set for Electro Flare appliers. Electro Rover is the cleanest user: apply Flare, finish the short rotation, Outro into Hsin with a 25% Electro DMG buff. It is also Hsin's sub-DPS setup, and Buling can run it situationally in Flare teams. Do not farm it first for Suoming — she does not apply Electro Flare reliably, so the 5-piece condition keeps falling off.",
    members: [
      {
        cost: "4-cost",
        echoes: [
          {
            name: "Reminiscence: Suhsin the Inevitable",
            icon: "/images/echoes/reminiscence-suhsin-the-inevitable.webp",
          },
        ],
      },
      {
        cost: "3-cost",
        echoes: [
          { name: "Skywatch Lancer", icon: "/images/echoes/skywatch-lancer.webp" },
          { name: "Soulfrayer", icon: "/images/echoes/soulfrayer.webp" },
        ],
      },
      {
        cost: "1-cost",
        echoes: [
          { name: "Porcelain Picket" },
          { name: "Stone Picket" },
          { name: "Aureate Picket" },
          { name: "Kernel Puppet: Worry" },
        ],
      },
    ],
    farm: "The same route as Sworn Vigil: Heart of Flames Tacet Field in the Simulacrum Nexus, the Simulacrum Nexus Tacet Discord Nest, and overworld spawns in the Nexus. Farm one trip, build both Electro sets. The 4-cost again comes from the Ordinance of the Inevitable weekly boss.",
    stats:
      "4-3-3-1-1 layout. 4-cost: Crit Rate or Crit DMG, balanced for the wearer's own sub-DPS damage. 3-costs: Electro DMG Bonus on both — Soulfrayer is the standout main-slot-adjacent pick because its own Outro effect stacks another Electro buff on the incoming Resonator. 1-costs: ATK% on both. Aim for roughly 120% Energy Regen so the rotation never stalls.",
  },
  {
    id: "tinged-yearning",
    name: "Flower of Tinged Yearning",
    icon: "/images/echoes/flower-of-tinged-yearning.webp",
    role: "Healer · unreleased",
    pill: "No user yet — don't farm",
    pillBis: false,
    twoPc: "Healing Bonus +10%.",
    fivePc:
      "Healing a Resonator in the team increases the ATK of all Resonators in the team by 10% for 30s. Effects of the same name cannot be stacked. While the effect is active, if the Resonator gains Unison or triggers Unison Response, their ATK is further increased by 15%.",
    who: "Honest answer: nobody runs this yet. No released Resonator can trigger the Unison half of the 5-piece, and today's healers (Shorekeeper, Verina) get more from their existing sets — switching them to Flower now is a downgrade. The set is plainly built for a future Unison healer; community expectation points at Lily in 3.8, but Kuro Games has not confirmed that. Don't spend Waveplates here yet. If pieces drop while you farm the Mengzhou nests, keep them unleveled and wait.",
    members: [
      {
        cost: "4-cost",
        echoes: [
          {
            name: "Thousand-Puppet Pavilion",
            icon: "/images/echoes/thousand-puppet-pavilion.webp",
          },
        ],
      },
      {
        cost: "3-cost",
        echoes: [
          { name: "Skywatch Lancer", icon: "/images/echoes/skywatch-lancer.webp" },
          { name: "Formrender", icon: "/images/echoes/formrender.webp" },
        ],
      },
      {
        cost: "1-cost",
        echoes: [
          { name: "Kernel Puppet: Fright" },
          { name: "Kernel Puppet: Grief" },
          { name: "Kernel Puppet: Reflection" },
          { name: "Kernel Puppet: Anger" },
        ],
      },
    ],
    farm: "Heart of Stillness Tacet Field in the Simulacrum Nexus of Mengzhou, plus the Tacet Discord Nests in Mengzhou (up to 90 echoes a day without spending Waveplates, though drops are shared with Mengzhou's other Sonata Effects).",
    stats:
      "No main-stat guidance yet — with no confirmed user, locking in Healing Bonus vs ATK% vs HP% pieces now would be a guess. If Lily's kit confirms the expected Unison-healer role after the 3.8 preview broadcast, this section gets real numbers then.",
  },
];

interface NewEcho {
  name: string;
  icon: string;
  meta: string;
  skill: string;
}

const NEW_ECHOES: NewEcho[] = [
  {
    name: "Reminiscence: Suhsin the Inevitable",
    icon: "/images/echoes/reminiscence-suhsin-the-inevitable.webp",
    meta: "4-cost · Vigil / Flash",
    skill:
      "Cast to deal Electro DMG. In the main slot it grants the wearer +10% Electro DMG, plus another +10% for 30s after inflicting Electro Flare, gaining Unison, or triggering Unison Response. The main Echo for both new Electro sets — farm it from the Ordinance of the Inevitable weekly boss.",
  },
  {
    name: "Formrender",
    icon: "/images/echoes/formrender.webp",
    meta: "3-cost · Vigil / Flower",
    skill:
      "Summons a Formrender dealing Fusion DMG; the wearer gains +10% Energy Regen while it sits in the main slot. CD 20s. The Energy Regen makes it a quiet support pick, and it is one of the two consensus 3-costs for Sworn Vigil builds.",
  },
  {
    name: "Soulfrayer",
    icon: "/images/echoes/soulfrayer.webp",
    meta: "3-cost · Vigil / Flash",
    skill:
      "Summons a Soulfrayer dealing Electro DMG 3 times. Casting Outro within 15s after summoning grants the incoming Resonator +12% Electro DMG Bonus for 15s. CD 20s. The support main-Echo pick for Electro Flare teams.",
  },
  {
    name: "Skywatch Lancer",
    icon: "/images/echoes/skywatch-lancer.webp",
    meta: "3-cost · Flash / Flower",
    skill:
      "Summons a Skywatch Lancer to attack the target, dealing Aero DMG 6 times. CD 15s. Mostly a set piece for its two Sonatas — and 3.7's new Phantom (shiny) Echo is Skywatch Lancer, for collectors.",
  },
  {
    name: "Jade Nether Serpent",
    icon: "/images/echoes/jade-nether-serpent.webp",
    meta: "1-cost · Vigil",
    skill:
      "Bombards the target with fireballs: five small Fusion DMG hits, then one larger one. CD 8s. A Sworn Vigil 1-cost filler with a fast, cheap skill.",
  },
  {
    name: "Bloomburst Puppet",
    icon: "/images/echoes/bloomburst-puppet.webp",
    meta: "1-cost · Vigil",
    skill:
      "Startles the target with a quick burst of Glacio DMG hits. CD 8s. The other new Sworn Vigil 1-cost; run whichever of the two rolls the better substats.",
  },
];

function MemberChips({ echoes }: { echoes: MemberEcho[] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        gap: "0.4rem 0.9rem",
        alignItems: "center",
      }}
    >
      {echoes.map((e) => (
        <span
          key={e.name}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          {e.icon ? (
            <Image
              src={e.icon}
              alt=""
              width={26}
              height={26}
              loading="lazy"
              decoding="async"
              style={{ borderRadius: 6 }}
            />
          ) : null}
          {e.name}
        </span>
      ))}
    </span>
  );
}

function SetCard({ set }: { set: EchoSet }) {
  return (
    <section
      className="og-echo-plate"
      id={`set-${set.id}`}
      aria-label={set.name}
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="og-echo-head" style={{ flexWrap: "wrap" }}>
        <span
          className="og-echo-name"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}
        >
          <Image
            src={set.icon}
            alt=""
            width={34}
            height={34}
            loading="lazy"
            decoding="async"
            style={{ borderRadius: 8 }}
          />
          {set.name}
        </span>
        <span className="og-echo-cost">{set.role}</span>
      </div>
      <p className="og-echo-usage">
        <span
          className={
            set.pillBis ? "og-usage-pill og-usage-bis" : "og-usage-pill og-usage-alt"
          }
        >
          {set.pill}
        </span>
      </p>
      <p>
        <strong>2-pc:</strong> {set.twoPc}
      </p>
      <p>
        <strong>5-pc:</strong> {set.fivePc}
      </p>
      <p>{set.who}</p>
      <p>
        <strong>Member echoes:</strong>
      </p>
      {set.members.map((g) => (
        <p key={g.cost}>
          <strong>{g.cost}:</strong> <MemberChips echoes={g.echoes} />
        </p>
      ))}
      <p>
        <strong>Where to farm:</strong> {set.farm}
      </p>
      <p>
        <strong>Main stats:</strong> {set.stats}
      </p>
    </section>
  );
}

export default function EchoSetsGuide() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Echo sets · Version 3.7"
        title="Three new sets, two worth farming"
        lede="Version 3.7 added three Sonata Effects: two Electro sets that split the patch's new teams between carry and support, and a healer set whose character doesn't exist yet. Here is every bonus, member echo, and farm route — each fact checked against two or more independent sources."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar
        label="Jump to a set"
        items={[
          { href: "#set-sworn-vigil", label: "Sworn Vigil" },
          { href: "#set-electric-reflection", label: "Electric Reflection" },
          { href: "#set-tinged-yearning", label: "Tinged Yearning" },
          { href: "#new-echoes", label: "New echoes" },
          { href: "#farming", label: "Farming plan" },
        ]}
      />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> farm{" "}
              <strong>Heart of Sworn Vigil</strong> if you run Hsin or Suoming, farm{" "}
              <strong>Flash of Electric Reflection</strong> for the Electro Rover /
              sub-DPS slot in the same teams, and leave{" "}
              <strong>Flower of Tinged Yearning</strong> alone until its healer
              actually releases. All three sets live in the Simulacrum Nexus of
              Mengzhou, unlocked through Main Quest Chapter IV Act IV,
              &ldquo;Simulacrum of the Heart.&rdquo;
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="sets"
          title="The three sets"
          blurb="Full bonus text, who each set is for, every echo that can roll it, and the stats to keep."
        />
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {SETS.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i * 60, 180)}>
              <SetCard set={s} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="og-section" id="new-echoes" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The new echoes, at a glance"
          blurb="3.7 added five new echoes plus a new weekly-boss Reminiscence. Only the main-slot effects matter for builds — the rest are set pieces."
        />
        <div className="og-echo-plates">
          {NEW_ECHOES.map((e, i) => (
            <Reveal key={e.name} delay={Math.min(i * 60, 240)}>
              <div className="og-echo-plate">
                <div className="og-echo-head">
                  <span
                    className="og-echo-name"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <Image
                      src={e.icon}
                      alt=""
                      width={34}
                      height={34}
                      loading="lazy"
                      decoding="async"
                      style={{ borderRadius: 8 }}
                    />
                    {e.name}
                  </span>
                </div>
                <p className="og-echo-cost" style={{ marginTop: "0.5rem" }}>
                  {e.meta}
                </p>
                <p>{e.skill}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="og-section" id="farming" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The farming plan"
          blurb="One region feeds all three sets. Spend Waveplates in this order."
        />
        <Reveal>
          <div className="og-stat-panel">
            <ul className="og-q-list">
              <li>
                <strong>Heart of Flames Tacet Field</strong> (Simulacrum Nexus) —
                drops both Electro sets. This is the default daily farm for anyone
                building Hsin, Suoming, or Electro Rover.
              </li>
              <li>
                <strong>Ordinance of the Inevitable</strong> (weekly boss) — the
                only source of Reminiscence: Suhsin the Inevitable, the 4-cost
                both Electro sets want. Three claims a week; start immediately,
                it is the real bottleneck.
              </li>
              <li>
                <strong>Simulacrum Nexus Tacet Discord Nest</strong> — free daily
                echo hunting (up to 90 a day, no Waveplates) across Mengzhou&rsquo;s
                Sonata Effects. Slower per set, but it costs nothing.
              </li>
              <li>
                <strong>Heart of Stillness Tacet Field</strong> — Flower of Tinged
                Yearning&rsquo;s field. Skip it until a Unison healer is confirmed;
                your Waveplates are worth more in Heart of Flames.
              </li>
              <li>
                <strong>Chord Cleansing, Nov 4–11</strong> — the recurring event
                doubles Tacet Field echo drops for its final-week run. If you
                can wait, it is the cheapest window to finish both Electro sets.
              </li>
            </ul>
          </div>
        </Reveal>
        <p className="og-echo-note">
          Echoes roll their Sonata from the set list above when they drop, so a
          member echo found in the overworld can land on either of its two
          Sonatas — Tacet Fields are how you aim at one set specifically.
        </p>
      </div>

      <p className="og-version-note">
        Set bonuses, member lists, and farm routes verified against the official
        Version 3.7 patch notes, Game8&rsquo;s Sonata Effect pages, the Wuthering
        Waves Wiki, EnjoyGM&rsquo;s 3.7 echo sets guide, Mone&rsquo;s 3.7 echoes
        guide, and Prydwen&rsquo;s echo database — see the{" "}
        <Link href="/characters/hsin">Hsin</Link> and{" "}
        <Link href="/characters/suoming">Suoming</Link> build pages for the
        per-character versions of these recommendations. Flower of Tinged
        Yearning&rsquo;s expected user (Lily, 3.8) is community expectation, not
        a Kuro Games confirmation, and is labeled that way wherever it appears.
      </p>
    </>
  );
}

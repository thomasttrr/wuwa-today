import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import { MaterialRows } from "@/components/MaterialTable";
import { getCharacter } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Phase 2 Rerun Banners (Dec 3) — Xuanling, Suisui, Hiyuki Kits, Weapons & Pre-Farm",
  description:
    "Version 3.8 Phase 2 starts Dec 3: Yangyang: Xuanling, Suisui, and Hiyuki return on rerun banners. Their kits, signature weapons, Prydwen ratings, best teams, and everything you can farm before the banners open.",
  alternates: { canonical: "/phase-2" },
};

interface Phase2Char {
  slug: string;
  art: string;
  artW: number;
  artH: number;
  artSrcSet?: string;
  released: string;
  kit: string;
  ratings: string;
  weapon: { name: string; icon: string; stats: string; passive: string };
  setLine: string;
  team: string;
}

const CHARS: Phase2Char[] = [
  {
    slug: "yangyang-xuanling",
    art: "/images/xuanling-splash.webp",
    artW: 640,
    artH: 597,
    artSrcSet:
      "/images/xuanling-splash-512.webp 512w, /images/xuanling-splash-1024.webp 1024w, /images/xuanling-splash-1200.webp 1200w, /images/xuanling-splash-1920.webp 1920w",
    released: "First released July 10, 2026",
    kit: "A slow, deliberate Havoc Bane hypercarry. She keeps Havoc Bane stacked on the enemy — up to six stacks, shredding DEF and amplifying Havoc damage — swaps between Azure and Feather stances with her Skill, and cashes out through enormous Heavy Attacks; her own buffs push her Crit DMG past 500%. Her Outro also boosts the next Havoc Bane applier, which today means Chisa.",
    ratings: "Prydwen (Nov 12): Tower of Adversity T0 · Whimpering Wastes T1.5, main DPS",
    weapon: {
      name: "Azure Oath",
      icon: "/images/weapons/azure-oath.png",
      stats: "Lv. 90: 587 ATK · 24.3% Crit Rate",
      passive:
        "12% DMG Bonus on every attribute; after inflicting Havoc Bane, her Heavy Attacks gain 36% DMG Amplification and ignore 12% of the target's DEF for 8s.",
    },
    setLine: "Song of Feathered Trace, main echo Thousand-Puppet Pavilion",
    team: "Yangyang: Xuanling + Chisa + Suisui",
  },
  {
    slug: "suisui",
    art: "/images/suisui-splash.webp",
    artW: 640,
    artH: 620,
    artSrcSet:
      "/images/suisui-splash-512.webp 512w, /images/suisui-splash-1024.webp 1024w, /images/suisui-splash-1200.webp 1200w, /images/suisui-splash-1920.webp 1920w",
    released: "First released July 30, 2026",
    kit: "The Negative Status support. She works in two stances, Zephyr and Drizzle, applies Glacio Chafe and heals — and her Liberation raises the stack caps that Chafe, Flare, and Rage teams live on, while her Outro hands the incoming carry a large DMG and ATK buff. Prydwen notes she is free-to-play friendly at S0: the 4-star Variation covers her fine.",
    ratings: "Prydwen (Nov 12): T0 support in both Tower of Adversity and Whimpering Wastes",
    weapon: {
      name: "Firstlight's Herald",
      icon: "/images/weapons/firstlights-herald.png",
      stats: "Lv. 90: 412 ATK · 77% Energy Regen",
      passive:
        "+12% Max HP; her Liberation restores 8 Concerto Energy, and while her Chafe and healing marks are both active, nearby teammates gain 20% ATK.",
    },
    setLine: "Song of Feathered Trace (Forbidden Bastion), or Rejuvenating Glow (Fallacy of No Return)",
    team: "Hsin + Electro Rover + Suisui — or Hiyuki + Lucilla + Suisui",
  },
  {
    slug: "hiyuki",
    art: "/images/renders/hiyuki-800.webp",
    artW: 543,
    artH: 800,
    released: "First released April 30, 2026",
    kit: "A Glacio Chafe hypercarry. She builds Dedication, enters her Ultimate stance off a Heavy Attack, and converts Chafe stacks directly into Glacio Bite — a bigger hit that stuns instead of freezing. Her Fine Snow passive grows stronger as the team applies Bane or Chafe, so she wants a Chafe enabler beside her: Lucilla or Suisui.",
    ratings: "Prydwen (Nov 12): T0 DPS in both Tower of Adversity and Whimpering Wastes",
    weapon: {
      name: "Frostburn",
      icon: "/images/weapons/frostburn.png",
      stats: "Lv. 90: 587 ATK · 24.3% Crit Rate",
      passive:
        "+12% ATK; applying Glacio Chafe adds 28% Glacio DMG Amplification and makes her Liberation ignore 10% DEF, and while she is on field, Chafe damage around her is amplified by 20%.",
    },
    setLine: "Wishes of Quiet Snowfall, main echo Reminiscence: Threnodian — Voidborne Construct",
    team: "Hiyuki + Lucilla + Suisui",
  },
];

function CharSection({ c }: { c: Phase2Char }) {
  const rec = getCharacter(c.slug);
  if (!rec) return null;
  const mats = rec.materials;
  return (
    <div className="og-section" id={c.slug} style={{ scrollMarginTop: "120px" }}>
      <Reveal>
        <div
          style={{
            border: "1px solid var(--line, #2a2f3a)",
            borderRadius: "16px",
            overflow: "hidden",
            background: "var(--panel, #12151d)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.art}
            srcSet={c.artSrcSet}
            sizes="(max-width: 760px) 100vw, 900px"
            alt={`${rec.name} art`}
            width={c.artW}
            height={c.artH}
            loading="lazy"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              objectPosition: "center 22%",
              display: "block",
            }}
          />
          <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
            <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.45rem" }}>
              <Link href={`/characters/${c.slug}`}>{rec.name}</Link>
            </h3>
            <p style={{ margin: "0 0 0.8rem", opacity: 0.85 }}>
              {rec.profile.element} · {rec.profile.weapon_type} · {rec.profile.role} ·{" "}
              <strong>{c.released}</strong> — returning on a rerun banner
            </p>
            <p style={{ margin: "0 0 0.8rem", lineHeight: 1.65 }}>{c.kit}</p>
            <p style={{ margin: "0 0 0.8rem", opacity: 0.85 }}>{c.ratings}</p>
            <div
              style={{
                display: "flex",
                gap: "0.7rem",
                alignItems: "flex-start",
                padding: "0.7rem 0.8rem",
                border: "1px solid var(--line, #2a2f3a)",
                borderRadius: "12px",
                marginBottom: "0.8rem",
              }}
            >
              <Image
                src={c.weapon.icon}
                alt={`${c.weapon.name} icon`}
                width={52}
                height={52}
                style={{ borderRadius: "8px", flexShrink: 0 }}
              />
              <div>
                <strong>{c.weapon.name}</strong> — her signature weapon, also rerunning.{" "}
                <span style={{ opacity: 0.85 }}>{c.weapon.stats}.</span>
                <div style={{ opacity: 0.85, marginTop: "0.25rem" }}>{c.weapon.passive}</div>
              </div>
            </div>
            <p style={{ margin: "0 0 0.4rem" }}>
              <strong>Best set:</strong> {c.setLine}
            </p>
            <p style={{ margin: "0 0 0.4rem" }}>
              <strong>Best team:</strong> {c.team}
            </p>
            <p style={{ margin: "0 0 1rem" }}>
              <strong>Pull verdict:</strong> {rec.pull_verdict.verdict}
            </p>
            {mats ? (
              <>
                <h4 style={{ margin: "0 0 0.5rem" }}>
                  Pre-farm — everything below is farmable right now
                </h4>
                <p style={{ margin: "0 0 0.4rem", opacity: 0.8, fontSize: "0.92rem" }}>
                  Ascension
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0.8rem", display: "grid", gap: "0.5rem" }}>
                  <MaterialRows entries={mats.ascension} />
                </ul>
                <p style={{ margin: "0 0 0.4rem", opacity: 0.8, fontSize: "0.92rem" }}>
                  Forte
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
                  <MaterialRows entries={mats.forte} />
                </ul>
              </>
            ) : null}
            <p style={{ margin: "1rem 0 0" }}>
              <Link href={`/characters/${c.slug}`}>
                Full build, sequences, and teams on her character page →
              </Link>
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function Phase2Page() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Version 3.8 · Phase 2 · Dec 3"
        title="Phase 2: the returning three"
        lede="On December 3, the Phase 2 banners bring back Yangyang: Xuanling, Suisui, and Hiyuki — three of the strongest Resonators in the game, all released earlier in 2026 and fully documented. This page gathers their kits, signature weapons, ratings, best teams, and everything you can farm before the banners open."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar
        label="Jump to"
        items={[
          { href: "#yangyang-xuanling", label: "Xuanling" },
          { href: "#suisui", label: "Suisui" },
          { href: "#hiyuki", label: "Hiyuki" },
          { href: "#prep", label: "Prep warnings" },
          { href: "#rumors", label: "Rumors & unknowns" },
        ]}
      />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> these are <strong>reruns, not debuts</strong> —
              nothing on this page is a leak. Banner dates come from Kuro&rsquo;s official convene
              notices; kit, weapon, and rating details come from Prydwen&rsquo;s character
              profiles, checked November 12, 2026, and match the verified data on each
              character&rsquo;s own page here. Phase 2 runs{" "}
              <strong>December 3, 10:00 to December 21, 11:59 server time</strong> (Dec 2, 9:00 PM
              to Dec 20, 10:59 PM ET). The 4-star rate-ups on every banner are Danjin, Baizhi, and
              Yuanwu. See the live countdowns on the <Link href="/banners">banners page</Link>.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="returning"
          title="The three returning Resonators"
          blurb="Who they are, how they play, what their weapons do, and the full pre-farm list for each."
        />
      </div>
      {CHARS.map((c) => (
        <CharSection key={c.slug} c={c} />
      ))}

      <div className="og-section" id="prep" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Prep warnings"
          blurb="The two things that actually gate a Dec 3 build."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Start the weekly boss this week.</strong> Each of the three needs 26
              weekly-boss materials (Skyward Glazed Heart for Xuanling and Suisui, We Who Question
              for Hiyuki). The weekly boss pays three claims a week, so even starting today you
              can bank at most 9 of the 26 before December 3 — the rest lands after launch. Every
              other material on their lists is farmable right now, with no gate.
            </p>
            <p>
              <strong>Budget the Shell Credits.</strong> A full build costs 170,000 credits for
              ascension plus 2,030,000 for Forte — 2.2 million per character, before Echo tuning.
              If you plan to pull two of the three, farm credits alongside the materials.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="rumors" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Rumors & unknowns"
          blurb="What is genuinely not settled — kept separate from the confirmed facts above."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The end date.</strong> Kuro&rsquo;s convene notices close Phase 2 on
              December 21 at 11:59 server time, the night before maintenance. Prydwen&rsquo;s
              banners page shows December 23 instead. We follow the official notices — but if
              Kuro extends the phase, the notices are what changes first, and this page is
              re-checked at the flip.
            </p>
            <p>
              <strong>Everything else is quiet.</strong> No sourced, checkable claims about Phase
              2 beyond the banners above are circulating that meet this site&rsquo;s two-source
              bar. If a claim can&rsquo;t be sourced, it doesn&rsquo;t go up — that is the whole
              rule for this section.
            </p>
            <p>
              Looking further ahead? The <Link href="/leaks">4.0+ leaks page</Link> tracks
              the rumored New Federation arc — Anna, Lucille, and the wider 4.X cast — with
              every claim tagged by how solid its evidence is.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Availability from "../../components/Availability";
import PhaseTrack, { type PhaseNode } from "../../components/PhaseTrack";
import PlannerAccounts, { type AccountPlan } from "../../components/PlannerAccounts";
import UpdatedStamp from "../../components/UpdatedStamp";
import { banners, bannerMeta } from "../../lib/data";
import { characters, getCharacter } from "../../lib/characters";
import { elementColor } from "../../lib/elements";
import { getPrefarmGuide } from "../../lib/prefarm";
import { tierFor } from "../../lib/tiers";
import { thumbFor } from "../../lib/renders";
import { CharMedal } from "../../components/CharThumb";
import "./planner.css";

export const metadata: Metadata = {
  title: "Pull Planner — Who to Pull in Version 3.7",
  description:
    "Version 3.7 pull planner: who's on the banner right now, picks by account type, whether Lynae and Lucilla are worth it, and whether to save for Lily in 3.8 — every pick traced to a verified pull verdict.",
  alternates: { canonical: "/pull-planner" },
};

const BUILT_AT = Date.now();
const FIVE_STARS = ["suoming", "lynae", "lucilla", "hsin", "iuno", "chisa"] as const;
type FiveStarSlug = (typeof FIVE_STARS)[number];

const slugByName = new Map(characters.map((c) => [c.name, c.slug]));
const bannerById = new Map(banners.map((b) => [b.id, b]));

function info(slug: FiveStarSlug) {
  const c = getCharacter(slug);
  if (!c) throw new Error(`pull-planner: missing character record for ${slug}`);
  const b = bannerById.get(c.pull_verdict.banner_id);
  return {
    slug,
    name: c.name,
    thumb: thumbFor(slug, c.profile.portrait_url),
    color: elementColor(c.profile.element),
    element: c.profile.element,
    role: c.profile.role,
    label: c.pull_verdict.verdict_label,
    text: c.pull_verdict.verdict,
    prerelease: c.pull_verdict.uncertain_or_prerelease,
    start: b?.startsAt ?? null,
    end: b?.endsAt ?? null,
    tier: tierFor(slug).ours?.tier ?? null,
  };
}

function plan(key: string, title: string, profile: string, pick: FiveStarSlug, note: string, also: string): AccountPlan {
  const v = info(pick);
  return {
    key,
    title,
    profile,
    note,
    also,
    pick: { slug: v.slug, name: v.name, thumb: v.thumb, color: v.color, label: v.label, start: v.start, end: v.end },
  };
}

export default function PullPlannerPage() {
  const p1 = bannerById.get("3.7-phase-1");
  const p2 = bannerById.get("3.7-phase-2");

  const phases: PhaseNode[] = banners
    .filter((b) => b.version === bannerMeta.version)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map((b) => ({
      id: b.id,
      label: `${b.version} · ${b.phase}`,
      start: b.startsAt,
      end: b.endsAt,
      stars: b.characters
        .filter((c) => c.rarity === 5)
        .map((c) => {
          const slug = slugByName.get(c.name);
          return {
            name: c.name,
            thumb: slug ? thumbFor(slug, getCharacter(slug)?.profile.portrait_url) : null,
            color: elementColor(c.element),
          };
        }),
    }));

  // Plan text is the planner's original editorial copy, unchanged.
  const plans: AccountPlan[] = [
    plan("new", "New player", "Fresh roster, everything is an upgrade. Priority is units that work everywhere and rerun rarely.", "lynae",
      "The safest rerun of 3.7 — a fresh account doesn't own her, and universal value beats a conditional DPS.",
      "Runner-up: Hsin — a new Electro main DPS fills the biggest hole on a fresh roster."),
    plan("f2p", "F2P", "One guaranteed 5-star for the whole version. No second chances — pick the lowest-risk option.", "hsin",
      "Conditional pick: missing an Electro DPS, she's a strong pull. Electro covered? Hold everything for Lynae in Phase 2.",
      "Why the condition: Lynae’s verdict (“safest rerun — pull if you don’t own her”) is the floor; Hsin’s is the ceiling when you need her role. Don’t spend on Iuno’s banner — third pick of Phase 1."),
    plan("low", "Low-spender", "Welkin / battle pass income — one to two 5-stars per version plus a signature weapon if you plan it.", "hsin",
      "Strong for accounts missing an Electro DPS — and she's the top of the Phase 1 value order (Hsin > Chisa > Iuno).",
      "Second pick: Chisa — “one of the best supports for Negative Status teams”, worth it if you’re building around your new Hsin. Skip Iuno unless you love Heavy Attack teams — luxury for full sustain slots."),
    plan("vet", "Veteran", "Deep roster, most sustains and DPS slots already covered. Pull for niches and upgrades, not bodies.", "chisa",
      "Niche but excellent: worth it if you're pulling Hsin or running Negative Status squads; skip if sustain is covered.",
      "Only-if conditions: Lynae only if you missed her earlier (“pull her if you don’t own her”); Lucilla only with Hiyuki, a Glacio DPS, or Echo Skill carries — “otherwise skip: she’s niche, not a generalist”."),
  ];

  const verdicts = FIVE_STARS.map(info);

  return (
    <>
      <header className="pp-hero">
        <p className="rs-kicker">Version {bannerMeta.version} · Pull strategy</p>
        <h1 className="pp-hero-title">Pull planner</h1>
        <p className="pp-hero-lede">
          Who to pull, answered per account type. Every pick traces to a
          verified pull verdict on this site, and each one shows whether its
          banner is still running.
        </p>
      </header>

      <section className="pp-section" aria-labelledby="pp-sched-h">
        <h2 id="pp-sched-h" className="pp-h">Where the version stands</h2>
        <PhaseTrack phases={phases} builtAt={BUILT_AT} />
      </section>

      <section className="pp-section" aria-labelledby="pp-acc-h">
        <h2 id="pp-acc-h" className="pp-h">Pick by your account</h2>
        <p className="pp-sub">
          Plans were written at the start of {bannerMeta.version}. When a
          pick&apos;s banner has ended it&apos;s flagged, and the advice applies to
          that Resonator&apos;s next rerun.
        </p>
        <PlannerAccounts plans={plans} builtAt={BUILT_AT} />
      </section>

      <section className="pp-section" aria-labelledby="pp-q-h">
        <h2 id="pp-q-h" className="pp-h">The big questions</h2>
        <div className="pp-qs">
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">01</span>
              <span className="pp-q-t">Pull Hsin or save for Suoming?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>They pair together.</strong> The Suoming verdict
                  reads:{" "}
                  <em>
                    “If you pulled Hsin, Suoming is her best partner and a
                    strong pull. Everyone else should wait for launch-day
                    numbers before deciding.”
                  </em>
                </li>
                <li>
                  <strong>Already have or pull Hsin?</strong> Suoming is her
                  best partner — budget for both.
                </li>
                <li>
                  <strong>Skipped Hsin?</strong> Save and compare: Suoming’s
                  verdict was written from pre-release numbers, so check her
                  verdict page for launch-day updates first.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/hsin">Hsin verdict</Link> ·{" "}
                <Link href="/characters/suoming">Suoming verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">02</span>
              <span className="pp-q-t">F2P with one guarantee: who?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>Make it count:</strong> if you’re missing an Electro
                  DPS, <strong>Hsin</strong> is “a strong pull for accounts
                  missing an Electro DPS”.
                </li>
                <li>
                  <strong>Electro slots covered?</strong> Hold for{" "}
                  <strong>Lynae</strong> in Phase 2 — she’s “the safest rerun
                  of 3.7”.
                </li>
                <li>
                  <strong>Phase 1 value order:</strong> Hsin &gt; Chisa &gt;
                  Iuno for most accounts.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/hsin">Hsin verdict</Link> ·{" "}
                <Link href="/characters/lynae">Lynae verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q" open>
            <summary>
              <span className="pp-q-n">03</span>
              <span className="pp-q-t">Do I need the Lynae / Lucilla reruns?</span>
              <Availability start={p2?.startsAt ?? null} end={p2?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>Lynae:</strong> “the safest rerun of 3.7 — pull her
                  if you don’t own her.”
                </li>
                <li>
                  <strong>Lucilla is conditional:</strong> pull her if you run
                  Hiyuki, a Glacio DPS, or Echo Skill carries — “she’s arguably
                  their best support”.
                </li>
                <li>
                  <strong>Otherwise:</strong> she’s niche, not a generalist,
                  and safe to skip.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/lynae">Lynae verdict</Link> ·{" "}
                <Link href="/characters/lucilla">Lucilla verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">04</span>
              <span className="pp-q-t">What about Chisa and Iuno?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>Chisa</strong> is “one of the best supports for
                  Negative Status teams — worth it if you’re building around
                  Hsin or status squads”.
                </li>
                <li>
                  <strong>Iuno</strong> is Phase 1’s third pick: a flexible
                  Aero healer/buffer, but “a luxury if your sustain slots are
                  full”.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/chisa">Chisa verdict</Link> ·{" "}
                <Link href="/characters/iuno">Iuno verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">05</span>
              <span className="pp-q-t">Pull 3.7 Phase 2 or save for Lily (3.8)?</span>
              <Availability start={p2?.startsAt ?? null} end={p2?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>What’s official:</strong> Lily is a 5-star Spectro
                  Pistols Resonator announced for Version 3.8. Her kit has not
                  been revealed — so nobody can honestly rank her yet.
                </li>
                <li>
                  <strong>Pull Phase 2 if:</strong> you have Hsin (Suoming is
                  her best partner), you don’t own Lynae (the safest rerun of
                  3.7), or Lucilla fits your Hiyuki / Glacio / Echo-Skill
                  account.
                </li>
                <li>
                  <strong>Save for Lily if:</strong> Phase 2 offers you nothing
                  new — and only if you’re comfortable waiting. Her 3.8 timing
                  is an <em>estimate</em>, not an officially announced date.
                </li>
                <li>
                  <strong>Bottom line:</strong> a guaranteed strong pull now
                  beats a hypothetical later. Only hold Astrite for Lily if
                  your roster can genuinely wait.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/suoming">Suoming verdict</Link> ·{" "}
                <Link href="/characters/lynae">Lynae verdict</Link> ·{" "}
                <Link href="/characters/lily">Lily preview</Link>
              </p>
            </div>
          </details>
        </div>
      </section>

      <section className="pp-section" aria-labelledby="pp-v-h">
        <h2 id="pp-v-h" className="pp-h">Every 5-star, verdict at a glance</h2>
        <p className="pp-sub">The source of truth behind every pick above.</p>
        <ul className="pp-verdicts">
          {verdicts.map((v) => (
            <li key={v.slug} className="pp-v rs-spot" style={{ "--c": v.color } as CSSProperties}>
              <div className="pp-v-head">
                <CharMedal thumb={v.thumb} name={v.name} size={56} rarity={5} />
                <div>
                  <h3>
                    <Link href={`/characters/${v.slug}`}>{v.name}</Link>
                  </h3>
                  <p className="pp-v-meta">
                    {v.element} · {v.role}
                    {v.tier && <span className="pp-v-tier">{v.tier}</span>}
                  </p>
                </div>
              </div>
              <span className="pp-verdict">{v.label}</span>
              <p className="pp-v-text">{v.text}</p>
              <div className="pp-v-foot">
                <Availability start={v.start} end={v.end} builtAt={BUILT_AT} />
                {v.prerelease && <span className="pp-avail pp-avail-unknown">Pre-release data</span>}
              </div>
              <p className="pp-v-links">
                <Link href={`/characters/${v.slug}`}>Full verdict →</Link>
                {getPrefarmGuide(v.slug) && <Link href={`/pre-farm/${v.slug}`}>Pre-farm →</Link>}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="pp-note">
        All picks trace to the verified pull verdicts above (published Oct
        13–14, 2026). Suoming&apos;s recommendation was written from pre-release data. All
        dates are server time (UTC+8).
      </p>
      <UpdatedStamp />
    </>
  );
}

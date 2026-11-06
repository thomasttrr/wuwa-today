import PageHero from "@/components/PageHero";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Availability from "../../components/Availability";
import PhaseTrack, { type PhaseNode } from "../../components/PhaseTrack";
import PlannerAccounts, { type AccountPlan } from "../../components/PlannerAccounts";
import UpdatedStamp from "../../components/UpdatedStamp";
import { banners, bannerMeta, nextVersion } from "../../lib/data";
import { characters, getCharacter } from "../../lib/characters";
import { elementColor } from "../../lib/elements";
import { getPrefarmGuide } from "../../lib/prefarm";
import { tierFor } from "../../lib/tiers";
import { thumbFor } from "../../lib/renders";
import { CharMedal } from "../../components/CharThumb";
import "./planner.css";

export const metadata: Metadata = {
  title: "Pull Planner — Who to Pull in Version 3.8",
  description:
    "Version 3.8 pull planner: Lily's Phase 1 value, the Sigrika and Qiuyuan reruns, picks by account type, and whether to save for Phase 2 — every pick traced to a verified pull verdict.",
  alternates: { canonical: "/pull-planner" },
};

const BUILT_AT = Date.now();
const FIVE_STARS = ["lily", "sigrika", "qiuyuan", "yangyang-xuanling", "suisui", "hiyuki"] as const;
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
  const p1 = bannerById.get("3.8-phase-1");
  const p2 = bannerById.get("3.8-phase-2");

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

  // Plan text is editorial copy traced to the pull verdicts below.
  const plans: AccountPlan[] = [
    plan("new", "New player", "Fresh roster, everything is an upgrade. Priority is units that work everywhere and rerun rarely.", "lily",
      "The safest first 5-star of 3.8 — a premium sustain is never wasted, and her buffs cover the Unison and Echo teams this version is built around.",
      "Runner-up: save for Yangyang: Xuanling in Phase 2 if you'd rather open with a top-tier carry — she wants a status team around her, which a fresh roster builds slowly."),
    plan("f2p", "F2P", "One guaranteed 5-star for the whole version. No second chances — pick the lowest-risk option.", "lily",
      "One guarantee, spent on the support who fits the most teams. DPS rotate out; premium sustain is the floor every account stands on.",
      "Why not the DPS: Sigrika's damage drops hard outside Echo Skill teams, and her best version needs Qiuyuan too — that's two pulls, not one. Xuanling is Phase 2 and also wants her support shell built first."),
    plan("low", "Low-spender", "Welkin / battle pass income — one to two 5-stars per version plus a signature weapon if you plan it.", "sigrika",
      "Phase 1's package for Echo accounts: Sigrika carries, Qiuyuan buffs her, and neither needs a signature weapon — two pulls, no weapon banner.",
      "Alternative: Lily at S0 and save the rest — her S2 is the breakpoint that turns her universal, so going deep on one banner beats spreading thin."),
    plan("vet", "Veteran", "Deep roster, most sustains and DPS slots already covered. Pull for niches and upgrades, not bodies.", "yangyang-xuanling",
      "Phase 2 holds the patch's strongest single pull — a top-tier Havoc carry — provided you can field her Chisa / Suisui status shell around her.",
      "Only-if conditions: Lily's S2 if her slot is your main upgrade; Sigrika only if Echo is your main team. Can't field Xuanling's shell? Then 3.8 is a save version for you."),
  ];

  const verdicts = FIVE_STARS.map(info);

  return (
    <>
      <PageHero kicker={<>Version {bannerMeta.version} · Pull strategy</>} title="Pull Planner">
        Who to pull, answered per account type. Every pick traces to a
          verified pull verdict on this site, and each one shows whether its
          banner is still running.
      </PageHero>

      <section className="pp-section" aria-labelledby="pp-sched-h">
        <h2 id="pp-sched-h" className="pp-h">Where the version stands</h2>
        <PhaseTrack phases={phases} builtAt={BUILT_AT} next={nextVersion} />
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
          <details className="pp-q" open>
            <summary>
              <span className="pp-q-n">01</span>
              <span className="pp-q-t">Pull Lily or save for Phase 2?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>What Lily is:</strong> a 5-star Spectro Pistols
                  healer/support whose buffs are strongest in Unison and Echo
                  Skill teams — kit confirmed at the Nov 6 broadcast, numbers
                  still beta until launch.
                </li>
                <li>
                  <strong>Pull Lily if:</strong> you run Unison or Echo teams,
                  or you lack a premium sustain. Her S2 is the breakpoint that
                  makes her universal.
                </li>
                <li>
                  <strong>Save for Phase 2 if:</strong> Shorekeeper already
                  covers you and what you actually want is a carry —
                  Yangyang: Xuanling (Dec 3) is the patch&apos;s strongest DPS,
                  with Suisui and Hiyuki beside her.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/lily">Lily verdict</Link> ·{" "}
                <Link href="/characters/yangyang-xuanling">Xuanling verdict</Link>
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
                  <strong>Make it count:</strong> <strong>Lily</strong> — the
                  support who fits the most teams, and the only Phase 1 pull
                  that needs nothing else to work.
                </li>
                <li>
                  <strong>The Echo exception:</strong> Sigrika is a top Aero
                  DPS only inside Echo Skill teams, and her best version
                  needs Qiuyuan as well — two guarantees, not one.
                </li>
                <li>
                  <strong>Phase 1 value order:</strong> Lily &gt; Sigrika
                  (with Qiuyuan) &gt; Qiuyuan alone, for most accounts.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/lily">Lily verdict</Link> ·{" "}
                <Link href="/characters/sigrika">Sigrika verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">03</span>
              <span className="pp-q-t">Do I need the Sigrika / Qiuyuan reruns?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>Sigrika:</strong> “top Aero DPS for dedicated Echo
                  Skill compositions” — and her damage drops significantly
                  outside them.
                </li>
                <li>
                  <strong>Qiuyuan is the enabler:</strong> a niche but strong
                  Echo-Skill buffer who elevates Sigrika, Phrolova, and
                  Galbrena — without needing his signature weapon.
                </li>
                <li>
                  <strong>Skip both if:</strong> you already have Lucilla, who
                  covers Qiuyuan&apos;s niche more consistently, or Echo teams
                  aren&apos;t your thing.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/sigrika">Sigrika verdict</Link> ·{" "}
                <Link href="/characters/qiuyuan">Qiuyuan verdict</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">04</span>
              <span className="pp-q-t">What about Lullaby — pull the weapon banner?</span>
              <Availability start={p1?.startsAt ?? null} end={p1?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>The math is friendly:</strong> the weapon banner has
                  no 50/50 — Lullaby is guaranteed within 80 pulls.
                </li>
                <li>
                  <strong>But sequences first:</strong> for most accounts,
                  Lily&apos;s S2 (which makes her universal) is the better
                  spend than her signature. Lullaby is nice to have, not
                  needed.
                </li>
                <li>
                  <strong>Budget option:</strong> Cadenza (4-star) is the
                  recommended cheap pick; Static Mist also works.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/lily">Lily verdict &amp; pull guide</Link>
              </p>
            </div>
          </details>
          <details className="pp-q">
            <summary>
              <span className="pp-q-n">05</span>
              <span className="pp-q-t">What&apos;s coming in Phase 2?</span>
              <Availability start={p2?.startsAt ?? null} end={p2?.endsAt ?? null} builtAt={BUILT_AT} />
            </summary>
            <div className="pp-q-body">
              <ul className="og-q-list">
                <li>
                  <strong>Yangyang: Xuanling</strong> — one of the strongest
                  DPS units in the game and the premier Havoc Bane carry. She
                  wants Chisa and Suisui around her to unlock her full
                  potential.
                </li>
                <li>
                  <strong>Suisui</strong> — the premier Negative Status
                  support, essential for Chafe, Bane, Flare, and Rage teams —
                  and the piece that completes Xuanling&apos;s shell.
                </li>
                <li>
                  <strong>Hiyuki</strong> — the elite Glacio hypercarry and
                  the best payoff for the Chafe mechanic; she wants Chafe
                  enablers like Lucilla or Chisa around her.
                </li>
                <li>
                  <strong>Bottom line:</strong> Phase 2 (Dec 3 – Dec 21) is a
                  carry patch. If Phase 1 offers you nothing, this is what
                  your Astrite is waiting for.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/yangyang-xuanling">Xuanling verdict</Link> ·{" "}
                <Link href="/characters/suisui">Suisui verdict</Link> ·{" "}
                <Link href="/characters/hiyuki">Hiyuki verdict</Link>
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
        All picks trace to the verified pull verdicts above. Lily&apos;s verdict
        was published Nov 6, 2026 from broadcast-confirmed info; her kit numbers
        stay labelled beta until the Nov 12 launch check. All dates are server
        time (UTC+8).
      </p>
      <UpdatedStamp />
    </>
  );
}

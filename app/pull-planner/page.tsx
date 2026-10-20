import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ObsidianSectionHead from "../../components/ObsidianSectionHead";
import ObsidianToolbar from "../../components/ObsidianToolbar";
import OgPageHero from "../../components/OgPageHero";
import Reveal from "../../components/Reveal";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeBanners, upcomingBanners, bannerMeta, formatServerDate } from "../../lib/data";
import { getCharacter } from "../../lib/characters";
import { getPrefarmGuide } from "../../lib/prefarm";

export const metadata: Metadata = {
  title: "Pull Planner — Who to Pull in Version 3.7",
  description:
    "Version 3.7 pull planner: pull Hsin or save for Suoming, F2P guarantee priorities, whether Lynae and Lucilla are worth it, and whether to save for Lily in 3.8 — every pick traced to a verified pull verdict.",
  alternates: { canonical: "/pull-planner" },
};

const FIVE_STARS = ["hsin", "iuno", "chisa", "suoming", "lynae", "lucilla"] as const;

type FiveStarSlug = (typeof FIVE_STARS)[number];

function getVerdict(slug: FiveStarSlug) {
  const char = getCharacter(slug);
  if (!char) throw new Error(`pull-planner: missing character record for ${slug}`);
  return {
    name: char.name,
    slug,
    label: char.pull_verdict.verdict_label,
    text: char.pull_verdict.verdict,
    prerelease: char.pull_verdict.uncertain_or_prerelease,
    published: char.pull_verdict.published_at,
  };
}

function PickRow({ slug, note }: { slug: FiveStarSlug; note: string }) {
  const v = getVerdict(slug);
  return (
    <div className="og-pick-row">
      <Image
        src={`/images/chars/${v.slug}.webp`}
        alt={`${v.name} portrait`}
        width={64}
        height={64}
        className="og-pick-portrait"
      />
      <div className="og-pick-body">
        <p className="og-pick-name">
          <Link href={`/characters/${v.slug}`}>{v.name}</Link>
          {v.prerelease && <span className="og-badge">pre-release data</span>}
        </p>
        <p className="og-pick-why">{note}</p>
        <p className="og-pick-verdict">
          <span className="og-badge">{v.label}</span>
        </p>
      </div>
    </div>
  );
}

function ProfileCard({
  title,
  profile,
  pick,
  note,
  also,
  delay,
}: {
  title: string;
  profile: string;
  pick: FiveStarSlug;
  note: string;
  also: React.ReactNode;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <section className="og-pick-card" aria-label={`${title} pull plan`}>
        <h3>
          <span className="og-kicker-dim">{title}</span>
        </h3>
        <p className="og-pick-desc">{profile}</p>
        <p className="og-pick-label">Ranked pick</p>
        <PickRow slug={pick} note={note} />
        <div className="og-pick-also">{also}</div>
      </section>
    </Reveal>
  );
}

function QuestionCard({
  question,
  title,
  delay,
  children,
}: {
  question: string;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={delay}>
      <section className="og-pick-card" aria-label={title}>
        <span className="og-kicker-dim">{question}</span>
        <h3>{title}</h3>
        <div className="og-pick-desc">{children}</div>
      </section>
    </Reveal>
  );
}

export default function PullPlannerPage() {
  const phase1 = activeBanners.find((b) => b.id === "3.7-phase-1");
  const phase2 = upcomingBanners.find((b) => b.id === "3.7-phase-2");

  const phase2Start = phase2 ? formatServerDate(phase2.startsAt) : "Oct 22, 2026";
  const phase1End = phase1 ? formatServerDate(phase1.endsAt) : "Oct 22, 2026";

  return (
    <>
      <OgPageHero
        kicker={`Version ${bannerMeta.version} · Pull strategy`}
        title="Pull planner"
        lede="Who to pull while 3.7 runs, answered per account type. Every pick below is traced to a verified pull verdict on this site — nothing is invented, and pre-release picks (Suoming) are marked as uncertain until launch-day numbers land."
        meta={
          <UpdatedStamp />
        }
      />

      <ObsidianToolbar
        label="Pull planner sections"
        items={[
          { href: "#schedule", label: "Schedule" },
          { href: "#questions", label: "Big questions" },
          { href: "#accounts", label: "By account" },
          { href: "#verdicts", label: "All verdicts" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead id="schedule" title="Banner schedule" />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Phase 1 banners">
              <span className="og-kicker">Phase 1 · live now</span>
              <h3>Ends {phase1End} (server time)</h3>
              <p className="og-pick-desc">
                5-stars: <strong>Hsin</strong> (new, Electro Main DPS),{" "}
                <strong>Iuno</strong> (rerun, Aero Support), <strong>Chisa</strong>{" "}
                (rerun, Havoc Support). 4-star rate-ups: Buling, Taoqi, Youhu.
              </p>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Phase 2 banners">
              <span className="og-kicker">Phase 2 · starts {phase2Start}</span>
              <h3>Starts {phase2Start} (server time)</h3>
              <p className="og-pick-desc">
                5-stars: <strong>Suoming</strong> (new, Sub-DPS / Support),{" "}
                <strong>Lynae</strong> (rerun), <strong>Lucilla</strong> (rerun).
                4-star rate-ups: Lumi, Danjin, Chixia.
              </p>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead id="questions" title="The big questions" />
        <div className="grid grid-2">
          <QuestionCard question="Question 1" title="Pull Hsin or save for Suoming?" delay={0}>
            <>
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
                  <strong>Skipped Hsin?</strong> Save and wait: Suoming’s
                  numbers are still pre-release data.
                </li>
              </ul>
              <p className="og-q-links">
                <Link href="/characters/hsin">Hsin verdict</Link> ·{" "}
                <Link href="/characters/suoming">Suoming verdict</Link>
              </p>
            </>
          </QuestionCard>
          <QuestionCard question="Question 2" title="F2P with one guarantee: who?" delay={70}>
            <>
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
            </>
          </QuestionCard>
          <QuestionCard question="Question 3" title="Do I need the Lynae / Lucilla reruns?" delay={0}>
            <>
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
            </>
          </QuestionCard>
          <QuestionCard question="Question 4" title="What about Chisa and Iuno?" delay={70}>
            <>
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
            </>
          </QuestionCard>
          <QuestionCard question="Question 5" title="Pull 3.7 Phase 2 or save for Lily (3.8)?" delay={0}>
            <>
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
            </>
          </QuestionCard>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead id="accounts" title="Pick by your account" />
        <div className="grid grid-2">
          <ProfileCard
            title="New player"
            profile="Fresh roster, everything is an upgrade. Priority is units that work everywhere and rerun rarely."
            pick="lynae"
            note="The safest rerun of 3.7 — a fresh account doesn't own her, and universal value beats a conditional DPS."
            delay={0}
            also={
              <>
                <p>
                  Runner-up: <strong>Hsin</strong> — a new Electro main DPS fills
                  the biggest hole on a fresh roster.
                </p>
              </>
            }
          />
          <ProfileCard
            title="F2P with one guarantee"
            profile="One guaranteed 5-star for the whole version. No second chances — pick the lowest-risk option."
            pick="hsin"
            note="Conditional pick: missing an Electro DPS, she's a strong pull. Electro covered? Hold everything for Lynae in Phase 2."
            delay={70}
            also={
              <>
                <p>
                  Why the condition: Lynae’s verdict (“safest rerun — pull if you
                  don’t own her”) is the floor; Hsin’s is the ceiling when you
                  need her role. Don’t spend on Iuno’s banner — third pick of
                  Phase 1.
                </p>
              </>
            }
          />
          <ProfileCard
            title="Low-spender"
            profile="Welkin / battle pass income — one to two 5-stars per version plus a signature weapon if you plan it."
            pick="hsin"
            note="Strong for accounts missing an Electro DPS — and she's the top of the Phase 1 value order (Hsin > Chisa > Iuno)."
            delay={0}
            also={
              <>
                <p>
                  Second pick: <strong>Chisa</strong> — “one of the best supports
                  for Negative Status teams”, worth it if you’re building around
                  your new Hsin. Skip <strong>Iuno</strong> unless you love Heavy
                  Attack teams — luxury for full sustain slots.
                </p>
              </>
            }
          />
          <ProfileCard
            title="Veteran"
            profile="Deep roster, most sustains and DPS slots already covered. Pull for niches and upgrades, not bodies."
            pick="chisa"
            note="Niche but excellent: worth it if you're pulling Hsin or running Negative Status squads; skip if sustain is covered."
            delay={70}
            also={
              <>
                <p>
                  Only-if conditions: <strong>Lynae</strong> only if you missed
                  her earlier (“pull her if you don’t own her”);{" "}
                  <strong>Lucilla</strong> only with Hiyuki, a Glacio DPS, or
                  Echo Skill carries — “otherwise skip: she’s niche, not a
                  generalist”.
                </p>
              </>
            }
          />
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="verdicts"
          title="Every 5-star, verdict at a glance"
          blurb="The source of truth behind every pick above. Verdicts are published per character and re-checked when banner data changes."
        />
        <div className="grid grid-2">
          {FIVE_STARS.map((slug, i) => {
            const v = getVerdict(slug);
            const hasPrefarm = Boolean(getPrefarmGuide(slug));
            return (
              <Reveal key={slug} delay={(i % 2) * 70}>
                <section className="og-pick-card" aria-label={`${v.name} pull verdict`}>
                  <div className="og-pick-row">
                    <Image
                      src={`/images/chars/${v.slug}.webp`}
                      alt={`${v.name} portrait`}
                      width={64}
                      height={64}
                      className="og-pick-portrait"
                    />
                    <div className="og-pick-body">
                      <h3 className="og-pick-name">
                        <Link href={`/characters/${v.slug}`}>{v.name}</Link>
                        {v.prerelease && (
                          <span className="og-badge">pre-release data</span>
                        )}
                      </h3>
                      <p className="og-pick-why">{v.text}</p>
                      <p className="og-pick-verdict">
                        <span className="og-badge">{v.label}</span>
                        <span className="og-pick-verdict-meta">
                          Published {v.published}
                        </span>
                      </p>
                      {hasPrefarm && (
                        <p className="og-q-links">
                          <Link href={`/pre-farm/${slug}`}>
                            Pre-farm {v.name} →
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </Reveal>
            );
          })}
        </div>
      </div>

      <p className="og-version-note">
        All picks trace to the verified pull verdicts above (published Oct
        13–14, 2026). Suoming’s recommendation uses pre-release data — wait for
        launch-day numbers unless you already pulled Hsin. All dates are server
        time (UTC+8). Phase 1 ends {phase1End}; Phase 2 begins {phase2Start}.
      </p>
    </>
  );
}

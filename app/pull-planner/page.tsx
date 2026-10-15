import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeBanners, upcomingBanners, formatServerDate } from "../../lib/data";
import { getCharacter } from "../../lib/characters";

export const metadata: Metadata = {
  title: "Pull Planner — Who to Pull in Version 3.7",
  description:
    "Version 3.7 pull planner: pull Hsin or save for Suoming, F2P guarantee priorities, and whether Lynae and Lucilla are worth it — every pick traced to a verified pull verdict.",
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
    <div className="pick-row">
      <Image
        src={`/images/chars/${v.slug}.png`}
        alt={`${v.name} portrait`}
        width={64}
        height={64}
        className="pick-portrait"
      />
      <div className="pick-body">
        <p className="pick-name">
          <Link href={`/characters/${v.slug}`}>{v.name}</Link>
          {v.prerelease && <span className="badge gold pick-caveat">pre-release data</span>}
        </p>
        <p className="pick-why">{note}</p>
        <p className="pick-verdict">
          <span className="badge gold">{v.label}</span>
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
      <section className="card profile-card" aria-label={`${title} pull plan`}>
        <h3 className="profile-title">
          <span className="profile-kicker">{title}</span>
        </h3>
        <p className="profile-desc">{profile}</p>
        <p className="profile-pick-label">Ranked pick</p>
        <PickRow slug={pick} note={note} />
        <div className="profile-also">{also}</div>
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
      <h1>Pull planner — Version 3.7</h1>
      <p className="lede">
        Who to pull while 3.7 runs, answered per account type. Every pick below
        is traced to a verified pull verdict on this site — nothing is invented,
        and pre-release picks (Suoming) are marked as uncertain until launch-day
        numbers land.
      </p>
      <div className="page-meta-row">
        <UpdatedStamp />
        <ShareButton />
      </div>

      <h2>Banner schedule</h2>
      <div className="grid grid-2">
        <Reveal>
          <section className="card" aria-label="Phase 1 banners">
            <p className="profile-kicker">Phase 1 · live now</p>
            <h3>Ends {phase1End} (server time)</h3>
            <p className="profile-desc">
              5-stars: <strong>Hsin</strong> (new, Electro Main DPS),{" "}
              <strong>Iuno</strong> (rerun, Aero Support), <strong>Chisa</strong>{" "}
              (rerun, Havoc Support). 4-star rate-ups: Buling, Taoqi, Youhu.
            </p>
          </section>
        </Reveal>
        <Reveal delay={70}>
          <section className="card" aria-label="Phase 2 banners">
            <p className="profile-kicker">Phase 2 · starts {phase2Start}</p>
            <h3>Starts {phase2Start} (server time)</h3>
            <p className="profile-desc">
              5-stars: <strong>Suoming</strong> (new, Sub-DPS / Support),{" "}
              <strong>Lynae</strong> (rerun), <strong>Lucilla</strong> (rerun).
              4-star rate-ups: Lumi, Danjin, Yangyang.
            </p>
          </section>
        </Reveal>
      </div>

      <h2>The three big questions</h2>
      <div className="grid grid-2">
        <Reveal>
          <section className="card" aria-label="Pull Hsin or save for Suoming">
            <p className="profile-kicker">Question 1</p>
            <h3>Pull Hsin or save for Suoming?</h3>
            <p className="profile-desc">
              They pair together. The Suoming verdict reads:{" "}
              <em>
                “If you pulled Hsin, Suoming is her best partner and a strong
                pull. Everyone else should wait for launch-day numbers before
                deciding.”
              </em>{" "}
              If you already have or pull Hsin, Suoming is her best partner —
              budget for both. If you skipped Hsin, save and wait: Suoming’s
              numbers are still pre-release data.{" "}
              <Link href="/characters/hsin">Hsin verdict</Link> ·{" "}
              <Link href="/characters/suoming">Suoming verdict</Link>
            </p>
          </section>
        </Reveal>
        <Reveal delay={70}>
          <section className="card" aria-label="F2P with one guarantee">
            <p className="profile-kicker">Question 2</p>
            <h3>F2P with one guarantee: who?</h3>
            <p className="profile-desc">
              Make it count. If you’re missing an Electro DPS,{" "}
              <strong>Hsin</strong> is “a strong pull for accounts missing an
              Electro DPS”. If your Electro slots are covered, hold for{" "}
              <strong>Lynae</strong> in Phase 2 — she’s “the safest rerun of 3.7”.
              The Phase 1 order of value is Hsin &gt; Chisa &gt; Iuno for most
              accounts. <Link href="/characters/hsin">Hsin verdict</Link> ·{" "}
              <Link href="/characters/lynae">Lynae verdict</Link>
            </p>
          </section>
        </Reveal>
        <Reveal>
          <section className="card" aria-label="Do I need Lynae or Lucilla">
            <p className="profile-kicker">Question 3</p>
            <h3>Do I need the Lynae / Lucilla reruns?</h3>
            <p className="profile-desc">
              Lynae: “the safest rerun of 3.7 — pull her if you don’t own her.”
              Lucilla is conditional: pull her if you run Hiyuki, a Glacio DPS,
              or Echo Skill carries — “she’s arguably their best support”.
              Otherwise she’s niche, not a generalist, and safe to skip.{" "}
              <Link href="/characters/lynae">Lynae verdict</Link> ·{" "}
              <Link href="/characters/lucilla">Lucilla verdict</Link>
            </p>
          </section>
        </Reveal>
        <Reveal delay={70}>
          <section className="card" aria-label="What about Chisa and Iuno">
            <p className="profile-kicker">Question 4</p>
            <h3>What about Chisa and Iuno?</h3>
            <p className="profile-desc">
              Chisa is “one of the best supports for Negative Status teams —
              worth it if you’re building around Hsin or status squads”.
              Iuno is Phase 1’s third pick: a flexible Aero healer/buffer, but
              “a luxury if your sustain slots are full”.{" "}
              <Link href="/characters/chisa">Chisa verdict</Link> ·{" "}
              <Link href="/characters/iuno">Iuno verdict</Link>
            </p>
          </section>
        </Reveal>
      </div>

      <h2>Pick by your account</h2>
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

      <h2>Every 5-star, verdict at a glance</h2>
      <p className="lede">
        The source of truth behind every pick above. Verdicts are published
        per character and re-checked when banner data changes.
      </p>
      <div className="grid grid-2">
        {FIVE_STARS.map((slug, i) => {
          const v = getVerdict(slug);
          return (
            <Reveal key={slug} delay={(i % 2) * 70}>
              <section className="card" aria-label={`${v.name} pull verdict`}>
                <div className="pick-row">
                  <Image
                    src={`/images/chars/${v.slug}.png`}
                    alt={`${v.name} portrait`}
                    width={64}
                    height={64}
                    className="pick-portrait"
                  />
                  <div className="pick-body">
                    <p className="pick-name">
                      <Link href={`/characters/${v.slug}`}>{v.name}</Link>
                      {v.prerelease && (
                        <span className="badge gold pick-caveat">pre-release data</span>
                      )}
                    </p>
                    <p className="pick-why">{v.text}</p>
                    <p className="pick-verdict">
                      <span className="badge gold">{v.label}</span>
                      <span className="pick-verdict-meta">
                        Published {v.published}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>

      <p className="char-version-note">
        All picks trace to the verified pull verdicts above (published Oct
        13–14, 2026). Suoming’s recommendation uses pre-release data — wait for
        launch-day numbers unless you already pulled Hsin. All dates are server
        time (UTC+8). Phase 1 ends {phase1End}; Phase 2 begins {phase2Start}.
      </p>

      <style>{`
        .profile-card { display: flex; flex-direction: column; gap: 0.4rem; }
        .profile-kicker {
          font-family: var(--mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--gold);
          margin: 0 0 0.4rem;
          text-transform: uppercase;
        }
        .profile-title { margin: 0; }
        .profile-desc { color: var(--text-2); margin: 0; }
        .profile-pick-label {
          font-family: var(--mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-3);
          margin: 0.6rem 0 0;
        }
        .pick-row { display: flex; gap: 0.8rem; align-items: flex-start; }
        .pick-portrait { border-radius: 12px; flex: none; width: 64px; height: 64px; object-fit: cover; }
        .pick-body { min-width: 0; flex: 1; }
        .pick-name { margin: 0; font-weight: 700; font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
        .pick-caveat { font-size: 0.68rem; font-weight: 700; }
        .pick-why { margin: 0.3rem 0 0.5rem; color: var(--text-2); line-height: 1.55; }
        .pick-verdict { margin: 0; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .pick-verdict-meta { font-size: 0.78rem; color: var(--text-3); }
        .profile-also { color: var(--text-2); font-size: 0.95rem; margin-top: 0.6rem; border-top: 1px solid var(--border); padding-top: 0.7rem; }
        .profile-also p { margin: 0; }
        .grid-2 .card h3 { margin-top: 0; }
      `}</style>
    </>
  );
}

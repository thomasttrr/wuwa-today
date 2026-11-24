import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import { CharPoster } from "@/components/CharThumb";
import { buildTeamsModel } from "@/lib/teams";
import "./whiwa.css";

// Cycle data lives in data/teams.json (the wastes section), farmed fresh
// after every Respawning Waters reset — this page and /teams read the same
// numbers, so they can never disagree.
const W = buildTeamsModel().wastes;

export const metadata: Metadata = {
  title: "Whimpering Wastes guide — current cycle, Golden Tokens, rewards and best teams",
  description:
    "Whimpering Wastes in Wuthering Waves: the current Respawning Waters cycle (Nov 23 – Dec 21, 2026), this reset's Golden Tokens, 800 Astrite per cycle, and the best Infinite Torrents teams per half.",
  alternates: { canonical: "/whimpering-wastes" },
};

const SECTIONS = [
  { href: "#cycle", label: "Current cycle" },
  { href: "#how", label: "How it works" },
  { href: "#rewards", label: "Rewards" },
  { href: "#tokens", label: "Golden Tokens" },
  { href: "#teams", label: "Best teams" },
];

const AREAS: [string, string, string][] = [
  [
    "Forbidden Waters — stages 1–6",
    "One-time",
    "The permanent half of the mode. Clear each stage once, bank the rewards, and it never resets — nothing here is on a timer.",
  ],
  [
    "Respawning Waters: Chasm — stages 7–11",
    "Resets every 28 days",
    "Five score stages that refresh each cycle. Your score follows your clear speed, and the point milestones pay out again every reset.",
  ],
  [
    "Respawning Waters: Infinite Torrents — stage 12",
    "Resets every 28 days",
    "The final stage, and the one the team lists below are built for. Two halves, each fought with its own team of three, chasing the highest score before the timer ends.",
  ],
];

const REWARDS: [string, string, string][] = [
  ["Forbidden Waters (stages 1–6)", "One-time", "Astrite ×800"],
  ["Respawning Waters: Chasm (stages 7–11)", "Every cycle", "Astrite ×625"],
  ["Respawning Waters: Torrents (stage 12)", "Every cycle", "Astrite ×175"],
];

const ENEMIES: [string, string, string][] = [
  [
    "1st half",
    "Starts with Concerto Energy restored to 100%.",
    "Chop Chop · Fusion Warrior · Rage Against the Statue · Snip Snap",
  ],
  [
    "2nd half",
    "Starts with Resonance Energy restored to 100%.",
    "Chop Chop · Fusion Warrior · Geospider S4 · Rocksteady Guardian",
  ],
];

export default function WhimperingWastesPage() {
  return (
    <>
      <Link href="/teams#wastes" className="og-back" transitionTypes={["nav-back"]}>
        ← Teams
      </Link>

      <PageHero
        kicker="Endgame mode · Current cycle Nov 23 – Dec 21, 2026"
        title="Whimpering Wastes"
        meta={<UpdatedStamp />}
      >
        {
          "A permanent score-attack endgame on the waters of Rinascita. Twelve stages in two halves: the first six you clear once and keep, the last six reset every 28 days with new Golden Tokens that reshape which teams win. This page tracks the current cycle — its tokens, its taxed elements, and the teams beating Infinite Torrents right now."
        }
      </PageHero>

      <ObsidianToolbar label="Jump to" items={SECTIONS} />

      <div className="og-section">
        <Reveal>
          <figure className="ww-art">
            <img
              src="/images/whimpering-wastes.webp"
              alt="Whimpering Wastes — official key art"
              width={1024}
              height={576}
              loading="lazy"
              decoding="async"
            />
            <figcaption>Whimpering Wastes — official key art.</figcaption>
          </figure>
        </Reveal>
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> unlock is{" "}
              <strong>Union Level 30</strong>. The Respawning Waters half of the
              mode reset on <strong>November 23, 2026</strong> and runs to{" "}
              <strong>December 21, 2026, 4:00 AM server time</strong>. A full
              clear pays <strong>800 Astrite every cycle</strong> — plus a
              one-time 800 from Forbidden Waters if you have never cleared it.
              This cycle&apos;s tokens push Aero, Echo Skill, Havoc Bane and
              Electro Flare teams; <strong>Fusion and Spectro teams have a
              harder run</strong>.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="cycle">
        <ObsidianSectionHead title="Current cycle — Nov 23 – Dec 21, 2026" />
        <Reveal>
          <p className="ww-p">{W.resetLine}</p>
        </Reveal>
        <Reveal>
          <ul className="ww-cards">
            {ENEMIES.map(([half, entry, foes]) => (
              <li key={half} className="ww-card">
                <p className="ww-tag">{half}</p>
                <h3>{entry}</h3>
                <p>Enemies: {foes}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="og-section" id="how">
        <ObsidianSectionHead title="How it works" />
        <Reveal>
          <ul className="ww-cards">
            {AREAS.map(([name, tag, text]) => (
              <li key={name} className="ww-card">
                <p className="ww-tag">{tag}</p>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal>
          <p className="ww-p">
            Every stage is scored on clear speed: faster clears earn more
            points, and points pay out at set milestones. Before a stage you
            pick <strong>Golden Tokens</strong> — strong buffs tied to specific
            mechanics, like Havoc Bane or Echo Skill damage. The tokens change
            every cycle, which is why the best teams change with them. In
            Infinite Torrents, tokens have unlimited uses, so the whole run is
            about building around this cycle&apos;s set.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="rewards">
        <ObsidianSectionHead title="Rewards" />
        <Reveal>
          <div className="ww-table-wrap">
            <table className="ww-table">
              <thead>
                <tr>
                  <th scope="col">Stages</th>
                  <th scope="col">When</th>
                  <th scope="col">Astrite</th>
                </tr>
              </thead>
              <tbody>
                {REWARDS.map(([stages, when, pay]) => (
                  <tr key={stages}>
                    <td>{stages}</td>
                    <td>{when}</td>
                    <td>{pay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <p className="ww-p">
            That is <strong>800 Astrite refreshed every 28-day cycle</strong>,
            and <strong>1,600 Astrite</strong> the first time you clear
            everything, counting the one-time Forbidden Waters half. Milestones
            also pay Shell Credit, tuners and upgrade materials.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="tokens">
        <ObsidianSectionHead title="Golden Tokens" blurb="This reset's big buffs." />
        <Reveal>
          <ul className="ww-cards">
            {W.tokens.map((t) => (
              <li key={t.name} className="ww-card">
                <p className="ww-tag">Golden Token</p>
                <h3>{t.name}</h3>
                <p>{t.text}</p>
              </li>
            ))}
            <li className="ww-card">
              <p className="ww-tag">Stage effect</p>
              <h3>Infinite Torrents</h3>
              <p>{W.stageEffect}</p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Harder this reset:</strong> {W.harder.text}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="teams">
        <ObsidianSectionHead title="Best teams this cycle" blurb="For Infinite Torrents, the final stage." />
        <Reveal>
          <p className="ww-p">{W.teamsLine}</p>
        </Reveal>
        {W.halves.map((half) => (
          <Reveal key={half.name}>
            <h3 className="ww-half-h">{half.name}</h3>
            <ul className="ww-teams">
              {half.teams.map((team) => (
                <li key={team.id} className="ww-team">
                  <div className="ww-team-head">
                    <h4>{team.name}</h4>
                    {team.badge ? (
                      <span className="ww-badge">{team.badge.text}</span>
                    ) : null}
                  </div>
                  <ul className="ww-members">
                    {team.members.map((m) => (
                      <li key={m.slug} className="ww-member">
                        {m.hasPage ? (
                          <Link href={`/characters/${m.slug}`}>
                            <CharPoster thumb={m.thumb} name={m.name} rarity={m.rarity} />
                          </Link>
                        ) : (
                          <CharPoster thumb={m.thumb} name={m.name} rarity={m.rarity} />
                        )}
                        <span className="ww-member-name">{m.name}</span>
                        <span className="ww-member-role">
                          {m.role} · {m.element}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="ww-how">{team.how}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal>
          <p className="ww-p">
            The same teams, with roster filtering and every other endgame mode,
            live on the <Link href="/teams#wastes">teams page</Link>. For the
            boss-rush mode, see the{" "}
            <Link href="/endstate-matrix">Endstate Matrix guide</Link>.
          </p>
        </Reveal>
      </div>

      <div className="og-section">
        <Reveal>
          <p className="ww-p ww-foot">
            Cycle data farmed and checked on November 24, 2026, the morning
            after the reset. Token effects and dates are cross-checked across
            current guides; where guides disagree on a number, this page
            leaves the number out rather than guessing.
          </p>
        </Reveal>
      </div>
    </>
  );
}

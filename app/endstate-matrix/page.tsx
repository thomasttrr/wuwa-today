import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import { eventById, formatServerDate, statusFromDates } from "@/lib/data";
import { formatServerDay } from "@/lib/dates";
import "./matrix.css";

// Phase IV's dates live in data/events.json; the wording below follows them at
// build time, so the page doesn't keep saying "opens Nov 19" after it opens.
const PHASE = eventById("endstate-matrix-adversity-vanguard");
const STATE = statusFromDates(PHASE); // "upcoming" | "active" | "ended"
const OPEN = STATE !== "upcoming";
const START_DAY = formatServerDay(PHASE.startsAt); // "Nov 19"
const START_FULL = formatServerDate(PHASE.startsAt); // "Nov 19, 2026"
const END_DAY = formatServerDay(PHASE.endsAt!); // "Dec 22"
const END_FULL = formatServerDate(PHASE.endsAt!); // "Dec 22, 2026"

export const metadata: Metadata = {
  title: "Endstate Matrix guide — Adversity Vanguard phases, rewards, buffs and teams",
  description:
    `The Endstate Matrix boss rush in Wuthering Waves: the final Adversity Vanguard phase (${START_DAY} – ${END_FULL}), the full 400-Astrite reward table, Power Circuit buffs, the boss board, and proven teams.`,
  alternates: { canonical: "/endstate-matrix" },
};

const SECTIONS = [
  { href: "#phase", label: "Current phase" },
  { href: "#how", label: "How it works" },
  { href: "#rewards", label: "Rewards" },
  { href: "#circuits", label: "Power Circuits" },
  { href: "#board", label: "The board" },
  { href: "#teams", label: "Teams" },
  { href: "#bonuses", label: "Cycle bonuses" },
];

const STABILITY: [string, string][] = [
  ["4,800 points", "Astrite ×50 · Premium Resonance Potion ×5 · Shell Credit ×60,000"],
  ["7,200 points", "Astrite ×50 · Premium Energy Core ×5 · Shell Credit ×80,000"],
  ["10,000 points", "Astrite ×50 · Premium Sealed Tube ×5 · Shell Credit ×100,000"],
];

const SINGULARITY: [string, string][] = [
  ["12,000 points", "Astrite ×50 · Premium Resonance Potion ×5 · Shell Credit ×60,000"],
  ["16,000 points", "Astrite ×50 · Premium Energy Core ×5 · Shell Credit ×80,000"],
  ["21,000 points", "Astrite ×50 · Echo Modifier ×5 · Shell Credit ×120,000"],
  ["5,000 points with 3 teams", "Astrite ×50 · Premium Sealed Tube ×15 · Shell Credit ×150,000"],
  ["5,000 points with 4 teams", "Astrite ×50 · Echo Modifier ×5 · Shell Credit ×150,000"],
  ["37,000 points", "Premium Tuner ×100 · Premium Sealed Tube ×15"],
  ["58,000 points", "Timed title “Until We Meet Again” · Rainbow Crown medal"],
  ["5,000 points with 6 teams", "Morphable Overlord Class Echo ×30 · Premium Enclosure Tank ×20"],
];

const BOARD: [string, string, string, string][] = [
  ["1", "Inferno Rider", "Fusion", "Burning damage over time on its hits — halved while your health is above 50% or you are shielded. From Round 2, standing on the ground burns too."],
  ["2", "Forbidden Bastion", "Glacio", "Dodge Counters restore 10 Resonance Energy and cut 20% of its Max Vibration Strength. From Round 2 its attack rises 30% for good."],
  ["3", "Crownless", "Havoc", "Takes 40% more total damage for 30s from whoever triggers a Unison Response on it. From Round 2 its Vibration Strength falls 20% slower."],
  ["4", "Calamity Effigy", "Aero", "Dodge Counters grant Unstoppable (up to 2 stacks, lose 1 when hit). From Round 2 its attack rises 40%, cancelled while it carries Electro Flare."],
  ["5", "Matrix Mimic", "None — equal to all", "Singularity Expansion only. Damage to it scores 1.1× points, beating it pays +1,000 points in Round 2 and up, and a kill makes your team immune to damage and interruption for 15s."],
];

const CIRCUIT_TEAMS: { circuit: string; teams: string[] }[] = [
  {
    circuit: "General Enhancement",
    teams: [
      "Luuk Herssen · Denia · Mornye",
      "Cartethyia · Ciaccona · Chisa",
      "Camellya · Roccia · Shorekeeper",
      "Carlotta · Zhezhi · Buling",
      "Jinhsi · Zhezhi · Shorekeeper",
      "Changli · Brant · Lupa",
      "Xiangli Yao · Yinlin · Shorekeeper",
      "Calcharo · Yinlin · Shorekeeper",
      "Lingyang · Zhezhi · Shorekeeper",
    ],
  },
  {
    circuit: "Enhancement: Negative Status",
    teams: [
      "Hsin · Electro Rover · Suisui — Game8's premier pick, built for Electro Flare",
      "Hiyuki · Lucilla · Chisa",
      "Yangyang: Xuanling · Chisa · Suisui",
      "Aemeath · Denia · Chisa",
      "Zani · Phoebe · Shorekeeper",
      "Phoebe · Spectro Rover · Shorekeeper",
      "Cartethyia · Ciaccona · Chisa",
      "Xiangli Yao · Yinlin · Buling",
      "Calcharo · Yinlin · Buling",
    ],
  },
  {
    circuit: "Basic DMG Enhancement",
    teams: [
      "Hsin · Jinhsi · Shorekeeper",
      "Jingran · Iuno · Shorekeeper",
      "Augusta · Iuno · Shorekeeper",
      "Sigrika · Qiuyuan · Shorekeeper",
      "Phrolova · Cantarella · Qiuyuan",
      "Galbrena · Qiuyuan · Shorekeeper",
    ],
  },
  {
    circuit: "Enhancement: Tune Break",
    teams: [
      "Lucy · Rebecca · Mornye — the only team that fully uses Tune Hack",
      "Qingxiao · Denia · Mornye",
      "Aemeath · Lynae · Mornye",
    ],
  },
];

export default function EndstateMatrixPage() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <PageHero
        kicker="Endstate Matrix · Adversity Vanguard · Endgame"
        title="Endstate Matrix"
        meta={<UpdatedStamp />}
      >
        {`The boss-rush endgame: five bosses in a row, fought with several teams while the damage carries over. This page covers the current cycle — ${
          STATE === "upcoming"
            ? `its final phase opens ${START_FULL}`
            : STATE === "active"
              ? `its final phase is live until ${END_FULL}`
              : `it ended ${END_FULL}`
        } — with the full reward table, the stage buffs, and the teams that cleared last phase.`}
      </PageHero>

      <ObsidianToolbar label="Jump to" items={SECTIONS} />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> Endstate Matrix is a boss rush across two
              zones — <strong>Stability Accords</strong> and <strong>Singularity Expansion</strong>.
              Boss health <strong>carries between your teams</strong>, and every Resonator has
              limited <strong>Vigor</strong>, so the mode rewards a deep roster. A full phase
              pays <strong>400 Astrite</strong>. The last phase of the Adversity Vanguard cycle
              runs{" "}
              <strong>
                {START_DAY} – {END_FULL}
              </strong>{" "}
              — when it ends, the cycle ends and unspent Encrypted Data is wiped.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="phase" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The current phase"
          blurb="Phase IV of Adversity Vanguard — the last phase of the cycle, and the last chance at its rewards."
        />
        <Reveal>
          <figure className="mx-art">
            <img
              src="/images/events/endstate-matrix.webp"
              alt="Endstate Matrix: Adversity Vanguard — official key art for the challenge cycle"
              width={1200}
              height={675}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Official key art for the Adversity Vanguard cycle: Kuro Games, via the official
              cycle preview.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal>
          <ul className="mx-cards">
            <li className="gk-card">
              <span className="mx-big">
                Phase IV {OPEN ? "opened" : "opens"} {START_DAY}
              </span>
              <p>
                Matrix phases open seven days after a version update, at 04:00 server time —
                the pattern all three earlier phases followed. Version 3.8 landed on Nov 12,
                so Phase IV {OPEN ? "opened" : "opens"} {START_FULL}.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">
                The cycle {STATE === "ended" ? "ended" : "ends"} {END_DAY}
              </span>
              <p>
                Kuro&apos;s 3.8 patch notes give the end exactly: December 22, 2026, 03:59
                (UTC+8). Unspent Encrypted Data is wiped, and the cycle rewards — the sigil
                and the Blade of a Thousand Arts weapon projection — become unobtainable. No
                third cycle has been announced.
              </p>
            </li>
            <li className="gk-card">
              {STATE === "upcoming" ? (
                <>
                  <span className="mx-big">Nothing is live right now</span>
                  <p>
                    Phase III ended when Version 3.8 launched on Nov 12. Between phases the
                    board is closed — your next run is Phase IV on {START_DAY}.
                  </p>
                </>
              ) : STATE === "active" ? (
                <>
                  <span className="mx-big">Phase IV is live</span>
                  <p>
                    It runs until {END_FULL}. This is the last phase of the cycle, so it is
                    your last run at its rewards.
                  </p>
                </>
              ) : (
                <>
                  <span className="mx-big">The cycle is over</span>
                  <p>
                    Phase IV closed on {END_FULL}, and the Adversity Vanguard cycle with it.
                    No third cycle has been announced.
                  </p>
                </>
              )}
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <p className="mx-note">
            One common mix-up: the reward table does <strong>not</strong> reset weekly.
            Rewards and phase tasks reset when a new phase opens — once per version. (Some
            seller blogs say weekly; Game8 and SenseOS, working from Kuro&apos;s own text,
            both say per phase.)
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="how" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="How it works"
          blurb="The rules that shape every run — unlock, zones, carried health, and Vigor."
        />
        <Reveal>
          <ul className="mx-cards mx-cards-2">
            <li className="gk-card">
              <span className="mx-big">The unlock</span>
              <p>
                Earn <strong>24 Crests in Tower of Adversity</strong> and{" "}
                <strong>3,500 points in Whimpering Wastes&apos; Infinite Torrents</strong>,
                each inside a single phase of that mode. Clear those once and the Matrix is
                open for good.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Two zones</span>
              <p>
                <strong>Stability Accords</strong> is one round of up to 3 teams.{" "}
                <strong>Singularity Expansion</strong> lets you field as many teams as you
                need across escalating rounds — Round 2 and up adds infections, and round
                score multipliers of ×1.15 and ×1.25.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Health carries over</span>
              <p>
                A boss keeps every point of damage your earlier teams dealt. A team that falls
                short still moves the next one closer — nobody&apos;s run is wasted.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Vigor</span>
              <p>
                Every Resonator carries <strong>1 Vigor</strong> and spends it by fighting.
                Healers and supports carry <strong>2</strong>, so they can fight twice. One{" "}
                <strong>Emergency Resonator</strong> each phase gets +1. Weapons and Echo sets
                lock to each Resonator for the run, and scoring pace is about{" "}
                <strong>5,000 points per team</strong>.
              </p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <p className="mx-note">
            New in 3.8 (official patch notes): you can now swap Resonators within your current
            team before starting a Matrix challenge — the same change landed in Tower of
            Adversity and Whimpering Wastes.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="rewards" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Rewards — 400 Astrite a phase"
          blurb="The same table across the cycle's phases, confirmed against Kuro's own reward pictures."
        />
        <Reveal>
          <p className="mx-note" style={{ margin: "0 0 1rem" }}>
            Counted with the other endgame modes, a version&apos;s endgame pays{" "}
            <strong>2,800 Astrite</strong>: Tower of Adversity 800, Whimpering Wastes 1,600,
            and the Matrix&apos;s 400.
          </p>
        </Reveal>
        <Reveal>
          <h3 className="mx-h3">Stability Accords — 150 Astrite</h3>
          <div className="mx-table-wrap">
            <table className="mx-table">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {STABILITY.map(([score, rewards]) => (
                  <tr key={score}>
                    <td>{score}</td>
                    <td>{rewards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <h3 className="mx-h3">Singularity Expansion — 250 Astrite</h3>
          <div className="mx-table-wrap">
            <table className="mx-table">
              <thead>
                <tr>
                  <th>Objective</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {SINGULARITY.map(([objective, rewards]) => (
                  <tr key={objective}>
                    <td>{objective}</td>
                    <td>{rewards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <h3 className="mx-h3">Cycle rewards — Encrypted Data</h3>
          <p className="mx-note" style={{ margin: "0 0 1rem" }}>
            Phase and cycle tasks pay <strong>Encrypted Data</strong>, spent on the cycle
            track: <strong>100</strong> for the sigil “Past the Endstate: Adversity Vanguard”,{" "}
            <strong>200</strong> for Premium Tuner ×300, and <strong>400</strong> for the
            weapon projection <strong>Blade of a Thousand Arts</strong>. Medals run alongside:
            Singularity medals from B at 12,000 points up to the Rainbow Crown at 58,000, plus
            cycle medals for finishing 7 Challenge Tasks and for finishing them all. Encrypted
            Data is <strong>wiped when the cycle ends on Dec 22</strong> — spend it before
            then.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="circuits" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Power Circuits"
          blurb="Each stage's buff rewards a team built to match it. Bring the team the circuit pays for, not just your strongest trio."
        />
        <Reveal>
          <p className="mx-note" style={{ margin: "0 0 1rem" }}>
            {OPEN ? (
              <>
                Phase IV&apos;s circuits went live in-game on {START_DAY} and have not been
                re-checked here yet. The four below are <strong>last phase&apos;s verified
                set</strong> (Game8); early leaks list the same four names for Phase IV.
                Check the in-game list before you build teams around them.
              </>
            ) : (
              <>
                Phase IV&apos;s circuits are published in-game when the phase opens on{" "}
                {START_DAY} — they are not out yet. The four below are{" "}
                <strong>last phase&apos;s verified set</strong> (Game8), and early leaks list
                the same four names for Phase IV. Treat the values as last phase&apos;s until
                the phase opens.
              </>
            )}
          </p>
        </Reveal>
        <Reveal>
          <ul className="mx-cards mx-cards-2">
            <li className="gk-card">
              <span className="mx-big">General Enhancement</span>
              <p>
                Enemies take 20% more total damage, and 20% more total Basic Attack damage.
                The no-conditions circuit — any strong team works.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Enhancement: Negative Status</span>
              <p>
                Targets carrying a Negative Status take 25% more total damage, plus another
                30% more Electro damage for 30s. This rotation&apos;s premier status is
                Electro Flare.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Basic DMG Enhancement</span>
              <p>
                Total Echo Skill damage +40%. Triggering a Unison Response deals 55% more
                total damage for 30s, and gaining a Shield adds 11% more damage for 2s,
                stacking to 5 — cleared when that Resonator switches out.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">Enhancement: Tune Break</span>
              <p>
                Inflicting Tunability–Shifting raises the whole team&apos;s total damage by
                25% for 30s; inflicting Hack–Shifting raises that Resonator&apos;s total
                damage by 30% for 30s.
              </p>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="og-section" id="board" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The board"
          blurb={
            OPEN
              ? "Both zones run the same boss sequence. This is last phase's verified board; Phase IV's has not been re-checked here yet."
              : "Both zones run the same boss sequence. Phase IV's list arrives with the phase — this is last phase's verified board."
          }
        />
        <Reveal>
          <div className="mx-table-wrap">
            <table className="mx-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Boss</th>
                  <th>Resists</th>
                  <th>What to know</th>
                </tr>
              </thead>
              <tbody>
                {BOARD.map(([n, boss, res, note]) => (
                  <tr key={n}>
                    <td>{n}</td>
                    <td>{boss}</td>
                    <td>{res}</td>
                    <td>{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Leaked, not confirmed:</strong> two posts from the October leak wave
              name Phase IV&apos;s board as <strong>Feilian Beringal, Denia, Crownless and
              Sigillum</strong>, plus the Matrix Mimic — and say <strong>Lucilla</strong> is
              this phase&apos;s Emergency Resonator (+1 Vigor), with phase tasks that include
              scoring 15,000 Singularity points with a team including Lily and defeating Denia
              three times. One datamine could sit behind both posts, so treat all of it as a
              rumour{" "}
              {OPEN
                ? "until it is checked against the live phase."
                : `until the phase opens on ${START_DAY}.`}
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="teams" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Teams that cleared last phase"
          blurb={
            OPEN
              ? "No proven Phase IV teams are listed here yet. These are Phase III's proven teams, and the best starting point for Phase IV."
              : "No Phase IV teams exist yet — the phase has not opened. These are Phase III's proven teams, and the best starting point for Phase IV planning."
          }
        />
        <Reveal>
          <p className="mx-note" style={{ margin: "0 0 1rem" }}>
            Game8&apos;s picks by Power Circuit (it lists a swap option for several support
            slots — Shorekeeper is the usual stand-in):
          </p>
        </Reveal>
        {CIRCUIT_TEAMS.map((group) => (
          <Reveal key={group.circuit}>
            <h3 className="mx-h3">{group.circuit}</h3>
            <ul className="mx-teams">
              {group.teams.map((team) => (
                <li key={team}>{team}</li>
              ))}
            </ul>
          </Reveal>
        ))}
        <Reveal>
          <p className="mx-note">
            A verified full clear backs the shape of these lists: one recorded run scored{" "}
            <strong>137,809 points</strong> across 9 teams in Round 3 — Phrolova · Cantarella
            · Buling; Galbrena · Lupa · Shorekeeper; Hiyuki · Lucilla · Suisui; Luuk · Lynae ·
            Verina; Jingran · Mortefi · Verina; Aemeath · Lynae · Mornye; Qingxiao · Denia ·
            Mornye; Yangyang: Xuanling · Chisa · Suisui; Hsin · Suoming · Shorekeeper.{" "}
            <a
              href="https://www.youtube.com/watch?v=RIq__HS370k"
              target="_blank"
              rel="noreferrer"
            >
              Watch the clear
            </a>
            . Phase IV teams will replace this section once real clears exist.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="bonuses" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Cycle bonuses"
          blurb="Bonuses that run for the whole Adversity Vanguard cycle, on top of each stage's circuit."
        />
        <Reveal>
          <ul className="mx-cards mx-cards-2">
            <li className="gk-card">
              <span className="mx-big">12 enhanced Resonators</span>
              <p>
                Twelve Resonators carry a bonus for the whole cycle — most deal 20–25% more
                total damage inside the Matrix, and a few add team element buffs on their
                Liberation: <strong>Jiyan, Xiangli Yao, Jinhsi, Changli, Yinlin, Zhezhi,
                Camellya, Carlotta, Roccia, Phoebe, Brant and Cantarella</strong>.
              </p>
            </li>
            <li className="gk-card">
              <span className="mx-big">The Emergency Resonator</span>
              <p>
                The +1 Vigor seat rotates by phase: <strong>Chisa</strong> in Phase I,{" "}
                <strong>Denia</strong> in Phase II, <strong>Lynae</strong> in Phase III.
                Phase IV&apos;s is leaked as <strong>Lucilla</strong> —{" "}
                {OPEN ? "not yet confirmed here." : "unconfirmed until the phase opens."}
              </p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <p className="mx-note">
            Sources: Game8&apos;s Endstate Matrix guides (mode, rewards and stage pages),
            SenseOS&apos;s cycle guide, and Kuro&apos;s official Version 3.8 patch notes for
            the cycle end date. Checked November 16, 2026.{" "}
            {OPEN
              ? `Phase IV's stages, circuits and proven teams have not been re-checked since the phase opened on ${START_FULL}.`
              : `Phase IV's stages, circuits and proven teams will be farmed and added once the phase opens on ${START_FULL}.`}
          </p>
        </Reveal>
      </div>
    </>
  );
}

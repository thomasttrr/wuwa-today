import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import "./effigy.css";

export const metadata: Metadata = {
  title: "Calamity Effigy Guide — Tactical Hologram: Sparring (Unlock, Mechanism, Rewards, Teams)",
  description:
    "The Calamity Effigy hologram fight in Wuthering Waves 3.8: how to unlock it, the Forged Might and Impeccable mechanism, all six difficulties, first-clear rewards (120 Astrite), and who to bring.",
  alternates: { canonical: "/calamity-effigy" },
};

const SECTIONS = [
  { href: "#unlock", label: "Unlock" },
  { href: "#boss", label: "The boss" },
  { href: "#mechanism", label: "The mechanism" },
  { href: "#stages", label: "Stages & rewards" },
  { href: "#teams", label: "Who to bring" },
  { href: "#tips", label: "Tips" },
];

export default function CalamityEffigyPage() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Tactical Hologram: Sparring · Mengzhou · Permanent"
        title="Calamity Effigy"
        lede="The third boss of Tactical Hologram: Sparring — a hologram rematch with Muyu's transformed form, the story boss of Chapter IV. It resists Aero, punishes slow fights, and pays 120 Astrite across six difficulties. This page covers the unlock, the Forged Might mechanism, the rewards, and who to bring."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar label="Jump to" items={SECTIONS} />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> unlock at <strong>Union Level 27</strong> after
              lighting the Four Chime Shaftpost in the main quest. Six stages, five minutes
              each, cleared in order. <strong>Do not bring an Aero damage dealer</strong> — the
              Effigy resists Aero. <strong>Do bring Electro Flare</strong> (it takes double
              damage from it) or any Negative Status applier. First clears pay{" "}
              <strong>120 Astrite in total</strong>, plus Sparring Coins, Premium Tuners, Shell
              Credits, and a Calamity Effigy icon.
            </p>
            <p>
              Not to be confused with the <strong>world boss</strong> of the same name in
              Xuanfang Hold — same enemy, different fight, different rewards. This guide is
              about the hologram.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="unlock" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="How to unlock it"
          blurb="Two gates, both from Kuro's official 3.8 posts."
        />
        <Reveal>
          <ol className="ef-steps">
            <li className="ef-step">
              <span className="ef-step-n">1</span>
              <div>
                <h3>Reach Union Level 27</h3>
                <p>
                  The same gate as the rest of the Tactical Hologram system. If the other
                  holograms are open to you, this one is too.
                </p>
              </div>
            </li>
            <li className="ef-step">
              <span className="ef-step-n">2</span>
              <div>
                <h3>Light the Four Chime Shaftpost</h3>
                <p>
                  During the main quest <strong>“The Wind Before the Storm”</strong> (Chapter IV
                  Act I), activate the Four Chime Shaftpost. The fight itself sits at the
                  simulator at <strong>Fogveil Pagoda, Eastern Xuan Peaks, Mengzhou</strong> —
                  and, like the other Sparring challenges, it can also be started from the
                  Guidebook.
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </div>

      <div className="og-section" id="boss" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Know the boss"
          blurb="An Overlord-class Autopuppet that deals Aero damage — and is built to punish Aero teams."
        />
        <Reveal>
          <ul className="ef-cards">
            <li className="ef-card">
              <span className="ef-big">High Aero RES</span>
              <p>
                The Effigy has raised resistance to Aero damage. Aero supports are fine, but an
                Aero main damage dealer will feel like hitting a wall.
              </p>
            </li>
            <li className="ef-card">
              <span className="ef-big">+100% from Electro Flare</span>
              <p>
                Its biggest weakness, straight from its in-game description: the Effigy takes
                double damage from Electro Flare. Build around it if you can.
              </p>
            </li>
            <li className="ef-card">
              <span className="ef-big">+20% under any status</span>
              <p>
                While the Effigy carries any Negative Status, it takes 20% more damage for 6
                seconds. Glacio Chafe, Spectro Frazzle, and Havoc Bane also shred its Vibration
                Strength quickly, opening up knockdowns.
              </p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <p className="ef-note">
            The fight itself is fast and aggressive — spear combos and lunges, with very little
            idle time. Five minutes per attempt, like every hologram. One more thing to plan
            around: at <strong>65% health</strong> (with about 20% of its Vibration Strength
            left) the Effigy stops, <strong>heals back to full</strong>, and Phase 2 begins
            with new moves — including a special two-part attack at 80% health. You cannot
            drain its Vibration Strength during the heal, so use that window to build energy
            instead of burning cooldowns. If you stagger it before 65%, a Jade Construct
            combo triggers instead — pushing it to 65% first skips that combo.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="mechanism" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The mechanism — stages V and VI"
          blurb="The first four stages are a straight fight. The last two add Kuro's Special Mechanism."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Forged Might → Impeccable.</strong> Your team gains{" "}
              <strong>1 stack of Impeccable every second</strong>, and each stack is worth{" "}
              <strong>+1% total damage, up to 100%</strong>. A{" "}
              <strong>Dodge Counter or Counterattack adds 10 stacks</strong> at once; a Basic
              Attack, Heavy Attack, Resonance Skill, or Echo Skill <strong>removes 2</strong>;
              a Resonance Liberation <strong>removes 10</strong>. So the rhythm is: dodge and
              counter to build stacks, then spend them on your biggest hits — and time
              Liberations for when the stack count can afford the cost.
            </p>
            <p>
              <strong>Way of the Forged Empyrean.</strong> The time-based escalation, with its
              numbers: at <strong>3 minutes</strong>, damage dealt and taken starts climbing
              every 10 seconds, up to <strong>+60%</strong>. At <strong>4 minutes</strong> it
              jumps to <strong>+100% damage dealt and taken — and healing stops working</strong>{" "}
              (100% less healing). With a 5-minute limit, the last minute is a pure damage
              race. Stalling is the one strategy this fight is designed to beat.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <p className="ef-note">
            The stack values above are the fight&apos;s own in-game mechanism text, confirmed
            by Game8&apos;s full guide (November 13, 2026) — they replaced the launch-day
            summary this page carried until then.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="stages" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Stages & rewards"
          blurb="Six difficulties, cleared in order. Rewards are first-clear only — replays are for clear times."
        />
        <Reveal>
          <div className="ef-table-wrap">
            <table className="ef-table">
              <thead>
                <tr>
                  <th scope="col">Stage</th>
                  <th scope="col">Boss level</th>
                  <th scope="col">Special mechanism</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Stage I</td>
                  <td>60</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage II</td>
                  <td>65</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage III</td>
                  <td>70</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage IV</td>
                  <td>80</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage V</td>
                  <td>90</td>
                  <td className="ef-hot">Forged Might / Impeccable + Way of the Forged Empyrean</td>
                </tr>
                <tr>
                  <td>Stage VI</td>
                  <td>100</td>
                  <td className="ef-hot">Forged Might / Impeccable + Way of the Forged Empyrean</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <p className="ef-note">
            Stage levels confirmed against Game8&apos;s stage table (November 13, 2026) —
            Stage VI at level 100 also matches player clear screens.
          </p>
        </Reveal>
        <Reveal>
          <div className="og-notice" role="note" style={{ marginTop: "1rem" }}>
            <p>
              <strong>Full clear pays 120 Astrite in total</strong> — 20 per stage — plus a{" "}
              <strong>Calamity Effigy icon</strong> and Reminiscence Echo items. The rest,
              stage by stage: <strong>Sparring Coins</strong> 300 / 300 / 400 / 400 / 400 /
              450 (<strong>2,250 total</strong>); <strong>Premium Tuners</strong> 10 / 10 / 20
              / 20 / 30 / 30; <strong>Shell Credits</strong> 30,000 rising to 60,000 (
              <strong>250,000 total</strong>); and a Calamity Effigy Echo item — 4-star at
              stages I–II, 5-star at stages III–VI. The coin and credit totals match player
              full-clear screens exactly. Two trophies pay a little more:{" "}
              <strong>Inhuman</strong> (clear any stage) for 5 Astrite, and{" "}
              <strong>The Fall of the Immortal One</strong> (clear Stage VI) for 20.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="teams" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Who to bring"
          blurb="No settled best-team list exists yet — the fight is days old. What is settled is which traits it rewards."
        />
        <Reveal>
          <ul className="ef-cards">
            <li className="ef-card">
              <h3>An Electro Flare applier</h3>
              <p>
                The single biggest lever in the fight: +100% damage taken from Electro Flare.{" "}
                <strong>Rover (Electro)</strong> and <strong>Buling</strong> both apply it.
              </p>
            </li>
            <li className="ef-card">
              <h3>A Negative Status applier</h3>
              <p>
                Any status turns on the +20% damage window; Chafe, Frazzle, and Bane teams also
                break its Vibration Strength fast. Glacio, Spectro, and Havoc status teams all
                qualify.
              </p>
            </li>
            <li className="ef-card">
              <h3>Not an Aero carry</h3>
              <p>
                Build your damage around any other element. Aero units in support slots are
                fine — it is the Aero damage itself that the resistance eats.
              </p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <p className="ef-note">
            Players are already clearing Stage VI — a Hiyuki team in under three minutes, and
            even a solo Chixia clear — so a well-built team of any non-Aero element has the
            damage. Proven team lists will be added here as they settle.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="tips" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Tips"
          blurb="The short list that actually changes clears."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Play the clock, not the boss.</strong> Five minutes, and the Way of the
              Forged Empyrean escalation makes a slow fight worse twice over — more damage
              taken, less healing. Bring damage up front instead of a stall team.
            </p>
            <p>
              <strong>Parry the round swings.</strong> In the world-boss fight (same moveset),
              Game8&apos;s advice is to parry the circular melee swings to cut Vibration
              Strength quickly — the glides and lunges are for dodging, not parrying.
            </p>
            <p>
              <strong>Never stand in front of it after a knockdown.</strong> It gets up firing a
              straight-line projectile barrage. Sidestep first, then go back in.
            </p>
            <p>
              <strong>Learn the fight on stages I–IV.</strong> The mechanism only exists at
              V–VI, so the early stages are free practice with the real moveset — and they pay
              their first-clear rewards either way.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="unknowns" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Still to confirm"
          blurb="Kept separate from the facts above, in the open."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Nothing outstanding right now.</strong> The three gaps this page
              launched with — the exact Impeccable numbers, the per-stage reward splits, and
              whether the hologram heals mid-fight — were all settled on November 13, 2026 by
              Game8&apos;s full guide, cross-checked against player clear screens (the
              2,250-coin and 250,000-credit full-clear totals match exactly). The heal is
              real: it is the Phase 2 trigger described above.
            </p>
            <p>
              Facts on this page come from Kuro&apos;s official 3.8 posts (November 10, 2026),
              Game8, and the Wuthering Waves wiki, cross-checked November 13, 2026. See also
              the <Link href="/version">3.8 version page</Link> and the{" "}
              <Link href="/teams">teams page</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

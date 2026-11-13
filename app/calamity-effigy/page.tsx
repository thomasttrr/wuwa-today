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
            idle time. Five minutes per attempt, like every hologram.
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
              <strong>Forged Might → Impeccable.</strong> In Kuro&apos;s official description,
              the fight builds stacks of <strong>Impeccable</strong> through{" "}
              <strong>Forged Might</strong> — tied to dodging and attacking — and the stacks
              raise damage as they grow. The longer stages are a race: stack the fight in your
              favour before the timer does the opposite.
            </p>
            <p>
              <strong>Way of the Forged Empyrean.</strong> A time-based escalation: the longer
              the fight runs, the more damage both sides deal — and the weaker healing becomes.
              Stalling is the one strategy this fight is designed to beat.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <p className="ef-note">
            Honest limit: no guide has published the exact stack values, cap, or duration yet —
            only Kuro&apos;s description above. This section gets the hard numbers as soon as
            they are confirmed in-game.
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
                  <td>60 †</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage II</td>
                  <td>65 †</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage III</td>
                  <td>70 †</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage IV</td>
                  <td>80 †</td>
                  <td>None — straight fight</td>
                </tr>
                <tr>
                  <td>Stage V</td>
                  <td>90 †</td>
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
            † Stage VI at level 100 is confirmed from player clears. The I–V levels follow the
            standard Sparring ladder shared by the other two bosses (Denia and Myriad Snare:
            Rustfire Chassis) and are marked until the Effigy&apos;s own table is published.
          </p>
        </Reveal>
        <Reveal>
          <div className="og-notice" role="note" style={{ marginTop: "1rem" }}>
            <p>
              <strong>Full clear pays 120 Astrite in total</strong> across the six stages, plus
              Sparring Coins, Premium Tuners, Shell Credits, a{" "}
              <strong>Calamity Effigy icon</strong>, and Reminiscence Echo items. Exact
              per-stage amounts are not published by any guide yet, so this page lists the
              confirmed totals rather than guessed splits.
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
              <strong>The exact Impeccable numbers.</strong> Per-stack values, the cap, and the
              duration are not published anywhere yet — only Kuro&apos;s summary wording. Same
              for the exact per-stage reward splits.
            </p>
            <p>
              <strong>A rumored self-heal.</strong> A few player clips appear to show the Effigy
              healing mid-fight, and the story version does heal once — but no guide has
              confirmed it for the hologram. It stays off the facts above until it is verified
              in-game.
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

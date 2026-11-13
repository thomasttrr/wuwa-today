import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import "./blocks.css";

export const metadata: Metadata = {
  title: "Lahai-Roi Blocks: Turnabout Guide — Scores, Tips & Rewards (WuWa 3.8)",
  description:
    "How Lahai-Roi Blocks: Turnabout works in Wuthering Waves 3.8: the 3,000 / 4,000 score targets, the new rotate feature, how boards jam, the tips that clear Hard mode, and the 400 Astrite rewards. Nov 19 – Dec 3, 2026.",
  alternates: { canonical: "/lahai-roi-blocks" },
};

const SECTIONS = [
  { href: "#how", label: "How it plays" },
  { href: "#new", label: "What's new" },
  { href: "#tips", label: "Tips" },
  { href: "#rewards", label: "Rewards" },
];

export default function LahaiRoiBlocksPage() {
  return (
    <>
      <Link href="/events" className="og-back">
        ← Events
      </Link>

      <OgPageHero
        kicker="Version 3.8 event · Nov 19 – Dec 3, 2026"
        title="Lahai-Roi Blocks: Turnabout"
        lede="The block-puzzle arcade game from Startorch Academy is back. You place geometric blocks on a small grid, complete rows and columns to break them, and race a score target before the board jams. This run adds the one feature players have asked for since the event first ran in 3.2: you can rotate the pieces."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar label="Jump to" items={SECTIONS} />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> unlock is Union Level 14. Each stage
              is a score race — <strong>3,000 points clears Easy, 4,000 clears
              Hard</strong> — and the only way to fail is jamming the board so a new
              piece fits nowhere. There are no star ratings and no attempt limits in
              the event guides: if a run clogs, go again. The headline reward is{" "}
              <strong>400 Astrite</strong>, and the event closes{" "}
              <strong>December 3, 2026, 03:59 server time</strong>.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="how" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="How a stage plays"
          blurb="Four rules explain the whole event."
        />
        <Reveal>
          <ol className="bl-steps">
            <li className="bl-step">
              <span className="bl-step-n">1</span>
              <div>
                <h3>You get a random set of blocks</h3>
                <p>
                  Each set is a handful of geometric pieces. Drag and place them onto
                  the grid — and with this run&rsquo;s new rotate feature, turn them
                  first if the fit is better that way.
                </p>
              </div>
            </li>
            <li className="bl-step">
              <span className="bl-step-n">2</span>
              <div>
                <h3>Complete a line to break it</h3>
                <p>
                  Fill a full horizontal row or a full vertical column and that line
                  breaks — it clears off the board and scores points. Clearing space
                  is the whole game: the board is small, and every placement either
                  works toward a line or works toward a jam.
                </p>
              </div>
            </li>
            <li className="bl-step">
              <span className="bl-step-n">3</span>
              <div>
                <h3>Place the whole set to draw the next one</h3>
                <p>
                  New blocks only spawn once every piece from the current set is on
                  the board. A piece you cannot place is not a problem you can skip —
                  it is the problem.
                </p>
              </div>
            </li>
            <li className="bl-step">
              <span className="bl-step-n">4</span>
              <div>
                <h3>Hit the target before the board jams</h3>
                <p>
                  <strong>Easy: 3,000 points. Hard: 4,000.</strong> The run ends when
                  a new piece fits nowhere. Game8&rsquo;s guide notes the game
                  usually grants one reset of your moves from your first clog, once
                  per stage run — treat it as a safety net, not a strategy (see Still
                  to confirm).
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </div>

      <div className="og-section" id="new" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="What's new in this run"
          blurb="One change, and it is the right one."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Pieces can be rotated.</strong> The 3.2 original made you place
              every block in the orientation you were given, and rotation was the
              community&rsquo;s standing request. Kuro&rsquo;s official 3.8 event
              notice confirms it is in for this run — and teases &ldquo;more hidden
              mechanics in store than meets the eye,&rdquo; so expect a wrinkle or
              two beyond the rotation. If a stage mechanic surprises you in a way
              this page doesn&rsquo;t cover, that tease is why.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="tips" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Tips that clear Hard mode"
          blurb="From Game8's event guide — the scoring habits that beat the jam."
        />
        <Reveal>
          <ul className="bl-cards">
            <li className="bl-card">
              <span className="bl-tag">Scoring</span>
              <h3>Break two lines with one piece</h3>
              <p>
                A placement that completes a row and a column at once is worth far
                more than two separate breaks — set those crossings up deliberately
                near the target, especially on Hard.
              </p>
            </li>
            <li className="bl-card">
              <span className="bl-tag">Scoring</span>
              <h3>Chain your breaks</h3>
              <p>
                Breaking lines on consecutive placements builds a combo and raises
                your score rate. When a break opens space, place the next piece to
                break again, not just to fit.
              </p>
            </li>
            <li className="bl-card">
              <span className="bl-tag">Board care</span>
              <h3>Never leave a 1×1 hole</h3>
              <p>
                The single-cell block is rare. A board dotted with one-cell holes is
                the classic jam setup — those holes almost never get filled, and
                every other piece routes around them until nothing fits.
              </p>
            </li>
            <li className="bl-card">
              <span className="bl-tag">Board care</span>
              <h3>Think in lines, not in space</h3>
              <p>
                &ldquo;Where does this fit?&rdquo; is the wrong question.
                &ldquo;Which line does this finish, or set up?&rdquo; is the right
                one. A tidy board that completes nothing still jams.
              </p>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="og-section" id="rewards" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Rewards"
          blurb="400 Astrite headline, from Kuro's official 3.8 notice."
        />
        <Reveal>
          <div className="bl-table-wrap">
            <table className="bl-table">
              <thead>
                <tr>
                  <th scope="col">Reward</th>
                  <th scope="col">Note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Astrite ×400</td>
                  <td>The reason to clear Hard on every stage</td>
                </tr>
                <tr>
                  <td>Premium Resonance Potion</td>
                  <td>Character EXP</td>
                </tr>
                <tr>
                  <td>Premium Energy Core</td>
                  <td>Weapon EXP</td>
                </tr>
                <tr>
                  <td>Premium Sealed Tube</td>
                  <td>Echo EXP</td>
                </tr>
                <tr>
                  <td>Forgery Advanced Supply – Lahai-Roi</td>
                  <td>Weapon and skill materials</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="bl-note">
            Quantities for the non-Astrite items are not published in the official
            notice or Game8&rsquo;s guide — this page lists what is confirmed rather
            than guessing counts.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="unknowns" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Still to confirm"
          blurb="Two details rest on one source each."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The one-time reset</strong> after your first clog comes from
              Game8&rsquo;s event guide only. <strong>The rotate feature</strong> is
              confirmed in Kuro&rsquo;s official 3.8 notice; Game8&rsquo;s guide had
              not been updated to mention it when this page was written (November 13,
              2026) — the event itself opens November 19, and this page will be
              rechecked against the live event.
            </p>
            <p>
              Facts on this page come from Game8&rsquo;s Lahai-Roi Blocks guide and
              Kuro&rsquo;s official 3.8 Update Content notice, cross-checked November
              13, 2026. The event is also listed on the{" "}
              <Link href="/events">events page</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

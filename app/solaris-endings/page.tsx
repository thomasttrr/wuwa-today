import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import "./solaris.css";

export const metadata: Metadata = {
  title: "Second Coming of Solaris — all 12 endings & routes (Unwritten Dreams guide)",
  description:
    "Every ending in the Second Coming of Solaris: Unwritten Dreams event: the 12 ending requirements, the two-playthrough plan, the Joint Route, the hidden Great Rover ending (2,000,000 Badges), and the rewards.",
  alternates: { canonical: "/solaris-endings" },
};

const SECTIONS = [
  { href: "#endings", label: "The 12 endings" },
  { href: "#run1", label: "Run 1" },
  { href: "#run2", label: "Run 2 — Joint Route" },
  { href: "#great-rover", label: "Great Rover" },
  { href: "#rewards", label: "Rewards" },
  { href: "#mistakes", label: "Mistakes" },
];

export default function SolarisEndingsPage() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Version 3.8 event · Second Coming of Solaris"
        title="Unwritten Dreams — all 12 endings"
        lede="A school-life sim inside Wuthering Waves: one school year as a transfer student, five stats, a badge economy, two rival organizations — and twelve endings. This page lists every ending's requirements and the two-playthrough plan that collects them all. It covers names and requirements only; it does not retell the story."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar label="Jump to" items={SECTIONS} />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The short version:</strong> you cannot get everything in one run — the
              summer route split locks you to one companion per playthrough. Plan on{" "}
              <strong>two runs</strong>: run 1 finishes one companion route, run 2 takes the
              Joint Route and harvests the rest. The whole trick is the{" "}
              <strong>Dec 2 save</strong> — save on the final day, view an ending, reload,
              view the next. Twelve endings, not twelve playthroughs.
            </p>
            <p>
              The event mode itself is <strong>permanent</strong>, but the rewards are not:
              claim them by <strong>December 21, 2026, 11:59 server time</strong>. Unlock is
              Union Level 14 plus the event quest. Total event Astrite: <strong>1,200</strong>.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="how" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="How a run works"
          blurb="The five things every ending hangs on."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Stats and people.</strong> You raise five stats (Knowledge, Thinking,
              Feeling, Aesthetics, Physique) plus Popularity, and raise each friend&rsquo;s
              Intimacy from Stranger up to <strong>Trusted</strong> — weekends and gifts do
              most of that work. <strong>School Badges</strong>, earned mainly from part-time
              jobs, are the currency: they buy stat boosters and gifts at Roccia&rsquo;s School
              Store, and two endings are gated on holding large amounts of them.
            </p>
            <p>
              <strong>The lock point.</strong> Early on you meet both organizations — the{" "}
              <strong>Student Council</strong> (Changli) and the <strong>Club Association</strong>{" "}
              (Cartethyia). At the <strong>summer break choice</strong>, joining one closes the
              other&rsquo;s route for that run. Professor Verina&rsquo;s early ambition question
              points the same way: academics and logic favor Changli&rsquo;s stats, body and
              aesthetics favor Cartethyia&rsquo;s, and reputation-and-wealth favors the badge
              path.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="endings" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The 12 endings"
          blurb="Names and requirements, grouped the way the game groups them. Both full guides (Game8 and GameWith) agree on this list, name for name."
        />
        <Reveal>
          <div className="so-table-wrap">
            <table className="so-table">
              <thead>
                <tr>
                  <th scope="col">Stat ending</th>
                  <th scope="col">Requirement at the ending choice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Academic Titan</td>
                  <td>Knowledge 850 + Thinking 600</td>
                </tr>
                <tr>
                  <td>Investment Warrior</td>
                  <td>Thinking 500</td>
                </tr>
                <tr>
                  <td>Laureate Conductor</td>
                  <td>Aesthetics 850 + Physique 600</td>
                </tr>
                <tr>
                  <td>Ace Mountaineer</td>
                  <td>Physique 500</td>
                </tr>
                <tr>
                  <td>The People&rsquo;s Teacher</td>
                  <td>Feeling 320 + pass Celestial Steed Corp&rsquo;s final evaluation</td>
                </tr>
                <tr>
                  <td>Me and Abby</td>
                  <td>The default ending — no requirements. There is no separate bad ending; this is the fallback.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <ul className="so-cards" style={{ marginTop: "1rem" }}>
            <li className="gk-card">
              <span className="so-tag">Companion · Changli</span>
              <h3>The Warmth of Fireworks</h3>
              <p>
                Changli at <strong>Trusted</strong> Intimacy, then choose her companion ending.
                Companion endings play as an extra scene alongside a main ending — you do not
                give up a stat ending to see one.
              </p>
            </li>
            <li className="gk-card">
              <span className="so-tag">Companion · Cartethyia</span>
              <h3>A Journey of Freedom</h3>
              <p>
                Cartethyia at <strong>Trusted</strong> Intimacy, then choose her companion
                ending. Same deal: an extra scene on top of your main ending.
              </p>
            </li>
            <li className="gk-card">
              <span className="so-tag">Special</span>
              <h3>Toward Tomorrow</h3>
              <p>
                <strong>Every friend at Trusted</strong> Intimacy, and pass Celestial Steed
                Corp&rsquo;s final evaluation. A run-2 goal — the Joint Route is built for it.
              </p>
            </li>
            <li className="gk-card">
              <span className="so-tag">Exclusive · 2nd run+</span>
              <h3>The Real World</h3>
              <p>
                On a repeat run, on <strong>Mar 16</strong>, choose the replay-only line{" "}
                <strong>“Yesterday, on the train…”</strong> when you meet Shorekeeper to receive
                the <strong>Handwritten Piano Score</strong>. On the final day, in her dialogue
                choose <strong>“Does that mean… going back to the original world?”</strong>,
                then <strong>“I want to go back”</strong> — the choice reappears several
                times; keep choosing it.
              </p>
            </li>
            <li className="gk-card">
              <span className="so-tag">Hidden</span>
              <h3>The Great Rover</h3>
              <p>
                Hold <strong>2,000,000 School Badges</strong>, then on <strong>Dec 1</strong>{" "}
                talk to <strong>Phoebe</strong> and choose{" "}
                <strong>“Buy out this school before Celestial Steed Corp does.”</strong> The
                full amount is spent on the purchase. Full plan below.
              </p>
            </li>
            <li className="gk-card">
              <span className="so-tag">Hidden</span>
              <h3>School Idol</h3>
              <p>
                Reach <strong>50,000+ Popularity</strong>, then on <strong>Dec 1</strong> talk
                to <strong>Buling</strong> and choose{" "}
                <strong>“Use my influence to help with student recruitment.”</strong>
              </p>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="og-section" id="run1" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Run 1 — one companion, done properly"
          blurb="Your first year sets up everything the second year harvests."
        />
        <Reveal>
          <ol className="so-steps">
            <li className="so-step">
              <span className="so-step-n">1</span>
              <div>
                <h3>Pick one companion and commit</h3>
                <p>
                  Changli (Student Council, Knowledge/Thinking) or Cartethyia (Club Association,
                  Aesthetics/Physique). Join their org at the summer split, clear their route
                  nodes, and stack their two key stats — the 850-threshold endings are
                  unforgiving of spread-out stats.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">2</span>
              <div>
                <h3>Max your companion to Trusted</h3>
                <p>
                  Gifts plus weekend outings. Finishing their route also earns a carry-over
                  item that starts them at higher Intimacy next run.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">3</span>
              <div>
                <h3>Invest in Chisa, Phoebe, and Buling</h3>
                <p>
                  Every Trusted friend pays you back in run 2, but these three pay most: Chisa
                  and Phoebe boost badge earning, and Buling — once Trusted — can be
                  commissioned for a publicity thread (100,000 Badges) that grants a large
                  Popularity carry-over for the School Idol ending.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">4</span>
              <div>
                <h3>Finish the year and bank the Memento</h3>
                <p>
                  Completing a run grants carry-over Mementos — the Graduation Yearbook alone
                  gives a large stat boost and <strong>200,000 Badges</strong> at the start of
                  run 2 — and unlocks Advanced Activities, including the best badge job.
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </div>

      <div className="og-section" id="run2" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Run 2 — the Joint Route harvest"
          blurb="Only available after a finished run. Six dates decide almost everything."
        />
        <Reveal>
          <ol className="so-steps">
            <li className="so-step">
              <span className="so-step-n">Mar 16</span>
              <div>
                <h3>The Piano Score — missable</h3>
                <p>
                  Meeting Shorekeeper, pick <strong>“Yesterday, on the train…”</strong> — the
                  replay-only option. Miss it and The Real World is locked for the whole run.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">Mar 18</span>
              <div>
                <h3>Set the ambition</h3>
                <p>
                  If you are going for The Great Rover this run, answer Verina with{" "}
                  <strong>“A Distinguished Reputation and Great Wealth”</strong> — it points
                  your priorities at Badges and Popularity.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">May 23</span>
              <div>
                <h3>Centennial Festival scratch cards</h3>
                <p>Open all of them — free items, no reason to leave any unscratched.</p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">Jul 6</span>
              <div>
                <h3>Join BOTH organizations</h3>
                <p>
                  The Joint Route branch: balance both orgs and complete{" "}
                  <strong>all 9 Journey Nodes</strong>, aiming for all stats toward S and{" "}
                  <strong>Trusted with both Changli and Cartethyia</strong> — this is also the
                  road to Toward Tomorrow.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">Dec 1</span>
              <div>
                <h3>The two farewell-day choices</h3>
                <p>
                  <strong>Phoebe</strong> — buy the school (needs the 2,000,000 Badges in hand).{" "}
                  <strong>Buling</strong> — the recruitment choice (needs 50,000+ Popularity).
                  Both unlock their hidden endings for the final choice.
                </p>
              </div>
            </li>
            <li className="so-step">
              <span className="so-step-n">Dec 2</span>
              <div>
                <h3>SAVE before you choose</h3>
                <p>
                  Make the save first. Then view an ending, reload, and view the next — every
                  unlocked ending from the one run: the stat endings you qualify for, both
                  companion scenes, and the specials.
                </p>
              </div>
            </li>
          </ol>
        </Reveal>
      </div>

      <div className="og-section" id="great-rover" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The Great Rover badge plan"
          blurb="2,000,000 Badges is the event's grind — here is the efficient version."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Spam Cashier Duty.</strong> The Family Restaurant&rsquo;s advanced job
              pays the best Badge rate in the event, and it unlocks as an Advanced Activity
              after your first completed run — one more reason this ending is a run-2 job.
              Run it with Chisa&rsquo;s and Phoebe&rsquo;s Intimacy bonuses active, and use
              fatigue-reduction items to fit in more shifts; weekends stay for people.
            </p>
            <p>
              <strong>Hit 2,000,000 by Nov 2 and do not spend.</strong> Nov 2 is the last
              free-action day before the final exams. From there your balance must never dip
              below 2,000,000 — the Dec 1 purchase takes the full amount. The shop restocks
              every Monday; patch your stats with items instead of spending badge time on
              classes.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="rewards" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Rewards"
          blurb="1,200 Astrite in total, from the event objectives — limited-time until Dec 21, even though the mode stays."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>The headline items:</strong> the <strong>Graduation Season</strong>{" "}
              sigil (complete 14 limited-time tasks), the <strong>Between Classes</strong>{" "}
              avatar, <strong>Selfie Pose: Salute</strong> and{" "}
              <strong>Selfie Expression: Cool</strong>, the <strong>School Headlines</strong>{" "}
              photo frame, plus tuners, Echo modifiers, sealed tubes, and Shell Credit.
            </p>
            <p>
              <strong>Three rewards hang on endings and milestones:</strong> The Real World
              ending awards the <strong>Between Classes</strong> avatar; each companion ending
              (Fireworks, Freedom) pays Premium Sealed Tubes and Shell Credit; and passing
              Celestial Steed Corp&rsquo;s final evaluation pays the Salute pose and Cool
              expression. The rest comes from the objectives list as you play.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="mistakes" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Mistakes that lock endings out"
          blurb="Every one of these costs a run if it happens."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Wrong org at the summer split (run 1).</strong> It closes the other
              companion&rsquo;s route for that run — there is no way back in.
            </p>
            <p>
              <strong>Skipping the Mar 16 Shorekeeper line (run 2).</strong> No Piano Score,
              no The Real World — for the entire run.
            </p>
            <p>
              <strong>Dipping below 2,000,000 Badges.</strong> One shopping trip in November
              can quietly kill The Great Rover.
            </p>
            <p>
              <strong>Leaving Buling and Popularity until December.</strong> School Idol needs
              50,000+ Popularity <em>and</em> the Dec 1 choice — December is too late to build
              either.
            </p>
            <p>
              <strong>Overwriting your only save after choosing an ending.</strong> Without
              the Dec 2 save, every other ending costs another playthrough.
            </p>
            <p>
              <strong>Spreading stats evenly on run 1.</strong> The 850-threshold endings —
              and possibly the final evaluation — need stacked stats, not balance.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="unknowns" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Still to confirm"
          blurb="Small print that rests on one guide, kept in the open."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Toward Tomorrow&rsquo;s fine print.</strong> Game8&rsquo;s guide adds
              that Abby counts toward &ldquo;every friend&rdquo; (her Intimacy rises only
              through specific dialogue choices) and Shorekeeper does not. The core condition —
              all friends Trusted plus passing the evaluation — is confirmed by both guides;
              the fine print is Game8 only for now.
            </p>
            <p>
              <strong>Per-objective reward splits</strong> come from Game8&rsquo;s objectives
              list; the 1,200 Astrite total itself is from Kuro&rsquo;s official event
              preview. And a warning against a rumour: one Game8 route page mentions
              &ldquo;four Abby endings&rdquo; — both complete ending lists show exactly one
              (&ldquo;Me and Abby&rdquo;), so this page follows the lists.
            </p>
            <p>
              Facts on this page come from Game8 and GameWith&rsquo;s ending guides,
              cross-checked November 13, 2026, against Kuro&rsquo;s official 3.8 event
              preview. The event itself is listed on the <Link href="/events">events page</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

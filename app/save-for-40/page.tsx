import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Save for 4.0 — what's left to earn in 3.8, and what a guarantee costs",
  description:
    "A plain saving guide for the rest of Version 3.8: the official-notice Astrite still on the table, what a guaranteed limited Resonator costs in pulls and Astrite, and the Phase 2 choice — pull the Dec 3 reruns or save for 4.0.",
  alternates: { canonical: "/save-for-40" },
};

export default function SaveFor40Page() {
  return (
    <>
      <Link href="/version" className="og-back" transitionTypes={["nav-back"]}>
        ← Version overview
      </Link>

      <PageHero kicker="Guide · Saving for 4.0" title="Save for 4.0">
        What is still on the table in the rest of 3.8, what a guaranteed
        limited Resonator actually costs, and the one choice Phase 2 asks of
        you. This is a plain guide page — no calculator, no planner, nothing
        to type in. The pull advice is labelled as ours. Version 4.0 itself
        is official now — Kuro revealed it on November 17 and it launches
        December 22; what is still leak material is the banner order and the
        kit details.
      </PageHero>

      <ObsidianToolbar
        label="On this page"
        items={[
          { href: "#still-to-earn", label: "Still to earn in 3.8" },
          { href: "#guarantee-cost", label: "What a guarantee costs" },
          { href: "#phase-2-choice", label: "The Phase 2 choice" },
          { href: "#sources", label: "Sources" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="still-to-earn"
          title="What you can still earn in the rest of 3.8"
          blurb="Official-notice figures only — the events still to come and the compensation Kuro has announced. We do not publish a single full-version free-to-play total: the trackers disagree with each other, so any one number would be a guess dressed as a fact."
        />
        <div style={{ overflowX: "auto" }}>
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Source</th>
                <th scope="col">Astrite</th>
                <th scope="col">Tides</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style={{ color: "var(--rs-ink)" }}>
                    Remaining 3.8 events + announced compensation
                  </strong>
                </td>
                <td>2,900</td>
                <td>5 Radiant Tide</td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: "var(--rs-ink)" }}>
                    WUTHERINGGIFT code
                  </strong>{" "}
                  (still active — see the codes on the home page)
                </td>
                <td>350 Astrite value, counting the code&apos;s rewards</td>
                <td>—</td>
              </tr>
              <tr>
                <td>
                  <strong style={{ color: "var(--rs-ink)" }}>Total</strong>
                </td>
                <td>
                  <strong style={{ color: "var(--rs-ink)" }}>3,250</strong>{" "}
                  Astrite, counting the code
                </td>
                <td>
                  <strong style={{ color: "var(--rs-ink)" }}>
                    + 5 Radiant Tide
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="og-section-blurb">
          Five Radiant Tides are five pulls on a limited banner before you
          spend a single Astrite. Dailies, weeklies and anything already in
          your bag are on top of this — count those yourself in game, because
          they depend on your account.
        </p>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="guarantee-cost"
          title="What a guaranteed limited character costs"
          blurb="From the game's published Convene rules — Kuro's own Convene Details notice, cross-checked against two independent explainers. These are ceilings, not averages: most players pay less, nobody pays more."
        />
        <div style={{ overflowX: "auto" }}>
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Rule</th>
                <th scope="col">Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cost of one pull</td>
                <td>160 Astrite (one Radiant Tide)</td>
              </tr>
              <tr>
                <td>Base 5-star rate</td>
                <td>0.8% per pull (1.8% average, counting the guarantee)</td>
              </tr>
              <tr>
                <td>A 5-star is guaranteed within</td>
                <td>80 pulls — 12,800 Astrite</td>
              </tr>
              <tr>
                <td>
                  The featured Resonator is a 50/50 — lose it and the next
                  5-star is guaranteed to be the featured one
                </td>
                <td>
                  Worst case 160 pulls —{" "}
                  <strong style={{ color: "var(--rs-ink)" }}>
                    25,600 Astrite
                  </strong>{" "}
                  from zero pity with no guarantee saved
                </td>
              </tr>
              <tr>
                <td>A featured 5-star weapon</td>
                <td>
                  Always the featured weapon — guaranteed within 80 pulls
                  (12,800 Astrite), no 50/50
                </td>
              </tr>
              <tr>
                <td>Pity carries over</td>
                <td>
                  Yes — pulls and a saved guarantee carry between limited
                  Resonator banners, including from 3.8 into 4.0. Weapon
                  pity is a separate count.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="og-section-blurb">
          One honest gap: Kuro does not publish where the 5-star rate starts
          rising near the cap (players call it soft pity). Any exact pull
          number for it comes from player tracking, not from Kuro — so plan
          on the 80 and 160 ceilings above, and treat anything earlier as a
          bonus.
        </p>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="phase-2-choice"
          title="The Phase 2 choice: pull Dec 3, or save?"
          blurb="Phase 2 is official: Yangyang: Xuanling, Suisui and Hiyuki rerun from Dec 3 — kits, weapons and pre-farm are on the Phase 2 page. The 4.0 side is official too — revealed November 17, launching December 22 — but its banner order is still unannounced."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>About the 4.0 side:</strong> <strong>Anna</strong> is
              official — Kuro revealed Version 4.0 on November 17,
              drip-marketed Anna on November 18 and Lucielle on November 19,
              and the version launches December 22. What Kuro has{" "}
              <strong>not</strong> announced is the banner order: Anna in
              Phase 1 and Lucielle in Phase 2 is still{" "}
              <strong>leaks-page material, not fact</strong>, and so are their
              elements, weapons, and kits. The evidence, graded, is on our{" "}
              <Link href="/leaks">leaks page</Link> and the{" "}
              <Link href="/version-4-0">Version 4.0 page</Link>.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-2" style={{ marginTop: "1rem" }}>
          <Reveal>
            <section className="og-pick-card" aria-label="Pull in Phase 2">
              <span className="rs-kicker">Our take · editorial</span>
              <h3>Pull in Phase 2 if…</h3>
              <ul className="og-q-list">
                <li>
                  <strong>Suisui would complete a team you already play.</strong>{" "}
                  She is the support of the three — the pick most likely to
                  lift an existing roster rather than start a new one.
                </li>
                <li>
                  You already have the pulls banked{" "}
                  <strong>and</strong> a guarantee or high pity saved, so a
                  Phase 2 pull does not spend the 4.0 fund.
                </li>
                <li>
                  One of the three is simply a favourite. Favourites outlast
                  version cycles; hype does not.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Save for 4.0">
              <span className="rs-kicker">Our take · editorial</span>
              <h3>Save for 4.0 if…</h3>
              <ul className="og-q-list">
                <li>
                  You are <strong>below the 160-pull worst case</strong>{" "}
                  (25,600 Astrite) with no guarantee saved, and a new-version
                  Resonator is the one thing you know you want.
                </li>
                <li>
                  The remaining 3.8 earnings above — about 3,250 Astrite plus
                  5 Radiant Tides — still leave you short. Phase 2 pulls now
                  would be paid for out of the 4.0 fund.
                </li>
                <li>
                  None of the three reruns fixes a team you actually run.
                  Reruns come back; a launch banner&apos;s first run is the
                  cheapest time to plan for it.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
        <p className="og-section-blurb">
          Full Phase 2 detail:{" "}
          <Link href="/phase-2">Phase 2 rerun banners (Dec 3)</Link>.
        </p>
      </div>

      <p className="og-version-note" id="sources">
        Sources, checked Nov 19, 2026: Kuro Games&apos; Version 3.8 notices
        (event rewards and compensation) for the earnings figures; Kuro&apos;s
        published Convene Details (0.8% base rate, 1.8% average, 5-star within
        80, featured 50/50, weapon guarantee) cross-checked against
        GamesChart&apos;s and Keygold&apos;s pity explainers, both read Nov
        19, 2026. The 2,900 Astrite + 5 Radiant Tide figure is events plus
        compensation only — no full-version free-to-play total is published
        here because sources disagree on one.
      </p>
    </>
  );
}

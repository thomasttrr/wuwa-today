import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Graphics settings — 120 FPS, ray tracing, DLSS, FSR & XeSS hardware rules",
  description:
    "Wuthering Waves graphics options and hardware rules: 120 FPS, ray tracing, DLSS frame generation, FSR, XeSS, mobile frame generation and console modes.",
  alternates: { canonical: "/graphics-settings" },
};

interface Row {
  option: string;
  where: string;
  needs: string;
  since: string;
}

const ROWS: Row[] = [
  {
    option: "120 FPS",
    where: "PC, Mac",
    needs:
      "PC: a supported card and processor — NVIDIA RTX 30, 40 and 50 cards from the RTX 3060 up, RTX 20 cards from the 2070 up, and AMD RX 6600 XT and up. Mac: M3 Pro, M3 Max, M4 or M4 Pro. Kuro warns 120 FPS can cause performance problems, glitches or hardware errors on some hardware — if it does, switch it off.",
    since: "1.2 (PC), 2.2 (Mac)",
  },
  {
    option: "Ray tracing",
    where: "PC",
    needs:
      "NVIDIA RTX 20 (2070 and up), RTX 30 (3060 and up), RTX 40 or RTX 50 cards; AMD and Intel cards with ray tracing hardware and 10 GB or more of video memory (some AMD models are excluded); AMD RX 9000 series since 3.1, with Adrenalin driver 25.10.2 or newer. Kuro warns ray tracing adds a lot of load — pick a level your device can carry.",
    since: "2.1, widened in 2.3 and 3.1",
  },
  {
    option: "DLSS frame generation",
    where: "PC, DirectX 12",
    needs:
      "RTX 40 cards and up. RTX 50 cards get DLSS 4 multi frame generation at 2x to 4x, and DLSS 4.5 adds 5x and 6x on RTX 50 (driver 595.97 or newer). Needs Windows hardware-accelerated GPU scheduling switched on.",
    since: "2.1, 2.6, 3.6",
  },
  {
    option: "FSR 3 frame generation",
    where: "PC, DirectX 12",
    needs: "AMD RX 6000 cards and newer. RX 5000 cards get FSR 3 upscaling without frame generation.",
    since: "2.6",
  },
  {
    option: "XeSS frame generation",
    where: "PC, DirectX 12",
    needs:
      "XeSS 2 frame generation on every discrete Intel card. XeSS 3 runs at 2x, 3x or 4x on Intel Arc A and B series, DG1, and Iris Xe or Arc integrated graphics.",
    since: "2.6, 3.5",
  },
  {
    option: "Mobile frame generation",
    where: "Phones",
    needs:
      "Listed chips only. Vendor frame generation: Snapdragon 8 Elite; Dimensity 9400 and 9400+ (Vulkan on) and Snapdragon 8 Gen 5. Kuro's own frame generation is a beta that started on the Snapdragon 8s Gen 4, with the 8 Gen 3 and 8 Gen 2 planned; Snapdragon 8 Gen 5 joined in 3.6 and Dimensity 9300 / 9300+ in 3.7.",
    since: "2.3, 3.0, 3.3, 3.6, 3.7",
  },
  {
    option: "Graphics Quality: Performance or Quality",
    where: "PS5 Pro, Xbox Series X",
    needs:
      "A choice under Settings, Graphics, Graphics Quality: Performance favours a smoother game, Quality a sharper picture. Not available on the standard PS5 or the Xbox Series S. Kuro has not published the frame rate or resolution of either mode.",
    since: "3.8",
  },
  {
    option: "PSSR",
    where: "PS5 Pro",
    needs:
      "PlayStation Spectral Super Resolution, toggled under Settings, Graphics, PSSR. Kuro says it makes the image clearer at display resolutions up to 4K.",
    since: "3.8",
  },
  {
    option: "Render Distance slider",
    where: "PC",
    needs:
      "A slider from 1 to 10 replaces the old Default, Far and Farthest presets — higher values draw the world further out. The presets themselves arrived in 3.2; the slider is new in 3.8.",
    since: "3.2 presets, 3.8 slider",
  },
  {
    option: "HDR",
    where: "—",
    needs:
      "Announced for Version 3.1, then held back in the 3.1 patch notes because it had not met the required standard. No newer Kuro post gives a date — it is not in the game yet.",
    since: "Announced, not released",
  },
];

export default function GraphicsSettingsPage() {
  return (
    <>
      <Link href="/version" className="og-back" transitionTypes={["nav-back"]}>
        ← Version overview
      </Link>

      <PageHero kicker="Graphics settings" title="What your hardware unlocks">
        The big graphics options, the hardware each one needs, and the game
        version that added it — from Kuro&apos;s patch notes, cross-checked
        against the SenseOS graphics guide (Nov 15, 2026) and Game8&apos;s
        settings page. No benchmark numbers: Kuro does not publish any, and
        we do not invent them.
      </PageHero>

      <ObsidianToolbar
        label="On this page"
        items={[
          { href: "#options", label: "The options" },
          { href: "#kuro-advice", label: "What Kuro advises" },
          { href: "#our-picks", label: "What to pick" },
          { href: "#sources", label: "Sources" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="options"
          title="The big options, and what each one needs"
          blurb="Every row is a hardware rule from Kuro's own patch notes. If your device is not listed for an option, the game simply does not offer it."
        />
        <div style={{ overflowX: "auto" }}>
          <table className="data">
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Where</th>
                <th scope="col">What it needs</th>
                <th scope="col">Since</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.option}>
                  <td>
                    <strong style={{ color: "var(--rs-ink)" }}>{r.option}</strong>
                  </td>
                  <td>{r.where}</td>
                  <td>{r.needs}</td>
                  <td>{r.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="kuro-advice"
          title="What Kuro itself advises"
          blurb="Before our picks: the guidance straight from the patch notes."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Start from Kuro&apos;s preset.</strong> Version 3.1 added
              a <strong>Recommended Settings</strong> button at the bottom
              right of the Graphics menu, tuned to your hardware.{" "}
              <strong>Frame generation needs a decent base frame rate</strong>{" "}
              — Kuro warns that with a low native frame rate it raises the
              number but can add input lag and display problems. The{" "}
              <strong>setup load indicator</strong> under Settings, Graphics
              (added in 2.6) shows how hard your current settings push your PC.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="our-picks"
          title="What to pick, by hardware tier"
          blurb="These picks are ours — editorial recommendations, clearly labelled, not Kuro's and not measured benchmarks."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="High-end PC">
              <span className="rs-kicker">Our pick · high-end PC</span>
              <h3>RTX 50, RTX 4080 and up</h3>
              <ul className="og-q-list">
                <li>
                  Turn on <strong>120 FPS</strong> if your card and processor
                  unlock it, and use <strong>DLSS Quality</strong> with frame
                  generation at <strong>2x</strong> first — reach for 4x to 6x
                  only if motion still feels rough.
                </li>
                <li>
                  <strong>Ray tracing at Medium</strong> is the sweet spot;
                  High is there if your card shrugs Medium off.
                </li>
                <li>
                  Push the <strong>Render Distance slider high</strong> — this
                  tier is who the top of the slider is for.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Mid-range PC">
              <span className="rs-kicker">Our pick · mid-range PC</span>
              <h3>RTX 3060–4060, RX 6600 XT–7700 class</h3>
              <ul className="og-q-list">
                <li>
                  Aim for a stable <strong>60 FPS</strong>, or 120 if the game
                  offers it and it holds. A steady rate beats a higher one
                  that swings.
                </li>
                <li>
                  Use your maker&apos;s upscaling — <strong>DLSS, FSR or XeSS
                  on Quality</strong> — and frame generation if your card
                  supports it.
                </li>
                <li>
                  Leave <strong>ray tracing off</strong> (Game8&apos;s advice
                  for lower specs too) and keep{" "}
                  <strong>Render Distance in the middle</strong> of the slider.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal>
            <section className="og-pick-card" aria-label="Older PC and phones">
              <span className="rs-kicker">Our pick · older PC &amp; phones</span>
              <h3>Minimum-spec PC, most phones</h3>
              <ul className="og-q-list">
                <li>
                  On PC near the minimum spec (GTX 1060 class), start from
                  Kuro&apos;s <strong>Recommended Settings</strong> button and
                  lower shadows before anything else.
                </li>
                <li>
                  On phones, Game8&apos;s advice matches ours:{" "}
                  <strong>Medium</strong> is the sensible preset. Turn on{" "}
                  <strong>Auto FPS</strong> so a hot phone lowers settings
                  instead of stuttering.
                </li>
                <li>
                  If your phone chip is on the frame generation list, turn it
                  on — Kuro says its own frame generation reaches up to 60 FPS
                  while using less power than native 60.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Console">
              <span className="rs-kicker">Our pick · console</span>
              <h3>PS5 Pro &amp; Xbox Series X</h3>
              <ul className="og-q-list">
                <li>
                  Pick <strong>Performance</strong> for combat-heavy play and{" "}
                  <strong>Quality</strong> when you are exploring or taking
                  photos — that is the trade Kuro describes, and the mode
                  frame rates are not published.
                </li>
                <li>
                  On <strong>PS5 Pro</strong>, turn <strong>PSSR on</strong> —
                  it is there to keep the picture clear up to 4K.
                </li>
                <li>
                  Standard PS5 and Xbox Series S have no graphics mode choice
                  in 3.8 — there is nothing to set.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <p className="og-version-note" id="sources">
        Sources, checked Nov 19, 2026: Kuro Games patch notes for Versions
        1.2–3.8 (the 3.8 notes add the console Graphics Quality option, PSSR
        and the PC Render Distance slider); SenseOS, “WuWa Graphics Settings:
        Ray Tracing, DLSS, 120 FPS” (checked against Kuro&apos;s posts up to
        Nov 15, 2026); Game8, “Best Settings for PC and Mobile”. Where the
        sources do not say — console mode frame rates, a full processor list
        for 120 FPS, an HDR date — this page says so instead of guessing.
      </p>
    </>
  );
}

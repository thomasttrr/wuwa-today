import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import ShareButton from "@/components/ShareButton";
import UpdatedStamp from "@/components/UpdatedStamp";

export const metadata: Metadata = {
  title: "5 Mistakes Every Beginner Makes — and What to Do Instead | WuWa Today",
  description:
    "The five traps every new Wuthering Waves account walks into: standard-banner Astrite, leveling everyone, rushing SOL3 Phase, and more.",
  alternates: { canonical: "/beginner/mistakes" },
};

const MISTAKES = [
  {
    n: "01",
    title: "Spending Astrite on the standard banner",
    wrong:
      "The permanent standard banner gives the same 5-stars as Beginner's Choice — slowly, forever, with no featured unit to work toward.",
    right:
      "Save Astrite and Lustrous Tides for limited featured character convenes. Limited units only return on reruns; standard characters never leave. See the Convene guide.",
  },
  {
    n: "02",
    title: "Leveling every character",
    wrong:
      "Materials are scarce early. Spreading them across six or seven characters leaves you with a bench of half-built units and no one who can clear content.",
    right:
      "Pick one core team — your carry, your sub-DPS, your healer (see First teams) — and invest only in those three until they're stable.",
  },
  {
    n: "03",
    title: "Raising SOL3 Phase before you're ready",
    wrong:
      "The SOL3 Phase ascension quest (UL 20, then Phase II at 40 and III at 60) raises world level — and every enemy scales with it. Your characters don't scale unless you've already capped them.",
    right:
      "Max your core team's levels, weapons, and skills before each ascension quest. If overworld fights start feeling spongy, you rushed it.",
  },
  {
    n: "04",
    title: "Burning Crystal Solvent and Astrite refills early",
    wrong:
      "Refilling Waveplates with Crystal Solvent or Astrite at low Union Levels buys you fewer drops per refill than the same refill at a higher level.",
    right:
      "Hoard Solvent until high UL — the UL 25 and UL 35 milestone chests hand you more for free. Spend refills only when the per-refill rewards are worth it.",
  },
  {
    n: "05",
    title: "Ignoring the Data Bank",
    wrong:
      "Echo quality is the main gear progression, and it's gated by Data Bank level — which is itself capped by SOL3 Phase. Players farm for hours on a low phase and never see a 5-star echo.",
    right:
      "Level the Data Bank as it unlocks: roughly Phase 3 for 4-star echoes, Phase 4 for 5-star echoes. And don't invest Tuners and XP into green/blue echoes — save upgrades for purple and gold.",
  },
];

export default function BeginnerMistakes() {
  return (
    <>
      <Link href="/beginner" className="og-back">
        ← Beginner guides
      </Link>

      <OgPageHero
        kicker="Beginner guides · 5 mistakes"
        title="The traps, and the fixes"
        lede="Every one of these costs you resources you can't get back. The good news: each fix is a single decision made once — you don't have to grind your way out."
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />

      <ObsidianToolbar
        label="The five mistakes"
        items={MISTAKES.map((m, i) => ({
          href: `#mistake-${i + 1}`,
          label: m.n,
        }))}
      />

      <div className="og-section">
        {MISTAKES.map((m, i) => (
          <Reveal key={m.n} delay={Math.min(i * 60, 240)}>
            <section
              className="og-pick-card"
              id={`mistake-${i + 1}`}
              aria-label={`Mistake ${i + 1}: ${m.title}`}
              style={{ scrollMarginTop: "120px" }}
            >
              <span className="og-kicker">Mistake {m.n}</span>
              <h3>{m.title}</h3>
              <div className="og-pick-desc">
                <ul className="og-q-list">
                  <li>
                    <strong>Why it hurts:</strong> {m.wrong}
                  </li>
                  <li>
                    <strong>Do this instead:</strong> {m.right}
                  </li>
                </ul>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      <p className="og-version-note">
        Compiled from beginner guides by sportskeeda, techbloat, and z2u, and
        cross-checked against the verified banner, pity, and echo mechanics in
        the <Link href="/beginner/convene-guide">Convene guide</Link> and{" "}
        <Link href="/beginner/start-here">Start here</Link>.
      </p>
    </>
  );
}

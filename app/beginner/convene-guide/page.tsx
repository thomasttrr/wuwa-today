import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import ShareButton from "@/components/ShareButton";
import UpdatedStamp from "@/components/UpdatedStamp";

export const metadata: Metadata = {
  title: "Beginner Convene Guide — Which Banners to Pull | WuWa Today",
  description:
    "Utterance of Marvels and Beginner's Choice explained: beginner banner flow, pity rules, weapon banners, and what your Lustrous Tides are for.",
  alternates: { canonical: "/beginner/convene-guide" },
};

export default function BeginnerConveneGuide() {
  return (
    <>
      <Link href="/beginner" className="og-back">
        ← Beginner guides
      </Link>

      <OgPageHero
        kicker="Beginner guides · Convene guide"
        title="Beginner banners, decoded"
        lede="Your first banners hand you a guaranteed 5-star for a discount — then let you pick one outright. Pull both, touch nothing else until you understand pity, and your account starts miles ahead."
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />

      <ObsidianToolbar
        label="On this page"
        items={[
          { href: "#flow", label: "The beginner flow" },
          { href: "#new-voyage", label: "New Voyage note" },
          { href: "#pity", label: "Pity rules" },
          { href: "#spend", label: "Where your pulls go" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="flow"
          title="The beginner banner flow"
          blurb="Two banners, back to back — both hand you a guaranteed 5-star."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Utterance of Marvels">
              <span className="og-kicker">Step 1 · discounted novice banner</span>
              <h3>Utterance of Marvels</h3>
              <ul className="og-q-list">
                <li>
                  After <strong>50 pulls</strong> you&apos;re guaranteed one
                  random 5-star from the standard pool: Verina, Encore,
                  Calcharo, Jianxin, or Lingyang.
                </li>
                <li>
                  Once it resolves, this banner is <strong>replaced</strong> by
                  Beginner&apos;s Choice Convene.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Beginner's Choice Convene">
              <span className="og-kicker">Step 2 · your pick, guaranteed</span>
              <h3>Beginner&apos;s Choice Convene</h3>
              <ul className="og-q-list">
                <li>
                  <strong>Choose one</strong> of five 5-stars — Calcharo,
                  Encore, Jianxin, Lingyang, Verina — and it&apos;s guaranteed
                  within <strong>80 pulls</strong>.
                </li>
                <li>
                  Once your chosen character is pulled, the banner{" "}
                  <strong>disappears permanently</strong>. Character convene
                  only — no 5-star weapons on it.
                </li>
                <li>
                  <strong>No time limit</strong>, unlike limited banners. Take
                  your time.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="new-voyage"
          title="A note on the newer flow"
          blurb="Not yet verified for fresh accounts — check in-game before planning around it."
        />
        <Reveal>
          <section className="og-pick-card" aria-label="New Voyage Companions uncertainty">
            <span className="og-kicker">New Voyage Companions Convene</span>
            <h3>Pending in-game verification</h3>
            <div className="og-pick-desc">
              <ul className="og-q-list">
                <li>
                  Game8 documents this as a newer beginner flow: unlocks at
                  Union Level 5 plus story progress at the Jinzhou City Gate,
                  with a 31-day window.
                </li>
                <li>
                  It would offer a pick of eight limited 5-stars (Shorekeeper,
                  Camellya, Jinhsi, Changli, Jiyan, Yinlin, Zhezhi, Xiangli
                  Yao), guaranteed within 160 pulls — but pulls and pity do
                  not transfer after the window closes.
                </li>
                <li>
                  <strong>
                    We haven&apos;t verified which flow fresh accounts see
                    first in 3.7.
                  </strong>{" "}
                  If your account shows New Voyage Companions instead of
                  Beginner&apos;s Choice, that&apos;s the current flow — and
                  this page will be updated once verified in-game.
                </li>
              </ul>
            </div>
          </section>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="pity"
          title="Pity rules, in one pass"
          blurb="How guarantees work across every banner family."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Pity guarantees">
              <span className="og-kicker">All banners</span>
              <h3>The guarantees</h3>
              <ul className="og-q-list">
                <li>
                  <strong>4-star guaranteed within 10 pulls;</strong> 5-star
                  within <strong>80 pulls</strong> (soft pity ramps around
                  65–70).
                </li>
                <li>
                  <strong>Character banners are 50/50:</strong> at 80 pulls
                  you&apos;ve got a coin flip for the featured unit. Lose the
                  flip and the next 80 <strong>guarantees</strong> the featured
                  unit — true worst case is 160 pulls.
                </li>
                <li>
                  Pity <strong>carries over</strong> to the next banner of the
                  same family.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Weapon banners">
              <span className="og-kicker">Weapon banners</span>
              <h3>No 50/50 on weapons</h3>
              <ul className="og-q-list">
                <li>
                  Weapon banners (Absolute Pulsation, Drawn Edges) have{" "}
                  <strong>no 50/50</strong>: the 5-star at ≤80 pulls is always
                  your selected/targeted weapon.
                </li>
                <li>
                  <strong>Drawn Edges</strong> (permanent): pick one of five
                  standard weapons — Emerald of Genesis, Lustrous Razor, Static
                  Mist, Abyss Surges, Cosmic Ripples — and it&apos;s guaranteed
                  your pick within 80 pulls.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="spend"
          title="Where your pulls go"
          blurb="The short version of the whole game."
        />
        <div className="grid grid-2">
          <Reveal>
            <section className="og-pick-card" aria-label="Do this">
              <span className="og-kicker">Do this</span>
              <h3>Spend on beginners &amp; limited</h3>
              <ul className="og-q-list">
                <li>
                  Use the pulls the game hands you on{" "}
                  <strong>Utterance of Marvels → Beginner&apos;s Choice</strong>{" "}
                  (or New Voyage Companions, if that&apos;s your flow).
                </li>
                <li>
                  Spend <strong>Lustrous Tides and Astrite</strong> on{" "}
                  <strong>limited featured character convenes</strong> — the
                  only place to get limited 5-stars.
                </li>
              </ul>
            </section>
          </Reveal>
          <Reveal delay={70}>
            <section className="og-pick-card" aria-label="Don't do this">
              <span className="og-kicker">Don&apos;t do this</span>
              <h3>Leave the standard banner alone</h3>
              <ul className="og-q-list">
                <li>
                  <strong>Never spend Astrite on the permanent standard
                  banner.</strong> It gives the same characters as Beginner&apos;s
                  Choice, slowly, forever — limited banners don&apos;t come back
                  on a schedule.
                </li>
                <li>
                  The beginner banners give you their guaranteed 5-stars from
                  the pulls the game provides; your Astrite stays saved for
                  limited picks.
                </li>
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <p className="og-version-note">
        Sources: Game8 (Beginner&apos;s Choice, New Voyage Companions), Rock
        Paper Shotgun (pity, voucher), Eurogamer (banner list), ScreenRant
        &amp; shattered.io (pity rules). New Voyage Companions flow is
        documented by Game8 but unverified for fresh accounts in 3.7.
      </p>
    </>
  );
}

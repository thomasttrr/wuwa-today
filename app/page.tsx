import type { Metadata } from "next";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import ObsidianButton from "../components/ObsidianButton";
import ObsidianSectionHead from "../components/ObsidianSectionHead";
import ResetTimers from "../components/ResetTimers";
import Reveal from "../components/Reveal";
import UpdatedStamp from "../components/UpdatedStamp";
import ObsidianCountdown from "../components/ObsidianCountdown";
import { elementColor } from "../lib/elements";
import {
  activeBanners,
  activeCodes,
  activeEvents,
  bannerMeta,
  upcomingBanners,
  formatServerDate,
} from "../lib/data";

export const metadata: Metadata = {
  title: "WuWa Today — Wuthering Waves Banners, Codes & Events",
  description:
    "Today in Wuthering Waves: live banners with countdowns, working redeem codes, active events, and daily/weekly reset timers. Updated daily.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  // The hero's key art follows the live banner: when the featured banner
  // changes, the hero follows it. Falls back to Hsin's art if no banner is live.
  const heroBanner = activeBanners[0];
  // Resonance Trait 1+2: the page themes to the featured banner's lead
  // character — their element becomes the accent, their cut-out sprite
  // stands in front of the headline.
  const heroChar =
    heroBanner?.characters.find((c) => c.rarity === 5 && c.isNew) ??
    heroBanner?.characters.find((c) => c.rarity === 5);
  const heroElement = heroChar ? elementColor(heroChar.element) : null;
  const featuredBanner = activeBanners[0];
  const secondBanner = activeBanners[1];
  const endingSoon = [...activeEvents]
    .filter((e) => e.endsAt)
    .sort((a, b) => (a.endsAt! < b.endsAt! ? -1 : 1))
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "WuWa Today",
            alternateName: "Wuthering Waves Today",
            url: "https://wuwa-today.vercel.app/",
            description:
              "Daily Wuthering Waves hub: current banners with countdowns, working redeem codes, active events, reset timers, and character build guides.",
          }),
        }}
      />
      {/* Direction A "The Viewport": contained 1080px panel aligned with the
          page content measure — official key art as atmosphere behind a
          glass panel, monochrome dark scrim, sharp headline, one ghost CTA. */}
      {heroElement && (
        <style>{`:root{--el-accent:${heroElement}}`}</style>
      )}
      <header className="og-masthead">
        <div className="og-masthead-text">
          <p className="og-kicker">
            Version {bannerMeta.version} — {bannerMeta.versionTitle}
          </p>
          <h1 className="og-display og-masthead-title">
            Today in Wuthering Waves
          </h1>
          <p className="og-masthead-sub">
            Live banners with countdowns, working redeem codes, and active
            events — verified against multiple sources, updated daily.
          </p>
        </div>
        <div className="og-masthead-side">
          <UpdatedStamp />
          <ObsidianButton href="/pull-planner" variant="ghost">
            Plan my pulls
          </ObsidianButton>
        </div>
      </header>

<div className={`og-today-grid${secondBanner ? "" : " og-today-grid--solo"}`}>
        <Reveal className="og-today-feat">
          {featuredBanner ? (
            <BannerCard
              banner={featuredBanner}
              featured
              priority
              events={activeEvents}
            />
          ) : (
            <p className="og-empty">
              No live banners right now — check back after the next version
              livestream.
            </p>
          )}
        </Reveal>

        <section className="og-tile og-today-codes" aria-label="Redeem codes">
          <div className="og-tile-head">
            <h2 className="og-tile-title">Redeem codes</h2>
            <span className="og-tile-note">Tap to copy</span>
          </div>
          {activeCodes.length === 0 ? (
            <p className="og-tile-empty">
              No verified working codes right now.
            </p>
          ) : (
            activeCodes.map((c) => <CodeRow key={c.code} code={c} />)
          )}
        </section>

        <div className="og-today-resets">
          <ResetTimers />
        </div>

        {secondBanner && (
          <Reveal className="og-today-second">
            <BannerCard banner={secondBanner} variant="tile" />
          </Reveal>
        )}

        <section className="og-tile og-today-events" aria-label="Events ending soon">
          <div className="og-tile-head">
            <h2 className="og-tile-title">Events ending soon</h2>
            <a className="og-tile-link" href="/events">
              Full calendar →
            </a>
          </div>
          {endingSoon.length === 0 ? (
            <p className="og-tile-empty">No dated events live right now.</p>
          ) : (
            <ul className="og-event-rows">
              {endingSoon.map((e) => (
                <li key={e.id} className="og-event-row">
                  <div className="og-event-row-text">
                    <span className="og-event-row-name">{e.name}</span>
                    <span className="og-event-row-rewards">{e.rewards}</span>
                  </div>
                  {e.endsAt && (
                    <div className="og-ends-chip">
                      <ObsidianCountdown
                        target={e.endsAt}
                        label={`Ends ${formatServerDate(e.endsAt)}`}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {upcomingBanners.length > 0 && (
        <div className="og-section">
          <ObsidianSectionHead
            id="upcoming"
            title="Coming next"
            blurb="The next phase's banners, with start countdowns."
            linkHref="/banners"
            linkText="All banners & history"
          />
          <div className="grid grid-2">
            {upcomingBanners.map((b, i) => (
              <Reveal key={b.id} delay={i * 70}>
                <BannerCard banner={b} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* New-player on-ramp: the bottom tab bar is full at 7 tabs, so the
          Beginner section lives here on home rather than as an 8th tab. */}
      <div className="og-section">
        <ObsidianSectionHead
          id="beginner"
          title="New to Solaris-3?"
          blurb="Four short guides: what to do first, how beginner banners work, your first teams, and the mistakes to skip."
          linkHref="/beginner"
          linkText="All beginner guides"
        />
        <div className="grid grid-2">
          <Reveal>
            <a
              href="/beginner/start-here"
              className="og-pick-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <span className="og-kicker">Start here</span>
              <h3>Your first week</h3>
              <p className="og-pick-desc">
                Your free roster, the unlocks that matter, and the Union Level
                milestones that gate your power.
              </p>
            </a>
          </Reveal>
          <Reveal delay={70}>
            <a
              href="/beginner/convene-guide"
              className="og-pick-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <span className="og-kicker">Beginner Convene guide</span>
              <h3>Beginner banners, decoded</h3>
              <p className="og-pick-desc">
                The beginner banner flow, pity rules, and where your pulls
                should actually go.
              </p>
            </a>
          </Reveal>
        </div>
      </div>

      {/* Verification stamp as a proper footer block — not a faint line. */}
      <div className="og-verify-block">
        <UpdatedStamp />
      </div>
    </>
  );
}

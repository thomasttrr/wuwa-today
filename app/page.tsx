import type { Metadata } from "next";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import ObsidianButton from "../components/ObsidianButton";
import ObsidianSectionHead from "../components/ObsidianSectionHead";
import ResetTimers from "../components/ResetTimers";
import Reveal from "../components/Reveal";
import UpdatedStamp from "../components/UpdatedStamp";
import ObsidianCountdown from "../components/ObsidianCountdown";
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
  const featuredBanner = activeBanners[0];
  const otherBanners = activeBanners.slice(1);
  const endingSoon = [...activeEvents]
    .filter((e) => e.endsAt)
    .sort((a, b) => (a.endsAt! < b.endsAt! ? -1 : 1))
    .slice(0, 4);
  // The one-line summary under the title, composed from the same
  // verified data the page shows — never hand-written, never stale.
  const lead =
    featuredBanner?.characters.find((c) => c.rarity === 5 && c.isNew) ??
    featuredBanner?.characters.find((c) => c.rarity === 5);
  const summary = featuredBanner
    ? `${lead ? `${lead.name}'s banner` : "The current banner"} ends ${formatServerDate(featuredBanner.endsAt)}. ${activeCodes.length === 1 ? "One verified code" : `${activeCodes.length} verified codes`}, ${activeEvents.length} events live, and every countdown on this page is counting to server time.`
    : "No banner is live right now — the next phase will be written up here as soon as its dates are confirmed.";

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

      {/* Centered hero: eyebrow, Bebas headline, summary, pills. */}
      <header className="front-head">
        <p className="front-eyebrow">
          Version {bannerMeta.version} — {bannerMeta.versionTitle}
        </p>
        <h1 className="front-title">
          Wuthering Waves banners, codes &amp; guides
        </h1>
        <p className="front-summary">{summary}</p>
        <div className="front-actions">
          <ObsidianButton href="/pull-planner" variant="solid">Plan my pulls</ObsidianButton>
          <ObsidianButton href="/characters" variant="ghost">
            Browse characters
          </ObsidianButton>
          <ObsidianButton href="/tier-list" variant="ghost">
            Tier list
          </ObsidianButton>
        </div>
      </header>

      {/* Live ticker: the day's facts, scrolling. Real data only —
          the same values the page below shows. Decorative motion,
          so the strip is aria-hidden; nothing here is exclusive. */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((dup) => (
            <span key={dup} className="ticker-set">
              <span className="ticker-item ticker-live">Live now</span>
              {featuredBanner && lead && (
                <span className="ticker-item">
                  {lead.name}&rsquo;s banner ends{" "}
                  {formatServerDate(featuredBanner.endsAt)}
                </span>
              )}
              {activeCodes[0] && (
                <span className="ticker-item">
                  Working code: <strong>{activeCodes[0].code}</strong>
                </span>
              )}
              <span className="ticker-item">
                {activeEvents.length} events live
              </span>
              {endingSoon[0] && (
                <span className="ticker-item">
                  {endingSoon[0].name} ends{" "}
                  {formatServerDate(endingSoon[0].endsAt!)}
                </span>
              )}
              <span className="ticker-item">
                Version {bannerMeta.version} — {bannerMeta.versionTitle}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* The featured banner, full width. */}
      {featuredBanner ? (
        <Reveal>
          <BannerCard
            banner={featuredBanner}
            featured
            priority
            events={activeEvents}
          />
        </Reveal>
      ) : (
        <p className="og-empty">
          No live banners right now — check back after the next version
          livestream.
        </p>
      )}

      {otherBanners.length > 0 && (
        <div className="og-section">
          <ObsidianSectionHead
            id="also-live"
            title="Also live"
            blurb="The other Convene banners running right now."
            linkHref="/banners"
            linkText="All banners & history"
          />
          {otherBanners.map((b, i) => (
            <Reveal key={b.id} delay={i * 70}>
              <BannerCard banner={b} />
            </Reveal>
          ))}
        </div>
      )}

      {/* Two-column index: events + what's next on the left,
          codes + resets on the right. Stacks on mobile. */}
      <div className="front-cols">
        <div>
          <div className="og-section">
            <ObsidianSectionHead
              id="events"
              title="Events ending soon"
              blurb="What's closing first, so nothing expires unclaimed."
              linkHref="/events"
              linkText="Full event calendar"
            />
            {endingSoon.length === 0 ? (
              <p className="og-empty">No dated events live right now.</p>
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
              {upcomingBanners.map((b, i) => (
                <Reveal key={b.id} delay={i * 70}>
                  <BannerCard banner={b} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="og-section">
            <ObsidianSectionHead
              id="codes"
              title="Working redeem codes"
              blurb="Every code verified against multiple sources before it lands here. Tap a code to copy it."
            />
            {activeCodes.length === 0 ? (
              <p className="og-empty">
                No verified working codes right now — check back after the
                next livestream.
              </p>
            ) : (
              activeCodes.map((c, i) => (
                <Reveal key={c.code} delay={Math.min(i, 3) * 60}>
                  <CodeRow code={c} />
                </Reveal>
              ))
            )}
          </div>

          <div className="og-section">
            <ObsidianSectionHead
              id="resets"
              title="Reset timers"
              blurb="Daily and weekly resets, shown for your server region."
            />
            <ResetTimers />
          </div>
        </div>
      </div>

      {/* New-player on-ramp — the nav has no room for a Beginner tab,
          so the section lives here on the front page. */}
      <div className="og-section">
        <ObsidianSectionHead
          id="beginner"
          title="New to Solaris-3?"
          blurb="Four short guides: what to do first, how beginner banners work, your first teams, and the mistakes to skip."
          linkHref="/beginner"
          linkText="All beginner guides"
        />
        <ul className="og-link-rows">
          <li>
            <a href="/beginner/start-here">
              <span className="og-link-row-title">Your first week</span>
              <span className="og-link-row-desc">
                Your free roster, the unlocks that matter, and the Union
                Level milestones that gate your power.
              </span>
            </a>
          </li>
          <li>
            <a href="/beginner/convene-guide">
              <span className="og-link-row-title">
                Beginner banners, decoded
              </span>
              <span className="og-link-row-desc">
                The beginner banner flow, pity rules, and where your pulls
                should actually go.
              </span>
            </a>
          </li>
        </ul>
      </div>

      {/* Verification stamp + colophon. */}
      <div className="og-verify-block">
        <UpdatedStamp />
        <p className="og-colophon">
          WuWa Today is a fan-kept reference: every date and code is checked
          against at least two sources before it is posted, and anything
          unconfirmed is labelled as a leak or an estimate.
        </p>
      </div>
    </>
  );
}

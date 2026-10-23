import type { Metadata } from "next";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import EventCard from "../components/EventCard";
import ObsidianButton from "../components/ObsidianButton";
import ObsidianSectionHead from "../components/ObsidianSectionHead";
import ObsidianToolbar from "../components/ObsidianToolbar";
import ResetTimers from "../components/ResetTimers";
import Reveal from "../components/Reveal";
import UpdatedStamp from "../components/UpdatedStamp";
import {
  activeBanners,
  activeCodes,
  activeEvents,
  bannerMeta,
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
  const heroArt = heroBanner?.image ?? "/images/hsin-splash.webp";
  // Responsive hero art (Fix 1, static-export safe: plain <img> srcset, no
  // next/image — the export is unoptimized so next/image generates nothing).
  // Variants are downscales of the 1200px originals shipped in ade595f
  // (same artworks, WebP q80); a new banner image needs matching -640/-1200
  // variants or the srcset below silently points at missing files.
  // DEVIATION from the brief's 640/1280/1920w: no genuine source wider than
  // 1200px was found, and upscaling to 1280/1920 is forbidden, so 1200w is
  // the largest served width. Note the hero is now a contained 1080px panel
  // (Direction A, sibling worker's in-progress change), so 1200w covers the
  // panel at 1x; a 2x-retina panel (2160 device px) still upscales from it.
  const heroBase = heroArt.replace(/\.webp$/, "");
  const heroSrcSet = `${heroArt} 640w, ${heroBase}-1200.webp 1200w`;

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
      <section className="og-hero" aria-label="Today in Wuthering Waves">
        {/* eslint-disable-next-line @next/next/no-img-element -- contained-panel hero art layer; next/image's wrapper spans would break the panel and scrim styling, and images are unoptimized in this static export so next/image adds nothing. */}
        <img
          className="og-hero-art"
          src={heroArt}
          srcSet={heroSrcSet}
          sizes="(max-width: 1080px) 100vw, 1080px"
          alt={`Official key art for the Wuthering Waves version ${bannerMeta.version} featured banner`}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="og-hero-inner">
          <div className="og-hero-panel">
            <p className="og-kicker-dim">
              Version {bannerMeta.version} — {bannerMeta.versionTitle}
            </p>
            <h1 className="og-display og-hero-title">Today in Wuthering Waves</h1>
            <p className="og-hero-sub">
              Live banners with countdowns, working redeem codes, and active
              events — verified against multiple sources, updated daily.
            </p>
            <ObsidianButton
              href="/pull-planner"
              variant="ghost"
              className="og-hero-cta"
            >
              Plan my pulls
            </ObsidianButton>
          </div>
        </div>
      </section>

      {/* In-page anchor jumps only — labels mirror the section headings
          below so they never read as a duplicate of the main page nav. */}
      <ObsidianToolbar
        label="On this page"
        items={[
          { href: "#banners", label: "Live banners" },
          { href: "#events", label: "Active events" },
          { href: "#resets", label: "Reset timers" },
          { href: "#codes", label: "Redeem codes" },
        ]}
      />

      <div className="og-section">
        <ObsidianSectionHead
          id="banners"
          title="Live banners"
          blurb="Featured Resonators and their weapons, with live countdowns to the phase flip."
          linkHref="/banners"
          linkText="All banners, upcoming phases & history"
        />
        <div className="grid grid-2">
          {activeBanners.length === 0 ? (
            <p className="og-empty">
              No live banners right now — check back after the next version
              livestream.
            </p>
          ) : (
            activeBanners.map((b, i) => (
              <Reveal key={b.id} delay={i * 70}>
                <BannerCard
                  banner={b}
                  featured={i === 0}
                  priority={i === 0}
                  events={i === 0 ? activeEvents : undefined}
                />
              </Reveal>
            ))
          )}
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="events"
          title="Active events"
          blurb="What's live right now and when each one closes."
          linkHref="/events"
          linkText="Full event calendar"
        />
        <div className="grid grid-2">
          {activeEvents.length === 0 ? (
            <p className="og-empty">
              No active events right now — check back after the next version
              livestream.
            </p>
          ) : (
            activeEvents.map((e, i) => (
              <Reveal key={e.id} delay={i * 70}>
                <EventCard event={e} compact />
              </Reveal>
            ))
          )}
        </div>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="resets"
          title="Reset timers"
          blurb="Daily and weekly resets, shown for your server region."
        />
        <ResetTimers />
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          id="codes"
          title="Working redeem codes"
          blurb="Every code verified against multiple sources before it lands here."
        />
        <div className="grid">
          {activeCodes.length === 0 ? (
            <p className="og-empty">
              No verified working codes right now — check back after the next
              livestream.
            </p>
          ) : (
            activeCodes.map((c, i) => (
              <Reveal key={c.code} delay={Math.min(i, 3) * 60}>
                <CodeRow code={c} />
              </Reveal>
            ))
          )}
        </div>
      </div>

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

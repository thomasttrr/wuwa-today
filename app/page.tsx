import type { Metadata } from "next";
import Link from "next/link";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import EventCard from "../components/EventCard";
import ObsidianButton from "../components/ObsidianButton";
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
};

function SectionHead({
  id,
  title,
  blurb,
  linkHref,
  linkText,
}: {
  id: string;
  title: string;
  blurb?: string;
  linkHref?: string;
  linkText?: string;
}) {
  return (
    <div className="og-section-head" id={id}>
      <div>
        <h2 className="og-h2">{title}</h2>
        {blurb && <p className="og-section-blurb">{blurb}</p>}
      </div>
      {linkHref && linkText && (
        <Link className="og-section-link" href={linkHref}>
          {linkText} →
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  // The hero's key art follows the live banner: when the featured banner
  // changes, the hero follows it. Falls back to Hsin's art if no banner is live.
  const heroBanner = activeBanners[0];
  const heroArt = heroBanner?.image ?? "/images/hsin-splash.webp";

  return (
    <>
      {/* The one full-bleed moment on the landing page: official key art,
          dark scrim, one monumental headline, one ghost CTA. */}
      <section className="og-hero" aria-label="Today in Wuthering Waves">
        {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed hero art layer; next/image's wrapper spans would break the viewport-bleed and scrim styling, and images are unoptimized in this static export so next/image adds nothing. */}
        <img
          className="og-hero-art"
          src={heroArt}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="og-hero-inner">
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
        <SectionHead
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
        <SectionHead
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
        <SectionHead
          id="resets"
          title="Reset timers"
          blurb="Daily and weekly resets, shown for your server region."
        />
        <ResetTimers />
      </div>

      <div className="og-section">
        <SectionHead
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

      {/* Verification stamp as a proper footer block — not a faint line. */}
      <div className="og-verify-block">
        <UpdatedStamp />
      </div>
    </>
  );
}

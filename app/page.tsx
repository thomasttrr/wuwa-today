import type { Metadata } from "next";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import EventCard from "../components/EventCard";
import ResetTimers from "../components/ResetTimers";
import NewsletterSignup from "../components/NewsletterSignup";
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
    <div className="section-head" id={id}>
      <div>
        <h2>{title}</h2>
        {blurb && <p className="section-blurb">{blurb}</p>}
      </div>
      {linkHref && linkText && (
        <a className="section-link" href={linkHref}>
          {linkText} →
        </a>
      )}
    </div>
  );
}

export default function HomePage() {
  const endingSoon = activeEvents.filter((e) => e.endsAt).length;

  return (
    <>
      <section className="hero" aria-label="About this site">
        <p className="hero-kicker">
          Version {bannerMeta.version} — {bannerMeta.versionTitle}
        </p>
        <h1 className="hero-title">
          Today in <span>Wuthering Waves</span>
        </h1>
        <p className="lede hero-lede">
          Everything time-sensitive in one place: who's on banner and when it
          ends, which redeem codes still work, what events are live — refreshed
          daily so you never miss a pull or a freebie.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{activeBanners.length}</strong>
            <span>live banner{activeBanners.length === 1 ? "" : "s"}</span>
          </div>
          <div className="hero-stat">
            <strong>{activeCodes.length}</strong>
            <span>working code{activeCodes.length === 1 ? "" : "s"}</span>
          </div>
          <div className="hero-stat">
            <strong>{endingSoon}</strong>
            <span>timed event{endingSoon === 1 ? "" : "s"}</span>
          </div>
        </div>
        <nav className="hero-nav" aria-label="Jump to sections">
          <a href="#banners">Banners</a>
          <a href="#codes">Codes</a>
          <a href="#events">Events</a>
          <a href="#resets">Reset timers</a>
        </nav>
        <UpdatedStamp />
      </section>

      <SectionHead
        id="banners"
        title="Live banners"
        blurb="Featured Resonators and their weapons, with live countdowns to the phase flip."
        linkHref="/banners"
        linkText="All banners, upcoming phases & history"
      />
      <div className="grid grid-2">
        {activeBanners.map((b) => (
          <BannerCard key={b.id} banner={b} />
        ))}
      </div>

      <SectionHead
        id="codes"
        title="Working redeem codes"
        blurb="Every code verified against multiple sources before it lands here. Redeem in-game via Terminal → Settings → Redemption Code."
        linkHref="/codes"
        linkText="All codes & expired archive"
      />
      <div className="grid">
        {activeCodes.map((c) => (
          <CodeRow key={c.code} code={c} />
        ))}
      </div>

      <SectionHead
        id="events"
        title="Active events"
        blurb="What's live right now and when each one closes."
        linkHref="/events"
        linkText="Full event calendar"
      />
      <div className="grid grid-2">
        {activeEvents.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      <SectionHead
        id="resets"
        title="Reset timers"
        blurb="Daily and weekly resets, shown for your server region."
      />
      <ResetTimers />

      <NewsletterSignup />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import EventCard from "../components/EventCard";
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
    <div className="section-head" id={id}>
      <div>
        <h2>{title}</h2>
        {blurb && <p className="section-blurb">{blurb}</p>}
      </div>
      {linkHref && linkText && (
        <Link className="section-link" href={linkHref}>
          {linkText} →
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-label="About this site">
        <p className="hero-kicker">
          Version {bannerMeta.version} — {bannerMeta.versionTitle}
        </p>
        <h1 className="hero-title">
          Today in <span>Wuthering Waves</span>
        </h1>
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
        {activeBanners.length === 0 ? (
          <p className="empty-state">
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

      <SectionHead
        id="codes"
        title="Working redeem codes"
        blurb="Every code verified against multiple sources before it lands here."
        linkHref="/codes"
        linkText="All codes & expired archive"
      />
      <div className="grid">
        {activeCodes.map((c, i) => (
          <Reveal key={c.code} delay={Math.min(i, 3) * 60}>
            <CodeRow code={c} />
          </Reveal>
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
        {activeEvents.length === 0 ? (
          <p className="empty-state">
            No active events right now — check back after the next version
            livestream.
          </p>
        ) : (
          activeEvents.map((e, i) => (
            <Reveal key={e.id} delay={i * 70}>
              <EventCard event={e} />
            </Reveal>
          ))
        )}
      </div>

      <SectionHead
        id="resets"
        title="Reset timers"
        blurb="Daily and weekly resets, shown for your server region."
      />
      <ResetTimers />
    </>
  );
}

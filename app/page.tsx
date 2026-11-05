import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "../components/CopyButton";
import ResetTimers from "../components/ResetTimers";
import HomeEndingSoon from "../components/HomeEndingSoon";
import NextVersionNote from "../components/NextVersionNote";
import Reveal from "../components/Reveal";
import RollingCountdown from "../components/RollingCountdown";
import UpdatedStamp from "../components/UpdatedStamp";
import WaveProgress from "../components/WaveProgress";
import {
  activeBanners,
  activeCodes,
  events,
  bannerMeta,
  nextVersion,
  formatServerDate,
} from "../lib/data";
import { characters } from "../lib/characters";
import { elementColor } from "../lib/elements";
import { thumbFor } from "../lib/renders";
import { CharMedal } from "../components/CharThumb";

export const metadata: Metadata = {
  title: "WuWa Today — Wuthering Waves Banners, Codes & Events",
  description:
    "Today in Wuthering Waves: live banners with countdowns, working redeem codes, active events, and daily/weekly reset timers. Updated daily.",
  alternates: { canonical: "/" },
};

const slugByName = new Map(characters.map((c) => [c.name, c.slug]));
const thumbBySlug = new Map(characters.map((c) => [c.slug, thumbFor(c.slug, c.profile.portrait_url)]));

// Build time seeds the client clock for the event list (hydration-safe).
const BUILT_AT = Date.now();

function srcSetFor(art: string) {
  const base = art.replace(/\.webp$/, "");
  return `${base}-512.webp 512w, ${base}.webp 640w, ${base}-1024.webp 1024w, ${base}-1200.webp 1200w, ${base}-1920.webp 1920w`;
}

export default function HomePage() {
  const banner = activeBanners[0];
  const lead = banner?.characters[0];
  const heroArt = banner?.image ?? "/images/hsin-splash.webp";
  const leadSlug = lead ? slugByName.get(lead.name) : undefined;
  const leadWeapon = banner?.weapons.find((w) => w.featuredFor === lead?.name) ?? banner?.weapons[0];
  const rateUps = banner?.characters.slice(1) ?? [];


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

      {/* Hero: the headline sits BEHIND the splash art. The art's own
          transparent silhouette lets the type show around it, so the
          character reads as standing in front of the title. Scroll drives a
          slight depth split (CSS scroll timeline, no JS). */}
      <section className="rs-hero" aria-label="Today in Wuthering Waves">
        <p className="rs-kicker rs-hero-kicker">
          <span className="rs-live-dot" aria-hidden="true" />
          Version {bannerMeta.version} · {bannerMeta.versionTitle}
        </p>
        <h1 className="rs-hero-title">
          <span>Today in</span>
          <span>Wuthering</span>
          <span>Waves</span>
        </h1>
        {/* eslint-disable-next-line @next/next/no-img-element -- layered hero art; static export is unoptimized so next/image adds nothing. */}
        <img
          className="rs-hero-art"
          src={heroArt}
          srcSet={srcSetFor(heroArt)}
          sizes="(max-width: 760px) 100vw, 640px"
          width={640}
          height={640}
          alt={banner?.imageAlt ?? "Official Wuthering Waves key art"}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="rs-hero-foot">
          <p className="rs-hero-sub">
            Live banners, working codes and every reset, verified against
            multiple sources and updated daily.
          </p>
          <div className="rs-hero-ctas">
            <a href="#today" className="rs-btn rs-btn-solid">
              See today
            </a>
            <Link href="/pull-planner" className="rs-btn">
              Plan my pulls
            </Link>
          </div>
        </div>
      </section>

      {nextVersion && <NextVersionNote next={nextVersion} builtAt={BUILT_AT} variant="strip" />}

      <section id="today" className="rs-today" aria-label="Today at a glance">
        {/* Featured banner: the art IS the tile. */}
        {banner && lead ? (
          <Reveal className="rs-tile-banner-wrap">
            <article className="rs-tile rs-tile-banner rs-spot">
              {/* eslint-disable-next-line @next/next/no-img-element -- tile art layer. */}
              <img
                className="rs-banner-art"
                src={heroArt}
                srcSet={srcSetFor(heroArt)}
                sizes="(max-width: 760px) 100vw, 720px"
                alt=""
                loading="lazy"
                decoding="async"
              />
              <div className="rs-banner-body">
                <p className="rs-kicker">
                  Featured · {lead.element} · {banner.phase}
                </p>
                <h2 className="rs-banner-name">{lead.name}</h2>
                {leadWeapon && (
                  <p className="rs-banner-weapon">
                    with <strong>{leadWeapon.name}</strong> · {leadWeapon.type}
                  </p>
                )}
                <RollingCountdown target={banner.endsAt} label="Banner ends in" />
                <WaveProgress start={banner.startsAt} end={banner.endsAt} label="Banner time left" />
                <p className="rs-banner-date">Ends {formatServerDate(banner.endsAt)} · server time</p>
                <div className="rs-banner-actions">
                  {leadSlug && (
                    <Link href={`/characters/${leadSlug}`} className="rs-btn rs-btn-solid">
                      {lead.name} build
                    </Link>
                  )}
                  <Link href="/banners" className="rs-btn">
                    All banners
                  </Link>
                </div>
              </div>
              {rateUps.length > 0 && (
                <div className="rs-rateups">
                  <p className="rs-rateups-h">Also on rate-up</p>
                  <ul>
                    {rateUps.map((c) => {
                      const slug = slugByName.get(c.name);
                      const thumb = slug ? thumbBySlug.get(slug) ?? null : null;
                      const inner = (
                        <>
                          <CharMedal className="rs-rateup-face" thumb={thumb} name={c.name} size={40} rarity={c.rarity} />
                          <span className="rs-rateup-name">{c.name}</span>
                          <span className="rs-rateup-meta">
                            {c.rarity}★ · {c.element}
                          </span>
                        </>
                      );
                      return (
                        <li key={c.name} style={{ "--opt": elementColor(c.element) } as CSSProperties}>
                          {slug ? <Link href={`/characters/${slug}`}>{inner}</Link> : <span>{inner}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </article>
          </Reveal>
        ) : (
          <article className="rs-tile">
            <p className="og-empty">No live banners right now. Check back after the next version livestream.</p>
          </article>
        )}

        <Reveal delay={80} className="rs-tile-codes-wrap">
          <article className="rs-tile rs-spot" id="codes" aria-labelledby="codes-h">
            <header className="rs-tile-head">
              <h2 id="codes-h">Redeem codes</h2>
              <span className="rs-count">{activeCodes.length}</span>
            </header>
            {activeCodes.length === 0 ? (
              <p className="rs-muted">No verified working codes right now.</p>
            ) : (
              <ul className="rs-codes">
                {activeCodes.map((c) => (
                  <li key={c.code}>
                    <div>
                      <span className="rs-code">{c.code}</span>
                      <span className="rs-code-rewards">{c.rewards}</span>
                      <span className="rs-code-exp">
                        {c.expiresAt ? `Expires ${formatServerDate(c.expiresAt)}` : "No expiry announced"}
                      </span>
                    </div>
                    <CopyButton text={c.code} />
                  </li>
                ))}
              </ul>
            )}
          </article>
        </Reveal>

        <Reveal delay={140} className="rs-tile-resets-wrap">
          <article className="rs-tile rs-spot" id="resets">
            <ResetTimers />
          </article>
        </Reveal>

        <Reveal delay={60} className="rs-tile-events-wrap">
          <article className="rs-tile rs-spot" id="events" aria-labelledby="events-h">
            <header className="rs-tile-head">
              <h2 id="events-h">Ending soon</h2>
              <Link href="/events" className="rs-tile-link">
                All events →
              </Link>
            </header>
            <HomeEndingSoon events={events} builtAt={BUILT_AT} />
          </article>
        </Reveal>

        <Reveal delay={120} className="rs-tile-new-wrap">
          <Link href="/beginner" className="rs-tile rs-tile-new rs-spot">
            <p className="rs-kicker">New to Solaris-3?</p>
            <h2>Your first week, decoded</h2>
            <p className="rs-muted">
              Four short guides: what to do first, beginner banners, your
              first teams, and the mistakes to skip.
            </p>
            <span className="rs-tile-link">Start here →</span>
          </Link>
        </Reveal>
      </section>

      <div className="og-verify-block">
        <UpdatedStamp />
      </div>
    </>
  );
}

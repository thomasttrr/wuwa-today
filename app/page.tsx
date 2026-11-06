import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import ResetTimers from "../components/ResetTimers";
import HomeCodes from "../components/HomeCodes";
import HomeEndingSoon from "../components/HomeEndingSoon";
import HomeUpNext, { type UpNextPhase } from "../components/HomeUpNext";
import NextVersionNote from "../components/NextVersionNote";
import Reveal from "../components/Reveal";
import RollingCountdown from "../components/RollingCountdown";
import UpdatedStamp from "../components/UpdatedStamp";
import WaveProgress from "../components/WaveProgress";
import { YourTime } from "../components/LocalTime";
import { srcSetFor } from "../lib/images";
import {
  activeBanners,
  activeCodes,
  events,
  bannerMeta,
  nextVersion,
  upcomingBanners,
  codesUpdatedAt,
} from "../lib/data";
import { formatServerDateTime, formatServerDay } from "../lib/dates";
import { characters } from "../lib/characters";
import { elementColor } from "../lib/elements";
import { thumbFor } from "../lib/renders";
import { prefarmGuides } from "../lib/prefarm";
import { CharMedal } from "../components/CharThumb";

export const metadata: Metadata = {
  title: "WuWa Today — Wuthering Waves Banners, Codes & Events",
  description:
    "Today in Wuthering Waves: live banners with countdowns, working redeem codes, active events, and daily/weekly reset timers. Updated daily.",
  alternates: { canonical: "/" },
};

/* Names are matched loosely: banners.json writes "Yangyang: Xuanling" where
   the character record says "Yangyang Xuanling". */
const nameKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "");
const slugByKey = new Map(characters.map((c) => [nameKey(c.name), c.slug]));
const slugByName = { get: (name: string) => slugByKey.get(nameKey(name)) };
const thumbBySlug = new Map(characters.map((c) => [c.slug, thumbFor(c.slug, c.profile.portrait_url)]));
const thumbByName = (name: string) => {
  const slug = slugByName.get(name);
  return slug ? thumbBySlug.get(slug) ?? null : null;
};

// Build time seeds the client clock for the live lists (hydration-safe).
const BUILT_AT = Date.now();

/* Banner tile art: full container width on phones, 2/3 of the 1200px
   container on desktop. */
const BANNER_ART_SIZES = "(max-width: 760px) calc(100vw - 2.5rem), 760px";

/* Codes, soonest expiry first; codes with no announced expiry last. */
const sortedCodes = [...activeCodes]
  .sort((a, b) => {
    if (!a.expiresAt) return b.expiresAt ? 1 : 0;
    if (!b.expiresAt) return -1;
    return Date.parse(a.expiresAt) - Date.parse(b.expiresAt);
  })
  .map(({ code, rewards, expiresAt }) => ({ code, rewards, expiresAt }));

/* "Up next": upcoming phases, serialized for the client tile. */
const upNextPhases: UpNextPhase[] = [...upcomingBanners]
  .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
  .map((b) => ({
    id: b.id,
    version: b.version,
    versionTitle: b.version === bannerMeta.version ? bannerMeta.versionTitle : null,
    phase: b.phase,
    startsAt: b.startsAt,
    endsAt: b.endsAt,
    estimated: !!b.uncertainFields?.some((f) => f === "startsAt" || f === "endsAt"),
    fiveStars: b.characters
      .filter((c) => c.rarity === 5)
      .map((c) => {
        const weapon = c.isNew ? b.weapons.find((w) => w.featuredFor === c.name) : undefined;
        return {
          name: c.name,
          slug: slugByName.get(c.name) ?? null,
          element: c.element,
          color: elementColor(c.element),
          isNew: !!c.isNew,
          thumb: thumbByName(c.name),
          weapon: weapon ? { name: weapon.name, type: weapon.type } : null,
        };
      }),
  }));

/* Pre-farm: guides for characters who have not launched yet. */
const prefarmNow = prefarmGuides
  .filter((g) => g.prerelease)
  .map((g) => {
    const banner = upcomingBanners.find((b) => b.characters.some((c) => c.name === g.character));
    const char = banner?.characters.find((c) => c.name === g.character);
    const echoes = (g.echoFarm ?? []).map((e) => e.name.split(" — ")[0]);
    return {
      slug: g.slug,
      name: g.character,
      startsAt: banner?.startsAt ?? null,
      color: char ? elementColor(char.element) : undefined,
      thumb: thumbBySlug.get(g.character_slug) ?? null,
      echoes,
      farmNow: g.farmNow.length,
      partial: !!g.partial,
    };
  });

export default function HomePage() {
  const banner = activeBanners[0];
  const lead = banner?.characters[0];
  const heroArt = banner?.image ?? "/images/hsin-splash.webp";
  const leadSlug = lead ? slugByName.get(lead.name) : undefined;
  const leadWeapon = banner?.weapons.find((w) => w.featuredFor === lead?.name) ?? banner?.weapons[0];
  const rateUps = banner?.characters.slice(1) ?? [];

  /* The masthead names the version that is LIVE. banners.json `_meta`
     moves to the next version as soon as it is announced, so when the two
     differ, the announced version is labelled as next, not as now. */
  const liveVersion = banner?.version ?? bannerMeta.version;
  const nextIsAnnounced = liveVersion !== bannerMeta.version;
  const nextStart = upNextPhases.find((p) => p.version === bannerMeta.version)?.startsAt;

  // LCP: start the hero art download from <head>, before the tile's <img> is parsed.
  preload(heroArt, { as: "image", imageSrcSet: srcSetFor(heroArt), imageSizes: BANNER_ART_SIZES, fetchPriority: "high" });

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

      {/* Masthead: compact so the live banner, codes and resets lead the
          first screen. The splash art lives once, in the banner tile. */}
      <section className="rs-hero" aria-labelledby="home-h1">
        <p className="rs-kicker rs-hero-kicker">
          <span className="rs-live-dot" aria-hidden="true" />
          {nextIsAnnounced ? (
            <>
              Version {liveVersion} · {banner?.phase} live
              <a href="#up-next" className="rs-hero-next">
                Next: {bannerMeta.version}
                <span className="rs-hero-next-title">&nbsp;{bannerMeta.versionTitle}</span>
                {nextStart ? ` · ${formatServerDay(nextStart)}` : ""}&nbsp;↓
              </a>
            </>
          ) : (
            <>
              Version {bannerMeta.version} · {bannerMeta.versionTitle}
            </>
          )}
        </p>
        <h1 id="home-h1" className="rs-hero-title">
          Wuthering Waves <span>today</span>
        </h1>
        <p className="rs-hero-sub">
          Live banners, working codes and every reset, verified against
          multiple sources.
        </p>
      </section>

      {/* Two independent columns on desktop (main + side) so a tall side tile
          never leaves a hole under the banner. On phones the columns
          dissolve (display: contents) and `order` interleaves the tiles:
          banner, codes, ending soon, resets, up next, pre-farm, beginner. */}
      <section id="today" className="rs-today" aria-label="Today at a glance">
        <div className="rs-col rs-col-main">
          {banner && lead ? (
            <div className="rs-tile-banner-wrap">
              <article className="rs-tile rs-tile-banner rs-spot">
                {/* eslint-disable-next-line @next/next/no-img-element -- tile art layer. */}
                <img
                  className="rs-banner-art"
                  src={heroArt}
                  srcSet={srcSetFor(heroArt)}
                  sizes={BANNER_ART_SIZES}
                  alt={banner.imageAlt ?? ""}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className="rs-banner-body">
                  <p className="rs-kicker">
                    Featured · {lead.element} · {banner.version} {banner.phase}
                  </p>
                  <h2 className="rs-banner-name">{lead.name}</h2>
                  {leadWeapon && (
                    <p className="rs-banner-weapon">
                      with <strong>{leadWeapon.name}</strong> · {leadWeapon.type}
                    </p>
                  )}
                  <RollingCountdown target={banner.endsAt} label="Banner ends in" />
                  <WaveProgress start={banner.startsAt} end={banner.endsAt} label="Banner time left" />
                  <p className="rs-banner-date">
                    <span>
                      Ends {formatServerDateTime(banner.endsAt)} server time (UTC+8)
                      {banner.uncertainFields?.includes("endsAt") ? " · est." : ""}
                    </span>
                    <span className="rs-banner-local">
                      <YourTime iso={banner.endsAt} prefix="= " />
                    </span>
                  </p>
                  <div className="rs-banner-actions">
                    {leadSlug && (
                      <Link href={`/characters/${leadSlug}`} className="rs-btn rs-btn-solid">
                        {lead.name} build
                      </Link>
                    )}
                    <Link href="/banners" className="rs-btn">
                      All banners
                    </Link>
                    <Link href="/pull-planner" className="rs-btn">
                      Plan my pulls
                    </Link>
                  </div>
                </div>
                {rateUps.length > 0 && (
                  <div className="rs-rateups">
                    <p className="rs-rateups-h">Also on rate-up, same end date</p>
                    <ul style={{ "--n": rateUps.length } as CSSProperties}>
                      {rateUps.map((c) => {
                        const slug = slugByName.get(c.name);
                        const inner = (
                          <>
                            <CharMedal className="rs-rateup-face" thumb={thumbByName(c.name)} name={c.name} size={40} rarity={c.rarity} />
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
            </div>
          ) : (
            <div className="rs-tile-banner-wrap">
              <article className="rs-tile">
                <p className="og-empty">No live banners right now. Check back after the next version livestream.</p>
              </article>
            </div>
          )}

          <Reveal delay={60} className="rs-tile-events-wrap">
            <article className="rs-tile rs-spot" id="events" aria-labelledby="events-h">
              <header className="rs-tile-head">
                <h2 id="events-h">Ending soon</h2>
                <Link href="/events" className="rs-tile-link">
                  All events →
                </Link>
              </header>
              <HomeEndingSoon events={events} codes={sortedCodes} builtAt={BUILT_AT} />
            </article>
          </Reveal>

          {nextVersion && (
            <div className="rs-tile-next-wrap">
              <NextVersionNote next={nextVersion} builtAt={BUILT_AT} variant="strip" />
            </div>
          )}

          {upNextPhases.length > 0 && (
            <Reveal delay={80} className="rs-tile-upnext-wrap">
              <HomeUpNext phases={upNextPhases} builtAt={BUILT_AT} />
            </Reveal>
          )}
        </div>

        <div className="rs-col rs-col-side">
          <Reveal delay={80} className="rs-tile-codes-wrap">
            <article className="rs-tile rs-spot" id="codes" aria-labelledby="codes-h">
              <HomeCodes codes={sortedCodes} updatedAt={codesUpdatedAt()} builtAt={BUILT_AT} />
            </article>
          </Reveal>

          <Reveal delay={140} className="rs-tile-resets-wrap">
            <article className="rs-tile rs-spot" id="resets">
              <ResetTimers />
            </article>
          </Reveal>

          {prefarmNow.map((p) => (
            <Reveal key={p.slug} delay={100} className="rs-tile-prefarm-wrap">
              <Link
                href={`/pre-farm/${p.slug}`}
                className="rs-tile rs-spot rs-tile-prefarm"
                style={p.color ? ({ "--opt": p.color } as CSSProperties) : undefined}
              >
                <div className="rs-prefarm-top">
                  <CharMedal thumb={p.thumb} name={p.name} size={56} rarity={5} className="rs-prefarm-face" />
                  <div>
                    <p className="rs-kicker">Pre-farm now</p>
                    <h2>{p.name}</h2>
                    {p.startsAt && <p className="rs-prefarm-when">Banner from {formatServerDay(p.startsAt)}</p>}
                  </div>
                </div>
                <p className="rs-muted">
                  {p.echoes.length > 0 ? `Echo sets to farm today: ${p.echoes.join(" · ")}.` : null}
                  {p.farmNow > 0 ? ` ${p.farmNow} materials you can farm now.` : null}
                  {p.partial ? " Material list not published yet." : null}
                </p>
                <span className="rs-tile-link">Open the pre-farm guide →</span>
              </Link>
            </Reveal>
          ))}

          <Reveal delay={120} className="rs-tile-new-wrap">
            <article className="rs-tile rs-spot rs-tile-new" aria-labelledby="new-h">
              <p className="rs-kicker">New to Solaris-3?</p>
              <h2 id="new-h">Your first week, decoded</h2>
              <p className="rs-muted">
                Four short guides: what to do first, beginner banners, your
                first teams, and the mistakes to skip.
              </p>
              <div className="rs-tile-new-links">
                <Link href="/beginner" className="rs-tile-link">
                  Start here →
                </Link>
                <Link href="/glossary" className="rs-tile-sublink">
                  Game terms in plain words →
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <div className="og-verify-block">
        <UpdatedStamp />
      </div>
    </>
  );
}

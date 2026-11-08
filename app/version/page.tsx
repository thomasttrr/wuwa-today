import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import ElementTheme from "@/components/ElementTheme";
import HomeCodes from "../../components/HomeCodes";
import Reveal from "../../components/Reveal";
import UpdatedStamp from "../../components/UpdatedStamp";
import { CharMedal, CharPoster } from "../../components/CharThumb";
import { activeCodes, bannerMeta, banners, codesUpdatedAt, events, outfits, type GameEvent } from "../../lib/data";
import { formatServerDay } from "../../lib/dates";
import { getCharacterByName } from "../../lib/characters";
import { elementColor } from "../../lib/elements";
import { getPrefarmGuide } from "../../lib/prefarm";
import { thumbFor } from "../../lib/renders";
import rendersData from "@/data/renders.json";
import VersionClock, { type ClockPhase } from "./VersionClock";
import PhaseStatus from "./PhaseStatus";
import LaunchChecklist, { launchSectionActive } from "./LaunchChecklist";
import "./version.css";

export const metadata: Metadata = {
  title: `Wuthering Waves ${bannerMeta.version} Overview — ${bannerMeta.versionTitle}: Banners, Events & Codes`,
  description: `Everything in Wuthering Waves Version ${bannerMeta.version}: both banner phases, the new Resonator, every event, the preview codes, and what's new — on one page.`,
  alternates: { canonical: "/version" },
};

const BUILT_AT = Date.now();

/* ---------------------------------------------------------------------------
   Data, assembled once at build time from the same files as every other page.
   --------------------------------------------------------------------------- */

const phases = banners
  .filter((b) => b.version === bannerMeta.version)
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

const isEstimated = (b: (typeof phases)[number]) =>
  !!b.uncertainFields?.some((f) => f === "startsAt" || f === "endsAt");

/** Each phase's headliner: its new 5-star, else the first listed. */
const leadOf = (b: (typeof phases)[number]) => b.characters.find((c) => c.isNew) ?? b.characters[0];

const clockPhases: ClockPhase[] = phases.map((b) => ({
  id: b.id,
  phase: b.phase,
  lead: leadOf(b).name,
  startsAt: b.startsAt,
  endsAt: b.endsAt,
  color: elementColor(leadOf(b).element),
  estimated: isEstimated(b),
}));

const versionStart = phases[0]?.startsAt;
const versionEnd = phases[phases.length - 1]?.endsAt;

const versionEvents: GameEvent[] =
  versionStart && versionEnd
    ? events
        .filter((e) => Date.parse(e.startsAt) >= Date.parse(versionStart) && Date.parse(e.startsAt) <= Date.parse(versionEnd))
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    : [];

/* Event groups, in the order a player cares about them. */
const EVENT_GROUPS: { type: GameEvent["type"]; label: string }[] = [
  { type: "limited", label: "Limited events & convenes" },
  { type: "login", label: "Log-in rewards" },
  { type: "leisure", label: "Leisure" },
  { type: "spending", label: "Spending events" },
  { type: "exploration", label: "Exploration" },
  { type: "trial", label: "Trials" },
  { type: "web", label: "Web events" },
  { type: "community", label: "Community" },
  { type: "permanent", label: "Permanent additions" },
];
const eventGroups = EVENT_GROUPS.map((g) => ({ ...g, items: versionEvents.filter((e) => e.type === g.type) })).filter(
  (g) => g.items.length > 0,
);
/* Before the in-game notice most events carry the same timing note: print
   the most common one once under the heading, and only the notes that say
   something different on their own cards. */
const noteCounts = new Map<string, number>();
for (const e of versionEvents) if (e.timeNote) noteCounts.set(e.timeNote, (noteCounts.get(e.timeNote) ?? 0) + 1);
const [topNote, topCount] = [...noteCounts].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
const sharedEventNote = topCount >= 2 ? topNote : null;

const versionCodes = activeCodes
  .filter((c) => (c.notes ?? "").includes(`Version ${bannerMeta.version}`))
  .map(({ code, rewards, expiresAt }) => ({ code, rewards, expiresAt }));

const newCosmetics = outfits.filter((o) => o.version === bannerMeta.version);

/* The new Resonator: phase 1's new 5-star. */
const newcomerBanner = phases.find((b) => b.characters.some((c) => c.isNew && c.rarity === 5));
const newcomerEntry = newcomerBanner?.characters.find((c) => c.isNew && c.rarity === 5);
const newcomer = newcomerEntry ? getCharacterByName(newcomerEntry.name) : undefined;
const newcomerWeapon = newcomerBanner?.weapons.find((w) => w.featuredFor === newcomerEntry?.name);
const newcomerGuide = newcomer ? getPrefarmGuide(newcomer.slug) : undefined;
const newcomerColor = newcomer ? elementColor(newcomer.profile.element) : undefined;

/* Hero art: the newcomer's full render, every size we have. */
type RenderSizes = Record<string, { sizes: { file: string; w: number }[] }>;
const heroRender = newcomer ? (rendersData.renders as RenderSizes)[newcomer.slug] : undefined;
const heroSizes = heroRender ? [...heroRender.sizes].sort((a, b) => a.w - b.w) : [];
const heroSrc = heroSizes[heroSizes.length - 1]?.file;
const heroSrcSet = heroSizes.map((s) => `${s.file} ${s.w}w`).join(", ");
const HERO_SIZES = "(max-width: 760px) 92vw, 560px";

/* Lily petals drifting through the hero: fixed values so the HTML is stable. */
const PETALS = [
  [6, 0, 14, 0.9], [18, 5.5, 17, 0.6], [29, 2.2, 15, 1.1], [41, 8.4, 19, 0.7],
  [53, 1.1, 16, 1], [64, 6.8, 18, 0.8], [76, 3.6, 14, 1.2], [88, 9.6, 20, 0.65],
  [94, 4.4, 16, 0.85], [12, 11, 18, 0.75], [47, 12.5, 17, 0.95], [70, 13.4, 15, 0.7],
] as const;

const SECTIONS = [
  ...(launchSectionActive(Date.now()) ? [{ id: "vo-launch", label: "Launch checklist" }] : []),
  { id: "vo-banners", label: "Banners" },
  ...(newcomer ? [{ id: "vo-new", label: newcomer.name }] : []),
  ...(versionEvents.length ? [{ id: "vo-events", label: "Events" }] : []),
  ...(versionCodes.length ? [{ id: "vo-codes", label: "Codes" }] : []),
  ...(newCosmetics.length ? [{ id: "vo-cosmetics", label: "Cosmetics" }] : []),
];

export default function VersionPage() {
  if (heroSrc) preload(heroSrc, { as: "image", imageSrcSet: heroSrcSet, imageSizes: HERO_SIZES, fetchPriority: "high" });

  return (
    <>
      {newcomerColor && <ElementTheme color={newcomerColor} />}

      {/* ---------------------------------------------------------- hero */}
      <header className="vo-hero">
        <div className="vo-petals" aria-hidden="true">
          {PETALS.map(([x, delay, dur, scale], i) => (
            <span
              key={i}
              style={{ "--x": `${x}%`, "--d": `${delay}s`, "--t": `${dur}s`, "--s": scale } as CSSProperties}
            />
          ))}
        </div>
        <span className="vo-hero-num" aria-hidden="true">
          {bannerMeta.version}
        </span>

        <div className="vo-hero-text">
          <p className="rs-kicker">Version {bannerMeta.version} · overview</p>
          <h1 className="vo-hero-title">{bannerMeta.versionTitle}</h1>
          <p className="vo-hero-lede">
            The whole patch on one page: {phases.length} banner phases
            {newcomer ? <>, a new Resonator in {newcomer.name}</> : null}
            {versionEvents.length ? <>, {versionEvents.length} events</> : null}, and what else is new.
          </p>
          <VersionClock phases={clockPhases} builtAt={BUILT_AT} />
        </div>

        {heroSrc && newcomer && (
          <div className="vo-hero-art">
            <span className="vo-hero-halo" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element -- static export; srcset from renders.json. */}
            <img
              src={heroSrc}
              srcSet={heroSrcSet}
              sizes={HERO_SIZES}
              alt={`${newcomer.name}, the new 5-star Resonator in Version ${bannerMeta.version}`}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        )}
      </header>

      <nav className="vo-jump" aria-label="On this page">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.label}
          </a>
        ))}
      </nav>

      <LaunchChecklist />

      {/* ------------------------------------------------------- banners */}
      <section className="vo-section" id="vo-banners" aria-labelledby="vo-banners-h">
        <Reveal>
          <div className="vo-section-head">
            <h2 id="vo-banners-h" className="vo-h">The banners</h2>
            <p className="vo-section-sub">Dates in server time (UTC+8){phases.some(isEstimated) ? "; est. = estimate until the in-game notice" : ""}.</p>
          </div>
        </Reveal>
        <div className="vo-phases">
          {phases.map((b, i) => {
            const lead = leadOf(b);
            const stars = b.characters.filter((c) => c.rarity === 5);
            const fours = b.characters.filter((c) => c.rarity === 4);
            return (
              <Reveal key={b.id} delay={i * 120}>
                <article className="vo-phase" style={{ "--c": elementColor(lead.element) } as CSSProperties}>
                  <header className="vo-phase-head">
                    <div>
                      <h3>{b.phase}</h3>
                      <p className="vo-phase-dates">
                        {formatServerDay(b.startsAt)} – {formatServerDay(b.endsAt)}
                        {isEstimated(b) && <span className="vo-est">est.</span>}
                      </p>
                    </div>
                    <PhaseStatus start={b.startsAt} end={b.endsAt} builtAt={BUILT_AT} />
                  </header>

                  <ul className="vo-posters">
                    {stars.map((c) => {
                      const rec = getCharacterByName(c.name);
                      const weapon = b.weapons.find((w) => w.featuredFor === c.name);
                      const body = (
                        <>
                          <CharPoster thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null} name={c.name} rarity={5}>
                            {c.isNew && <span className="vo-new-tag">New</span>}
                          </CharPoster>
                          <span className="vo-poster-meta">
                            {c.element} · {rec?.profile.role ?? c.weaponType}
                          </span>
                          {weapon && <span className="vo-poster-weapon">{weapon.name}</span>}
                        </>
                      );
                      return (
                        <li key={c.name} style={{ "--c": elementColor(c.element) } as CSSProperties}>
                          {rec ? (
                            <Link href={`/characters/${rec.slug}`} className="vo-poster">
                              {body}
                            </Link>
                          ) : (
                            <span className="vo-poster">{body}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {fours.length > 0 && (
                    <div className="vo-fours">
                      <span className="vo-fours-h">4★ rate-ups</span>
                      <ul>
                        {fours.map((c) => {
                          const rec = getCharacterByName(c.name);
                          return (
                            <li key={c.name} style={{ "--c": elementColor(c.element) } as CSSProperties}>
                              <CharMedal thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null} name={c.name} size={30} rarity={4} />
                              {c.name}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
        <p className="vo-more">
          <Link href="/pull-planner">Who to pull — Pull Planner →</Link>
          <Link href="/banners">Full banner schedule →</Link>
        </p>
      </section>

      {/* ----------------------------------------------------- newcomer */}
      {newcomer && (
        <section className="vo-section" id="vo-new" aria-labelledby="vo-new-h">
          <Reveal>
            <article className="vo-spot" style={{ "--c": newcomerColor } as CSSProperties}>
              <div className="vo-spot-art" aria-hidden="true">
                <span className="vo-spot-ring" />
                <span className="vo-spot-ring vo-spot-ring-2" />
                <CharMedal thumb={thumbFor(newcomer.slug, newcomer.profile.portrait_url)} name={newcomer.name} size={148} rarity={5} />
              </div>
              <div className="vo-spot-body">
                <p className="rs-kicker vo-spot-kicker">
                  New 5★ Resonator · {newcomer.profile.element} · {newcomer.profile.weapon_type}
                </p>
                <h2 id="vo-new-h" className="vo-spot-name">
                  {newcomer.name}
                </h2>
                <span className="vo-verdict">{newcomer.pull_verdict.verdict_label}</span>
                <dl className="vo-facts">
                  <div>
                    <dt>Role</dt>
                    <dd>{newcomer.profile.role}</dd>
                  </div>
                  {newcomerWeapon && (
                    <div>
                      <dt>Signature</dt>
                      <dd>{newcomerWeapon.name}</dd>
                    </div>
                  )}
                  {newcomerBanner && (
                    <div>
                      <dt>Banner</dt>
                      <dd>
                        {newcomerBanner.phase} · {formatServerDay(newcomerBanner.startsAt)} – {formatServerDay(newcomerBanner.endsAt)}
                      </dd>
                    </div>
                  )}
                </dl>
                <p className="vo-spot-text">{newcomer.pull_verdict.verdict}</p>
                {newcomer.profile.uncertain_or_prerelease && (
                  <p className="vo-beta">
                    <span>Beta</span> Kit details come from the preview broadcast; numbers can change at launch.
                  </p>
                )}
                <div className="vo-spot-links">
                  <Link href={`/characters/${newcomer.slug}`} className="rs-btn rs-btn-solid">
                    {newcomer.name}&apos;s build
                  </Link>
                  {newcomerGuide && (
                    <Link href={`/pre-farm/${newcomerGuide.slug}`} className="rs-btn">
                      Pre-farm checklist
                    </Link>
                  )}
                  <Link href="/pull-planner" className="rs-btn">
                    Pull planner
                  </Link>
                </div>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      {/* -------------------------------------------------------- events */}
      {versionEvents.length > 0 && (
        <section className="vo-section" id="vo-events" aria-labelledby="vo-events-h">
          <Reveal>
            <div className="vo-section-head">
              <h2 id="vo-events-h" className="vo-h">
                Events in {bannerMeta.version}
              </h2>
              {sharedEventNote && <p className="vo-section-sub">{sharedEventNote}</p>}
            </div>
          </Reveal>
          {eventGroups.map((g) => (
            <div key={g.type} className="vo-egroup">
              <h3 className="vo-egroup-h">
                {g.label} <span>{g.items.length}</span>
              </h3>
              <ul className="vo-events">
                {g.items.map((e, i) => (
                  <li key={e.id}>
                    <Reveal delay={Math.min(i, 5) * 60} className="vo-event-wrap">
                      <article className={`vo-event vo-event-${e.type}`}>
                        <h4 className="vo-event-name">{e.name}</h4>
                        <p className="vo-event-desc">{e.description}</p>
                        <p className="vo-event-rewards">
                          <span>Rewards</span> {e.rewards}
                        </p>
                        {e.timeNote && e.timeNote !== sharedEventNote && <p className="vo-event-note">{e.timeNote}</p>}
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="vo-more">
            <Link href="/events">All events, live and ending soon →</Link>
          </p>
        </section>
      )}

      {/* --------------------------------------------------------- codes */}
      {versionCodes.length > 0 && (
        <section className="vo-section" id="vo-codes" aria-labelledby="vo-codes-h">
          <Reveal>
            <article className="rs-tile vo-codes-tile">
              <HomeCodes
                codes={versionCodes}
                updatedAt={codesUpdatedAt()}
                builtAt={BUILT_AT}
                title={`${bannerMeta.version} preview codes`}
                headingId="vo-codes-h"
                emptyText={`The ${bannerMeta.version} preview codes have expired. Working codes are always on the Today page.`}
              />
            </article>
          </Reveal>
        </section>
      )}

      {/* ----------------------------------------------------- cosmetics */}
      {newCosmetics.length > 0 && (
        <section className="vo-section" id="vo-cosmetics" aria-labelledby="vo-cosmetics-h">
          <Reveal>
            <div className="vo-section-head">
              <h2 id="vo-cosmetics-h" className="vo-h">
                Also new in {bannerMeta.version}
              </h2>
            </div>
          </Reveal>
          <div className="vo-tiles">
            {newCosmetics.map((o, i) => (
              <Reveal key={o.id} delay={i * 100}>
                <Link href="/outfits" className="vo-tile">
                  <span className="vo-tile-img">
                    {/* eslint-disable-next-line @next/next/no-img-element -- static export. */}
                    <img src={o.image} alt={o.imageAlt} loading="lazy" decoding="async" />
                  </span>
                  <span className="vo-tile-kind">
                    {o.kind} · {o.character}
                  </span>
                  <span className="vo-tile-name">{o.name}</span>
                  <span className="vo-tile-meta">{o.availability}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="vo-more">
            <Link href="/outfits">The full cosmetics catalog →</Link>
          </p>
        </section>
      )}

      <div className="vo-stamp">
        <UpdatedStamp />
      </div>
    </>
  );
}

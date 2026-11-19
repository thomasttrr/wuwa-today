import fs from "node:fs";
import path from "node:path";
import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import AmHero from "../components/home/AmHero";
import AmGlance, { type GlanceUnlock } from "../components/home/AmGlance";
import AmEvents, { type AmEvent } from "../components/home/AmEvents";
import AmTimeline, { type AmPhase, type AmStop } from "../components/home/AmTimeline";
import AmArchive from "../components/home/AmArchive";
import { AmBar, AmRel } from "../components/home/AmTime";
import HomeCodes from "../components/HomeCodes";
import UpdatedStamp from "../components/UpdatedStamp";
import { CharMedal } from "../components/CharThumb";
import { activeBanners, activeCodes, banners, bannerMeta, codesUpdatedAt, events, nextVersion, nextVersionPending, noBannerLine, upcomingBanners, type Banner, type GameCharacter, BUILD_NOW } from "../lib/data";
import { formatServerDateTime, formatServerDay } from "../lib/dates";
import { getCharacterByName } from "../lib/characters";
import { elementColor } from "../lib/elements";
import { fullRender, thumbFor } from "../lib/renders";
import { prefarmGuides } from "../lib/prefarm";
import { V4_CAST, V4_LAUNCH_DAY, V4_TITLE, V4_TRAILER } from "../lib/v4-cast";
import { ARCHIVE_FILE, ARCHIVE_OPEN_QUESTION, ARCHIVE_RECORDS, ARCHIVE_TITLE } from "../lib/archive";
import "./home.css";

export const metadata: Metadata = {
  title: "WuWa Today — Wuthering Waves banners, codes & events",
  description:
    "Today in Wuthering Waves: live banners with countdowns, working redeem codes, active events, and daily/weekly reset timers. Updated daily.",
  alternates: { canonical: "/" },
};

// Build time seeds the client clock for the live lists (hydration-safe).
const BUILT_AT = BUILD_NOW;
const D = 86_400_000;

/* ---------- small data helpers ---------- */

const slugOf = (name: string) => getCharacterByName(name)?.slug ?? null;
const thumbOf = (name: string) => {
  const c = getCharacterByName(name);
  return c ? thumbFor(c.slug, c.profile.portrait_url) : null;
};

/** "A", "A and B", "A, B and C". */
function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Short event name for tight labels: the part before a colon. */
const shortName = (n: string) => n.split(":")[0].trim();

const SERVER_DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "Asia/Shanghai" });
const dayKey = (iso: string) => SERVER_DAY.format(new Date(iso));

/** Pull a headline figure out of an event's reward text: "400 Astrite per phase"
 *  -> 400 / "Astrite per phase"; "Double Echo drops" -> 2× / "Echo drops". */
function rewardHeadline(rewards: string): { amount: string | null; unit: string | null; reward: string } {
  const first = rewards.split(",")[0].trim();
  const a = rewards.match(/^([\d,]+)\s+Astrite(\s+per\s+\w+)?/i) ?? rewards.match(/Astrite\s*[x×]\s*([\d,]+)(\s+per\s+\w+)?/i);
  if (a) return { amount: a[1], unit: `Astrite${a[2] ?? ""}`, reward: first };
  const dbl = first.match(/^Double\s+(.+)$/i);
  if (dbl) return { amount: "2×", unit: dbl[1].charAt(0).toUpperCase() + dbl[1].slice(1), reward: first };
  return { amount: null, unit: null, reward: first.length > 44 ? `${first.slice(0, 42)}…` : first };
}

/** The featured weapon's splash, when we have one on disk. */
function weaponSplash(name: string | undefined): string | null {
  if (!name) return null;
  const file = `/images/weapons/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-splash.jpg`;
  return fs.existsSync(path.join(process.cwd(), "public", file)) ? file : null;
}

const statusLine = (c: GameCharacter) => (c.rarity === 5 ? (c.isNew ? "New 5★" : "5★ rerun") : "4★ rate-up");

/* ---------- section pieces ---------- */

function SectionHead({ id, title, meta, more }: { id: string; title: string; meta?: ReactNode; more?: { href: string; label: string } }) {
  return (
    <header className="am-sh">
      <h2 id={id}>{title}</h2>
      {meta && <span className="am-sh-meta">{meta}</span>}
      {more &&
        (more.href.startsWith("#") ? (
          <a className="am-sh-more" href={more.href}>
            {more.label}
          </a>
        ) : (
          <Link className="am-sh-more" href={more.href}>
            {more.label}
          </Link>
        ))}
    </header>
  );
}

function CharCard({ c, size, extra }: { c: GameCharacter; size: "feat" | "c5"; extra?: ReactNode }) {
  const slug = slugOf(c.name);
  const art = fullRender(slug);
  const body = (
    <>
      {size === "feat" && <span className="am-rays" aria-hidden="true" />}
      {art && (
        /* eslint-disable-next-line @next/next/no-img-element -- full-body render with its own srcset. */
        <img
          src={art.src}
          srcSet={art.srcSet}
          sizes={size === "feat" ? "(max-width: 900px) 92vw, 520px" : "(max-width: 900px) 46vw, 360px"}
          alt=""
          decoding="async"
          style={{ objectPosition: `${Math.round(art.fx * 100)}% ${size === "feat" ? "12%" : "4%"}` }}
        />
      )}
      {extra}
      <span className="am-cap">
        <span className="am-st5">{statusLine(c)}</span>
        <b>{c.name}</b>
        <span className="am-kit">
          {c.element}, {c.weaponType}
          {c.role ? `. ${c.role}.` : ""}
        </span>
      </span>
    </>
  );
  const cls = `am-card am-${size}`;
  const style = { "--ec": elementColor(c.element) } as CSSProperties;
  return slug ? (
    <Link href={`/characters/${slug}`} className={cls} style={style}>
      {body}
    </Link>
  ) : (
    <div className={cls} style={style}>
      {body}
    </div>
  );
}

function FourStars({ chars, id }: { chars: GameCharacter[]; id: string }) {
  if (chars.length === 0) return null;
  return (
    <div className="am-r4" role="group" aria-labelledby={id}>
      <p className="am-r4-h" id={id}>
        4★ rate-ups
      </p>
      {chars.map((c) => {
        const slug = slugOf(c.name);
        const inner = (
          <>
            <CharMedal thumb={thumbOf(c.name)} name={c.name} size={58} className="am-r4-pic" />
            <span className="am-r4-t">
              <b>{c.name}</b>
              <span className="am-kit">
                {c.element}, {c.weaponType}
              </span>
            </span>
          </>
        );
        const style = { "--ec": elementColor(c.element) } as CSSProperties;
        return slug ? (
          <Link key={c.name} href={`/characters/${slug}`} className="am-r4c" style={style}>
            {inner}
          </Link>
        ) : (
          <div key={c.name} className="am-r4c" style={style}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/** The featured 5-stars of a phase: the new ones if any, else all 5-stars. */
const featuredOf = (b: Banner) => {
  const fives = b.characters.filter((c) => c.rarity === 5);
  const fresh = fives.filter((c) => c.isNew);
  return fresh.length ? fresh : fives;
};

export default function HomePage() {
  const banner = activeBanners[0];
  const lead = banner?.characters[0];
  const leadSlug = lead ? slugOf(lead.name) : null;
  const heroArt = leadSlug ? fullRender(leadSlug) : null;
  const liveVersion = banner?.version ?? bannerMeta.version;
  /* banners.json `_meta` moves to the next version as soon as it is
     announced, so its title only names the live version while they match. */
  const versionTitle = liveVersion === bannerMeta.version ? bannerMeta.versionTitle : `Version ${liveVersion}`;
  /* The next-version takeover shows once it is revealed with a launch date,
     until its real banners are entered in banners.json. */
  const showNext = !!nextVersion?.launchLabel && nextVersionPending;
  const launchShort = nextVersion?.launchLabel?.replace(/,\s*\d{4}$/, "") ?? "";

  const heroNext =
    showNext && nextVersion
      ? {
          version: nextVersion.version,
          title: V4_TITLE,
          launchDay: V4_LAUNCH_DAY,
          launchLabel: launchShort,
          revealedAt: nextVersion.revealAt,
          revealedLabel: nextVersion.revealLabel,
          trailer: V4_TRAILER,
          blurb: `Version ${nextVersion.version} opens the New Federation on ${launchShort}. Seven new Resonators were revealed on ${nextVersion.revealLabel}; their kits are not announced yet.`,
          cast: V4_CAST.map((c) => ({ name: c.name, art: c.art })),
        }
      : null;

  // LCP: start the hero render download from <head>.
  if (heroArt) preload(heroArt.src, { as: "image", imageSrcSet: heroArt.srcSet, imageSizes: "(max-width: 900px) 92vw, 62vw", fetchPriority: "high" });

  /* hero copy */
  const otherFives = banner?.characters.filter((c) => c.rarity === 5 && c !== lead).map((c) => c.name) ?? [];
  const fours = banner?.characters.filter((c) => c.rarity === 4).map((c) => c.name) ?? [];
  const heroBlurb = lead
    ? `${lead.rarity}★ ${lead.element}, ${lead.weaponType}.${otherFives.length ? ` ${joinNames(otherFives)} ${otherFives.length > 1 ? "rerun" : "reruns"} alongside` : ""}${fours.length ? `${otherFives.length ? ", with" : " With"} ${joinNames(fours)} as 4★ rate-ups.` : "."}`
    : "";

  /* codes */
  const codes = [...activeCodes].sort((a, b) => {
    if (!a.expiresAt) return b.expiresAt ? 1 : 0;
    if (!b.expiresAt) return -1;
    return Date.parse(a.expiresAt) - Date.parse(b.expiresAt);
  });
  const codeCell = codes[0]
    ? { code: codes[0].code, rewards: codes[0].rewards.split(",").slice(0, 2).join(" and").trim(), count: codes.length }
    : null;

  /* events */
  type DatedEvent = (typeof events)[number] & { endsAt: string };
  const current = events.filter((e): e is DatedEvent => !!e.endsAt && Date.parse(e.endsAt) > BUILT_AT);
  const amEvents: AmEvent[] = current.map((e) => {
    const r = rewardHeadline(e.rewards ?? "");
    const [m, d] = dayKey(e.startsAt).split(" ");
    return {
      id: e.id,
      name: e.name,
      image: e.image ?? null,
      startsAt: e.startsAt,
      endsAt: e.endsAt,
      ...r,
      startLabel: { d, m },
      endLabel: formatServerDay(e.endsAt),
    };
  });
  const unlocks: GlanceUnlock[] = current
    .filter((e) => Date.parse(e.startsAt) > BUILT_AT)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
    .map((e) => {
      const r = rewardHeadline(e.rewards ?? "");
      return { name: e.name, startsAt: e.startsAt, reward: r.amount && /Astrite/.test(r.unit ?? "") ? `${r.amount} Astrite` : null };
    });

  /* timeline: this version's phases and every date that opens something */
  const vBanners = banners.filter((b) => b.version === liveVersion).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const vStart = vBanners[0]?.startsAt;
  const vEnd = vBanners.length ? vBanners.reduce((a, b) => (Date.parse(b.endsAt) > Date.parse(a.endsAt) ? b : a)).endsAt : undefined;
  const phases: AmPhase[] = vBanners.map((b) => {
    const f = featuredOf(b);
    return {
      id: b.id,
      label: b.phase,
      names: joinNames(f.map((c) => c.name.replace(/^.*?:\s*/, ""))),
      start: b.startsAt,
      end: b.endsAt,
      faces: f.map((c) => ({ name: c.name, thumb: thumbOf(c.name) })),
      color: elementColor(f[0]?.element ?? ""),
    };
  });
  const stops: AmStop[] = [];
  if (vStart && vEnd) {
    const byDay = new Map<string, { t: string; names: string[] }>();
    for (const e of events) {
      const t = Date.parse(e.startsAt);
      if (t < Date.parse(vStart) || t >= Date.parse(vEnd)) continue;
      const k = dayKey(e.startsAt);
      const g = byDay.get(k) ?? { t: e.startsAt, names: [] };
      if (Date.parse(e.startsAt) < Date.parse(g.t)) g.t = e.startsAt;
      g.names.push(shortName(e.name));
      byDay.set(k, g);
    }
    vBanners.forEach((b, i) => {
      const k = dayKey(b.startsAt);
      const g = byDay.get(k);
      const names = featuredOf(b).map((c) => c.name.replace(/^.*?:\s*/, ""));
      stops.push({
        t: b.startsAt,
        day: k,
        title: i === 0 ? `${joinNames(names)} banner opens` : `${b.phase}: ${joinNames(names)}`,
        sub: g ? g.names.slice(0, 3).join(", ") : null,
      });
      byDay.delete(k);
    });
    for (const [k, g] of byDay) stops.push({ t: g.t, day: k, title: g.names[0], sub: g.names.slice(1, 3).join(", ") || null });
    stops.push({
      t: vEnd,
      day: dayKey(vEnd),
      title: `${liveVersion} ends`,
      sub: showNext && nextVersion ? `${nextVersion.version} arrives ${launchShort}` : null,
    });
    stops.sort((a, b) => Date.parse(a.t) - Date.parse(b.t));
  }
  const vDays = vStart && vEnd ? Math.round((Date.parse(vEnd) - Date.parse(vStart)) / D) : 0;

  /* Phase 2 (the next phase in this version) */
  const nextPhase = upcomingBanners
    .filter((b) => b.version === liveVersion)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))[0];
  const p2Fives = nextPhase?.characters.filter((c) => c.rarity === 5) ?? [];
  const p2Fours = nextPhase?.characters.filter((c) => c.rarity === 4) ?? [];
  const p2SameDay = nextPhase
    ? events.filter((e) => dayKey(e.startsAt) === dayKey(nextPhase.startsAt)).map((e) => (e.name.includes(":") ? `the ${shortName(e.name)}` : e.name))
    : [];
  const p2NewCount = p2Fives.filter((c) => c.isNew).length;
  const p2Blurb = nextPhase
    ? `${p2Fives.length === 1 ? "One" : p2Fives.length === 2 ? "Two" : p2Fives.length === 3 ? "Three" : p2Fives.length} 5★ ${p2NewCount === 0 ? (p2Fives.length === 1 ? "rerun" : "reruns") : p2NewCount === p2Fives.length ? "debut" + (p2Fives.length === 1 ? "" : "s") : "banners"}${p2Fours.length ? `, with ${joinNames(p2Fours.map((c) => c.name))} as the 4★ rate-ups` : ""}.${p2SameDay.length ? ` ${joinNames(p2SameDay)} open${p2SameDay.length === 1 ? "s" : ""} the same day.` : ""}`
    : "";

  /* pre-farm + beginner */
  const prefarmNow = prefarmGuides
    .filter((g) => g.prerelease)
    .map((g) => {
      const b = upcomingBanners.find((x) => x.characters.some((c) => c.name === g.character));
      const ch = b?.characters.find((c) => c.name === g.character);
      return {
        slug: g.slug,
        name: g.character,
        startsAt: b?.startsAt ?? null,
        color: ch ? elementColor(ch.element) : undefined,
        thumb: thumbOf(g.character),
        echoes: (g.echoFarm ?? []).map((e) => e.name.split(" — ")[0]),
      };
    });

  return (
    <div className="am">
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
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="am-mark" viewBox="0 0 24 24">
          <path d="M12 1 13.4 6H15v4h2v4h2v9H5v-9h2v-4h2V6h1.6z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter" />
          <path d="M12 9v14M9 14v9M15 14v9" stroke="currentColor" strokeWidth="1" />
        </symbol>
      </svg>

      {banner && lead ? (
        <AmHero
          version={liveVersion}
          versionTitle={versionTitle}
          lead={{ name: lead.name, href: leadSlug ? `/characters/${leadSlug}` : null }}
          blurb={heroBlurb}
          render={heroArt}
          renderAlt={`${lead.name}, official full-body render`}
          banner={{
            startsAt: banner.startsAt,
            endsAt: banner.endsAt,
            phase: banner.phase,
            endLabel: formatServerDateTime(banner.endsAt).replace(",", " at"),
            estimated: !!banner.uncertainFields?.includes("endsAt"),
          }}
          next={heroNext}
          builtAt={BUILT_AT}
        />
      ) : heroNext ? (
        <AmHero version={heroNext.version} versionTitle={heroNext.title} lead={null} blurb="" render={null} renderAlt="" banner={null} next={heroNext} builtAt={BUILT_AT} />
      ) : (
        <section className="am-hero am-hero-empty" aria-labelledby="am-h1">
          <div className="am-wrap am-slide">
            <h1 id="am-h1" className="am-name am-name-sm">
              Wuthering Waves today
            </h1>
            <p className="am-lead">{noBannerLine(BUILT_AT)}</p>
          </div>
        </section>
      )}

      <AmGlance unlocks={unlocks} code={codeCell} />

      {/* Freshness right under the at-a-glance strip, so "is this current?"
          is answered before the visitor reads the banner. */}
      <div className="am-wrap am-verify">
        <UpdatedStamp />
      </div>

      {banner && (
        <section className="am-blk am-wrap" id="banner" aria-labelledby="am-h-banner">
          <SectionHead id="am-h-banner" title="Banner" meta={`${banner.phase}, ends ${formatServerDay(banner.endsAt)}`} more={{ href: "/banners", label: "All banners" }} />
          <div className="am-roster">
            {lead && (
              <CharCard
                c={lead}
                size="feat"
                extra={(() => {
                  const w = banner.weapons.find((x) => x.featuredFor === lead.name);
                  const art = weaponSplash(w?.name);
                  return w && art ? (
                    <span className="am-sig" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element -- weapon splash crop. */}
                      <img src={art} alt="" decoding="async" />
                      <span>
                        <b>{w.name}</b>Signature {w.type.toLowerCase()}
                      </span>
                    </span>
                  ) : null;
                })()}
              />
            )}
            {banner.characters
              .filter((c) => c.rarity === 5 && c !== lead)
              .map((c) => (
                <CharCard key={c.name} c={c} size="c5" />
              ))}
            <FourStars chars={banner.characters.filter((c) => c.rarity === 4)} id="am-r4-live" />
          </div>
        </section>
      )}

      {codes.length > 1 && (
        <section className="am-blk am-wrap" aria-labelledby="codes-h">
          <div className="am-codes">
            <HomeCodes codes={codes.map(({ code, rewards, expiresAt }) => ({ code, rewards, expiresAt }))} updatedAt={codesUpdatedAt()} builtAt={BUILT_AT} />
          </div>
        </section>
      )}

      <section className="am-blk am-wrap" id="events" aria-labelledby="am-h-events">
        <SectionHead id="am-h-events" title="Events" meta="Live and coming up, server time" more={{ href: "/events", label: "Full calendar" }} />
        <AmEvents events={amEvents} builtAt={BUILT_AT} />
      </section>

      {vStart && vEnd && (
        <section className="am-blk am-wrap" id="timeline" aria-labelledby="am-h-line">
          <SectionHead
            id="am-h-line"
            title="Timeline"
            meta={`${formatServerDay(vStart)} to ${formatServerDay(vEnd)}, ${vDays} days. Tall gold ticks are Monday weekly resets.`}
          />
          <AmTimeline
            start={vStart}
            end={vEnd}
            phases={phases}
            stops={stops}
            next={showNext && nextVersion ? { version: nextVersion.version, label: launchShort } : null}
            builtAt={BUILT_AT}
          />
        </section>
      )}

      {nextPhase && vStart && (
        <section className="am-blk am-wrap" id="phase2" aria-labelledby="am-h-p2">
          <SectionHead
            id="am-h-p2"
            title={nextPhase.phase}
            meta={`Opens ${formatServerDateTime(nextPhase.startsAt).replace(",", " at")}${nextPhase.uncertainFields?.includes("startsAt") ? " (estimated)" : ""}`}
            more={{ href: "/pull-planner", label: "Pull planner" }}
          />
          <div className="am-p2">
            <div>
              <span className="am-k">Opens in</span>
              <p className="am-big am-num">
                <AmRel target={nextPhase.startsAt} />
              </p>
              <AmBar start={vStart} end={nextPhase.startsAt} />
              <p className="am-p2-copy">{p2Blurb}</p>
            </div>
            <div className="am-cards3">
              {p2Fives.map((c) => (
                <CharCard key={c.name} c={c} size="c5" />
              ))}
              <FourStars chars={p2Fours} id="am-r4-next" />
            </div>
          </div>
        </section>
      )}

      {showNext && nextVersion && (
        <section className="am-blk am-wrap am-fed" id="fed" aria-labelledby="am-h-fed">
          <SectionHead
            id="am-h-fed"
            title="The New Federation"
            meta={`Version ${nextVersion.version}, ${V4_TITLE}`}
            more={{ href: "/version-4-0", label: "What we know" }}
          />
          <div className="am-fed-top">
            <div>
              <span className="am-k">Launch day, {launchShort}, in</span>
              <p className="am-big am-num am-gold">
                <AmRel target={V4_LAUNCH_DAY} />
              </p>
            </div>
            <p className="am-fed-copy">
              The New Federation, watched over by the Sentinel Promeus. Kuro revealed seven new Resonators on {nextVersion.revealLabel} alongside the trailer{" "}
              <em>{V4_TRAILER}</em>.
            </p>
          </div>
          <div className="am-fed-cards">
            {V4_CAST.map((c) => (
              <Link key={c.name} href="/version-4-0" className="am-fc" style={{ "--ca": c.accent } as CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element -- official card art. */}
                <img src={c.art} alt={c.alt} decoding="async" width={540} height={960} />
                <span className="am-fc-cap">
                  <b>{c.name}</b>
                  <i>{c.tagline}</i>
                </span>
              </Link>
            ))}
          </div>
          <p className="am-fed-note">Names and taglines are official. Elements, weapons and banner order are not announced yet.</p>
        </section>
      )}

      <section className="am-blk am-wrap" id="archive" aria-labelledby="am-h-arc">
        <SectionHead id="am-h-arc" title="Federated Cities Archive" meta="The Resonator War, as the game has shown it" />
        <AmArchive file={ARCHIVE_FILE} title={ARCHIVE_TITLE} records={ARCHIVE_RECORDS} question={ARCHIVE_OPEN_QUESTION} />
      </section>

      <section className="am-blk am-wrap" id="plan" aria-labelledby="am-h-plan">
        <SectionHead id="am-h-plan" title="Plan ahead" meta="Guides for what comes next" />
        <div className="am-plan">
          {prefarmNow.map((p) => (
            <Link key={p.slug} href={`/pre-farm/${p.slug}`} className="am-plan-card" style={p.color ? ({ "--ec": p.color } as CSSProperties) : undefined}>
              <CharMedal thumb={p.thumb} name={p.name} size={56} className="am-plan-face" />
              <span>
                <span className="am-k">Pre-farm now</span>
                <b>{p.name}</b>
                <span className="am-plan-sub">
                  {p.startsAt ? `Banner from ${formatServerDay(p.startsAt)}. ` : ""}
                  {p.echoes.length ? `Echo sets to farm: ${joinNames(p.echoes)}.` : "Materials to farm before release."}
                </span>
              </span>
            </Link>
          ))}
          <Link href="/beginner" className="am-plan-card">
            <span className="am-plan-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <use href="#am-mark" />
              </svg>
            </span>
            <span>
              <span className="am-k">New to Solaris-3?</span>
              <b>Your first week, decoded</b>
              <span className="am-plan-sub">What to do first, beginner banners, first teams, and the mistakes to skip.</span>
            </span>
          </Link>
          <Link href="/glossary" className="am-plan-card">
            <span className="am-plan-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <use href="#am-mark" />
              </svg>
            </span>
            <span>
              <span className="am-k">Glossary</span>
              <b>Game terms in plain words</b>
              <span className="am-plan-sub">The game&apos;s jargon, explained in a sentence each.</span>
            </span>
          </Link>
        </div>
      </section>

    </div>
  );
}

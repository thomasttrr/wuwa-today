import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "../../components/Reveal";
import RollingCountdown from "../../components/RollingCountdown";
import NextVersionNote from "../../components/NextVersionNote";
import SelectorCards from "../../components/SelectorCards";
import SelectorConvenes from "../../components/SelectorConvenes";
import UpdatedStamp from "../../components/UpdatedStamp";
import WaveProgress from "../../components/WaveProgress";
import {
  activeBanners,
  upcomingBanners,
  bannerHistory,
  bannerMeta,
  nextVersion,
  formatServerDate,
  type Banner,
  type GameCharacter,
} from "../../lib/data";
import { characters } from "../../lib/characters";
import { elementColor } from "../../lib/elements";
import { buildTierModel, PRYDWEN_TIERS } from "../../lib/tiers";
import { thumbFor } from "../../lib/renders";
import { CharMedal, CharPoster } from "../../components/CharThumb";
import "./banners.css";

export const metadata: Metadata = {
  title: "Wuthering Waves Banners — Current, Upcoming & History",
  description:
    "Who's on the current Wuthering Waves banner right now? Live featured banners with countdowns, who's worth pulling, what's coming next (official vs. leak labeled), and the full banner timeline.",
  alternates: { canonical: "/banners" },
};

// Build time seeds the client clock for the next-version note (hydration-safe).
const BUILT_AT = Date.now();

import { srcSetFor } from "@/lib/images";
const bySlug = new Map(characters.map((c) => [c.slug, c]));
const slugByName = new Map(characters.map((c) => [c.name, c.slug]));
const tiers = new Map(buildTierModel().chars.map((c) => [c.slug, c]));


/** Best Prydwen Tower of Adversity placement, for the lineup cards. */
function communityTier(slug: string | undefined): string | null {
  const t = slug ? tiers.get(slug) : undefined;
  const ps = t?.prydwen["Tower of Adversity"] ?? [];
  if (ps.length === 0) return null;
  const best = ps.reduce((a, b) => (PRYDWEN_TIERS.indexOf(b.tier) < PRYDWEN_TIERS.indexOf(a.tier) ? b : a));
  return `${best.tier} ${best.role}`;
}

const STATUS_LABEL: Record<string, string> = { new: "New", rerun: "Rerun", "rate-up": "Rate-up" };

function LineupCard({ c, banner, lead }: { c: GameCharacter; banner: Banner; lead: boolean }) {
  const slug = slugByName.get(c.name);
  const rec = slug ? bySlug.get(slug) : undefined;
  const weapon = banner.weapons.find((w) => w.featuredFor === c.name);
  const ours = slug ? tiers.get(slug)?.ours : null;
  const community = communityTier(slug);
  const body = (
    <>
      <div className="bn-card-face">
        <CharPoster thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null} name={c.name} rarity={c.rarity} hideName />
      </div>
      <div className="bn-card-main">
        <p className="bn-card-kicker">
          <span className={`bn-status bn-status-${c.status}`}>{STATUS_LABEL[c.status]}</span>
          {c.element} · {c.weaponType}
        </p>
        <h3 className="bn-card-name">{c.name}</h3>
        {weapon && (
          <p className="bn-card-weapon">
            Signature: <strong>{weapon.name}</strong>
          </p>
        )}
        <dl className="bn-card-tiers">
          <div>
            <dt>Our tier</dt>
            <dd>{ours ? ours.tier : <span className="bn-unranked">Not ranked</span>}</dd>
          </div>
          <div>
            <dt>Community · ToA</dt>
            <dd>{community ?? <span className="bn-unranked">Not ranked</span>}</dd>
          </div>
        </dl>
        {ours?.note && <p className="bn-card-note">{ours.note}</p>}
        {rec && <span className="bn-card-cta">Build, teams and pull verdict →</span>}
      </div>
    </>
  );
  const style = { "--c": elementColor(c.element) } as CSSProperties;
  const cls = `bn-card rs-spot${lead ? " bn-card-lead" : ""}`;
  return rec ? (
    <Link href={`/characters/${slug}`} className={cls} style={style}>
      {body}
    </Link>
  ) : (
    <article className={cls} style={style}>
      {body}
    </article>
  );
}

interface TimelineNode {
  id: string;
  version: string;
  phase: string;
  startsAt: string;
  endsAt: string;
  headliner: string | null;
  state: "past" | "now" | "next";
}

export default function BannersPage() {
  const live = activeBanners[0];
  const lead = live?.characters[0];
  const fiveStars = live?.characters.filter((c) => c.rarity === 5) ?? [];
  const fourStars = live?.characters.filter((c) => c.rarity === 4) ?? [];
  const art = live?.image;

  const timeline: TimelineNode[] = [
    ...[...bannerHistory]
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((h) => ({
        id: h.id,
        version: h.version,
        phase: h.phase,
        startsAt: h.startsAt,
        endsAt: h.endsAt,
        headliner: /^([^(]+?)\s*\(/.exec(h.note)?.[1]?.trim() ?? null,
        state: "past" as const,
      })),
    ...activeBanners.map((b) => ({
      id: b.id,
      version: b.version,
      phase: b.phase,
      startsAt: b.startsAt,
      endsAt: b.endsAt,
      headliner: b.characters[0]?.name ?? null,
      state: "now" as const,
    })),
    ...upcomingBanners.map((b) => ({
      id: b.id,
      version: b.version,
      phase: b.phase,
      startsAt: b.startsAt,
      endsAt: b.endsAt,
      headliner: b.characters[0]?.name ?? null,
      state: "next" as const,
    })),
  ];

  return (
    <>
      {live && lead ? (
        <section className="bn-stage" aria-labelledby="bn-title">
          {art && (
            // eslint-disable-next-line @next/next/no-img-element -- stage art layer; static export is unoptimized.
            <img
              className="bn-stage-art"
              src={art}
              srcSet={srcSetFor(art)}
              sizes="(max-width: 760px) 100vw, 760px"
              alt={live.imageAlt ?? `Official key art for the ${live.version} ${live.phase} banner`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          )}
          <div className="bn-stage-body">
            <p className="rs-kicker">
              <span className="rs-live-dot" aria-hidden="true" /> Live now · Version {live.version} · {live.phase}
            </p>
            <h1 id="bn-title" className="bn-stage-title">
              {lead.name}
            </h1>
            <p className="bn-stage-sub">
              {fiveStars.length > 1
                ? `New 5★ ${lead.element} ${lead.weaponType}, with ${fiveStars
                    .slice(1)
                    .map((c) => c.name)
                    .join(" and ")} on rerun.`
                : `New 5★ ${lead.element} ${lead.weaponType}.`}
            </p>
            <RollingCountdown target={live.endsAt} label="Banner ends in" />
            <WaveProgress start={live.startsAt} end={live.endsAt} label="Phase time left" />
            <p className="bn-stage-dates">
              {formatServerDate(live.startsAt)} → {formatServerDate(live.endsAt)} · server time (UTC+8)
              {live.uncertainFields?.length ? " · dates estimated" : ""}
            </p>
          </div>
        </section>
      ) : (
        <header className="bn-stage bn-stage-empty">
          <h1 className="bn-stage-title">Banners</h1>
          <p className="bn-stage-sub">No live banner right now. Check back after the next version livestream.</p>
        </header>
      )}

      {live && (
        <section className="bn-section" aria-labelledby="bn-lineup-h">
          <header className="bn-section-head">
            <h2 id="bn-lineup-h">Who&apos;s on this banner</h2>
            <p>Tap a Resonator for the full build and pull verdict.</p>
          </header>
          <div className="bn-lineup">
            {fiveStars.map((c, i) => (
              <Reveal key={c.name} delay={i * 70}>
                <LineupCard c={c} banner={live} lead={i === 0} />
              </Reveal>
            ))}
          </div>
          {fourStars.length > 0 && (
            <div className="bn-fours">
              <p className="bn-fours-h">4★ rate-ups</p>
              <ul>
                {fourStars.map((c) => {
                  const slug = slugByName.get(c.name);
                  const rec = slug ? bySlug.get(slug) : undefined;
                  const inner = (
                    <>
                      <CharMedal thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null} name={c.name} size={34} rarity={4} />
                      <span className="bn-four-name">{c.name}</span>
                      <span className="bn-four-meta">{c.element}</span>
                    </>
                  );
                  return (
                    <li key={c.name} style={{ "--c": elementColor(c.element) } as CSSProperties}>
                      {slug ? <Link href={`/characters/${slug}`}>{inner}</Link> : <span>{inner}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      <SelectorConvenes />

      <SelectorCards />

      <section className="bn-section" aria-labelledby="bn-timeline-h">
        <header className="bn-section-head">
          <h2 id="bn-timeline-h">Banner timeline</h2>
          <p>Every phase on record, all dates in server time (UTC+8).</p>
        </header>
        <ol className="bn-timeline">
          {timeline.map((n) => {
            const slug = n.headliner ? slugByName.get(n.headliner) : undefined;
            const rec = slug ? bySlug.get(slug) : undefined;
            const color = rec ? elementColor(rec.profile.element) : undefined;
            const node = (
              <>
                <CharMedal
                  className="bn-node-face"
                  thumb={rec ? thumbFor(rec.slug, rec.profile.portrait_url) : null}
                  name={n.headliner ?? "?"}
                  size={56}
                  rarity={5}
                />
                <span className="bn-node-ver">
                  {n.version} · {n.phase}
                </span>
                <span className="bn-node-name">{n.headliner ?? "TBA"}</span>
                <span className="bn-node-date">
                  {formatServerDate(n.startsAt)} – {formatServerDate(n.endsAt)}
                </span>
                {n.state === "now" && <span className="bn-node-here">Now</span>}
              </>
            );
            return (
              <li key={n.id} className={`bn-node bn-node-${n.state}`} style={color ? ({ "--c": color } as CSSProperties) : undefined}>
                {slug ? <Link href={`/characters/${slug}`}>{node}</Link> : <div>{node}</div>}
              </li>
            );
          })}
          {upcomingBanners.length === 0 && (
            <li className="bn-node bn-node-tba">
              <div>
                <CharMedal className="bn-node-face" thumb={null} name="?" size={56} />
                {nextVersion ? (
                  <NextVersionNote next={nextVersion} builtAt={BUILT_AT} variant="node" />
                ) : (
                  <>
                    <span className="bn-node-ver">Next phase</span>
                    <span className="bn-node-name">Not announced</span>
                    <span className="bn-node-date">Lands here once Kuro Games confirms it</span>
                  </>
                )}
              </div>
            </li>
          )}
        </ol>
      </section>

      {live && (
        <details className="bn-trust">
          <summary>
            <span>How sure are these dates?</span>
            <span className="rs-chip">
              {live.confidence ? `${live.confidence} confidence` : "Unrated"}
            </span>
          </summary>
          <div className="bn-trust-body">
            {live.timeNote && <p>{live.timeNote}</p>}
            {live.sources.length > 0 && (
              <>
                <p className="bn-trust-h">Sources checked</p>
                <ul>
                  {live.sources.map((s) => (
                    <li key={s}>
                      <a href={s} target="_blank" rel="noopener noreferrer">
                        {new URL(s).hostname.replace(/^www\./, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {live.imageCredit && <p className="bn-trust-credit">{live.imageCredit}</p>}
            <UpdatedStamp />
          </div>
        </details>
      )}
      <p className="bn-version-note">
        Version {bannerMeta.version}: {bannerMeta.versionTitle}
      </p>
    </>
  );
}

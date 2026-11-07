import PageHero from "@/components/PageHero";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Availability from "../../components/Availability";
import CopyButton from "../../components/CopyButton";
import UpdatedStamp from "../../components/UpdatedStamp";
import { CharMedal } from "../../components/CharThumb";
import {
  activeCodes,
  bannerMeta,
  banners,
  events,
  formatServerDate,
  outfits,
} from "../../lib/data";
import { characters, getCharacter } from "../../lib/characters";
import { elementColor } from "../../lib/elements";
import { getPrefarmGuide } from "../../lib/prefarm";
import { thumbFor } from "../../lib/renders";
import "./version.css";

export const metadata: Metadata = {
  title: `Version ${bannerMeta.version} Overview — ${bannerMeta.versionTitle}`,
  description: `Everything in Wuthering Waves Version ${bannerMeta.version}: both banner phases, the new Resonator, every event, the preview codes, and what's new — on one page.`,
  alternates: { canonical: "/version" },
};

const BUILT_AT = Date.now();
const slugByName = new Map(characters.map((c) => [c.name, c.slug]));

export default function VersionPage() {
  const phases = banners
    .filter((b) => b.version === bannerMeta.version)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const p1 = phases[0];
  const p2 = phases[phases.length - 1];
  const now = BUILT_AT;

  const status =
    !p1 || now < Date.parse(p1.startsAt)
      ? `Launches ${p1 ? formatServerDate(p1.startsAt) : ""}`
      : now <= Date.parse(p1.endsAt)
        ? `Live now — Phase 1 ends ${formatServerDate(p1.endsAt)}`
        : p2 && now <= Date.parse(p2.endsAt)
          ? `Live now — Phase 2 ends ${formatServerDate(p2.endsAt)}`
          : "This version has ended";

  const versionEvents = p1 && p2
    ? events
        .filter((e) => {
          const s = Date.parse(e.startsAt);
          return s >= Date.parse(p1.startsAt) && s <= Date.parse(p2.endsAt);
        })
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    : [];

  const versionCodes = activeCodes.filter((c) =>
    (c.notes ?? "").includes(`Version ${bannerMeta.version}`),
  );

  const newCosmetics = outfits.filter((o) => o.version === bannerMeta.version);
  const lily = getCharacter("lily");
  const lilyGuide = getPrefarmGuide("lily");

  return (
    <>
      <PageHero
        kicker={<>Version overview</>}
        title={`Version ${bannerMeta.version} — ${bannerMeta.versionTitle}`}
      >
        Everything in this patch on one page: the banners, the new Resonator,
        every event, and what else is new. <strong>{status}.</strong>
      </PageHero>

      <section className="vo-section" aria-labelledby="vo-banners-h">
        <h2 id="vo-banners-h" className="vo-h">The banners</h2>
        <div className="vo-phases">
          {phases.map((b) => (
            <article key={b.id} className="vo-phase">
              <div className="vo-phase-head">
                <h3>
                  {b.phase} · {formatServerDate(b.startsAt)} – {formatServerDate(b.endsAt)}
                </h3>
                <Availability start={b.startsAt} end={b.endsAt} builtAt={BUILT_AT} />
              </div>
              <div className="vo-stars">
                {b.characters
                  .filter((c) => c.rarity === 5)
                  .map((c) => {
                    const slug = slugByName.get(c.name);
                    const rec = slug ? getCharacter(slug) : null;
                    return (
                      <div key={c.name} className="vo-star" style={{ "--c": elementColor(c.element) } as CSSProperties}>
                        {slug && rec ? (
                          <CharMedal thumb={thumbFor(slug, rec.profile.portrait_url)} name={c.name} size={56} rarity={5} />
                        ) : null}
                        <div>
                          {slug ? (
                            <Link href={`/characters/${slug}`} className="vo-star-name">{c.name}</Link>
                          ) : (
                            <span className="vo-star-name">{c.name}</span>
                          )}
                          <p className="vo-star-meta">{c.element} · {rec?.profile.role ?? ""}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <p className="vo-four">
                4-star rate-ups: {b.characters.filter((c) => c.rarity === 4).map((c) => c.name).join(" · ")}
              </p>
              <p className="vo-weapons">
                Weapons: {b.weapons.map((w) => `${w.name} (${w.featuredFor})`).join(" · ")}
              </p>
            </article>
          ))}
        </div>
        <p className="vo-more">
          <Link href="/banners">Full banner schedule →</Link> ·{" "}
          <Link href="/pull-planner">Pull Planner — who to pull →</Link>
        </p>
      </section>

      {lily && (
        <section className="vo-section" aria-labelledby="vo-lily-h">
          <h2 id="vo-lily-h" className="vo-h">New Resonator: Lily</h2>
          <article className="vo-spot" style={{ "--c": elementColor(lily.profile.element) } as CSSProperties}>
            <CharMedal thumb={thumbFor("lily", lily.profile.portrait_url)} name="Lily" size={72} rarity={5} />
            <div className="vo-spot-body">
              <span className="vo-verdict">{lily.pull_verdict.verdict_label}</span>
              <p>{lily.pull_verdict.verdict}</p>
              <p className="vo-spot-links">
                <Link href="/characters/lily">Lily&apos;s page &amp; build →</Link>
                {lilyGuide && <Link href="/pre-farm/lily">Pre-farm checklist →</Link>}
                <Link href="/pull-planner">Pull guide &amp; planner →</Link>
              </p>
            </div>
          </article>
        </section>
      )}

      {versionEvents.length > 0 && (
        <section className="vo-section" aria-labelledby="vo-events-h">
          <h2 id="vo-events-h" className="vo-h">Events in {bannerMeta.version}</h2>
          <ul className="vo-events">
            {versionEvents.map((e) => (
              <li key={e.id} className="vo-event">
                <div className="vo-event-main">
                  <span className="vo-event-name">{e.name}</span>
                  <span className="vo-event-type">{e.type}</span>
                </div>
                <p className="vo-event-rewards">{e.rewards}</p>
                <p className="vo-event-note">{e.timeNote}</p>
              </li>
            ))}
          </ul>
          <p className="vo-more">
            <Link href="/events">All events, live and ending soon →</Link>
          </p>
        </section>
      )}

      {versionCodes.length > 0 && (
        <section className="vo-section" aria-labelledby="vo-codes-h">
          <h2 id="vo-codes-h" className="vo-h">{bannerMeta.version} preview codes</h2>
          <ul className="vo-codes">
            {versionCodes.map((c) => (
              <li key={c.code} className="vo-code">
                <code>{c.code}</code>
                <span className="vo-code-rewards">{c.rewards}</span>
                <span className="vo-code-exp">
                  {c.expiresAt ? `Expires ${formatServerDate(c.expiresAt)}` : "No expiry announced"}
                </span>
                <CopyButton text={c.code} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {newCosmetics.length > 0 && (
        <section className="vo-section" aria-labelledby="vo-new-h">
          <h2 id="vo-new-h" className="vo-h">Also new in {bannerMeta.version}</h2>
          <div className="vo-tiles">
            {newCosmetics.map((o) => (
              <Link key={o.id} href="/outfits" className="vo-tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.image} alt={o.imageAlt} loading="lazy" />
                <span className="vo-tile-name">{o.name}</span>
                <span className="vo-tile-meta">{o.kind} · {o.character}</span>
              </Link>
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

"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import { CharMedal } from "./CharThumb";
import { formatServerDay } from "../lib/dates";
import type { Thumb } from "../lib/renders";

export interface UpNextCharacter {
  name: string;
  slug: string | null;
  element: string;
  color: string;
  isNew: boolean;
  thumb: Thumb | null;
  /** Featured weapon, shown for new characters only. */
  weapon: { name: string; type: string } | null;
}

export interface UpNextPhase {
  id: string;
  version: string;
  versionTitle: string | null;
  phase: string;
  startsAt: string;
  endsAt: string;
  /** Phase boundaries are community estimates until the in-game notice. */
  estimated: boolean;
  fiveStars: UpNextCharacter[];
}

/**
 * Homepage "Up next": the next banner phases from data/banners.json, with a
 * countdown to the first one. Filtered on the shared clock so a phase that
 * has started (before the next rebuild swaps the featured banner) drops out
 * instead of counting down to a time already passed.
 */
export default function HomeUpNext({ phases, builtAt }: { phases: UpNextPhase[]; builtAt: number }) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  const upcoming = phases.filter((p) => Date.parse(p.startsAt) > now).slice(0, 2);
  if (upcoming.length === 0) return null;

  const first = upcoming[0];
  const versionLine = `Version ${first.version}${first.versionTitle ? ` · ${first.versionTitle}` : ""}`;

  return (
    <article className="rs-tile rs-spot rs-upnext" id="up-next" aria-labelledby="upnext-h">
      <header className="rs-tile-head rs-upnext-head">
        <div>
          <p className="rs-kicker">{versionLine}</p>
          <h2 id="upnext-h">Up next</h2>
        </div>
        <Link href="/banners" className="rs-tile-link">
          All banners →
        </Link>
      </header>

      <div className="rs-upnext-start">
        <span className="rs-upnext-start-l">
          {first.phase} starts in{first.estimated ? " (est.)" : ""}
        </span>
        <RollingCountdown size="sm" target={first.startsAt} label={`${first.phase} starts in`} />
      </div>

      <ol className="rs-phases">
        {upcoming.map((p) => (
          <li key={p.id} className="rs-phase">
            <p className="rs-phase-head">
              <span className="rs-phase-name">
                {p.version} {p.phase}
              </span>
              <span className="rs-phase-dates">
                {formatServerDay(p.startsAt)} – {formatServerDay(p.endsAt)}
                {p.estimated && (
                  <span className="rs-est" title="Phase dates are estimates until the in-game Convene notice">
                    est.
                  </span>
                )}
              </span>
            </p>
            <ul className="rs-phase-chars">
              {p.fiveStars.map((c) => {
                const inner = (
                  <>
                    <CharMedal thumb={c.thumb} name={c.name} size={44} rarity={5} className="rs-phase-face" />
                    <span className="rs-phase-char-name">{c.name}</span>
                    <span className="rs-phase-char-meta">
                      {c.isNew ? <strong>New</strong> : "Rerun"} · {c.element}
                    </span>
                    {c.weapon && (
                      <span className="rs-phase-char-weapon">
                        Signature: {c.weapon.name} · {c.weapon.type}
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={c.name} style={{ "--opt": c.color } as CSSProperties} className={c.isNew ? "is-new" : undefined}>
                    {c.slug ? <Link href={`/characters/${c.slug}`}>{inner}</Link> : <span>{inner}</span>}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
      <p className="rs-upnext-note">Dates in server time (UTC+8).</p>
    </article>
  );
}

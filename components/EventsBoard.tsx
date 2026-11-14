"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import { formatServerDate } from "../lib/dates";
import type { GameEvent } from "../lib/data";

const TYPE_LABELS: Record<string, string> = {
  limited: "Limited",
  login: "Login",
  spending: "Spending",
  permanent: "Permanent",
  web: "Web",
  leisure: "Leisure",
  exploration: "Exploration",
  community: "Community",
  trial: "Trial",
};

type Live = "live" | "soon" | "ended" | "always";
const DAY = 86_400_000;

/** Status from the dates, not the stored field: a static export would
 * otherwise keep showing yesterday's statuses until the next data push. */
function statusOf(e: GameEvent, now: number): Live {
  const s = new Date(e.startsAt).getTime();
  const end = e.endsAt ? new Date(e.endsAt).getTime() : null;
  if (now < s) return "soon";
  if (end === null) return "always";
  return now < end ? "live" : "ended";
}

/** Small square crop of an event's key art, made by `npm run thumbs:events`
 * (same file name under /images/events/thumbs/). Run it after adding an event. */
const thumbOf = (image: string) => image.replace("/images/events/", "/images/events/thumbs/");

/** Art tile in a timeline label. An event without art gets a visible empty
 * tile rather than a silent gap, so a missing image is easy to spot. */
function TlArt({ image }: { image?: string | null }) {
  if (!image) return <span className="ev-tl-art ev-tl-art-none" aria-hidden="true" />;
  return (
    <span className="ev-tl-art" aria-hidden="true">
      <img
        src={thumbOf(image)}
        alt=""
        width={96}
        height={96}
        loading="lazy"
        decoding="async"
        // A new event whose thumb is not generated yet falls back to the full art.
        onError={(ev) => {
          if (!ev.currentTarget.src.endsWith(image)) ev.currentTarget.src = image;
        }}
      />
    </span>
  );
}

/**
 * Events board: live summary, a version timeline (one bar per event with a
 * "now" line), then ending-soon / starting-soon / permanent sections and a
 * collapsed recently-ended list. Server render uses the build time; the
 * shared clock takes over after hydration.
 */
export default function EventsBoard({ events, builtAt }: { events: GameEvent[]; builtAt: number }) {
  const clock = useNow(30_000);
  const now = clock ? clock.getTime() : builtAt;
  const [type, setType] = useState<string | null>(null);

  const types = useMemo(() => [...new Set(events.map((e) => e.type))].sort(), [events]);
  const list = events.filter((e) => !type || e.type === type);
  const withStatus = list.map((e) => ({ e, st: statusOf(e, now) }));
  // Compare instants, not strings — stored times can carry different offsets.
  const ts = (iso: string | null) => (iso ? Date.parse(iso) : Infinity);
  const byEnd = (a: { e: GameEvent }, b: { e: GameEvent }) => {
    const x = ts(a.e.endsAt);
    const y = ts(b.e.endsAt);
    return x === y ? 0 : x < y ? -1 : 1;
  };
  const live = withStatus.filter((x) => x.st === "live").sort(byEnd);
  const soon = withStatus.filter((x) => x.st === "soon").sort((a, b) => ts(a.e.startsAt) - ts(b.e.startsAt));
  const always = withStatus.filter((x) => x.st === "always");
  const ended = withStatus.filter((x) => x.st === "ended").sort((a, b) => byEnd(b, a));

  // Timeline window: earliest start to latest end among dated events.
  const dated = events.filter((e) => e.endsAt);
  const t0 = dated.length ? Math.min(...dated.map((e) => new Date(e.startsAt).getTime())) : builtAt;
  const t1 = dated.length ? Math.max(...dated.map((e) => new Date(e.endsAt!).getTime())) : builtAt;
  const span = t1 - t0;
  const pct = (t: number) => (span > 0 ? `${((Math.min(Math.max(t, t0), t1) - t0) / span) * 100}%` : "0%");
  const ticks: number[] = [];
  const first = new Date(t0);
  first.setUTCHours(0, 0, 0, 0);
  for (let t = first.getTime() + DAY; t < t1; t += 7 * DAY) ticks.push(t);
  const timeline = [...live, ...soon, ...ended.slice(0, 3)].filter((x) => x.e.endsAt);
  const tlGroups = [
    { key: "live", label: "Live", items: live.filter((x) => x.e.endsAt) },
    { key: "soon", label: "Starting soon", items: soon.filter((x) => x.e.endsAt) },
    { key: "ended", label: "Recently ended", items: ended.slice(0, 3) },
  ].filter((g) => g.items.length > 0);
  const shortDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Shanghai" });

  const urgent = live[0];

  // When the chart is wider than the screen (phones), open it scrolled so
  // the "now" line sits ~60% across instead of showing the version start.
  const scrollRef = useRef<HTMLDivElement>(null);
  const nowFrac = span > 0 ? (Math.min(Math.max(now, t0), t1) - t0) / span : 0;
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth || el.scrollLeft > 0) return;
    el.scrollLeft = Math.max(0, el.scrollWidth * nowFrac - el.clientWidth * 0.6);
  }, [nowFrac]);

  // Lane width in px, so axis labels can be thinned to what actually fits.
  const lanesRef = useRef<HTMLDivElement>(null);
  const [laneW, setLaneW] = useState(0);
  const hasTimeline = timeline.length > 0;
  useEffect(() => {
    const el = lanesRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setLaneW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [hasTimeline]);
  // Labels: weekly where they fit, every 2nd or 3rd week on narrow lanes, and
  // never under the "Now" pill or past the chart's right edge. The dashed
  // lines stay weekly. Hidden until the lane is measured, so a first paint
  // never shows the overlapping set.
  const pxPerDay = laneW > 0 && span > 0 ? (laneW / span) * DAY : 0;
  const labelEvery = pxPerDay > 0 ? Math.max(1, Math.ceil(54 / (pxPerDay * 7))) : 1;
  const nowX = span > 0 ? ((Math.min(Math.max(now, t0), t1) - t0) / span) * laneW : 0;
  const showTickLabel = (t: number, i: number) => {
    if (i % labelEvery !== 0) return false;
    const x = ((t - t0) / span) * laneW;
    return !(x > nowX - 70 && x < nowX + 16) && x < laneW - 28;
  };

  // Tapping a timeline row scrolls to that event's card and flashes it. The
  // row is a real #hash link, so it still works if the card is not found.
  const [flash, setFlash] = useState<string | null>(null);
  const flashTimer = useRef(0);
  function jumpToCard(ev: MouseEvent<HTMLAnchorElement>, id: string) {
    const card = document.getElementById(`ev-card-${id}`);
    if (!card) return;
    ev.preventDefault();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    card.focus({ preventScroll: true });
    window.clearTimeout(flashTimer.current);
    setFlash(null); // restart the ring if the same card is tapped twice
    requestAnimationFrame(() => {
      setFlash(id);
      flashTimer.current = window.setTimeout(() => setFlash(null), 1800);
    });
  }

  return (
    <>
      <div className="ev-summary" aria-live="polite">
        <div className="ev-sum-card ev-sum-main">
          <span className="ev-sum-n">{live.length + always.length}</span>
          <span className="ev-sum-l">running now</span>
        </div>
        {urgent && (
          <div className="ev-sum-card ev-sum-urgent">
            <span className="ev-sum-l">Ends soonest · {urgent.e.name}</span>
            <RollingCountdown size="md" target={urgent.e.endsAt!} label="Ends in" />
          </div>
        )}
        <div className="ev-sum-card">
          <span className="ev-sum-n">{soon.length}</span>
          <span className="ev-sum-l">starting soon</span>
        </div>
      </div>

      <div className="ev-filters" role="group" aria-label="Filter by event type">
        <button type="button" className="ev-chip" aria-pressed={type === null} onClick={() => setType(null)}>
          All
        </button>
        {types.map((t) => (
          <button key={t} type="button" className="ev-chip" aria-pressed={type === t} onClick={() => setType(type === t ? null : t)}>
            {TYPE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      {timeline.length > 0 && (
        <section className="ev-tl" aria-labelledby="ev-tl-h">
          <header className="ev-head">
            <h2 id="ev-tl-h">Version timeline</h2>
            <p>
              {formatServerDate(new Date(t0).toISOString())} → {formatServerDate(new Date(t1).toISOString())}
            </p>
          </header>
          <div ref={scrollRef} className="ev-tl-scroll">
            <div className="ev-tl-chart">
              <div ref={lanesRef} className="ev-tl-lanes" aria-hidden="true">
                <div className="ev-tl-axis" style={laneW ? undefined : { visibility: "hidden" }}>
                  {ticks.map((t, i) => (
                    <span key={t} style={{ left: pct(t) }}>
                      {showTickLabel(t, i) ? shortDate(new Date(t).toISOString()) : null}
                    </span>
                  ))}
                </div>
                <span className="ev-tl-now" style={{ left: pct(now) }}>
                  <b>Now</b>
                </span>
              </div>
              {tlGroups.map((g) => (
                <div key={g.key} className="ev-tl-group">
                  <p className="ev-tl-glabel">{g.label}</p>
                  <ol className="ev-tl-rows">
                    {g.items.map(({ e, st }) => {
                      const s = new Date(e.startsAt).getTime();
                      const en = new Date(e.endsAt!).getTime();
                      const row = (
                        <>
                          <span className="ev-tl-lab">
                            <TlArt image={e.image} />
                            <span className="ev-tl-txt">
                              <span className="ev-tl-name">{e.name}</span>
                              <span className="ev-tl-dates">
                                {shortDate(e.startsAt)} – {shortDate(e.endsAt!)}
                              </span>
                            </span>
                          </span>
                          <span className="ev-tl-lane">
                            <span
                              className="ev-tl-bar"
                              style={{ left: pct(s), width: `calc(${pct(en)} - ${pct(s)})` } as CSSProperties}
                              title={`${e.name}: ${formatServerDate(e.startsAt)} – ${formatServerDate(e.endsAt)}`}
                            />
                          </span>
                        </>
                      );
                      return (
                        <li key={e.id} className={`ev-tl-row ev-st-${st}`}>
                          {st === "ended" ? (
                            // Ended events have no card to jump to.
                            <div className="ev-tl-link">{row}</div>
                          ) : (
                            <a className="ev-tl-link" href={`#ev-card-${e.id}`} onClick={(ev) => jumpToCard(ev, e.id)}>
                              {row}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </div>
          {tlGroups.some((g) => g.key !== "ended") && (
            <p className="ev-tl-hint">Select a live or upcoming event to jump to its card.</p>
          )}
        </section>
      )}

      <Section id="live" title="Ending soon" hint="Finish these first." items={live} now={now} flash={flash} />
      <Section id="upcoming" title="Starting soon" items={soon} now={now} flash={flash} />
      <Section id="permanent" title="Permanent" items={always} now={now} flash={flash} />

      {ended.length > 0 && (
        <details className="ev-ended">
          <summary>
            Recently ended <span className="ev-count">{ended.length}</span>
          </summary>
          <ul>
            {ended.map(({ e }) => (
              <li key={e.id}>
                <span>{e.name}</span>
                <span className="ev-ended-d">Ended {formatServerDate(e.endsAt)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function Section({
  id,
  title,
  hint,
  items,
  now,
  flash,
}: {
  id: string;
  title: string;
  hint?: string;
  items: { e: GameEvent; st: Live }[];
  now: number;
  flash: string | null;
}) {
  if (items.length === 0) return null;
  return (
    <section className="ev-section" aria-labelledby={`ev-${id}-h`}>
      <header className="ev-head" id={id}>
        <h2 id={`ev-${id}-h`}>
          {title} <span className="ev-count">{items.length}</span>
        </h2>
        {hint && <p>{hint}</p>}
      </header>
      <ul className="ev-grid">
        {items.map(({ e, st }) => (
          <EventItem key={e.id} e={e} st={st} now={now} flash={flash === e.id} />
        ))}
      </ul>
    </section>
  );
}

function EventItem({ e, st, now, flash }: { e: GameEvent; st: Live; now: number; flash: boolean }) {
  const end = e.endsAt ? new Date(e.endsAt).getTime() : null;
  const lastDay = st === "live" && end !== null && end - now < DAY;
  return (
    <li
      id={`ev-card-${e.id}`}
      tabIndex={-1}
      className={`ev-card rs-spot ev-st-${st}${lastDay ? " ev-last-day" : ""}${flash ? " ev-flash" : ""}`}
    >
      {e.image && (
        <div className="ev-art" aria-hidden="true">
          <img src={e.image} alt="" loading="lazy" decoding="async" width={1024} height={576} />
        </div>
      )}
      <div className="ev-card-top">
        <span className="ev-type">{TYPE_LABELS[e.type] ?? e.type}</span>
        {st === "live" && <span className="ev-pill ev-pill-live">{lastDay ? "Last day" : "Live"}</span>}
        {st === "soon" && <span className="ev-pill">Starts {formatServerDate(e.startsAt)}</span>}
        {e.timeNote && <span className="ev-est" title={e.timeNote}>Est.</span>}
      </div>
      <h3 className="ev-name">{e.name}</h3>
      <p className="ev-rewards">
        {e.rewards}
        {e.rewardsUnconfirmed && (
          <span className="rs-unconfirmed" title="Rewards from early coverage — check the in-game notice">
            Unconfirmed
          </span>
        )}
      </p>
      {e.href && (
        <p className="ev-guide-link">
          <a href={e.href}>{e.hrefLabel ?? "Full guide →"}</a>
        </p>
      )}
      {st === "live" && e.endsAt && <RollingCountdown size="sm" target={e.endsAt} label="Ends in" />}
      {st === "soon" && <RollingCountdown size="sm" target={e.startsAt} label="Starts in" />}
      <details className="ev-more">
        <summary>Details</summary>
        <p>{e.description}</p>
        <p className="ev-dates">
          {formatServerDate(e.startsAt)} → {e.endsAt ? formatServerDate(e.endsAt) : "no end date"}
        </p>
        {e.timeNote && <p className="ev-note">{e.timeNote}</p>}
      </details>
    </li>
  );
}

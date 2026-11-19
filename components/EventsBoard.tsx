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
  recurring: "Recurring",
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

/**
 * Events board: live summary, a version calendar (events as art bars on a
 * date axis, grouped into lanes by kind, with a "now" line), then
 * active / starting-soon / permanent card sections and a collapsed
 * recently-ended list. Server render uses the build time; the shared
 * clock takes over after hydration.
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

  // Version calendar window: the current version runs from the earliest
  // start among live/upcoming events to the latest end after it. Older
  // events that ended before the window opens stay in the lists below.
  const upcoming = withStatus.filter((x) => x.st === "live" || x.st === "soon");
  const t0 = upcoming.length ? Math.min(...upcoming.map((x) => new Date(x.e.startsAt).getTime())) : builtAt;
  const inWindow = withStatus.filter(
    (x) => x.st === "always" || (x.e.endsAt && new Date(x.e.endsAt).getTime() > t0),
  );
  const datedInWindow = inWindow.filter((x) => x.e.endsAt);
  const t1 = datedInWindow.length
    ? Math.max(...datedInWindow.map((x) => new Date(x.e.endsAt!).getTime()))
    : t0 + 30 * DAY;
  const span = t1 - t0;
  const pct = (t: number) => (span > 0 ? `${((Math.min(Math.max(t, t0), t1) - t0) / span) * 100}%` : "0%");
  const shortDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Shanghai" });
  // Axis markers: the window edges plus any day two or more events start
  // (in practice the phase flips). Weekly gridlines stay unlabelled.
  const startCounts = new Map<string, number>();
  for (const x of datedInWindow) {
    const day = x.e.startsAt.slice(0, 10);
    startCounts.set(day, (startCounts.get(day) ?? 0) + 1);
  }
  const markers: { t: number; label: string }[] = [{ t: t0, label: shortDate(new Date(t0).toISOString()) }];
  for (const x of datedInWindow) {
    const s = new Date(x.e.startsAt).getTime();
    if ((startCounts.get(x.e.startsAt.slice(0, 10)) ?? 0) >= 2 && s > t0 && s < t1) {
      if (!markers.some((m) => Math.abs(m.t - s) < DAY)) {
        markers.push({ t: s, label: shortDate(x.e.startsAt) });
      }
    }
  }
  markers.push({ t: t1, label: shortDate(new Date(t1).toISOString()) });
  markers.sort((a, b) => a.t - b.t);
  const weekLines: number[] = [];
  for (let t = t0 + 7 * DAY; t < t1; t += 7 * DAY) weekLines.push(t);

  // Calendar lanes by event kind, packed so overlapping bars stack.
  const LANES: { key: string; label: string; types: string[] }[] = [
    { key: "featured", label: "Featured events", types: ["limited"] },
    { key: "login", label: "Login gifts", types: ["login"] },
    { key: "leisure", label: "Leisure", types: ["leisure", "exploration"] },
    { key: "more", label: "Trials and more", types: ["trial", "spending", "web", "community"] },
    { key: "recurring", label: "Recurring challenges", types: ["recurring"] },
    { key: "always", label: "Always on", types: ["permanent"] },
  ];
  const BAR_H = 44;
  const calLanes = LANES.map((lane) => {
    const items = inWindow
      .filter((x) => lane.types.includes(x.e.type))
      .sort((a, b) => ts(a.e.startsAt) - ts(b.e.startsAt));
    const rowEnds: number[] = [];
    const packed = items.map((x) => {
      const s = new Date(x.e.startsAt).getTime();
      const en = x.e.endsAt ? new Date(x.e.endsAt).getTime() : Infinity;
      let row = rowEnds.findIndex((last) => s >= last);
      if (row === -1) {
        rowEnds.push(en);
        row = rowEnds.length - 1;
      } else {
        rowEnds[row] = en;
      }
      return { ...x, row };
    });
    return { ...lane, packed, rows: Math.max(1, rowEnds.length) };
  }).filter((lane) => lane.packed.length > 0);
  const hasCalendar = calLanes.length > 0;

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
        <button type="button" className="rs-filter ev-chip" aria-pressed={type === null} onClick={() => setType(null)}>
          All
        </button>
        {types.map((t) => (
          <button key={t} type="button" className="rs-filter ev-chip" aria-pressed={type === t} onClick={() => setType(type === t ? null : t)}>
            {TYPE_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      {hasCalendar && (
        <section className="ev-cal" aria-labelledby="ev-cal-h">
          <header className="ev-head">
            <h2 id="ev-cal-h">Version calendar</h2>
            <p>
              {formatServerDate(new Date(t0).toISOString())} → {formatServerDate(new Date(t1).toISOString())} · server time
            </p>
          </header>
          <div ref={scrollRef} className="ev-cal-scroll">
            <div className="ev-cal-chart">
              <div className="ev-cal-overlay" aria-hidden="true">
                {weekLines.map((t) => (
                  <span key={t} className="ev-cal-week" style={{ left: pct(t) }} />
                ))}
                <span className="ev-cal-now" style={{ left: pct(now) }}>
                  <b>Now</b>
                </span>
              </div>
              <div className="ev-cal-axisrow">
                <div className="ev-cal-rail ev-cal-rail-axis" aria-hidden="true" />
                <div className="ev-cal-axis">
                  {markers.map((m) => (
                    <span key={m.t} style={{ left: pct(m.t) }}>
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
              {calLanes.map((lane) => (
                <div key={lane.key} className="ev-cal-lane">
                  <div className="ev-cal-rail">
                    <span className="ev-cal-lane-name">{lane.label}</span>
                    <span className="ev-cal-lane-n">{lane.packed.length}</span>
                  </div>
                  <div className="ev-cal-track" style={{ height: lane.rows * BAR_H - 8 }}>
                    {lane.packed.map(({ e, st, row }) => {
                      const s = new Date(e.startsAt).getTime();
                      const en = e.endsAt ? new Date(e.endsAt).getTime() : t1;
                      const bar = (
                        <>
                          <span className="ev-cal-art" aria-hidden="true">
                            {e.image ? (
                              <img
                                src={thumbOf(e.image)}
                                alt=""
                                width={96}
                                height={96}
                                loading="lazy"
                                decoding="async"
                                onError={(ev) => {
                                  if (e.image && !ev.currentTarget.src.endsWith(e.image)) {
                                    ev.currentTarget.src = e.image;
                                  }
                                }}
                              />
                            ) : null}
                          </span>
                          <span className="ev-cal-txt">
                            <span className="ev-cal-name">{e.name}</span>
                            <span className="ev-cal-dates">
                              {e.endsAt
                                ? `${shortDate(e.startsAt)} – ${shortDate(e.endsAt)}`
                                : `From ${shortDate(e.startsAt)} · no end date`}
                            </span>
                          </span>
                          {st === "live" && <span className="ev-cal-live" aria-hidden="true" />}
                        </>
                      );
                      const style = {
                        left: pct(s),
                        width: `calc(${pct(en)} - ${pct(s)})`,
                        top: row * BAR_H,
                      } as CSSProperties;
                      const short = (en - s) / span < 0.24;
                      const cls = `ev-cal-bar ev-st-${st}${short ? " ev-cal-short" : ""}${type && e.type !== type ? " ev-cal-dim" : ""}`;
                      const title = e.endsAt
                        ? `${e.name}: ${formatServerDate(e.startsAt)} – ${formatServerDate(e.endsAt)}`
                        : `${e.name}: from ${formatServerDate(e.startsAt)}, no end date`;
                      return st === "ended" ? (
                        // Ended events have no card to jump to.
                        <div key={e.id} className={cls} style={style} title={title}>
                          {bar}
                        </div>
                      ) : (
                        <a
                          key={e.id}
                          className={cls}
                          style={style}
                          title={title}
                          href={`#ev-card-${e.id}`}
                          onClick={(ev) => jumpToCard(ev, e.id)}
                        >
                          {bar}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="ev-cal-hint">Select a live or upcoming event to jump to its card.</p>
        </section>
      )}

      <Section id="live" title="Active events" hint="Running now — finish them before they end." items={live} now={now} flash={flash} />
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
      className={`ev-card ev-st-${st}${lastDay ? " ev-last-day" : ""}${flash ? " ev-flash" : ""}`}
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

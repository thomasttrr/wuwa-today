"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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
  const byEnd = (a: { e: GameEvent }, b: { e: GameEvent }) =>
    (a.e.endsAt ?? "9999").localeCompare(b.e.endsAt ?? "9999");
  const live = withStatus.filter((x) => x.st === "live").sort(byEnd);
  const soon = withStatus.filter((x) => x.st === "soon").sort((a, b) => a.e.startsAt.localeCompare(b.e.startsAt));
  const always = withStatus.filter((x) => x.st === "always");
  const ended = withStatus.filter((x) => x.st === "ended").sort((a, b) => byEnd(b, a));

  // Timeline window: earliest start to latest end among dated events.
  const dated = events.filter((e) => e.endsAt);
  const t0 = Math.min(...dated.map((e) => new Date(e.startsAt).getTime()));
  const t1 = Math.max(...dated.map((e) => new Date(e.endsAt!).getTime()));
  const span = t1 - t0;
  const pct = (t: number) => `${((Math.min(Math.max(t, t0), t1) - t0) / span) * 100}%`;
  const ticks: number[] = [];
  const first = new Date(t0);
  first.setUTCHours(0, 0, 0, 0);
  for (let t = first.getTime() + DAY; t < t1; t += 7 * DAY) ticks.push(t);
  const timeline = [...live, ...soon, ...ended.slice(0, 3)].filter((x) => x.e.endsAt);

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
            <div className="ev-tl-chart" style={{ "--now": pct(now) } as CSSProperties}>
              <div className="ev-tl-axis" aria-hidden="true">
                {ticks.map((t) => (
                  <span key={t} style={{ left: pct(t) }}>
                    {new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "Asia/Shanghai" })}
                  </span>
                ))}
              </div>
              <div className="ev-tl-track">
              <span className="ev-tl-now" aria-hidden="true">
                <b>Now</b>
              </span>
              <ol className="ev-tl-rows">
                {timeline.map(({ e, st }) => {
                  const s = new Date(e.startsAt).getTime();
                  const en = new Date(e.endsAt!).getTime();
                  return (
                    <li key={e.id} className={`ev-tl-row ev-st-${st}`}>
                      <span
                        className="ev-tl-bar"
                        style={{ left: pct(s), width: `calc(${pct(en)} - ${pct(s)})` } as CSSProperties}
                        title={`${e.name}: ${formatServerDate(e.startsAt)} – ${formatServerDate(e.endsAt)}`}
                      >
                        <span className="ev-tl-name">{e.name}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      <Section id="live" title="Ending soon" hint="Finish these first." items={live} now={now} />
      <Section id="upcoming" title="Starting soon" items={soon} now={now} />
      <Section id="permanent" title="Permanent" items={always} now={now} />

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
}: {
  id: string;
  title: string;
  hint?: string;
  items: { e: GameEvent; st: Live }[];
  now: number;
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
          <EventItem key={e.id} e={e} st={st} now={now} />
        ))}
      </ul>
    </section>
  );
}

function EventItem({ e, st, now }: { e: GameEvent; st: Live; now: number }) {
  const end = e.endsAt ? new Date(e.endsAt).getTime() : null;
  const lastDay = st === "live" && end !== null && end - now < DAY;
  return (
    <li className={`ev-card rs-spot ev-st-${st}${lastDay ? " ev-last-day" : ""}`}>
      <div className="ev-card-top">
        <span className="ev-type">{TYPE_LABELS[e.type] ?? e.type}</span>
        {st === "live" && <span className="ev-pill ev-pill-live">{lastDay ? "Last day" : "Live"}</span>}
        {st === "soon" && <span className="ev-pill">Starts {formatServerDate(e.startsAt)}</span>}
        {e.timeNote && <span className="ev-est" title={e.timeNote}>Est.</span>}
      </div>
      <h3 className="ev-name">{e.name}</h3>
      <p className="ev-rewards">{e.rewards}</p>
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

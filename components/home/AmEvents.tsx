"use client";

import useNow from "../useNow";
import { relSpan } from "./AmTime";

export interface AmEvent {
  id: string;
  name: string;
  image: string | null;
  startsAt: string;
  endsAt: string;
  /** Big headline figure ("1,200") and its unit ("Astrite"), when the rewards name one. */
  amount: string | null;
  unit: string | null;
  /** Short reward line for the compact rows and cards without a figure. */
  reward: string;
  startLabel: { d: string; m: string };
  endLabel: string;
}

const D = 86_400_000;
const MAX_LIVE = 6;

/**
 * Events on the home page. Live events are art cards with a bar showing
 * how much of each event is left (it turns crimson inside 72 hours);
 * upcoming events stay as compact rows. The lists are split by the build
 * time until the clock hydrates, so the static HTML matches the first render.
 */
export default function AmEvents({ events, builtAt }: { events: AmEvent[]; builtAt: number }) {
  const now = useNow(60_000);
  const t = now?.getTime() ?? builtAt;
  const current = events.filter((e) => Date.parse(e.endsAt) > t);
  const live = current.filter((e) => Date.parse(e.startsAt) <= t).sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));
  const up = current.filter((e) => Date.parse(e.startsAt) > t).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const shown = live.slice(0, MAX_LIVE);

  return (
    <>
      {live.length > 0 && (
        <>
          <h3 className="am-grp">Live now</h3>
          <ul className="am-evcards">
            {shown.map((e) => {
              const left = Math.max(0, Date.parse(e.endsAt) - t);
              const pct = Math.max(1.5, Math.min(100, (left / (Date.parse(e.endsAt) - Date.parse(e.startsAt))) * 100));
              return (
                <li key={e.id} className={`am-evc${left < 3 * D ? " is-urgent" : ""}`}>
                  <div className="am-evart">
                    {e.image && (
                      /* eslint-disable-next-line @next/next/no-img-element -- event key art. */
                      <img src={e.image} alt="" decoding="async" />
                    )}
                    {e.amount && (
                      <span className="am-evrw">
                        {e.amount}
                        <small>{e.unit}</small>
                      </span>
                    )}
                  </div>
                  <div className="am-evbody">
                    <h4>{e.name}</h4>
                    {!e.amount && <p className="am-evreward">{e.reward}</p>}
                    <div className="am-evbar" aria-hidden="true">
                      <i style={{ width: `${pct.toFixed(1)}%` }} />
                    </div>
                    <p className="am-evmeta">
                      <span className="am-st is-live">
                        <i aria-hidden="true" />
                        {now ? `${relSpan(left)} left` : "Live"}
                      </span>
                      <span>Ends {e.endLabel}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          {live.length > MAX_LIVE && (
            <p className="am-more">
              <a href="/events">
                {live.length - MAX_LIVE} more live event{live.length - MAX_LIVE === 1 ? "" : "s"} on the events page
              </a>
            </p>
          )}
        </>
      )}
      {up.length > 0 && (
        <>
          <h3 className="am-grp">Coming up</h3>
          <ul className="am-evrows">
            {up.map((e) => {
              const soon = Date.parse(e.startsAt) - t < 3 * D;
              return (
                <li key={e.id} className="am-ev">
                  <span className="am-ev-d am-num">
                    {e.startLabel.d}
                    <small>{e.startLabel.m}</small>
                  </span>
                  <div className="am-ev-n">
                    {e.image && (
                      /* eslint-disable-next-line @next/next/no-img-element -- event thumbnail. */
                      <img src={e.image} alt="" decoding="async" />
                    )}
                    <h4>{e.name}</h4>
                  </div>
                  <span className={`am-st${soon ? " is-soon" : ""}`}>
                    <i aria-hidden="true" />
                    {now ? `Opens in ${relSpan(Date.parse(e.startsAt) - t)}` : `Opens ${e.startLabel.m} ${e.startLabel.d}`}
                  </span>
                  <span className="am-ev-r">
                    {e.amount ? (
                      <>
                        <b className="am-num">{e.amount}</b>
                        <small>{e.unit}</small>
                      </>
                    ) : (
                      <small>{e.reward}</small>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      {live.length === 0 && up.length === 0 && <p className="am-empty">No events are live or announced right now.</p>}
    </>
  );
}

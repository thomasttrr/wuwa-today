"use client";

import { useEffect, useRef, useState } from "react";
import useNow from "../useNow";
import CdBoot from "../CdBoot";
import { relSpan } from "./AmTime";
import { SERVER_OPTIONS, nextDailyReset, nextWeeklyReset } from "@/lib/dates";

const STORAGE_KEY = "wuwa-today:server-id";
const D = 86_400_000;

export interface GlanceUnlock {
  name: string;
  startsAt: string;
  reward: string | null;
}

/**
 * The "today at a glance" strip under the hero: daily and weekly reset for
 * the visitor's server region (shared with the reset tile's saved choice),
 * the next event to unlock, and the active redeem code with copy.
 */
export default function AmGlance({
  unlocks,
  code,
}: {
  unlocks: GlanceUnlock[];
  code: { code: string; rewards: string; count: number } | null;
}) {
  const [serverId, setServerId] = useState<string>(SERVER_OPTIONS[2].id);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const server = SERVER_OPTIONS.find((s) => s.id === serverId) ?? SERVER_OPTIONS[2];

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SERVER_OPTIONS.some((s) => s.id === stored)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- post-hydration restore keeps the static HTML identical to the first client render.
        setServerId(stored);
      }
    } catch {
      /* storage unavailable: keep the default region */
    }
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const pick = (id: string) => {
    setServerId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* the choice still applies for this visit */
    }
  };

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.code);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2600);
  };

  const now = useNow();
  const t = now?.getTime() ?? null;
  const daily = t === null ? null : nextDailyReset(server.offsetHours, now!).getTime() - t;
  const weekly = t === null ? null : nextWeeklyReset(server.offsetHours, now!).getTime() - t;
  const unlock = t === null ? unlocks[0] : unlocks.find((u) => Date.parse(u.startsAt) > t);
  const hm = (ms: number) => `${Math.floor(ms / 3_600_000)}:${String(Math.floor((ms % 3_600_000) / 60_000)).padStart(2, "0")}`;

  return (
    <section className="am-glance am-wrap" id="today" aria-label="Today at a glance">
      <div className="am-g">
        <span className="am-g-k">Daily reset</span>
        {daily === null ? (
          <b className="am-num" data-cd-reset="daily" data-cd-off={server.offsetHours} data-cd-v="–" suppressHydrationWarning>
            <CdBoot />
          </b>
        ) : (
          <b className="am-num">{hm(daily)}</b>
        )}
        <div className="am-bar" aria-hidden="true">
          <i style={{ width: daily === null ? 0 : `${100 - (daily / D) * 100}%` }} />
        </div>
        <small>04:00 server time. Waveplates and dailies.</small>
      </div>
      <div className="am-g">
        <span className="am-g-k">Weekly reset</span>
        {weekly === null ? (
          <b className="am-num" data-cd-reset="weekly" data-cd-off={server.offsetHours} data-cd-v="–" suppressHydrationWarning>
            <CdBoot />
          </b>
        ) : (
          <b className="am-num">{relSpan(weekly)}</b>
        )}
        <div className="am-bar" aria-hidden="true">
          <i style={{ width: weekly === null ? 0 : `${100 - (weekly / (7 * D)) * 100}%` }} />
        </div>
        <small>
          Monday 04:00.{" "}
          <label className="am-server">
            <span className="am-sr">Server region</span>
            <select value={serverId} onChange={(e) => pick(e.target.value)}>
              {SERVER_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </small>
      </div>
      <div className="am-g">
        <span className="am-g-k">Next unlock</span>
        {unlock && t === null ? (
          <b className="am-num" data-cd={unlock.startsAt} data-cd-u="rel" data-cd-v="–" suppressHydrationWarning>
            <CdBoot />
          </b>
        ) : (
          <b className="am-num">{unlock && t !== null ? relSpan(Date.parse(unlock.startsAt) - t) : "None"}</b>
        )}
        <div className="am-bar" aria-hidden="true">
          <i style={{ width: 0 }} />
        </div>
        <small>{unlock ? `${unlock.name}${unlock.reward ? `, ${unlock.reward}` : ""}` : "No events announced past this one."}</small>
      </div>
      <div className="am-g" id="codes">
        <span className="am-g-k">{code && code.count > 1 ? `Codes (${code.count})` : "Code"}</span>
        {code ? (
          <>
            <button type="button" className="am-code" onClick={copy} aria-label={`Copy code ${code.code}`}>
              {code.code}
            </button>
            <div className="am-bar" aria-hidden="true">
              <i style={{ width: 0 }} />
            </div>
            <small aria-live="polite">{copied ? "Copied. Redeem it in Settings, Other." : `${code.rewards}. Tap to copy.`}</small>
          </>
        ) : (
          <>
            <b className="am-num">None</b>
            <small>No working codes right now.</small>
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import useNow from "./useNow";
import launch from "../data/launch.json";

/*
 * Shared 3.8 go-live countdown — homepage and /version mount this one
 * component, so the pages always match. Sleek pass (Tom, Nov 8): the timer
 * appears ONCE, as a segmented hero (days / hrs / min / sec with unit
 * labels, digit-change animation); the region rows underneath are slim
 * one-liners carrying only what differs per zone — the local opening time
 * and the UTC offset, both computed from the zone at runtime.
 *
 * Data: counts to data/launch.json's goLiveAt (the same instant
 * HomeLaunchStrip hides at). The hairline under the hero fills from
 * predownloadOpensAt to goLiveAt. At the instant it flips to "Playable
 * now"; the homepage mount passes hideAtLive and disappears with the
 * launch strip instead.
 */

const GO_LIVE = Date.parse(launch.goLiveAt);
const WINDOW_START = Date.parse(launch.predownloadOpensAt);

const ZONES: { label: string; tz: string }[] = [
  { label: "New York", tz: "America/New_York" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "London", tz: "Europe/London" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Shanghai · server", tz: "Asia/Shanghai" },
];

/** "Wed, Nov 11 · 10:00 PM" — the opening wall-clock in the zone. */
function openingLabel(tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
    .format(GO_LIVE)
    .replace(", ", " · ")
    .replace(", ", " ");
}

/** "UTC−5" / "UTC+8" — the zone's own offset at the go-live instant. */
function offsetLabel(tz: string): string {
  const part = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  })
    .formatToParts(GO_LIVE)
    .find((p) => p.type === "timeZoneName");
  return (part?.value ?? "").replace("GMT", "UTC").replace("-", "−");
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    { v: String(Math.floor(s / 86_400)), u: "days" },
    { v: pad(Math.floor((s % 86_400) / 3600)), u: "hrs" },
    { v: pad(Math.floor((s % 3600) / 60)), u: "min" },
    { v: pad(s % 60), u: "sec" },
  ];
}

export default function LaunchCountdown({
  builtAt,
  hideAtLive = false,
}: {
  builtAt: number;
  hideAtLive?: boolean;
}) {
  const clock = useNow(1000);
  const now = clock ? clock.getTime() : builtAt;
  const live = now >= GO_LIVE;

  if (live && hideAtLive) return null;

  const units = parts(GO_LIVE - now);
  const progress = Math.min(
    1,
    Math.max(0, (now - WINDOW_START) / (GO_LIVE - WINDOW_START)),
  );

  return (
    <section className="lc-card" aria-label={`Version ${launch.version} launch countdown`}>
      <div className="lc-top">
        <p className="lc-kicker">
          <span className={live ? "lc-dot lc-dot-live" : "lc-dot"} aria-hidden="true" />
          {live ? `Version ${launch.version} · Live` : `Version ${launch.version} · Goes live in`}
        </p>
        {live ? (
          <p className="lc-now">Playable now</p>
        ) : (
          <div className="lc-timer" role="timer" aria-label={units.map((u) => `${u.v} ${u.u}`).join(", ")}>
            {units.map((u, i) => (
              <span key={u.u} className="lc-unit">
                {/* keyed by value: React remounts on change, replaying the tick animation */}
                <span key={u.v} className="lc-num">
                  {u.v}
                </span>
                <span className="lc-unit-label">{u.u}</span>
                {i < units.length - 1 && (
                  <span className="lc-sep" aria-hidden="true">
                    :
                  </span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="lc-progress" aria-hidden="true">
        <span className="lc-progress-fill" style={{ width: `${Math.round(progress * 1000) / 10}%` }} />
      </div>
      <ul className="lc-rows">
        {ZONES.map((z) => (
          <li key={z.tz} className="lc-row">
            <span className="lc-zone">
              {z.label}
              <span className="lc-offset">{offsetLabel(z.tz)}</span>
            </span>
            <span className="lc-open">
              {live ? "Opened " : ""}
              {openingLabel(z.tz)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

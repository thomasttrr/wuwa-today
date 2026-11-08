"use client";

import useNow from "./useNow";
import launch from "../data/launch.json";

/*
 * Shared 3.8 go-live countdown for the homepage and /version. One component,
 * two mounts, so the pages always match. Ticks every second off the shared
 * clock store; the go-live instant is data/launch.json's goLiveAt — the same
 * timestamp HomeLaunchStrip hides at and the /version phase clock uses.
 *
 * Each row is one server region: the time remaining (the same duration
 * everywhere) and the local wall-clock opening time in that zone. At the
 * instant it flips to "Playable now"; the homepage mount passes hideAtLive
 * and disappears with the launch strip instead.
 */

const GO_LIVE = Date.parse(launch.goLiveAt);

const ZONES: { label: string; tz: string }[] = [
  { label: "New York", tz: "America/New_York" },
  { label: "Los Angeles", tz: "America/Los_Angeles" },
  { label: "London", tz: "Europe/London" },
  { label: "Berlin", tz: "Europe/Berlin" },
  { label: "Shanghai · server", tz: "Asia/Shanghai" },
];

function openingLabel(tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(GO_LIVE);
}

function remainingLabel(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86_400);
  const h = Math.floor((s % 86_400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return d > 0
    ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(sec)}s`
    : `${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
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

  const remaining = remainingLabel(GO_LIVE - now);

  return (
    <section className="lc-card" aria-label={`Version ${launch.version} launch countdown`}>
      <div className="lc-head">
        <span className={live ? "lc-dot lc-dot-live" : "lc-dot"} aria-hidden="true" />
        {live ? (
          <p className="lc-title">
            Version {launch.version} is <strong>playable now</strong>
          </p>
        ) : (
          <p className="lc-title">
            Version {launch.version} goes live in{" "}
            <span className="lc-big" role="timer">
              {remaining}
            </span>
          </p>
        )}
      </div>
      <ul className="lc-rows">
        {ZONES.map((z) => (
          <li key={z.tz} className="lc-row">
            <span className="lc-zone">{z.label}</span>
            <span className="lc-rem">{live ? "Live" : remaining}</span>
            <span className="lc-open">
              {live ? "Opened " : "Opens "}
              {openingLabel(z.tz)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

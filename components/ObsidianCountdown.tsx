"use client";

import useNow from "./useNow";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function breakdown(target: Date, now: Date): string {
  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

/**
 * ObsidianCountdown — mono tabular-nums GOLD countdown with digit roll.
 * Gold because it is time. Each character renders in its own clipped
 * window, keyed by position AND value — when a digit changes, React
 * remounts just that span and the CSS rolls the new digit up into view.
 * Renders a static fallback on the server; ticks via the shared
 * NowProvider clock (one 1s interval drives every countdown on the page).
 */
export default function ObsidianCountdown({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const now = useNow();

  const targetDate = new Date(target);
  const ended = now ? now.getTime() >= targetDate.getTime() : false;
  const text = !now ? "--d --h --m --s" : ended ? "Ended" : breakdown(targetDate, now);

  return (
    <div>
      <div
        className={`og-countdown${ended ? " og-countdown-ended" : ""}`}
        aria-live="off"
      >
        {text.split("").map((ch, i) => (
          <span key={`${i}-${ch}`} className="og-cd-roll" aria-hidden="true">
            <span>{ch === " " ? "\u00A0" : ch}</span>
          </span>
        ))}
        <span className="og-visually-hidden">{text}</span>
      </div>
      <div className="og-countdown-label">{label}</div>
    </div>
  );
}

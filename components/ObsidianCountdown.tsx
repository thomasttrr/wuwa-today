"use client";

import { useEffect, useState } from "react";

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
 * Renders a static fallback on the server; ticks client-side.
 */
export default function ObsidianCountdown({
  target,
  label,
}: {
  target: string;
  label: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only clock sync: the static export renders a placeholder, the effect swaps in live time after mount to stay hydration-safe.
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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
        <span className="og-cd-sr" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {text}
        </span>
      </div>
      <div className="og-countdown-label">{label}</div>
    </div>
  );
}

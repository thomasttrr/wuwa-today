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
 * Live countdown to an ISO-8601 target. Renders a static fallback on the
 * server so the page is SEO-friendly, then ticks client-side.
 *
 * Digit transitions: each character renders in its own span, keyed by
 * position AND value — when a digit changes, React remounts just that span
 * and the CSS plays a 200ms slide. Unchanged digits keep their key and
 * never re-animate. (Animation itself is gated behind
 * prefers-reduced-motion in CSS.)
 */
export default function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetDate = new Date(target);
  const text = now ? breakdown(targetDate, now) : "--d --h --m --s";

  return (
    <div>
      <div className="countdown" aria-live="off">
        {text.split("").map((ch, i) => (
          <span key={`${i}-${ch}`} className="cd-ch">
            {ch === " " ? " " : ch}
          </span>
        ))}
      </div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

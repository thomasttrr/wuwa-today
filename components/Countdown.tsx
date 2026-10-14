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
 */
export default function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const targetDate = new Date(target);

  return (
    <div>
      <div className="countdown" aria-live="off">
        {now ? breakdown(targetDate, now) : "--d --h --m --s"}
      </div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

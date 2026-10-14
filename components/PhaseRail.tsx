"use client";

import { useEffect, useState } from "react";
import type { GameEvent } from "../lib/data";

/**
 * Signature device: a 3px track beneath the featured banner's countdown
 * showing phase elapsed vs. remaining, with gold tick marks for active
 * event deadlines that fall inside the banner phase.
 *
 * Client-rendered after mount so the static export stays hydration-safe.
 * Rendered only on the featured (first active) banner card.
 */
export default function PhaseRail({
  startsAt,
  endsAt,
  events,
}: {
  startsAt: string;
  endsAt: string;
  events: GameEvent[];
}) {
  // Client-only timestamp, read once after mount: the static export renders
  // a placeholder, then the effect swaps in the live rail. Reading Date.now()
  // here (not during render) keeps the render pure and hydration-safe.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional post-mount sync: the server render must not read the clock, so the timestamp is captured after mount to stay hydration-safe.
    setNowMs(Date.now());
  }, []);

  if (nowMs === null) {
    return <div className="phase-rail" aria-hidden="true" />;
  }

  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const pct =
    end > start
      ? Math.min(100, Math.max(0, ((nowMs - start) / (end - start)) * 100))
      : 0;

  const ticks = events
    .filter((e) => {
      if (!e.endsAt) return false;
      const t = new Date(e.endsAt).getTime();
      return t >= start && t <= end;
    })
    .map((e) => ({
      id: e.id,
      name: e.name,
      pct: ((new Date(e.endsAt as string).getTime() - start) / (end - start)) * 100,
    }));

  return (
    <div
      className="phase-rail"
      role="img"
      aria-label={`${Math.round(pct)}% of the banner phase elapsed${
        ticks.length
          ? `; ${ticks.length} event deadline${ticks.length === 1 ? "" : "s"} before it ends`
          : ""
      }`}
    >
      <div className="phase-rail-fill" style={{ width: `${pct}%` }} />
      {ticks.map((t) => (
        <span
          key={t.id}
          className="phase-rail-tick"
          style={{ left: `${t.pct}%` }}
          title={t.name}
        />
      ))}
    </div>
  );
}

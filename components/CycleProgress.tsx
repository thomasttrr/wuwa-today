"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar showing how far through a reset cycle we are
 * (daily = 24h, weekly = 7d). Ticks every 10s — plenty for a bar that
 * moves this slowly. Renders a static placeholder pre-mount so the
 * static export stays hydration-safe.
 */
export default function CycleProgress({
  target,
  cycleMs,
  label,
}: {
  target: string;
  cycleMs: number;
  label: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only clock sync: the static export renders a placeholder, the effect swaps in live time after mount to stay hydration-safe.
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 10_000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return <div className="cycle-bar" aria-hidden="true" />;
  }

  const remaining = Math.max(0, new Date(target).getTime() - now);
  const pct = Math.min(100, Math.max(0, ((cycleMs - remaining) / cycleMs) * 100));

  return (
    <div
      className="cycle-bar"
      role="img"
      aria-label={`${label}: ${Math.round(pct)}% of the cycle elapsed`}
    >
      <div className="cycle-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

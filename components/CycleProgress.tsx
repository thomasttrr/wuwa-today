"use client";

import useNow from "./useNow";

/**
 * Thin progress bar showing how far through a reset cycle we are
 * (daily = 24h, weekly = 7d). Ticks every 10s via useNow(10_000) on the
 * shared NowProvider clock — plenty for a bar that moves this slowly.
 * Renders a static placeholder pre-mount so the static export stays
 * hydration-safe.
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
  const now = useNow(10_000);

  if (now === null) {
    return <div className="cycle-bar" aria-hidden="true" />;
  }

  const remaining = Math.max(0, new Date(target).getTime() - now.getTime());
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

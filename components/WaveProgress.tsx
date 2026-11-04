"use client";

import useNow from "./useNow";

/**
 * WaveProgress — time remaining drawn as a thin sine waveform. The full
 * wave is a dim track; the element-colored stroke covers what's left and
 * drains as time passes. Draws itself in once on first paint (CSS).
 */
export default function WaveProgress({
  start,
  end,
  label,
}: {
  start: string;
  end: string;
  label: string;
}) {
  const now = useNow(30_000);
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const left = now ? Math.min(1, Math.max(0, (e - now.getTime()) / (e - s))) : 1;
  const W = 600;
  let d = "M0 12";
  for (let x = 0; x <= W; x += 10) d += ` L${x} ${(12 + Math.sin(x / 14) * 7).toFixed(2)}`;
  return (
    <div className="rs-wave" role="img" aria-label={`${label}: ${Math.round(left * 100)}% of the phase remaining`}>
      <svg viewBox={`0 0 ${W} 24`} preserveAspectRatio="none" aria-hidden="true">
        <path d={d} className="rs-wave-track" pathLength={1} />
        <path
          d={d}
          className="rs-wave-fill"
          pathLength={1}
          style={{ strokeDasharray: `${left} 1`, "--left": left } as React.CSSProperties}
        />
      </svg>
    </div>
  );
}

"use client";

import { useId } from "react";
import useNow from "./useNow";

/**
 * WaveProgress — time remaining drawn as a thin sine waveform. The full
 * wave is a dim track; the element-colored stroke covers what's left and
 * drains as time passes.
 *
 * The fill is the same path shown through a clip rect of width `left`.
 * It used to be a stroke-dasharray sized via pathLength={1}; WebKit can
 * resolve that dash math in raw path units instead, which draws the fill
 * as dashes/dots along the wave (seen on iOS). A clip rect needs no dash
 * math and renders identically everywhere.
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
  const clipId = useId();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  const span = e - s;
  const left =
    now && span > 0 ? Math.min(1, Math.max(0, (e - now.getTime()) / span)) : now ? 0 : 1;
  const W = 600;
  let d = "M0 12";
  for (let x = 0; x <= W; x += 10) d += ` L${x} ${(12 + Math.sin(x / 14) * 7).toFixed(2)}`;
  return (
    <div className="rs-wave" role="img" aria-label={`${label}: ${Math.round(left * 100)}% of the phase remaining`}>
      <svg viewBox={`0 0 ${W} 24`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={left * W} height={24} />
          </clipPath>
        </defs>
        <path d={d} className="rs-wave-track" />
        <g clipPath={`url(#${clipId})`}>
          <path d={d} className="rs-wave-fill" />
        </g>
      </svg>
    </div>
  );
}

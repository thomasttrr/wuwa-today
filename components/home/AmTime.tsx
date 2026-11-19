"use client";

import useNow from "../useNow";
import CdBoot from "../CdBoot";

const D = 86_400_000;
const H = 3_600_000;
const M = 60_000;
const pad = (n: number) => String(n).padStart(2, "0");

/** "14d 6h", "5h 12m", "38m": the site's short relative span. */
export function relSpan(ms: number): string {
  const v = Math.max(0, ms);
  const d = Math.floor(v / D);
  const h = Math.floor((v % D) / H);
  const m = Math.floor((v % H) / M);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
}

/**
 * AmCountdown — the hero's four-cell countdown in display serif numerals.
 * The static HTML is filled before first paint by lib/countdown-boot.ts
 * (hydration-safe); a visually hidden sentence carries the value for screen
 * readers, the cells are aria-hidden.
 */
export function AmCountdown({ target, label }: { target: string; label: string }) {
  const now = useNow();
  const left = now ? Math.max(0, Date.parse(target) - now.getTime()) : null;
  const pending = left === null;
  const cells = pending
    ? ["d", "h", "m", "s"]
    : [pad(Math.floor(left / D)), pad(Math.floor((left % D) / H)), pad(Math.floor((left % H) / M)), pad(Math.floor((left % M) / 1000))];
  const units = ["Days", "Hours", "Minutes", "Seconds"];
  const spoken =
    left === null
      ? "Loading"
      : left === 0
        ? "Ended"
        : `${Math.floor(left / D)} days, ${Math.floor((left % D) / H)} hours, ${Math.floor((left % H) / M)} minutes`;
  return (
    <div className="am-count" data-cd={pending ? target : undefined}>
      <span className="am-sr">
        {label}: {spoken}
      </span>
      <div className="am-count-cells" aria-hidden="true">
        {cells.map((v, i) => (
          <div key={units[i]} className={i === 3 ? "is-sec" : undefined}>
            {pending ? <b key="cd" data-cd-u={v} data-cd-v="–" suppressHydrationWarning /> : <b key={v}>{v}</b>}
            <span>{units[i]}</span>
          </div>
        ))}
      </div>
      {pending && <CdBoot />}
    </div>
  );
}

/** A plain relative span ("14d 6h") that ticks once a minute. */
export function AmRel({ target, fallback = "–" }: { target: string; fallback?: string }) {
  const now = useNow(60_000);
  if (now) return <>{relSpan(Date.parse(target) - now.getTime())}</>;
  return (
    <span data-cd={target} data-cd-u="rel" data-cd-v={fallback} suppressHydrationWarning>
      <CdBoot />
    </span>
  );
}

/**
 * AmProgress — the gold rule with a diamond marker: how far `now` is
 * between `start` and `end`. `label` receives the percentage once the
 * clock is known; the right-hand note is static.
 */
export function AmProgress({
  start,
  end,
  label,
  note,
}: {
  start: string;
  end: string;
  label: (pct: number) => React.ReactNode;
  note: React.ReactNode;
}) {
  const now = useNow(60_000);
  const s = Date.parse(start);
  const e = Date.parse(end);
  const pct = now ? Math.max(0, Math.min(100, ((now.getTime() - s) / (e - s)) * 100)) : null;
  return (
    <div className="am-prog">
      <i style={{ width: pct === null ? 0 : `${pct}%` }} aria-hidden="true" />
      <span>{pct === null ? " " : label(Math.floor(pct))}</span>
      <span>{note}</span>
    </div>
  );
}

/** A thin bar showing how far `now` is between two instants (Phase 2 "opens in"). */
export function AmBar({ start, end }: { start: string; end: string }) {
  const now = useNow(60_000);
  const s = Date.parse(start);
  const e = Date.parse(end);
  const pct = now ? Math.max(0, Math.min(100, ((now.getTime() - s) / (e - s)) * 100)) : 0;
  return (
    <div className="am-bar" aria-hidden="true">
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

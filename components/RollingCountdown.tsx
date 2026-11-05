"use client";

import { memo } from "react";
import useNow from "./useNow";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** One rolling digit. Memoized: only the digits whose value changed re-render each tick. */
const Digit = memo(function Digit({ ch }: { ch: string }) {
  if (ch === "-") {
    return (
      <span className="rs-cd-win">
        <span className="rs-cd-dash">–</span>
      </span>
    );
  }
  return (
    <span className="rs-cd-win">
      <span className="rs-cd-col" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
        {DIGITS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
});

function parts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  return [
    { v: Math.floor(diff / 86_400_000), u: "days" },
    { v: Math.floor((diff % 86_400_000) / 3_600_000), u: "hrs" },
    { v: Math.floor((diff % 3_600_000) / 60_000), u: "min" },
    { v: Math.floor((diff % 60_000) / 1000), u: "sec" },
  ];
}

/**
 * RollingCountdown — Martian Mono readout where every digit is a column of
 * 0-9 that springs to its value, so digits roll instead of swapping.
 * Server render shows dashes; the shared useNow clock drives ticks.
 */
export default function RollingCountdown({
  target,
  label,
  size = "lg",
}: {
  target: string;
  label: string;
  size?: "lg" | "md" | "sm";
}) {
  const now = useNow();
  const t = new Date(target);
  const ended = now ? now.getTime() >= t.getTime() : false;
  const p = now ? parts(t, now) : null;
  const spoken = !p ? "Loading" : ended ? "Ended" : p.map((x) => `${x.v} ${x.u}`).join(", ");

  return (
    <div className={`rs-cd rs-cd-${size}`}>
      <div className="rs-cd-label">{label}</div>
      {ended ? (
        <div className="rs-cd-ended">Ended</div>
      ) : (
        <div className="rs-cd-row" aria-hidden="true">
          {(p ?? [{ u: "days" }, { u: "hrs" }, { u: "min" }, { u: "sec" }]).map((x, i) => {
            const str = "v" in x ? String(x.v).padStart(2, "0") : "--";
            return (
              <div className="rs-cd-unit" key={x.u}>
                <div className="rs-cd-digits">
                  {str.split("").map((ch, j) => (
                    <Digit ch={ch} key={j} />
                  ))}
                </div>
                <div className="rs-cd-u">{x.u}</div>
                {i < 3 && <span className="rs-cd-sep" />}
              </div>
            );
          })}
        </div>
      )}
      <span className="og-visually-hidden">{`${label}: ${spoken}`}</span>
    </div>
  );
}

"use client";

import type { CSSProperties } from "react";
import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import { availOf } from "./Availability";
import { formatServerDate } from "../lib/dates";

export interface PhaseNode {
  id: string;
  label: string;
  start: string;
  end: string;
  stars: { name: string; portrait: string | null; color: string }[];
}

/** Version phases as a track: ended -> live (with countdown) -> next (TBA). */
export default function PhaseTrack({ phases, builtAt }: { phases: PhaseNode[]; builtAt: number }) {
  const clock = useNow(30_000);
  const now = clock ? clock.getTime() : builtAt;
  return (
    <ol className="pp-track">
      {phases.map((p) => {
        const st = availOf(p.start, p.end, now);
        return (
          <li key={p.id} className={`pp-phase pp-phase-${st}`}>
            <p className="pp-phase-kicker">
              {p.label}
              <span className="pp-phase-state">{st === "live" ? "Live now" : st === "ended" ? "Ended" : "Upcoming"}</span>
            </p>
            <ul className="pp-phase-stars">
              {p.stars.map((s) => (
                <li key={s.name} style={{ "--c": s.color } as CSSProperties}>
                  {s.portrait && (
                    // eslint-disable-next-line @next/next/no-img-element -- 44px portrait.
                    <img src={s.portrait} alt="" width={44} height={44} loading="lazy" />
                  )}
                  <span>{s.name}</span>
                </li>
              ))}
            </ul>
            {st === "live" ? (
              <RollingCountdown size="sm" target={p.end} label="Ends in" />
            ) : (
              <p className="pp-phase-dates">
                {formatServerDate(p.start)} – {formatServerDate(p.end)}
              </p>
            )}
          </li>
        );
      })}
      <li className="pp-phase pp-phase-tba">
        <p className="pp-phase-kicker">Next phase</p>
        <p className="pp-phase-tba-t">Not announced</p>
        <p className="pp-phase-dates">Lily (3.8) is expected; no date is official yet.</p>
      </li>
    </ol>
  );
}

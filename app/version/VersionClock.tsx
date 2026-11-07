"use client";

import type { CSSProperties } from "react";
import RollingCountdown from "../../components/RollingCountdown";
import useNow from "../../components/useNow";
import { formatServerDay, formatSpan } from "../../lib/dates";

export interface ClockPhase {
  id: string;
  phase: string;
  lead: string;
  startsAt: string;
  endsAt: string;
  color: string;
  estimated: boolean;
}

type State =
  | { kind: "before"; target: string }
  | { kind: "live"; phase: ClockPhase; target: string }
  | { kind: "gap"; phase: ClockPhase; target: string }
  | { kind: "ended" };

function stateAt(phases: ClockPhase[], now: number): State {
  const first = phases[0];
  if (now < Date.parse(first.startsAt)) return { kind: "before", target: first.startsAt };
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    if (now >= Date.parse(p.startsAt) && now < Date.parse(p.endsAt)) return { kind: "live", phase: p, target: p.endsAt };
    const next = phases[i + 1];
    if (next && now >= Date.parse(p.endsAt) && now < Date.parse(next.startsAt)) {
      return { kind: "gap", phase: next, target: next.startsAt };
    }
  }
  return { kind: "ended" };
}

/**
 * The version's clock: one big countdown to the next thing that happens
 * (launch, current phase end, next phase start) plus a timeline of the
 * phases with a "today" marker. Reads the shared clock, so a static build
 * keeps telling the truth between rebuilds; `builtAt` seeds the HTML.
 */
export default function VersionClock({ phases, builtAt }: { phases: ClockPhase[]; builtAt: number }) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  if (phases.length === 0) return null;

  const state = stateAt(phases, now);
  const start = Date.parse(phases[0].startsAt);
  const end = Date.parse(phases[phases.length - 1].endsAt);
  const span = end - start;
  const nowPct = Math.min(100, Math.max(0, ((now - start) / span) * 100));
  const inRange = now >= start && now <= end;

  const label =
    state.kind === "before"
      ? "Launches in"
      : state.kind === "live"
        ? `${state.phase.phase} is live · ends in`
        : state.kind === "gap"
          ? `${state.phase.phase} starts in`
          : "";

  return (
    <div className="vo-clock">
      {state.kind === "ended" ? (
        <p className="vo-clock-ended">This version has ended.</p>
      ) : (
        <RollingCountdown target={state.target} label={label} />
      )}

      <div className="vo-tl" role="img" aria-label={timelineLabel(phases, state, now)}>
        <div className="vo-tl-track">
          {phases.map((p, i) => {
            const w = ((Date.parse(p.endsAt) - Date.parse(p.startsAt)) / span) * 100;
            const done = now >= Date.parse(p.endsAt);
            const live = now >= Date.parse(p.startsAt) && !done;
            return (
              <span
                key={p.id}
                className={`vo-tl-seg${live ? " is-live" : ""}${done ? " is-done" : ""}`}
                style={{ "--w": `${w}%`, "--c": p.color, "--i": i } as CSSProperties}
              />
            );
          })}
          {inRange && <span className="vo-tl-now" style={{ "--x": `${nowPct}%` } as CSSProperties} />}
        </div>
        <div className="vo-tl-labels" aria-hidden="true">
          {phases.map((p) => {
            const w = ((Date.parse(p.endsAt) - Date.parse(p.startsAt)) / span) * 100;
            return (
              <span key={p.id} className="vo-tl-label" style={{ "--w": `${w}%`, "--c": p.color } as CSSProperties}>
                <strong>{p.phase}</strong>
                <span>{p.lead}</span>
                <span className="vo-tl-dates">
                  {formatServerDay(p.startsAt)} – {formatServerDay(p.endsAt)}
                  {p.estimated ? " · est." : ""}
                </span>
              </span>
            );
          })}
        </div>
        {!inRange && state.kind === "before" && clock && (
          <p className="vo-tl-before">{formatSpan(start - now)} until the first phase opens.</p>
        )}
      </div>
    </div>
  );
}

function timelineLabel(phases: ClockPhase[], state: State, now: number): string {
  const parts = phases.map((p) => `${p.phase} (${p.lead}) ${formatServerDay(p.startsAt)} to ${formatServerDay(p.endsAt)}`);
  const where =
    state.kind === "before"
      ? "The version has not started yet."
      : state.kind === "live"
        ? `${state.phase.phase} is live now, ${formatSpan(Date.parse(state.phase.endsAt) - now)} left.`
        : state.kind === "gap"
          ? `Between phases; ${state.phase.phase} is next.`
          : "The version has ended.";
  return `Version timeline: ${parts.join("; ")}. ${where}`;
}

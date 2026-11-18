"use client";

import { useEffect, useRef } from "react";
import useNow from "../useNow";
import { CharMedal } from "../CharThumb";
import type { Thumb } from "@/lib/renders";

export interface AmPhase {
  id: string;
  label: string;
  names: string;
  start: string;
  end: string;
  faces: { name: string; thumb: Thumb | null }[];
  color: string;
}
export interface AmStop {
  t: string;
  day: string;
  title: string;
  sub: string | null;
}

const D = 86_400_000;
const H = 3_600_000;
const DAY = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "Asia/Shanghai" });

/**
 * The version as a ribbon: phase bands with their featured faces, a tick
 * for every day (tall gold ticks on Monday weekly resets), diamond markers
 * for each date that opens something, a cyan "today" marker, and a cap
 * for the next version. Scrolls sideways on narrow screens, opening at today.
 */
export default function AmTimeline({
  start,
  end,
  phases,
  stops,
  next,
  builtAt,
}: {
  start: string;
  end: string;
  phases: AmPhase[];
  stops: AmStop[];
  next: { version: string; label: string } | null;
  builtAt: number;
}) {
  const now = useNow(60_000);
  const wrap = useRef<HTMLDivElement>(null);
  const scrolled = useRef(false);
  const s = Date.parse(start);
  const e = Date.parse(end);
  const pos = (ms: number) => Math.max(0, Math.min(100, ((ms - s) / (e - s)) * 100));
  const t = now?.getTime() ?? null;
  const tt = t ?? builtAt;

  const ticks: { left: number; monday: boolean; past: boolean }[] = [];
  const firstDay = Math.ceil((s + 8 * H) / D) * D - 8 * H; // next midnight, server time
  for (let d = firstDay; d < e; d += D) {
    ticks.push({ left: pos(d), monday: new Date(d + 8 * H).getUTCDay() === 1, past: d <= tt });
  }

  useEffect(() => {
    const el = wrap.current;
    if (!el || scrolled.current || t === null) return;
    scrolled.current = true;
    if (el.scrollWidth > el.clientWidth + 4) {
      const track = el.firstElementChild as HTMLElement | null;
      el.scrollLeft = Math.max(0, ((track?.offsetWidth ?? 0) * pos(t)) / 100 - el.clientWidth * 0.45);
    }
  });

  const today = t !== null && t >= s && t < e;

  return (
    <div className="am-line-wrap" ref={wrap}>
      <div className="am-vline" role="img" aria-label={`Version timeline from ${stops[0]?.day ?? ""} to ${stops[stops.length - 1]?.day ?? ""}`}>
        <div className="am-vtrack">
          {phases.map((p) => {
            const on = tt >= Date.parse(p.start) && tt < Date.parse(p.end);
            const left = pos(Date.parse(p.start));
            const right = pos(Date.parse(p.end));
            return (
              <div
                key={p.id}
                className={`am-vband${on ? " is-on" : ""}`}
                style={{ left: `${left}%`, width: `calc(${right - left}% - 6px)`, "--ec": p.color } as React.CSSProperties}
              >
                <span className="am-vhead">
                  <span className="am-vfaces">
                    {p.faces.map((f) => (
                      <CharMedal key={f.name} thumb={f.thumb} name={f.name} size={34} />
                    ))}
                  </span>
                  <span className="am-vbl">
                    <b>{p.label}</b>
                    <span>{p.names}</span>
                  </span>
                  {on && <em>Now</em>}
                </span>
              </div>
            );
          })}
          {ticks.map((k) => (
            <i key={k.left} className={`am-vt${k.monday ? " is-wk" : ""}${k.past ? " is-past" : ""}`} style={{ left: `${k.left}%` }} />
          ))}
          <i className="am-vax" />
          <i className="am-vdone" style={{ width: `${pos(tt)}%` }} />
          {stops.map((st, i) => {
            const last = i === stops.length - 1;
            return (
              <div
                key={st.t + st.title}
                className={`am-node ${i % 2 ? "is-dn" : "is-up"}${Date.parse(st.t) <= tt ? " is-past" : ""}${last ? " is-last" : ""}`}
                style={{ left: `${pos(Date.parse(st.t))}%` }}
              >
                <div className="am-lb">
                  <span>{st.day}</span>
                  <b>{st.title}</b>
                  {st.sub && <span className="am-lb-sub">{st.sub}</span>}
                </div>
              </div>
            );
          })}
          {today && (
            <>
              <div className="am-vnow" style={{ left: `${pos(t!)}%` }}>
                <span>Today, {DAY.format(t!)}</span>
              </div>
              <div className="am-now-dot" style={{ left: `${pos(t!)}%` }} />
            </>
          )}
        </div>
        {next && (
          <a className="am-vend" href="#fed" aria-label={`Version ${next.version} arrives ${next.label}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <use href="#am-mark" />
            </svg>
            <b>{next.version}</b>
            <span>{next.label}</span>
          </a>
        )}
      </div>
    </div>
  );
}

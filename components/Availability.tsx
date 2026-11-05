"use client";

import useNow from "./useNow";
import { formatServerDate } from "../lib/dates";

export type Avail = "live" | "soon" | "ended" | "unknown";

export function availOf(start: string | null, end: string | null, now: number): Avail {
  if (!start || !end) return "unknown";
  if (now < new Date(start).getTime()) return "soon";
  return now < new Date(end).getTime() ? "live" : "ended";
}

/** Banner availability from dates on the shared clock (static-export safe). */
export default function Availability({
  start,
  end,
  builtAt,
}: {
  start: string | null;
  end: string | null;
  builtAt: number;
}) {
  const clock = useNow(60_000);
  const st = availOf(start, end, clock ? clock.getTime() : builtAt);
  if (st === "unknown") return <span className="pp-avail pp-avail-unknown">Not on a banner yet</span>;
  if (st === "ended") return <span className="pp-avail pp-avail-ended">Banner ended {formatServerDate(end)}</span>;
  if (st === "soon") return <span className="pp-avail pp-avail-soon">Banner starts {formatServerDate(start)}</span>;
  return <span className="pp-avail pp-avail-live">On banner · ends {formatServerDate(end)}</span>;
}

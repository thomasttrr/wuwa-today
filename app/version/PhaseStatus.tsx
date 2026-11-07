"use client";

import useNow from "../../components/useNow";
import { formatSpan } from "../../lib/dates";

/** "Opens in 5d 4h" / "Live · 12d left" / "Ended" for one phase, on the shared clock. */
export default function PhaseStatus({ start, end, builtAt }: { start: string; end: string; builtAt: number }) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (now < s) return <span className="vo-status is-soon">Opens in {formatSpan(s - now)}</span>;
  if (now < e) return <span className="vo-status is-live">Live · {formatSpan(e - now)} left</span>;
  return <span className="vo-status is-ended">Ended</span>;
}

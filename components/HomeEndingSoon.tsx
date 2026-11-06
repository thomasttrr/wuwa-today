"use client";

import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import type { GameEvent, RedeemCode } from "../lib/data";

const MAX_ROWS = 5;

interface Row {
  key: string;
  kind: "event" | "codes";
  name: string;
  detail: string;
  endsAt: string;
  unconfirmed?: boolean;
}

/**
 * Homepage "Ending soon": every timed deadline in one list — live events
 * plus redeem codes with an announced expiry (codes sharing an expiry are
 * one row). Live-ness comes from the dates on the shared clock, not the
 * stored status, so a static build never shows finished items or hides
 * ones that have since started. The featured banner is left out: its
 * countdown is the tile directly above.
 */
export default function HomeEndingSoon({
  events,
  codes,
  builtAt,
}: {
  events: GameEvent[];
  codes: Pick<RedeemCode, "code" | "expiresAt">[];
  builtAt: number;
}) {
  const clock = useNow(30_000);
  const now = clock ? clock.getTime() : builtAt;

  const rows: Row[] = events
    .filter((e) => e.endsAt && Date.parse(e.startsAt) <= now && Date.parse(e.endsAt) > now)
    .map((e) => ({
      key: e.id,
      kind: "event" as const,
      name: e.name,
      detail: e.rewards,
      endsAt: e.endsAt!,
      unconfirmed: e.rewardsUnconfirmed,
    }));

  const byExpiry = new Map<string, string[]>();
  for (const c of codes) {
    if (!c.expiresAt || Date.parse(c.expiresAt) <= now) continue;
    byExpiry.set(c.expiresAt, [...(byExpiry.get(c.expiresAt) ?? []), c.code]);
  }
  for (const [endsAt, list] of byExpiry) {
    rows.push({
      key: `codes-${endsAt}`,
      kind: "codes",
      name: list.length > 1 ? `${list.length} redeem codes expire` : `Code ${list[0]} expires`,
      detail: list.length > 1 ? list.join(" · ") : "Redeem it before it goes",
      endsAt,
    });
  }

  rows.sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt));
  const shown = rows.slice(0, MAX_ROWS);
  const more = rows.length - shown.length;

  if (shown.length === 0) return <p className="rs-muted">Nothing timed is ending right now.</p>;
  return (
    <>
      <ul className="rs-events">
        {shown.map((r) => (
          <li key={r.key} className={r.kind === "codes" ? "is-codes" : undefined}>
            <div className="rs-event-main">
              <span className="rs-event-name">
                {r.kind === "codes" ? <a href="#codes">{r.name}</a> : r.name}
              </span>
              <span className="rs-event-rewards">
                {r.detail}
                {r.unconfirmed && <span className="rs-unconfirmed">Unconfirmed</span>}
              </span>
            </div>
            <RollingCountdown size="sm" target={r.endsAt} label={r.kind === "codes" ? `${r.name} in` : `${r.name} ends in`} />
          </li>
        ))}
      </ul>
      {(more > 0 || shown.some((r) => r.unconfirmed)) && (
        <div className="rs-events-foot">
          {more > 0 && <p>+{more} more timed {more === 1 ? "event ends" : "events end"} later.</p>}
          {shown.some((r) => r.unconfirmed) && (
            <p>
              <span className="rs-unconfirmed" aria-hidden="true">
                Unconfirmed
              </span>{" "}
              Rewards come from early coverage, not the in-game notice yet. Check in-game before planning around them.
            </p>
          )}
        </div>
      )}
    </>
  );
}

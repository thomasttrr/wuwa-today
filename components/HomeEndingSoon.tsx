"use client";

import RollingCountdown from "./RollingCountdown";
import useNow from "./useNow";
import type { GameEvent } from "../lib/data";

/**
 * Homepage "Ending soon" list. Live-ness comes from each event's dates on
 * the shared clock (not the stored status), so a static build never shows
 * finished events or hides ones that have since started.
 */
export default function HomeEndingSoon({ events, builtAt }: { events: GameEvent[]; builtAt: number }) {
  const clock = useNow(30_000);
  const now = clock ? clock.getTime() : builtAt;
  const live = events
    .filter((e) => e.endsAt && new Date(e.startsAt).getTime() <= now && new Date(e.endsAt).getTime() > now)
    .sort((a, b) => a.endsAt!.localeCompare(b.endsAt!))
    .slice(0, 4);

  if (live.length === 0) return <p className="rs-muted">No timed events running right now.</p>;
  return (
    <ul className="rs-events">
      {live.map((e) => (
        <li key={e.id}>
          <div className="rs-event-main">
            <span className="rs-event-name">{e.name}</span>
            <span className="rs-event-rewards">
        {e.rewards}
        {e.rewardsUnconfirmed && (
          <span className="rs-unconfirmed" title="Rewards from early coverage — check the in-game notice">
            Unconfirmed
          </span>
        )}
      </span>
          </div>
          <RollingCountdown size="sm" target={e.endsAt!} label="Ends in" />
        </li>
      ))}
    </ul>
  );
}

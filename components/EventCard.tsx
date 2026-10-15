"use client";

import { useState } from "react";
import ObsidianCountdown from "./ObsidianCountdown";
import { formatServerDateWithNote, type GameEvent } from "../lib/data";

const TYPE_LABELS: Record<string, string> = {
  limited: "Limited event",
  login: "Login event",
  spending: "Spending event",
  permanent: "Permanent",
  web: "Web event",
};

/**
 * Obsidian event card. Solid #101014 surface; gold mono countdown with
 * digit-roll (gold because it is time); gold live dot for active events.
 *
 * `compact` (home page): countdown + rewards are promoted, the body is
 * truncated to two lines, and full details expand via a real toggle —
 * works on touch, keyboard, and screen readers (no hover-only behavior).
 */
export default function EventCard({
  event,
  compact = false,
}: {
  event: GameEvent;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const badgeRow = (
    <div className="og-badge-row">
      <span className="og-badge">{TYPE_LABELS[event.type] ?? event.type}</span>
      {event.status === "active" ? (
        <span className="og-live">Live</span>
      ) : (
        <span className="og-badge">Upcoming</span>
      )}
      {event.timeNote && <span className="og-badge">Dates estimated</span>}
    </div>
  );

  const countdown = event.endsAt ? (
    <ObsidianCountdown
      target={event.status === "active" ? event.endsAt : event.startsAt}
      label={`${
        event.status === "active" ? "Ends" : "Starts"
      } ${formatServerDateWithNote(
        event.status === "active" ? event.endsAt : event.startsAt,
        event.timeNote
      )}`}
    />
  ) : (
    <p className="og-event-meta">No end date — take your time.</p>
  );

  if (compact) {
    return (
      <article
        className="og-event-card og-event-card-compact"
        aria-label={`Event: ${event.name}`}
      >
        {badgeRow}
        <h3 className="og-event-title">{event.name}</h3>
        {countdown}
        <p className="og-event-rewards">
          <strong>Rewards:</strong> {event.rewards}
        </p>
        <p
          className="og-event-desc"
          data-expanded={expanded ? "true" : "false"}
        >
          {event.description}
        </p>
        <button
          type="button"
          className="og-event-expand"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Show details"}
        </button>
      </article>
    );
  }

  return (
    <article className="og-event-card" aria-label={`Event: ${event.name}`}>
      {badgeRow}
      <h3 className="og-event-title">{event.name}</h3>
      <p className="og-event-desc">{event.description}</p>
      <p className="og-event-meta">
        <strong>Rewards:</strong> {event.rewards}
      </p>
      {countdown}
    </article>
  );
}

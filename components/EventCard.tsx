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
 */
export default function EventCard({ event }: { event: GameEvent }) {
  return (
    <article className="og-event-card" aria-label={`Event: ${event.name}`}>
      <div className="og-badge-row">
        <span className="og-badge">{TYPE_LABELS[event.type] ?? event.type}</span>
        {event.status === "active" ? (
          <span className="og-live">Live</span>
        ) : (
          <span className="og-badge">Upcoming</span>
        )}
        {event.timeNote && <span className="og-badge">Dates estimated</span>}
      </div>
      <h3 className="og-event-title">{event.name}</h3>
      <p className="og-event-desc">{event.description}</p>
      <p className="og-event-meta">
        <strong>Rewards:</strong> {event.rewards}
      </p>
      {event.endsAt ? (
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
      )}
    </article>
  );
}

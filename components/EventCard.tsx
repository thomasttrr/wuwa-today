import Countdown from "./Countdown";
import { formatDateWithNote, type GameEvent } from "../lib/data";

const TYPE_LABELS: Record<string, string> = {
  limited: "Limited event",
  login: "Login event",
  spending: "Spending event",
  permanent: "Permanent",
  web: "Web event",
};

export default function EventCard({ event }: { event: GameEvent }) {
  return (
    <article className="card" aria-label={`Event: ${event.name}`}>
      <div>
        <span className="badge">{TYPE_LABELS[event.type] ?? event.type}</span>
        {event.status === "upcoming" && <span className="badge purple">Upcoming</span>}
        {event.timeNote && <span className="badge dim">Dates estimated</span>}
      </div>
      <h3 style={{ marginTop: "0.5rem" }}>{event.name}</h3>
      <p style={{ margin: "0.4rem 0" }}>{event.description}</p>
      <p className="event-meta">
        <strong>Rewards:</strong> {event.rewards}
      </p>
      {event.endsAt ? (
        <Countdown
          target={event.status === "active" ? event.endsAt : event.startsAt}
          label={`${event.status === "active" ? "Ends" : "Starts"} ${formatDateWithNote(
            event.status === "active" ? event.endsAt : event.startsAt,
            event.timeNote
          )}`}
        />
      ) : (
        <p className="event-meta">No end date — take your time.</p>
      )}
    </article>
  );
}

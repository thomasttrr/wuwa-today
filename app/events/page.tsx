import type { Metadata } from "next";
import EventCard from "../../components/EventCard";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeEvents, upcomingEvents } from "../../lib/data";

export const metadata: Metadata = {
  title: "Wuthering Waves Events — Active & Upcoming",
  description:
    "Every active Wuthering Waves event with end-date countdowns, plus what's coming next. Never miss limited rewards again.",
};

export default function EventsPage() {
  return (
    <>
      <h1>Wuthering Waves events</h1>
      <p className="lede">
        What's running now, what ends soonest, and what's on the horizon.
        Limited events are ordered by end date — finish the top ones first.
      </p>
      <UpdatedStamp />

      <h2>Active</h2>
      <div className="grid grid-2">
        {activeEvents.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>

      {upcomingEvents.length > 0 && (
        <>
          <h2>Upcoming</h2>
          <div className="grid grid-2">
            {upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
    </>
  );
}

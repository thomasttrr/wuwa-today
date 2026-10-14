import type { Metadata } from "next";
import EventCard from "../../components/EventCard";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
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
        What&apos;s running now, what ends soonest, and what&apos;s on the horizon.
        Limited events are ordered by end date — finish the top ones first.
      </p>
      <div className="page-meta-row">
        <UpdatedStamp />
        <ShareButton />
      </div>

      <h2>Active</h2>
      {activeEvents.length === 0 ? (
        <p className="empty-state">
          No active events right now — check back after the next version
          livestream.
        </p>
      ) : (
        <div className="grid grid-2">
          {activeEvents.map((e, i) => (
            <Reveal key={e.id} delay={i * 70}>
              <EventCard event={e} />
            </Reveal>
          ))}
        </div>
      )}

      {upcomingEvents.length > 0 && (
        <>
          <h2>Upcoming</h2>
          <div className="grid grid-2">
            {upcomingEvents.map((e, i) => (
              <Reveal key={e.id} delay={i * 70}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </>
  );
}

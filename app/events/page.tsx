import type { Metadata } from "next";
import EventCard from "../../components/EventCard";
import ObsidianToolbar from "../../components/ObsidianToolbar";
import OgPageHero from "../../components/OgPageHero";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeEvents, upcomingEvents, bannerMeta } from "../../lib/data";

export const metadata: Metadata = {
  title: "Wuthering Waves Events — Active & Upcoming",
  description:
    "Every active Wuthering Waves event with end-date countdowns, plus what's coming next. Never miss limited rewards again.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  return (
    <>
      <OgPageHero
        kicker={`Version ${bannerMeta.version} · Active & upcoming`}
        title="Wuthering Waves events"
        lede="What’s running now, what ends soonest, and what’s on the horizon. Limited events are ordered by end date — finish the top ones first."
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />

      <ObsidianToolbar
        label="Event sections"
        items={[
          { href: "#active", label: "Active" },
          ...(upcomingEvents.length > 0
            ? [{ href: "#upcoming", label: "Upcoming" }]
            : []),
        ]}
      />

      <div className="og-section">
        <div className="og-section-head" id="active">
          <h2 className="og-h2">Active</h2>
        </div>
        {activeEvents.length === 0 ? (
          <p className="og-empty">
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
      </div>

      {upcomingEvents.length > 0 && (
        <div className="og-section">
          <div className="og-section-head" id="upcoming">
            <h2 className="og-h2">Upcoming</h2>
          </div>
          <div className="grid grid-2">
            {upcomingEvents.map((e, i) => (
              <Reveal key={e.id} delay={i * 70}>
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

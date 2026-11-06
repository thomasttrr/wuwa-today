import PageHero from "@/components/PageHero";
import type { Metadata } from "next";
import EventsBoard from "../../components/EventsBoard";
import UpdatedStamp from "../../components/UpdatedStamp";
import { events, bannerMeta } from "../../lib/data";
import "./events.css";

export const metadata: Metadata = {
  title: "Wuthering Waves Events — Active & Upcoming",
  description:
    "Every active Wuthering Waves event with end-date countdowns, a version timeline, and what's coming next. Never miss limited rewards again.",
  alternates: { canonical: "/events" },
};

const BUILT_AT = Date.now();

export default function EventsPage() {
  return (
    <>
      <PageHero kicker={<>Version {bannerMeta.version} · {bannerMeta.versionTitle}</>} title="Events">
        What&apos;s running, what ends first, and what starts next. Statuses
          update live from each event&apos;s dates, in server time (UTC+8).
      </PageHero>
      <EventsBoard events={events} builtAt={BUILT_AT} />
      <div className="ev-stamp">
        <UpdatedStamp />
      </div>
    </>
  );
}

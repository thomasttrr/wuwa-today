import type { Metadata } from "next";
import BannerCard from "../components/BannerCard";
import CodeRow from "../components/CodeRow";
import EventCard from "../components/EventCard";
import ResetTimers from "../components/ResetTimers";
import NewsletterSignup from "../components/NewsletterSignup";
import UpdatedStamp from "../components/UpdatedStamp";
import {
  activeBanners,
  activeCodes,
  activeEvents,
  bannerMeta,
} from "../lib/data";

export const metadata: Metadata = {
  title: "WuWa Today — Wuthering Waves Banners, Codes & Events",
  description:
    "Today in Wuthering Waves: live banners with countdowns, working redeem codes, active events, and daily/weekly reset timers. Updated daily.",
};

export default function HomePage() {
  return (
    <>
      <h1>Today in Wuthering Waves</h1>
      <p className="lede">
        Version {bannerMeta.version} — {bannerMeta.versionTitle}. Everything
        time-sensitive in one place: who's on banner, which codes still work,
        what ends soon.
      </p>
      <UpdatedStamp />

      <h2 id="banners">Live banners</h2>
      <div className="grid grid-2">
        {activeBanners.map((b) => (
          <BannerCard key={b.id} banner={b} />
        ))}
      </div>
      <p>
        <a href="/banners">All banners, upcoming phases &amp; history →</a>
      </p>

      <h2 id="codes">Working redeem codes</h2>
      <div className="grid">
        {activeCodes.map((c) => (
          <CodeRow key={c.code} code={c} />
        ))}
      </div>
      <p>
        <a href="/codes">All codes &amp; expired archive →</a>
      </p>

      <h2 id="events">Active events</h2>
      <div className="grid grid-2">
        {activeEvents.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
      <p>
        <a href="/events">Full event calendar →</a>
      </p>

      <h2 id="resets">Reset timers</h2>
      <ResetTimers />

      <NewsletterSignup />
    </>
  );
}

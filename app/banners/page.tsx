import type { Metadata } from "next";
import BannerCard from "../../components/BannerCard";
import ObsidianToolbar from "../../components/ObsidianToolbar";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeBanners, upcomingBanners, bannerHistory, formatServerDate } from "../../lib/data";

export const metadata: Metadata = {
  title: "Wuthering Waves Banners — Current, Upcoming & History",
  description:
    "All Wuthering Waves banners: who's featured right now, what's coming next (official vs. leak labeled), and the full banner history.",
};

export default function BannersPage() {
  return (
    <>
      <div className="og-page-head">
        <h1 className="og-display og-h1">Wuthering Waves banners</h1>
        <p className="og-lede">
          Current and upcoming Convene banners. Anything not confirmed by Kuro
          Games is labeled as a leak or estimate — never presented as fact.
        </p>
        <div className="og-meta-row">
          <UpdatedStamp />
          <ShareButton />
        </div>
      </div>

      <ObsidianToolbar
        label="Banner sections"
        items={[
          { href: "#live", label: "Live now" },
          { href: "#upcoming", label: "Upcoming" },
          { href: "#history", label: "History" },
        ]}
      />

      <div className="og-section">
        <div className="og-section-head" id="live">
          <h2 className="og-h2">Live now</h2>
        </div>
        <div className="grid grid-2">
          {activeBanners.map((b, i) => (
            <Reveal key={b.id} delay={i * 70}>
              <BannerCard banner={b} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="og-section">
        <div className="og-section-head" id="upcoming">
          <h2 className="og-h2">Upcoming</h2>
        </div>
        <div className="grid grid-2">
          {upcomingBanners.map((b, i) => (
            <Reveal key={b.id} delay={i * 70}>
              <BannerCard banner={b} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="og-section">
        <div className="og-section-head" id="history">
          <div>
            <h2 className="og-h2">Banner history</h2>
            <p className="og-section-blurb">
              Every phase on record, all dates in server time (UTC+8).
            </p>
          </div>
        </div>
        <div className="og-table-wrap">
          <table className="og-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Phase</th>
                <th>Ran</th>
                <th>Headliners</th>
              </tr>
            </thead>
            <tbody>
              {bannerHistory.map((h) => (
                <tr key={h.id}>
                  <td>{h.version}</td>
                  <td>{h.phase}</td>
                  <td className="og-mono">
                    {formatServerDate(h.startsAt)} – {formatServerDate(h.endsAt)}
                  </td>
                  <td>{h.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import BannerCard from "../../components/BannerCard";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeBanners, upcomingBanners, bannerHistory, formatDate } from "../../lib/data";

export const metadata: Metadata = {
  title: "Wuthering Waves Banners — Current, Upcoming & History",
  description:
    "All Wuthering Waves banners: who's featured right now, what's coming next (official vs. leak labeled), and the full banner history.",
};

export default function BannersPage() {
  return (
    <>
      <h1>Wuthering Waves banners</h1>
      <p className="lede">
        Current and upcoming Convene banners. Anything not confirmed by Kuro
        Games is labeled as a leak or estimate — never presented as fact.
      </p>
      <UpdatedStamp />

      <h2>Live now</h2>
      <div className="grid grid-2">
        {activeBanners.map((b) => (
          <BannerCard key={b.id} banner={b} />
        ))}
      </div>

      <h2>Upcoming</h2>
      <div className="grid grid-2">
        {upcomingBanners.map((b) => (
          <BannerCard key={b.id} banner={b} />
        ))}
      </div>

      <h2>Banner history</h2>
      <div className="table-scroll">
      <table className="data">
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
              <td>
                {formatDate(h.startsAt)} – {formatDate(h.endsAt)}
              </td>
              <td>{h.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="updated">
        History is abbreviated in this MVP — extend <span className="mono">data/banners.json</span> →
        <span className="mono"> history</span> to grow the archive.
      </p>
    </>
  );
}

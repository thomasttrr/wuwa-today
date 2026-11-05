import { codesUpdatedAt, dataUpdatedAt, formatServerDate } from "../lib/data";

/** "Banners & events verified Oct 13, 2026 · Codes Oct 6, 2026" stamp under each page head. */
export default function UpdatedStamp() {
  const main = formatServerDate(dataUpdatedAt());
  const codes = formatServerDate(codesUpdatedAt());
  return (
    <p className="og-updated">
      Banners &amp; events verified {main}
      {codes !== main ? <> · codes verified {codes}</> : null}. Dates marked
      estimated come from community trackers — confirm in-game.
    </p>
  );
}

import { codesUpdatedAt, dataUpdatedAt, formatServerDate } from "../lib/data";
import { LocalDate } from "./LocalTime";

/**
 * "Banners & events verified Oct 13, 2026 · Codes Oct 6, 2026" stamp under
 * each page head. The HTML carries the server-time (UTC+8) date; after
 * hydration it shows the date in the visitor's own zone, so an evening
 * update in the Americas never reads as "verified tomorrow".
 */
export default function UpdatedStamp() {
  const mainIso = dataUpdatedAt();
  const codesIso = codesUpdatedAt();
  const main = formatServerDate(mainIso);
  const codes = formatServerDate(codesIso);
  return (
    <p className="og-updated">
      Banners &amp; events verified <LocalDate iso={mainIso} fallback={main} />
      {codes !== main ? (
        <>
          {" "}
          · codes verified <LocalDate iso={codesIso} fallback={codes} />
        </>
      ) : null}
      . Dates marked estimated come from community trackers — confirm in-game.
    </p>
  );
}

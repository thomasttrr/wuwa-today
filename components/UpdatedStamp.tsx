import { dataUpdatedAt, formatDate } from "../lib/data";

/** "Data verified Oct 13, 2026" stamp shown under each page head. */
export default function UpdatedStamp() {
  return (
    <p className="og-updated">
      Data verified {formatDate(dataUpdatedAt())}. Dates marked estimated come
      from community trackers — confirm in-game.
    </p>
  );
}

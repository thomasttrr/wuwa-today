import { dataUpdatedAt, formatDate } from "../lib/data";

/** "Data verified Oct 13, 2026" stamp shown under each dashboard section. */
export default function UpdatedStamp() {
  return (
    <p className="updated">
      Data verified {formatDate(dataUpdatedAt())}. Dates marked estimated come
      from community trackers — confirm in-game.
    </p>
  );
}

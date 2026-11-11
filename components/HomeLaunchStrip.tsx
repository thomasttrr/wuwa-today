"use client";

import Link from "next/link";
import useNow from "./useNow";
import launch from "../data/launch.json";

/*
 * The homepage launch strip for Version 3.8, in the .rs-broadcast slot the
 * next-version strip used to occupy. Client-clock driven (builtAt seeds the
 * server render, like NextVersionNote), so it flips on its own: pre-download
 * countdown → pre-download open + Mail deadline → gone at go-live, with no
 * rebuild needed. Facts live in data/launch.json.
 */

const T = {
  predownload: Date.parse(launch.predownloadOpensAt),
  compensation: Date.parse(launch.compensationDeadlineAt),
  maintenance: Date.parse(launch.maintenanceStartsAt),
  goLive: Date.parse(launch.goLiveAt),
};

export default function HomeLaunchStrip({ builtAt }: { builtAt: number }) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;

  if (now >= T.goLive) return null;

  const text =
    now >= T.compensation
      ? "Pre-download is open now. The window for the 300 Astrite compensation closed Wed 3:00 PM ET."
      : now >= T.predownload
        ? "Pre-download is open now. One deadline: Mail must be unlocked before Wed 3:00 PM ET to get the 300 Astrite compensation."
        : "Pre-download opens Mon, Nov 9 · 9:00 PM ET. Mail must be unlocked before Wed 3:00 PM ET to get the 300 Astrite compensation.";

  return (
    <p className="rs-broadcast">
      <span className="rs-broadcast-tag">{launch.version} launch</span>
      <span className="rs-broadcast-text">{text}</span>
      <span className="rs-broadcast-links">
        <Link href="/version#vo-launch">Launch checklist</Link>
      </span>
    </p>
  );
}

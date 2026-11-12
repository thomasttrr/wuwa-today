import type { ReactNode } from "react";
import launch from "@/data/launch.json";
import Reveal from "../../components/Reveal";
import { YourTime } from "../../components/LocalTime";

/*
 * The 3.8 launch checklist, from data/launch.json (Kuro's official
 * maintenance notice + Steam announcement, cross-checked). Each item
 * carries its own build-time gate, so the section ages correctly across
 * rebuilds: eligibility and pre-download items drop once maintenance
 * starts, the claim item appears at go-live, and the whole section
 * retires when the version ends. Times are authored in ET (the site's
 * home audience) with the reader's own local time appended by YourTime.
 */

const T = {
  predownload: Date.parse(launch.predownloadOpensAt),
  maintenance: Date.parse(launch.maintenanceStartsAt),
  goLive: Date.parse(launch.goLiveAt),
  hideAfter: Date.parse(launch.sectionHideAfter),
};

/* The static export renders this page once, at build time, so "now" is a
 * build-time snapshot — the same pattern as the banners page's BUILT_AT.
 * Rebuilds at phase boundaries keep it honest. */
const BUILT_AT = Date.now();

export function launchSectionActive(now: number): boolean {
  return now < T.hideAfter;
}

export default function LaunchChecklist() {
  const now = BUILT_AT;
  if (!launchSectionActive(now)) return null;

  const items: ReactNode[] = [];

  if (now < T.maintenance) {
    items.push(
      <li key="eligibility" className="vo-launch-item vo-launch-item-warn">
        <p className="vo-launch-title">Don&apos;t miss the compensation</p>
        <p className="vo-launch-text">
          {launch.compensation} goes to every account that has a character created and the
          Mail feature unlocked <strong>before Wed, Nov 11 · 3:00 PM ET</strong>
          <YourTime iso={launch.maintenanceStartsAt} />. New or returning player? Unlock
          Mail before that time or the compensation is gone.
        </p>
      </li>,
    );
  }

  if (now >= T.goLive) {
    items.push(
      <li key="claim" className="vo-launch-item">
        <p className="vo-launch-title">Claim your compensation</p>
        <p className="vo-launch-text">
          {launch.compensation}. {launch.compensationClaim}
        </p>
      </li>,
    );
  }

  if (now < T.maintenance) {
    items.push(
      <li key="predownload" className="vo-launch-item">
        <p className="vo-launch-title">
          {now >= T.predownload ? "Pre-download is open" : "Pre-download opens Mon, Nov 9 · 9:00 PM ET"}
          {now < T.predownload && <YourTime iso={launch.predownloadOpensAt} />}
        </p>
        <p className="vo-launch-text">
          Download 3.8 early so you can play the moment the servers open.{" "}
          {launch.predownloadSizes}.
        </p>
      </li>,
    );
  }

  if (now < T.goLive + 24 * 3600 * 1000) {
    items.push(
      <li key="maintenance" className="vo-launch-item">
        <p className="vo-launch-title">Maintenance: Wed, Nov 11 · 3:00 PM – 10:00 PM ET</p>
        <p className="vo-launch-text">
          The game is offline for the update, and Version 3.8 goes live the moment it
          ends<YourTime iso={launch.goLiveAt} />. If maintenance runs long, Kuro posts a
          follow-up notice and adjusts the compensation.
        </p>
      </li>,
    );
  }

  items.push(
    <li key="steam" className="vo-launch-item">
      <p className="vo-launch-title">On Steam? You need a reinstall</p>
      <p className="vo-launch-text">
        Steam&apos;s download method is being replaced by Kuro&apos;s Official Launcher.
        Uninstall the old package completely, install the new Official Launcher through
        Steam, then pick a resource tier (UHD / HD / SD) inside it. Your account and
        progress are not touched. The full install needs about {launch.steamStorageGb} GB
        free on PC, and Steam gets no pre-download for 3.8 — that starts with Version 4.0.
      </p>
    </li>,
  );

  if (!items.length) return null;

  return (
    <section className="vo-section" id="vo-launch" aria-labelledby="vo-launch-h">
      <Reveal>
        <div className="vo-section-head">
          <h2 id="vo-launch-h" className="vo-h">
            Launch checklist
          </h2>
          <p className="vo-section-sub">
            The dates around the update itself — pre-download, downtime, and the one
            deadline that costs you {launch.compensation.split(" + ")[0]} if you miss it.{" "}
            {launch.verifiedVia}
          </p>
        </div>
      </Reveal>
      <ol className="vo-launch-list">{items}</ol>
    </section>
  );
}

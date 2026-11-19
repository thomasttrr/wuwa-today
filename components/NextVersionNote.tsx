"use client";

import useNow from "./useNow";
import type { NextVersion } from "../lib/data";

/**
 * The "what's next" slot for a version whose banners aren't announced yet,
 * rendered from banners.json → nextVersion on the banners timeline node and
 * the pull-planner phase track. It states only what Kuro has announced
 * (version, title, reveal and launch day): never a headliner, phase date or
 * rerun. `builtAt` seeds the server render so hydration matches.
 */
export default function NextVersionNote({
  next,
  builtAt,
  variant,
}: {
  next: NextVersion;
  builtAt: number;
  variant: "node" | "phase";
}) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  const revealed = now >= Date.parse(next.revealAt);
  const launched = !!next.launchAt && now >= Date.parse(next.launchAt);

  const name = revealed && next.title ? next.title : "Not announced";
  const detail = launched
    ? `Arrived ${next.launchLabel} · banners not entered yet`
    : revealed && next.launchLabel
      ? `Launches ${next.launchLabel} · banner order not announced`
      : revealed
        ? "Broadcast aired — details being verified"
        : `Reveal ${next.revealLabel} · dates and reruns not announced`;

  if (variant === "node") {
    return (
      <>
        <span className="bn-node-ver">Version {next.version}</span>
        <span className="bn-node-name">{name}</span>
        <span className="bn-node-date">{detail}</span>
      </>
    );
  }

  return (
    <>
      <p className="pp-phase-kicker">Version {next.version}</p>
      <p className="pp-phase-tba-t">{name}</p>
      <p className="pp-phase-dates">{detail}</p>
    </>
  );
}

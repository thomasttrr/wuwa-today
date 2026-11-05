"use client";

import Link from "next/link";
import useNow from "./useNow";
import type { NextVersion } from "../lib/data";

/**
 * The "what's next" copy for a version whose banners aren't announced yet,
 * rendered from one data block (banners.json → nextVersion) on three
 * surfaces: the banners timeline node, the pull-planner phase track, and a
 * thin homepage strip.
 *
 * It states only what is confirmed (version, expected headliner, reveal
 * time) and never a phase date or rerun. Once the reveal time passes it flips
 * to "details being verified"; the strip auto-hides after `hideAfter`.
 * `builtAt` seeds the server render so hydration matches.
 */
export default function NextVersionNote({
  next,
  builtAt,
  variant,
}: {
  next: NextVersion;
  builtAt: number;
  variant: "node" | "phase" | "strip";
}) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  const revealed = now >= Date.parse(next.revealAt);
  const hidden = now > Date.parse(next.hideAfter);

  const name = `${next.expectedCharacter} expected`;
  const detail = revealed
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

  if (variant === "phase") {
    return (
      <>
        <p className="pp-phase-kicker">Version {next.version}</p>
        <p className="pp-phase-tba-t">{name}</p>
        <p className="pp-phase-dates">{detail}</p>
      </>
    );
  }

  if (hidden) return null;

  return (
    <p className="rs-broadcast">
      <span className="rs-broadcast-tag">{next.version} preview</span>
      <span className="rs-broadcast-text">
        {revealed
          ? `The ${next.version} broadcast has aired — details are being verified.`
          : `Broadcast ${next.revealLabel}.`}{" "}
        {next.expectedCharacter} is expected:
      </span>
      <span className="rs-broadcast-links">
        <Link href={`/characters/${next.characterSlug}`}>{next.expectedCharacter}&apos;s page</Link>
        <Link href={`/pre-farm/${next.prefarmSlug}`}>Pre-farm guide (partial)</Link>
      </span>
    </p>
  );
}

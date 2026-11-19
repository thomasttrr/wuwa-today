"use client";

import Link from "next/link";
import { ViewTransition, useLayoutEffect, type CSSProperties, type MouseEvent, type ReactNode } from "react";

/* Shared-element morphs into the character hero.

   1. Which part skips its entrance. React fires onShare on the side being
      left, so the source (a banner card, the home hero art) flags the
      arriving character page: the parts that are morphing skip their own
      entrance animations (detail.css, html[data-vt]). One motion, not two.
      ElementTheme clears the flag when the character page unmounts.

   2. Morphs from far down a page. React only pairs the two ends if the
      arriving hero is on screen when the new page is measured, and the
      browser snapshots it where it is at that moment. Next.js scrolls to
      the top only after that, so from a scrolled page the hero was above
      the viewport and the pair was dropped. A tap that starts a morph flags
      the page (html[data-vt-land]); MorphLanding then scrolls to the top
      inside React's commit, before both. The previous history entry has
      already saved its scroll position, so Back still returns there. */

/** "hero": the whole panel morphs in. "fig": only the full-body render does. */
export function markMorphArrival(kind: "hero" | "fig") {
  // Only flag when the character hero is the page now on screen.
  if (document.querySelector(".cx-hero")) document.documentElement.dataset.vt = kind;
}

let landTimer = 0;

function clearLanding() {
  window.clearTimeout(landTimer);
  delete document.documentElement.dataset.vtLand;
}

/** onClick for a link that morphs into a character hero. */
export function startMorph(e: MouseEvent) {
  // Modified clicks open a new tab or window: no navigation here, no morph.
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  document.documentElement.dataset.vtLand = "";
  // Safety net if the navigation never lands.
  window.clearTimeout(landTimer);
  landTimer = window.setTimeout(clearLanding, 4000);
}

/** Mounted in the character hero. Its layout effect runs inside React's
    commit, before the arriving hero is measured and snapshotted. */
export function MorphLanding() {
  useLayoutEffect(() => {
    if (!("vtLand" in document.documentElement.dataset)) return;
    clearLanding();
    // "instant": the page sets scroll-behavior: smooth.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return null;
}

/** A card link that grows into the character hero panel. Only the pair
    animates; otherwise the card leaves with the page. */
export function CardMorph({
  slug,
  href,
  className,
  style,
  children,
}: {
  slug: string;
  href: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <ViewTransition name={`char-${slug}`} share="vt-card" default="none" onShare={() => markMorphArrival("hero")}>
      <Link href={href} className={className} style={style} onClick={startMorph}>
        {children}
      </Link>
    </ViewTransition>
  );
}

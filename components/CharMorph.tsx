"use client";

import { ViewTransition, type ReactNode } from "react";

/* Shared-element morphs into the character hero. React fires onShare on the
   side being left, so the source (a banner card, the home hero art) flags
   the arriving character page: the parts that are morphing skip their own
   entrance animations (detail.css, html[data-vt]). One motion, not two.
   ElementTheme clears the flag when the character page unmounts. */

/** "hero": the whole panel morphs in. "fig": only the full-body render does. */
export function markMorphArrival(kind: "hero" | "fig") {
  // Only flag when the character hero is the page now on screen.
  if (document.querySelector(".cx-hero")) document.documentElement.dataset.vt = kind;
}

/** A card that grows into the character hero panel. Only the pair animates;
    otherwise the card leaves with the page. */
export function CardMorph({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`char-${slug}`} share="vt-card" default="none" onShare={() => markMorphArrival("hero")}>
      {children}
    </ViewTransition>
  );
}

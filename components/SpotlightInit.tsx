"use client";

import { useEffect } from "react";

const CARD_SELECTOR =
  ".og-banner-card, .og-event-card, .og-pick-card, .og-char-tile, .res-card, .og-team-card, .og-role-card, .og-code-row, .og-link-rows li";

/**
 * Desktop spotlight (Resonance Trait 4): an element-coloured highlight
 * follows the cursor along card borders. One delegated pointermove
 * listener sets --mx/--my on the card under the cursor; the border
 * glow itself is pure CSS (::after mask ring). Fine pointers only,
 * and it never runs for touch or reduced-motion users.
 */
export default function SpotlightInit() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest?.(CARD_SELECTOR) as HTMLElement | null;
      if (!card) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        card.style.setProperty("--my", `${e.clientY - rect.top}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}

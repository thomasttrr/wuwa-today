"use client";

import { useEffect } from "react";
import { applySiteElement } from "@/lib/site-element";

export interface ThemeSlot {
  start: string;
  end: string;
  color: string;
}

function colorAt(slots: ThemeSlot[], now: number, fallback: string): string {
  const live = slots.find((s) => Date.parse(s.start) <= now && now < Date.parse(s.end));
  return live?.color ?? fallback;
}

/**
 * SiteTheme — picks the site accent from the banner schedule in the
 * browser, so the theme follows the live banner without a rebuild.
 * It schedules a timer for the next phase boundary (the moment a banner
 * starts or ends), re-checks every minute as a safety net, and again when
 * the tab becomes visible (laptops waking from sleep skip timers).
 */
export default function SiteTheme({ slots, fallback }: { slots: ThemeSlot[]; fallback: string }) {
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = Date.now();
      applySiteElement(colorAt(slots, now, fallback));
      window.clearTimeout(timer);
      const next = slots
        .flatMap((s) => [Date.parse(s.start), Date.parse(s.end)])
        .filter((t) => t > now)
        .sort((a, b) => a - b)[0];
      // setTimeout caps at ~24.8 days; the minute interval covers longer gaps.
      if (next !== undefined && next - now < 2 ** 31 - 1) timer = window.setTimeout(tick, next - now + 250);
    };
    tick();
    const interval = window.setInterval(tick, 60_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [slots, fallback]);
  return null;
}

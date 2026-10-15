"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/banners", label: "Banners" },
  { href: "/events", label: "Events" },
  { href: "/characters", label: "Characters" },
  { href: "/pre-farm", label: "Pre-Farm" },
  { href: "/pull-planner", label: "Pull Planner", shortLabel: "Planner" },
  { href: "/tier-list", label: "Tier List" },
];

/**
 * ObsidianNav — solid full-width bottom tab bar (all viewports).
 * A frosted-glass "magic pill" glides behind the active tab with a
 * springy overshoot ease, measured from the tab's real position/size.
 * No @property, no glow clichés — one bar, one pill, one ease.
 */
export default function ObsidianNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  const activeIndex = NAV.findIndex((item) => isActive(item.href));

  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeIndex < 0) return;
    const measure = () => {
      const tab = list.querySelectorAll(":scope > a")[activeIndex] as
        | HTMLElement
        | undefined;
      if (!tab) return;
      setPill((prev) => {
        const next = { x: tab.offsetLeft, w: tab.offsetWidth };
        return prev && prev.x === next.x && prev.w === next.w ? prev : next;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    <nav className="og-tabbar" aria-label="Primary">
      <div className="og-tabbar-inner">
        <div ref={listRef} className="og-tabbar-tabs">
          {pill && activeIndex >= 0 && (
            <div
              className="og-tabbar-pill"
              aria-hidden="true"
              style={{
                transform: `translateX(${pill.x}px)`,
                width: pill.w,
              }}
            />
          )}
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={i === activeIndex ? "page" : undefined}
            >
              <span className="og-tab-label">{item.label}</span>
              {item.shortLabel && (
                <span className="og-tab-label-short">{item.shortLabel}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

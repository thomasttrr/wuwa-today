"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// The palette only mounts after a keypress/click, so keep it out of every
// page's initial JS and fetch it on first open.
const CommandPalette = dynamic(() => import("./CommandPalette"));

export interface SearchItem {
  kind: "page" | "character" | "action";
  label: string;
  href: string;
  hint: string;
  color?: string;
  image?: string;
}

const NAV = [
  { href: "/", label: "Today" },
  { href: "/banners", label: "Banners" },
  { href: "/events", label: "Events" },
  { href: "/characters", label: "Characters" },
  { href: "/pre-farm", label: "Pre-Farm" },
  { href: "/pull-planner", label: "Planner" },
  { href: "/tier-list", label: "Tier List" },
  { href: "/teams", label: "Teams" },
];

/**
 * ResonanceNav — one glass bar, two homes: a slim top bar on desktop, a
 * floating capsule above the home indicator on mobile (CSS decides).
 * The active-tab highlight glides between tabs on the shared spring.
 * The search button (and ⌘K / Ctrl+K / "/") opens the command palette.
 */
export default function ResonanceNav({ items }: { items: SearchItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const activeIndex = NAV.findIndex((item) => isActive(item.href));

  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || activeIndex < 0) {
      setPill(null);
      return;
    }
    const tab = () => list.querySelectorAll<HTMLElement>(":scope > a")[activeIndex];
    const measure = () => {
      const t = tab();
      if (!t) return;
      setPill((prev) => {
        const next = { x: t.offsetLeft, w: t.offsetWidth };
        return prev && prev.x === next.x && prev.w === next.w ? prev : next;
      });
    };
    measure();
    const t = tab();
    if (t && list.scrollWidth > list.clientWidth) {
      list.scrollTo({
        left: t.offsetLeft - (list.clientWidth - t.offsetWidth) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName));
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="rs-nav" aria-label="Primary">
        <Link href="/" className="rs-brand" aria-label="WuWa Today home">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>WuWa Today</span>
        </Link>
        <div ref={listRef} className="rs-tabs">
          {pill && (
            <span
              className="rs-tab-pill"
              aria-hidden="true"
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w }}
            />
          )}
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} aria-current={i === activeIndex ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
        <button type="button" className="rs-search-btn" onClick={() => setOpen(true)} aria-label="Search characters and pages">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="rs-search-label">Search</span>
          <kbd>⌘K</kbd>
        </button>
      </nav>
      {open && <CommandPalette items={items} onClose={() => setOpen(false)} />}
    </>
  );
}

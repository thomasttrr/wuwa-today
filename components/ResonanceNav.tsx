"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DESKTOP_PRIMARY, MOBILE_PRIMARY, NAV_ITEMS, SEARCH_EVENT, isActiveHref } from "@/lib/nav";

// The palette and the More sheet only mount on demand, so keep them out of
// every page's initial JS and fetch them on first open.
const CommandPalette = dynamic(() => import("./CommandPalette"));
const MoreSheet = dynamic(() => import("./MoreSheet"));

export interface SearchItem {
  kind: "page" | "character" | "action";
  label: string;
  href: string;
  hint: string;
  color?: string;
  image?: string;
}

/** Tabs shown in the bar; each knows on which layouts it is visible. */
const TABS = NAV_ITEMS.filter((i) => MOBILE_PRIMARY.includes(i.href) || DESKTOP_PRIMARY.includes(i.href));

/**
 * ResonanceNav — one glass bar, two homes: a slim top bar on desktop, a
 * floating capsule above the home indicator on mobile (CSS decides).
 * Phones get 4 tabs + More; desktop gets 6 + More. More opens a sheet with
 * every section, grouped. The active pill glides on the shared spring and
 * lands on More when the current page lives there.
 */
export default function ResonanceNav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreCurrent, setMoreCurrent] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const visible = [...list.querySelectorAll<HTMLElement>(":scope > a, :scope > button")].filter((el) => el.offsetWidth > 0);
      const link = visible.find((el) => el.getAttribute("aria-current") === "page");
      const onPage = NAV_ITEMS.some((i) => isActiveHref(pathname, i.href));
      // The current page's tab is hidden on this layout: it lives under More.
      const current = link ?? (onPage ? moreRef.current : null);
      setMoreCurrent(!link && onPage);
      setPill((prev) => {
        if (!current) return null;
        const next = { x: current.offsetLeft, w: current.offsetWidth };
        return prev && prev.x === next.x && prev.w === next.w ? prev : next;
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [pathname]);

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
    const onSearch = () => {
      setMoreOpen(false);
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(SEARCH_EVENT, onSearch);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(SEARCH_EVENT, onSearch);
    };
  }, []);

  const closeMore = useCallback(() => {
    setMoreOpen(false);
    moreRef.current?.focus();
  }, []);

  const activeHref = NAV_ITEMS.find((i) => isActiveHref(pathname, i.href))?.href;

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
          {TABS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${MOBILE_PRIMARY.includes(item.href) ? "" : "rs-tab-d"} ${DESKTOP_PRIMARY.includes(item.href) ? "" : "rs-tab-m"}`.trim() || undefined}
              aria-current={item.href === activeHref ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <button
            ref={moreRef}
            type="button"
            className={`rs-tab-more${moreCurrent ? " is-current" : ""}`}
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
          >
            More
          </button>
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
      {open && <CommandPalette onClose={() => setOpen(false)} />}
      {moreOpen && <MoreSheet pathname={pathname} onClose={closeMore} />}
    </>
  );
}

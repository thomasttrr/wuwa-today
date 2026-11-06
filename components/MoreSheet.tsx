"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { NAV_GROUPS, NAV_ITEMS, SEARCH_EVENT, isActiveHref } from "@/lib/nav";
import ThemeSwitch from "./ThemeSwitch";

/**
 * Every section, grouped. A bottom sheet on phones, a panel under the bar on
 * desktop. Native <dialog>: the browser traps focus, Esc closes, and the
 * page behind is inert.
 */
export default function MoreSheet({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    // Lock page scroll behind the sheet (iOS ignores overflow on <html> alone).
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="rs-more"
      aria-labelledby="rs-more-h"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rs-more-box">
        <div className="rs-more-head">
          <h2 id="rs-more-h">All sections</h2>
          <button type="button" className="rs-more-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <button
          type="button"
          className="rs-more-search"
          onClick={() => window.dispatchEvent(new Event(SEARCH_EVENT))}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Search Resonators and pages
        </button>
        <div className="rs-more-groups">
          {NAV_GROUPS.map((g) => (
            <section key={g} aria-label={g}>
              <h3>{g}</h3>
              <ul>
                {NAV_ITEMS.filter((i) => i.group === g).map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      onClick={onClose}
                      aria-current={isActiveHref(pathname, i.href) ? "page" : undefined}
                    >
                      <span className="rs-more-label">{i.label}</span>
                      <span className="rs-more-hint">{i.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <ThemeSwitch />
      </div>
    </dialog>
  );
}

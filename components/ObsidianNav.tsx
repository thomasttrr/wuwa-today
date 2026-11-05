"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Sidebar chrome, modelled on the layout Tom picked: a fixed
 * 220px left rail on desktop (wordmark, grouped nav, search pill
 * at the foot), collapsing to a slim top bar + drawer on mobile.
 */

const Icon = {
  home: (
    <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />
  ),
  banner: <path d="M5 21V4h11l-2 4 2 4H5" />,
  calendar: (
    <path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />
  ),
  users: (
    <path d="M16 19a4 4 0 0 0-8 0M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
  ),
  sprout: (
    <path d="M12 21v-8M12 13c0-3.5-2.5-5-6-5 0 3.5 2.5 5 6 5ZM12 11c0-3-2-4.5-5-4.5M12 13c0-3.5 2.5-5 6-5 0 3.5-2.5 5-6 5Z" />
  ),
  target: (
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01" />
  ),
  trophy: (
    <path d="M7 4h10v5a5 5 0 0 1-10 0V4ZM7 5H4a3 3 0 0 0 3 4M17 5h3a3 3 0 0 1-3 4M12 14v3M8 21h8M12 17v4" />
  ),
  book: <path d="M5 3h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5zM5 3v18M9 7h6" />,
  search: (
    <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-3.8-3.8" />
  ),
  layers: (
    <path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5" />
  ),
};

function NavIcon({ d }: { d: React.ReactNode }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="snav-ico"
    >
      {d}
    </svg>
  );
}

const SECTIONS: {
  label?: string;
  items: { href: string; label: string; icon: React.ReactNode }[];
}[] = [
  { items: [{ href: "/", label: "Today", icon: Icon.home }] },
  {
    label: "Database",
    items: [
      { href: "/characters", label: "Characters", icon: Icon.users },
      { href: "/banners", label: "Banners", icon: Icon.banner },
      { href: "/events", label: "Events", icon: Icon.calendar },
      { href: "/tier-list", label: "Tier List", icon: Icon.trophy },
      { href: "/echo-sets", label: "Echo Sets", icon: Icon.layers },
    ],
  },
  {
    label: "Guides & Tools",
    items: [
      { href: "/pre-farm", label: "Pre-Farm", icon: Icon.sprout },
      { href: "/pull-planner", label: "Pull Planner", icon: Icon.target },
      { href: "/glossary", label: "Glossary", icon: Icon.book },
    ],
  },
];

function NavBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <>
      <nav className="snav" aria-label="Primary">
        {SECTIONS.map((sec, si) => (
          <div key={si} className="snav-sec">
            {sec.label && <p className="snav-label">{sec.label}</p>}
            <ul>
              {sec.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={isActive(item.href) ? "snav-link on" : "snav-link"}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    <NavIcon d={item.icon} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="snav-foot">
        <button
          type="button"
          className="snav-pill"
          onClick={() => {
            onNavigate?.();
            window.dispatchEvent(new CustomEvent("wuwa:search"));
          }}
        >
          <NavIcon d={Icon.search} />
          <span className="snav-pill-text">Search the site…</span>
          <kbd>⌘K</kbd>
        </button>
        <Link href="/beginner" className="snav-beginner" onClick={onNavigate}>
          New player? Start here →
        </Link>
      </div>
    </>
  );
}

export default function ObsidianNav() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);

  const requestClose = () => {
    if (closeTimer.current !== null) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      setOpen(false);
      setClosing(false);
      menuBtnRef.current?.focus();
    }, 220);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="topbar">
        <Link href="/" className="topbar-word">
          WUWA <span>TODAY</span>
        </Link>
        <div className="topbar-actions">
          <button
            type="button"
            className="topbar-btn"
            aria-label="Search (Command K)"
            onClick={() => window.dispatchEvent(new CustomEvent("wuwa:search"))}
          >
            <NavIcon d={Icon.search} />
          </button>
          <button
            type="button"
            ref={menuBtnRef}
            className="topbar-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => (open ? requestClose() : setOpen(true))}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="sidebar">
        <div className="side-word">
          <Link href="/">
            WUWA <span>TODAY</span>
          </Link>
        </div>
        <NavBody />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className={closing ? "drawer-wrap closing" : "drawer-wrap"}>
          <button
            type="button"
            className="drawer-scrim"
            aria-label="Close menu"
            onClick={requestClose}
          />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
            <div className="drawer-head">
              <Link href="/" className="topbar-word" onClick={requestClose}>
                WUWA <span>TODAY</span>
              </Link>
              <button
                type="button"
                ref={closeBtnRef}
                className="topbar-btn"
                aria-label="Close menu"
                onClick={requestClose}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <NavBody onNavigate={requestClose} />
          </aside>
        </div>
      )}
    </>
  );
}

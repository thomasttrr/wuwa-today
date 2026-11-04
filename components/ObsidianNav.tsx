"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/banners", label: "Banners" },
  { href: "/events", label: "Events" },
  { href: "/characters", label: "Characters" },
  { href: "/pre-farm", label: "Pre-Farm" },
  { href: "/pull-planner", label: "Pull Planner" },
  { href: "/tier-list", label: "Tier List" },
];

/**
 * Masthead — a plain top bar: wordmark left, section links, search.
 * The current section is marked with vermilion text and a short bar
 * under it. No floating pill, no glass. On narrow screens the links
 * become their own scrollable row under the wordmark row.
 */
export default function ObsidianNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="masthead">
      <div className="masthead-in">
        <Link href="/" className="wordmark" aria-label="WuWa Today — home">
          WUWA<span>TODAY</span>
        </Link>
        <nav className="mainnav" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={isActive(item.href) ? "on" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="searchbtn"
          aria-label="Search (Command K)"
          onClick={() => window.dispatchEvent(new CustomEvent("wuwa:search"))}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <span className="searchbtn-label">Search</span>
          <kbd>⌘K</kbd>
        </button>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/banners", label: "Banners" },
  { href: "/events", label: "Events" },
  { href: "/characters", label: "Characters" },
  { href: "/pull-planner", label: "Pull Planner" },
  { href: "/tier-list", label: "Tier List" },
];

/**
 * ObsidianNav — floating DETACHED glass capsule.
 * Desktop: fixed top-center. Mobile: fixed bottom thumb-reach bar.
 * Glass chrome ONLY here (never on content surfaces); every glass
 * element carries the specular top-edge glint via .og-nav::before.
 */
export default function ObsidianNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="og-nav" aria-label="Primary">
      <Link className="og-nav-brand" href="/" aria-label="WuWa Today home">
        WuWa&nbsp;Today
      </Link>
      <div className="og-nav-links">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

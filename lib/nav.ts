/**
 * Single source of truth for site sections. The nav, the More sheet, the
 * footer and the search palette all read from here so they never drift.
 */
export type NavGroup = "Live" | "Characters & builds" | "Plan" | "Learn";

export interface NavItem {
  href: string;
  label: string;
  /** Shorter label for tight spots (mobile tab bar). */
  short?: string;
  group: NavGroup;
  /** One-line description, shown in search and the More sheet. */
  hint: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Today", group: "Live", hint: "Banners, codes, resets" },
  { href: "/banners", label: "Banners", group: "Live", hint: "Live, upcoming, history" },
  { href: "/events", label: "Events", group: "Live", hint: "What's live and ending soon" },
  { href: "/characters", label: "Characters", group: "Characters & builds", hint: "Builds for every Resonator" },
  { href: "/teams", label: "Teams", group: "Characters & builds", hint: "Best teams, Tower, Whimpering Wastes" },
  { href: "/tier-list", label: "Tier List", group: "Characters & builds", hint: "Current rankings" },
  { href: "/echo-sets", label: "Echo Sets", group: "Characters & builds", hint: "Sonata effects and where to farm" },
  { href: "/outfits", label: "Outfits & Cosmetics", group: "Characters & builds", hint: "Every outfit, accessory and skin" },
  { href: "/pull-planner", label: "Pull Planner", short: "Planner", group: "Plan", hint: "Who to pull, by account type" },
  { href: "/pre-farm", label: "Pre-Farm", group: "Plan", hint: "Materials ahead of release" },
  { href: "/beginner", label: "Beginner Guides", short: "Beginner", group: "Learn", hint: "New to Solaris-3" },
  { href: "/glossary", label: "Glossary", group: "Learn", hint: "Game terms in plain words" },
];

export const NAV_GROUPS: NavGroup[] = ["Live", "Characters & builds", "Plan", "Learn"];

/** Always-visible tabs on phones (the rest live under More). */
export const MOBILE_PRIMARY = ["/", "/banners", "/characters", "/teams"];
/** Always-visible tabs on desktop. */
export const DESKTOP_PRIMARY = ["/", "/banners", "/events", "/characters", "/teams", "/tier-list"];

/** Window event that opens the command palette. */
export const SEARCH_EVENT = "wuwa-today:search";

export function isActiveHref(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

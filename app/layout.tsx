import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Martian_Mono, Mona_Sans } from "next/font/google";
import ResonanceNav, { type SearchItem } from "@/components/ResonanceNav";
import ScrollTop from "@/components/ScrollTop";
import NowProvider from "@/components/NowProvider";
import Spotlight from "@/components/Spotlight";
import { activeBanners } from "@/lib/data";
import { characters, toCharacterHubTile } from "@/lib/characters";
import { elementColor } from "@/lib/elements";
import "./globals.css";
import "./obsidian.css";
import "./og-pages.css";
import "./resonance.css";

/* Resonance type system. Both families are variable with a width axis, so
   headlines and numeric readouts can stretch together. Body stays system
   sans for speed; Martian Mono carries every number on the site. */
const monaSans = Mona_Sans({
  weight: "variable",
  axes: ["wdth"],
  subsets: ["latin"],
  variable: "--font-mona",
  display: "swap",
});
const martianMono = Martian_Mono({
  weight: "variable",
  axes: ["wdth"],
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
});

/* The site is tuned to the featured banner's lead Resonator: its element
   becomes the site-wide --el accent. Character pages re-tune it. */
const featuredElement = activeBanners[0]?.characters[0]?.element ?? "";
const siteEl = elementColor(featuredElement);

const SEARCH_ITEMS: SearchItem[] = [
  { kind: "page", label: "Today", href: "/", hint: "Banners, codes, resets" },
  { kind: "page", label: "Banners", href: "/banners", hint: "Live, upcoming, history" },
  { kind: "page", label: "Events", href: "/events", hint: "Event calendar" },
  { kind: "page", label: "Characters", href: "/characters", hint: "Every Resonator" },
  { kind: "page", label: "Pre-Farm", href: "/pre-farm", hint: "Materials ahead of release" },
  { kind: "page", label: "Pull Planner", href: "/pull-planner", hint: "Astrite and pity" },
  { kind: "page", label: "Tier List", href: "/tier-list", hint: "Current rankings" },
  { kind: "page", label: "Echo Sets", href: "/echo-sets", hint: "Sonata effects" },
  { kind: "page", label: "Beginner guides", href: "/beginner", hint: "New to Solaris-3" },
  { kind: "page", label: "Glossary", href: "/glossary", hint: "Game terms" },
  ...characters.map((c) => {
    const t = toCharacterHubTile(c);
    return {
      kind: "character" as const,
      label: t.name,
      href: `/characters/${t.slug}`,
      hint: `${t.element} · ${t.weapon_type}`,
      color: elementColor(t.element),
      image: t.portrait_url,
    };
  }),
];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* viewport-fit=cover engages the iPhone notch/home-indicator safe-area
     insets so env(safe-area-inset-bottom) on the floating nav is real. */
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://wuwa-today.vercel.app"),
  title: {
    default: "WuWa Today — Wuthering Waves Banners, Codes & Events",
    template: "%s | WuWa Today",
  },
  description:
    "Your daily Wuthering Waves dashboard: current banners with countdowns, working redeem codes, active events, reset timers, and pull guides — updated every day.",
  keywords: ["Wuthering Waves", "WuWa", "banners", "redeem codes", "events", "pull guide", "countdown"],
  openGraph: {
    type: "website",
    siteName: "WuWa Today",
    title: "WuWa Today — Wuthering Waves Banners, Codes & Events",
    description:
      "Current banners with countdowns, working redeem codes, active events, and reset timers — updated daily.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${monaSans.variable} ${martianMono.variable}`}>
      <body
        className="og rs"
        data-site-el={siteEl}
        style={{ "--el": siteEl } as CSSProperties}
      >
        {/* One shared 1s ticker for every countdown/progress bar on the page. */}
        <NowProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ResonanceNav items={SEARCH_ITEMS} />
        <main id="main">
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <nav className="site-footer-nav" aria-label="Site">
              <Link href="/">Today</Link>
              <Link href="/banners">Banners</Link>
              <Link href="/events">Events</Link>
              <Link href="/characters">Characters</Link>
              <Link href="/pre-farm">Pre-Farm</Link>
              <Link href="/pull-planner">Pull Planner</Link>
              <Link href="/tier-list">Tier List</Link>
              <Link href="/glossary">Glossary</Link>
            </nav>
            <p>
              <strong>WuWa Today</strong> is an unofficial fan project. Wuthering
              Waves is a trademark of Kuro Games. This site is not affiliated
              with or endorsed by Kuro Games.
            </p>
            <p>
              Banner dates marked &quot;estimated&quot; come from community trackers —
              always confirm in-game. All banner and event dates are shown in
              server time (UTC+8). Codes are verified against multiple
              sources before publishing.
            </p>
          </div>
        </footer>
        <ScrollTop />
        <Spotlight />
        </NowProvider>
      </body>
    </html>
  );
}

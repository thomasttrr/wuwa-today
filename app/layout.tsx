import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Martian_Mono, Mona_Sans } from "next/font/google";
import ResonanceNav from "@/components/ResonanceNav";
import ScrollTop from "@/components/ScrollTop";
import Spotlight from "@/components/Spotlight";
import SiteTheme, { type ThemeSlot } from "@/components/SiteTheme";
import ThemeSwitch from "@/components/ThemeSwitch";
import { themeBootScript } from "@/lib/theme-mode";
import { activeBanners, banners } from "@/lib/data";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import { ELEMENT_FALLBACK, elementColor } from "@/lib/elements";
import "./globals.css";
import "./obsidian.css";
import "./og-pages.css";
import "./resonance.css";
import "./resonance-shared.css";
import "./guide-kit.css";
import "./theme-dark.css";

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

/* The site is tuned to the live banner's lead Resonator: its element is
   the site-wide --el accent. The server render uses the banner live at
   build time; <SiteTheme> then re-picks it in the browser from the full
   schedule and switches at each phase boundary, so no rebuild is needed.
   Character pages override it while open. */
const featuredElement = activeBanners[0]?.characters[0]?.element ?? "";
const siteEl = featuredElement ? elementColor(featuredElement) : ELEMENT_FALLBACK;
const THEME_SLOTS: ThemeSlot[] = banners
  .filter((b) => b.characters[0])
  .map((b) => ({ start: b.startsAt, end: b.endsAt, color: elementColor(b.characters[0].element) }));


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* viewport-fit=cover engages the iPhone notch/home-indicator safe-area
     insets so env(safe-area-inset-bottom) on the floating nav is real. */
  viewportFit: "cover",
  /* Tint mobile browser chrome / overscroll to the dark canvas. */
  themeColor: "#06070a",
  colorScheme: "dark",
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
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${monaSans.variable} ${martianMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved Dark appearance before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body
        className="og rs"
        data-site-el={siteEl}
        style={{ "--el": siteEl } as CSSProperties}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteTheme slots={THEME_SLOTS} fallback={ELEMENT_FALLBACK} />
        <ResonanceNav />
        <main id="main">
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <nav className="site-footer-nav" aria-label="Site">
              {NAV_GROUPS.map((g) => (
                <div key={g} className="site-footer-group">
                  <h2>{g}</h2>
                  <ul>
                    {NAV_ITEMS.filter((i) => i.group === g).map((i) => (
                      <li key={i.href}>
                        <Link href={i.href} prefetch={false}>
                          {i.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
            <ThemeSwitch />
            <p>
              <strong>WuWa Today</strong> is an unofficial fan project. Wuthering
              Waves is a trademark of Kuro Games. This site is not affiliated
              with or endorsed by Kuro Games.
            </p>
            <p>
              Banner dates marked &quot;estimated&quot; come from community trackers —
              always confirm in-game. Banner and event dates are shown in
              server time (UTC+8); times marked &quot;your time&quot; are converted
              to your device&apos;s time zone. Codes are verified against
              multiple sources before publishing.
            </p>
          </div>
        </footer>
        <ScrollTop />
        <Spotlight />
      </body>
    </html>
  );
}

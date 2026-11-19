import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Cormorant, Geist_Mono, Jost } from "next/font/google";
import ResonanceNav from "@/components/ResonanceNav";
import ScrollTop from "@/components/ScrollTop";
import SiteTheme from "@/components/SiteTheme";
import ThemeSwitch from "@/components/ThemeSwitch";
import { themeBootScript } from "@/lib/theme-mode";
import { countdownBootScript } from "@/lib/countdown-boot";
import { NAV_GROUPS, NAV_ITEMS } from "@/lib/nav";
import "./globals.css";
import "./content.css";
import "./resonance.css";
import "./resonance-shared.css";
import "./guide-kit.css";
import "./theme-dark.css";
import "./aftermath.css";

/* Aftermath type system (app/aftermath.css): Cormorant for display, Jost
   for reading and every number, Geist Mono for record-style details. */
const cormorant = Cormorant({
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});
const geistMono = Geist_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

/* Champagne gold is the house accent (--el). Character pages still re-tune
   it to their element while open (<ElementTheme>), and the Dark appearance
   still locks it to platinum. */
const SITE_ACCENT = "#d9c49b";


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* viewport-fit=cover engages the iPhone notch/home-indicator safe-area
     insets so env(safe-area-inset-bottom) on the floating nav is real. */
  viewportFit: "cover",
  /* Tint mobile browser chrome / overscroll to the dark canvas. */
  themeColor: "#15171d",
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
  openGraph: { type: "website", siteName: "WuWa Today", locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the saved Dark appearance before first paint (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: countdownBootScript }} />
      </head>
      <body
        className="og rs"
        data-site-el={SITE_ACCENT}
        style={{ "--el": SITE_ACCENT } as CSSProperties}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteTheme slots={[]} fallback={SITE_ACCENT} />
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
      </body>
    </html>
  );
}

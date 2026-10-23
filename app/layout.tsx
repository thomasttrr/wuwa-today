import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import ObsidianNav from "@/components/ObsidianNav";
import ScrollTop from "@/components/ScrollTop";
import NowProvider from "@/components/NowProvider";
import "./globals.css";
import "./obsidian.css";
import "./og-pages.css";

/* Obsidian Glass display type: Space Grotesk, semibold/bold, uppercase,
   tight tracking. Body stays system sans; data stays tabular mono. */
const spaceGrotesk = Space_Grotesk({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

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
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="og">
        {/* One shared 1s ticker for every countdown/progress bar on the page. */}
        <NowProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ObsidianNav />
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
        </NowProvider>
      </body>
    </html>
  );
}

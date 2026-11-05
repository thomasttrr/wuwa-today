import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter, Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import ObsidianNav from "@/components/ObsidianNav";
import ScrollTop from "@/components/ScrollTop";
import SpotlightInit from "@/components/SpotlightInit";
import NowProvider from "@/components/NowProvider";
import SearchPalette from "@/components/SearchPalette";
import "./style.css";

/* Type system follows the reference Tom picked: Inter for text,
   Bebas Neue for display, IBM Plex Mono for data. */
const inter = Inter({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const bebas = Bebas_Neue({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-plex",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07090d",
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
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} ${plexMono.variable}`}>
      <body>
        {/* Arm the reveal hidden state before first paint (Reveal's
            useEffect add stays as a no-op fallback). No-JS never gets
            the class, so content stays visible — progressive rule. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js-anim')",
          }}
        />
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
            <p className="foot-word">WUWA<span>TODAY</span></p>
            <nav className="site-footer-nav" aria-label="Site">
              <Link href="/">Today</Link>
              <Link href="/banners">Banners</Link>
              <Link href="/events">Events</Link>
              <Link href="/characters">Characters</Link>
              <Link href="/pre-farm">Pre-Farm</Link>
              <Link href="/pull-planner">Pull Planner</Link>
              <Link href="/tier-list">Tier List</Link>
              <Link href="/echo-sets">Echo Sets</Link>
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
        <div className="scroll-progress" aria-hidden="true" />
        <ScrollTop />
        <SpotlightInit />
        <SearchPalette />
        </NowProvider>
      </body>
    </html>
  );
}

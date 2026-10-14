import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

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

const NAV = [
  { href: "/", label: "Today" },
  { href: "/banners", label: "Banners" },
  { href: "/codes", label: "Codes" },
  { href: "/events", label: "Events" },
  { href: "/guides", label: "Guides" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container">
            <a className="brand" href="/" aria-label="WuWa Today home">
              WuWa <span>Today</span>
            </a>
            <nav className="site-nav" aria-label="Primary">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>
        <main id="main">
          <div className="container">{children}</div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <p>
              <strong>WuWa Today</strong> is an unofficial fan project. Wuthering
              Waves is a trademark of Kuro Games. This site is not affiliated
              with or endorsed by Kuro Games.
            </p>
            <p>
              Banner dates marked "estimated" come from community trackers —
              always confirm in-game. Codes are verified against multiple
              sources before publishing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

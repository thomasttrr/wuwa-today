import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
  { href: "/tier-list", label: "Tier List" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container">
            <Link className="brand" href="/" aria-label="WuWa Today home">
              WuWa <span>Today</span>
            </Link>
            <nav className="site-nav" aria-label="Primary">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
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
              Banner dates marked &quot;estimated&quot; come from community trackers —
              always confirm in-game. All banner and event dates are shown in
              server time (UTC+8). Codes are verified against multiple
              sources before publishing.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}

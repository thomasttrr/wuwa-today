# WuWa Today

An unofficial, fan-made daily dashboard for **Wuthering Waves**: live banners with countdowns, working redeem codes, active events, reset timers, and evergreen pull guides. Content is data-driven — updating the site means editing JSON files, never code.

**Status:** MVP. No backend, no paywall, no invented data. The newsletter signup is a clearly-labeled stub until a provider is connected.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build   # static export lands in ./out
npm run start   # serves the production build
```

## Deploy to Vercel (what Tom needs to do)

The site is a static export (`output: "export"` in `next.config.js`), so deployment is trivial — but it needs Tom's own accounts. Kit cannot do these steps for him:

1. **Create a Vercel account** at https://vercel.com (free Hobby tier is enough).
2. **Push this `site/` folder to a GitHub repo** (e.g. `wuwa-today`). Kit can prepare the repo; Tom clicks through the GitHub/Vercel OAuth.
3. In Vercel: **Add New → Project → Import** the GitHub repo.
   - Framework preset: Next.js (auto-detected)
   - Build command: `npm run build` (default)
   - Output directory: `out` — set this manually, because static export writes to `out/`, not `.next/`
4. **Deploy.** Vercel gives a `*.vercel.app` URL immediately.
5. **Custom domain (recommended for SEO/branding):** buy a domain (Namecheap/Cloudflare, ~$12/yr) → Vercel project → Settings → Domains → add it → follow the DNS instructions.

Before promoting the site publicly:
- Replace `https://wuwa-today.example.com` with the real domain in `app/layout.tsx` (`metadataBase`) and `app/sitemap.ts` (`BASE`).
- Connect a real newsletter provider (Buttondown, ConvertKit, Beehiiv) — see the `PLACEHOLDER` in `components/NewsletterSignup.tsx`.
- Submit the sitemap (`/sitemap.xml`) in Google Search Console.

## Project structure

```
site/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # / — home dashboard
│   ├── banners/page.tsx    # /banners
│   ├── codes/page.tsx      # /codes
│   ├── events/page.tsx     # /events
│   ├── guides/             # /guides + /guides/[slug]
│   ├── layout.tsx          # header, nav, footer, SEO metadata
│   ├── sitemap.ts          # /sitemap.xml
│   └── globals.css         # dark game-wiki theme (no CSS framework)
├── components/             # Countdown, CopyButton, BannerCard, CodeRow,
│                           # EventCard, ResetTimers, NewsletterSignup
├── lib/                    # data.ts (types + JSON loading + reset math),
│                           # guides.ts (guide rendering helpers)
├── data/                   # ★ ALL GAME DATA LIVES HERE ★
│   ├── banners.json
│   ├── codes.json
│   ├── events.json
│   ├── guides.json
│   ├── README.md           # schema + update workflow
│   └── SOURCES.md          # verification sources
├── public/robots.txt
├── README.md               # this file
└── UPDATE_PLAYBOOK.md      # refresh procedures (for scheduled jobs)
```

## Data & trust rules

- **Two-source rule for codes:** a code is published as working only if verified by ≥2 independent sources or one official Kuro Games post. Single-source codes go in `codes.json → excluded` with the reason.
- **Estimates are labeled:** banner phase boundaries from community trackers are marked "estimated" in the UI. Never present a leak as fact.
- **No invented data.** If a field is unknown, omit it or mark it uncertain.
- Full refresh procedures: see `UPDATE_PLAYBOOK.md`.

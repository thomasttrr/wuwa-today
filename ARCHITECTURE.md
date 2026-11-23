# ARCHITECTURE — wuwa-today

Onboarding spec for AI coding sessions. Dense by design. Known defects are listed in `AUDIT_REPORT.md` (IDs like H1/M4 below refer to it).

## 0. Read first
- **Next.js 16.4.6 / React 19.3.1 / TypeScript 5.9.3 (strict).** APIs differ from older training data. Per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing Next code. `next dev` rewrites the `AGENTS.md` block and `next-env.d.ts`; that diff is expected.
- **Static export** (`next.config.js: output: "export"`, `images.unoptimized`). No server runtime, no DB, no API routes at request time. Hosted on Vercel as static files from `out/`.
- **Content is data:** game facts live in `data/*.json`, imported at build time. Editorial pages (leaks, version-4-0, phase-2, glossary, graphics-settings, echo-sets, solaris-endings, calamity-effigy) keep their copy inline in TSX.
- Product rules live in `README.md` (trust rules), `UPDATE_PLAYBOOK.md` (ops runbook), `DESIGN.md` (visual system), `data/README.md` (schemas, partly stale), `data/SOURCES.md` (provenance).

## 1. Directory map
| Path | Responsibility |
|---|---|
| `app/` | App Router routes; one `page.tsx` per route plus route-local CSS. `layout.tsx` = fonts, global CSS, nav, footer, two inline boot scripts. |
| `app/characters/[slug]/` | The only dynamic route: `generateStaticParams` from `characterSlugs()`, `dynamicParams = false` (61 pages). |
| `app/search-index.json/route.ts` | `force-static` GET, emitted as a file; the command palette fetches it lazily. |
| `app/sitemap.ts`, `robots.ts`, `manifest.ts` | Static metadata routes. The sitemap's route list is hand-maintained. |
| `app/*.css` | Global layers, imported by the layout in this order: `content` → `resonance` → `resonance-shared` → `guide-kit` → `theme-dark` → `aftermath` (last wins; Aftermath is the current look). |
| `components/` | Shared UI. `"use client"` islands: countdowns, explorers, nav/palette, theme. Server components otherwise. |
| `components/home/` | Home-only sections (`Am*` = Aftermath home): hero, sky/embers canvas, glance strip, events, timeline, archive. |
| `lib/` | Data loading, view models, pure helpers. Details in §3. |
| `data/` | All game data as JSON (§2). `data/characters/<slug>.json` = one file per Resonator. |
| `public/images/` | Art (~1000 files): `chars/` portraits, `renders/` full-body art plus `-w240/-w480` thumbs, `weapons/`, `echoes/`, `events/` plus `events/thumbs/`, `outfits/`, `leaks/`, `items/`. |
| `scripts/` | `check-data.mjs` (build gate) and three `sharp` thumbnail generators. |
| `.github/workflows/rebuild-at-phase-boundaries.yml` | Hourly and daily Vercel deploy-hook trigger (§4). |
| `vercel.json` | Production redirects (mirror of `next.config.js`) and 30-day cache headers for `/images`, `/icons`. |
| Untracked: `docs/`, `reports/`, `research_notes/`, `.claude/`, `.superpowers/`, `out/`, `.next/` | Working notes and build output. Not part of the app. |

## 2. Data files → loaders → surfaces
| File | Loader | Consumed by |
|---|---|---|
| `banners.json` (`_meta`, `nextVersion`, `banners[]`, `selectors[]`, `history[]`) | `lib/data.ts` | home, `/banners`, `/version`, `/pull-planner`, `[slug]` banner labels, the workflow |
| `events.json` | `lib/data.ts` (`events`, `eventById`) | home, `/events` (`EventsBoard`), `/endstate-matrix`, `/lahai-roi-blocks`, the workflow |
| `codes.json` (`active[]` only) | `lib/data.ts` `activeCodes` | home (`AmGlance`, `HomeCodes`) |
| `codes-excluded.json` (`excluded[]`, `expired[]`) | none (check-data only) | blocklist: an active code listed here fails the build |
| `outfits.json`, `version-notes.json`, `launch.json` | `lib/data.ts` / direct import | `/outfits`; `/version` (notes, `LaunchCountdown`, `LaunchChecklist`) |
| `characters/*.json` (61) | `lib/characters.ts` (explicit import **and** `ALL[]` entry each) | hub, `[slug]`, search index, teams, tiers, planner, sitemap |
| `renders.json` | `lib/renders.ts` (server-only) and `[slug]/page.tsx` | thumbs and full-body art everywhere |
| `teams.json` | `lib/teams.ts` → `lib/teams-wire.ts` pack | `/teams` (`TeamsExplorer` unpacks) |
| `tier-list-prydwen.json` + `tier-list.json` | `lib/tiers.ts` | `/tier-list`, `/banners`, `[slug]` |
| `prefarm.json` (`guides: []` today) | `lib/prefarm.ts` | home, `[slug]`, planner, version, sitemap (see H4: target route missing) |
| `guides.json`, `characters-roster.json` | dead at runtime | none (only types from `lib/guides.ts`) |

## 3. `lib/` modules
- `data.ts`: JSON → typed exports. **`BUILD_NOW`** (`WUWA_BUILD_NOW` env or `Date.now()`), `statusFromDates()`, `activeBanners`, `upcomingBanners`, `activeEvents`, `nextVersionPending`, `nextVersionLaunched()`, `versionNow()`, empty-state copy. Re-exports `dates.ts`.
- `dates.ts`: pure, **no JSON imports**, safe for client bundles. Server-time formatters (`Asia/Shanghai`), viewer-local formatters (client-only), `formatSpan`, `nextDailyReset` / `nextWeeklyReset`, `SERVER_OPTIONS` (America −5, Europe +1, Asia +8).
- `countdown-boot.ts`: minified inline `window.__cd` that fills countdown placeholders before first paint. Mirrors the `dates.ts` reset math.
- `characters.ts` + `character-schema.ts`: the record types, `getCharacter`, loose `getCharacterByName` (strips non-alphanumerics), `CharacterHubTile` DTO (slim client payload), `isPreRelease`.
- `teams.ts` / `teams-wire.ts`: builds `TeamsModel` and **throws at build** on unknown member names, a member count ≠ 3, or a bad badge tone. Members are positional `[Main DPS, Sub-DPS, Support]`. The wire format dedupes characters into a `cast` map.
- `tiers.ts`: joins Prydwen and editorial tiers; `tierFor(slug)` is the site-wide source of truth for tiers (`tier_badge` in character files is stale).
- `renders.ts`: `thumbFor` / `fullRender` srcset builders. `images.ts`: splash srcset convention.
- `nav.ts`: **single source** for nav, More sheet, footer and palette (`NAV_ITEMS`, `MOBILE_PRIMARY`, `DESKTOP_PRIMARY`, `SEARCH_EVENT`).
- `theme-mode.ts` (+ boot script), `site-element.ts` (`--el` accent ownership), `elements.ts` (element colours), `v4-cast.ts` / `archive.ts` (hard-coded 4.0 home content), `prefarm.ts`, `echo-guide.ts`, `guides.ts` (types only in practice), `search-index.ts`.

## 4. End-to-end data flow
```
data/*.json ──(static import at build)──► lib/*.ts view models
      │                                         │
      │   prebuild: scripts/check-data.mjs      ▼
      │   (shape/refs gate, exit 1 = no build)  app/**/page.tsx (server components, run ONCE at build)
      │                                         │  decisions baked with BUILD_NOW:
      │                                         │  hero banner, live/ended lists, sections shown, accent
      ▼                                         ▼
GitHub Action (hourly :07 UTC + daily 09:00) ──► Vercel deploy hook ──► next build ──► out/ (HTML+RSC+JS) ──► CDN
  fires when a banner/event start|end or
  nextVersion.launchAt fell in [now−70m, now+5m]
                                                ▼
Browser: HTML paints → inline <head> scripts run while parsing:
   themeBootScript  (localStorage "wuwa-today:theme" → html[data-theme])
   window.__cd defs → each placeholder's <CdBoot/> calls __cd(parent): writes data-cd-v / reel transforms
→ hydration (useNow() returns null, so it matches the server HTML)
→ shared 1 s clock starts (components/useNow.ts; pauses when the tab is hidden)
→ islands re-derive time state on the client: countdowns, HomeCodes expiry filter,
  EventsBoard live/soon/ended, AmHero "Out now", TeamsExplorer rotation notes
→ user state: localStorage roster / server region / theme; URL hash deep links
```
- **Two clocks:** the build clock decides structure (which sections and banner exist in the HTML); the view clock decides labels inside islands. Anything structural goes stale until the next rebuild. That is why the workflow exists.
- **Accent pipeline:** `body[style --el]` is set server-side to gold `#d9c49b`. `SiteTheme` re-applies the site default (its schedule is unused: `slots=[]`). `ElementTheme` on character pages does `pushElement` / `popElement` via `body[data-el-override]`. Gold-only mode is `html[data-theme="dark"]`.
- **Navigation morphs:** React `<ViewTransition>` shares `char-<slug>` / `fig-<slug>` between cards or the home hero and the character hero. `CharMorph.startMorph` sets `html[data-vt-land]`, and `MorphLanding` scrolls to the top inside the commit.

## 5. State ownership & side-effect boundaries
| State | Owner | Mutation boundary |
|---|---|---|
| Game facts | `data/*.json` (git) | Hand or agent edits → commit → rebuild. Never mutated at runtime. |
| "Is X live?" (structural) | `BUILD_NOW` in `lib/data.ts` | Rebuild only. |
| "Is X live?" (labels) | `useNow()` shared store | 1 s interval, bucketed per consumer; `null` on server and during hydration. |
| Theme | `localStorage["wuwa-today:theme"]` + `html[data-theme]` | `setThemeMode()` dispatches the `wuwa-today:theme` event. |
| Owned roster | `localStorage["wuwa-today:roster"]`, shared by `TeamsExplorer` and `TierExplorer` | Whole-set overwrite, no cross-tab sync (M3). |
| Server region | `localStorage["wuwa-today:server-id"]` (`AmGlance`) | Validated against `SERVER_OPTIONS`. |
| Palette open | `ResonanceNav` state; opened by ⌘/Ctrl-K, `/`, or the `wuwa-today:search` window event | — |
| Deep links | URL hash (`/teams`, `/outfits`, `/events`) | `history.replaceState` in Wardrobe; decoding is not guarded (H3). |
| External I/O | Build: fs reads only (`app/page.tsx` `fs.existsSync` for weapon splashes). Client: one `fetch("/search-index.json")`, memoised, retried on failure. CI: one `curl POST` to the deploy hook. | No timeouts are needed in-app; nothing else talks to the network. |

## 6. Invariants — never violate
1. **Never show an unverified or expired redeem code.** `active` needs ≥2 independent sources or one official Kuro post; dead codes go to `codes-excluded.json`. Every surface that shows a code must re-check `expiresAt` against the view clock (`AmGlance` currently does not: H1).
2. **Status comes from dates, never from the stored `status` field** (`statusFromDates`). Stored `status` is legacy.
3. **Every timestamp in data carries a UTC offset** (`+08:00` server time, or `Z`). An offset-less value shifts by the build machine's timezone and crashes the workflow's Python (H2). Date-only strings are allowed only for `published_at` / `addedAt` style fields.
4. **Hydration safety:** client components never read `Date.now()`, `localStorage`, `location` or `window` during render. Use `useNow()` (null first) and effects. Countdown placeholders carry `data-cd*` attributes plus `<CdBoot/>` and `suppressHydrationWarning` only where `__cd` writes.
5. **Game dates render in server time** (`formatServerDate*`, `Asia/Shanghai`). Viewer-local time appears only after hydration and is labelled "your time".
6. **Client bundles import from `lib/dates.ts`, never `lib/data.ts`** (keeps the JSON out of the browser). Heavy view models cross the boundary as DTOs (`CharacterHubTile`, packed teams, resolved `Thumb`s); `renders.json` stays server-only.
7. **Character registry:** `data/characters/<slug>.json` has `slug === filename`, an import in `lib/characters.ts` **and** an entry in `ALL[]`, plus a portrait file. Weapon icons must exist.
8. **Redirects:** `next.config.js` is canonical; `vercel.json` must match exactly (enforced by check-data). Static export ignores `next.config` redirects in production.
9. **`eventById("…")` ids must exist** (check-data scans `app/`). `teams.json` trios are exactly 3, in role order, using names from its own `characters` index (build throws).
10. **Honesty labels:** estimates carry `timeNote` plus `uncertainFields` (rendered as "estimated"); leaks are never presented as fact; nothing is invented (unknown fields are omitted).
11. **Navigation entries live only in `lib/nav.ts`.**
12. **`countdown-boot.ts` math must equal `lib/dates.ts` reset math and the React countdown output**, or first paint and the first tick disagree.

## 7. Commands
```powershell
npm run dev            # next dev on :3000 (.claude/launch.json "dev")
npm run check          # scripts/check-data.mjs only
npm run build          # prebuild check-data, then next build → out/
npm run lint           # eslint (next core-web-vitals + typescript); baseline 0 errors / 6 img warnings
npx tsc --noEmit       # typecheck; baseline clean
npm run thumbs         # render thumbs (rewrites data/renders.json "thumbs"); also thumbs:events, thumbs:outfits
$env:WUWA_BUILD_NOW="2026-12-22T12:00:00+08:00"; npm run build   # preview another day (always use an offset)
```
- **No test suite exists.** Proposed matrix: `AUDIT_REPORT.md` → Phase 3 test matrix.
- The deploy hook needs the GitHub secret `VERCEL_DEPLOY_HOOK_URL`; without it the workflow logs a notice and exits 0.

## 8. Common change recipes
- **New character:** add `data/characters/<slug>.json` → `import c_x from "@/data/characters/<slug>.json"` **and** add it to `ALL[]` in `lib/characters.ts` → portrait `public/images/chars/<slug>.webp` → optional render in `renders.json` plus `npm run thumbs` → `npm run check`.
- **New event:** append to `events.json` (offset timestamps, unique `id`) → art in `public/images/events/` → `npm run thumbs:events` (not validated: M11) → `npm run check`.
- **Banner flip / new version:** follow `UPDATE_PLAYBOOK.md` §2–3 and "Between versions". Also update the code-pinned pieces: `lib/v4-cast.ts` and the home takeover (M10), and `app/pull-planner/page.tsx` `PLAN_VERSION` / `FIVE_STARS` / plans / `Availability` window.
- **New route:** add `app/<route>/page.tsx`; add it to `lib/nav.ts` if navigable and to `app/sitemap.ts` (manual list).
- **New redirect:** add it to both `next.config.js` and `vercel.json`.

## 9. Fragile areas (touch with care)
| Area | Why |
|---|---|
| Build clock vs view clock (`lib/data.ts`, every home section) | Structural state is frozen until the next rebuild; correctness depends on the workflow firing (H1, H2, M9). |
| `.github/workflows/rebuild-at-phase-boundaries.yml` | Inline Python; one bad date kills every hourly run (H2); does not watch code expiries (H1). |
| `lib/countdown-boot.ts` | Minified duplicate of the date math; aborts the whole root if reel column count ≠ digit count (e.g. ≥100 days); silent `catch`. |
| URL-hash handlers (`Wardrobe.tsx:91`, `TeamsExplorer.tsx:67`) | Unguarded `decodeURIComponent`, and no `app/error.tsx` (H3, verified). |
| Pre-farm links (6 emitters) | Target route deleted (H4). |
| Tier ranking (3 copies of the `reduce`) | Unknown tier → `-1` → wins → crash (M4). |
| Name resolution | Five slug strategies; banner names like `"Yangyang: Xuanling"` need the loose lookup (M8). |
| Hard-coded version content | `lib/v4-cast.ts`, `AmHero` title split, pull planner `"3.8"`, `sitemap.ts` route list. |
| `scripts/make-thumbs.mjs` | Non-atomic manifest write; trusts partial files; percent-encoded `ROOT` (M6, M7). |
| Roster `localStorage` | Lost updates across tabs; no shape validation (M3). |

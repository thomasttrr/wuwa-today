# WuWa Today — Website Improvement Plan

**Audited:** 2026-11-05 · live site https://wuwa-today.vercel.app (deployed from `main` @ `0118846`) and the source in this repo.
**Branch for this work:** `improvement/website-overhaul`
**Method:** every page opened in a real browser at 320, 375, ~706 and 1440 px wide; layout and overflow measured with DOM scripts (Appendix A); network weight measured with the Resource Timing API; source read file by file. Evidence for every finding is quoted next to it. Anything not measured is labelled **Potential**.

---

## 0. Rules for the implementing agent (read first)

1. Work only on `improvement/website-overhaul`. Commit only when the owner tells you to; if they do, one task = one commit, message starts with the task ID (e.g. `P1-2: …`).
2. Do the phases in order. Inside a phase, do the tasks in the order listed unless the task says otherwise. Check each task's **Depends on** line before starting it.
3. **Never change game facts.** Do not edit any value in `data/*.json` (names, dates, rewards, tiers, verdicts, sources) unless a task explicitly tells you to, and then only in the way it describes. This site's value is its accuracy.
4. **No new runtime dependencies.** The only allowed new package is `sharp` as a **devDependency** in task P2-2.
5. After **every** task: `npm run lint` and `npm run build` must both pass with no new warnings. Then run the task's **Verify** steps.
6. For visual tasks, take screenshots **before** and **after** at 375×812 and 1440×900 for each page the task touches, and compare. Unintended differences = regression; fix before moving on.
7. If the code does not match what this plan describes (a file or class name has changed), stop and report the mismatch. Do not guess.
8. Keep `prefers-reduced-motion` and `prefers-reduced-transparency` handling working everywhere you touch motion or blur.
9. When a task describes a *desired outcome* rather than exact pixels, meet the acceptance criteria; the visual details are your call within the design system in `DESIGN.md` (created in P3-1).

---

## 1. Overall assessment

WuWa Today is a **genuinely good companion site with an unusually strong trust model** (two-source rule for codes, "estimated" labels, verified-on stamps, recorded sources) and a **distinctive identity**: the whole UI is tinted by the element of the live banner's lead Resonator ("Resonance"). The technical base is sound: fully static export, TTFB ~170 ms, **CLS 0.000** on the homepage, lazy-loaded command palette, one shared 1-second clock (`components/useNow.ts`) for every countdown, accessible countdowns (animated reels are `aria-hidden` with spoken text alongside), skip link, reduced-motion and reduced-transparency fallbacks.

Its problems come from **fast iteration without consolidation**:

- **Three design systems are stacked on top of each other and all load on every page** — "Native Dark" (`app/globals.css`), "Obsidian Glass" (`app/obsidian.css`, `app/og-pages.css`) and "Resonance" (`app/resonance.css`, `app/resonance-shared.css`, `app/theme-dark.css`). Resonance re-points the older tokens instead of replacing them. Result: 4,622 lines of global CSS, roughly 130 unused class selectors, ~50 distinct `font-size` values, 41 `!important`s, 7 separate page-hero implementations and chips/pills in 8 class namespaces. The git log shows the cost: 5 of the last 15 commits are mobile/iOS hotfixes for overlap and cut-off problems.
- **The homepage puts atmosphere before utility.** It calls itself a daily dashboard, but the whole first mobile screen is a title poster; the live banner, countdown, codes and resets all start below the fold.
- **Navigation hides half the site.** Echo Sets has **no link anywhere** except the ⌘K search; Beginner and Glossary are not in the main nav; on a phone only ~3.5 of 8 nav tabs are visible at once.
- **Images are oversized for where they are shown**, mainly the character thumbnails (Teams page: 45 images, 4.3 MB).
- **Some mobile layout bugs remain** at narrow widths (text clipped at 320 px on three pages).

Nothing found is **Critical** (site works, data is intact). Most of the work is High/Medium and follows from one decision: **keep Resonance, finish the migration to it, delete the rest, then rebuild the homepage, navigation and the heaviest pages on that clean base.**

---

## 2. Design direction (decisions and reasons)

**Keep (these work and are on-brand):**
- **Element-tuned theming (`--el`)**. It mirrors the game's own element system and gives the site an identity no other WuWa site has. Keep `SiteTheme`, `ElementTheme` and the Dark appearance.
- Dark canvas, Mona Sans (display, width axis) + Martian Mono (all numbers), the rolling countdown, the `CharPoster`/`CharMedal` thumbnails, the hub→detail `ViewTransition` morph, the Spotlight hover on desktop.
- The trust language and stamps. Make them **more** visible, not less.

**Evolve:**
- **Homepage → dashboard first, poster second.** A returning player opens this site to answer "what's live, how long is left, any new codes, when's reset". Those answers must be on the first screen of a phone. Art stays, but as the live-banner card (one image, not two).
- **Character pages → answer first.** The page is 10,300 px tall on a phone and the "Pull verdict" section starts at 9,243 px. Add a compact "At a glance" summary right after the hero, built only from data the page already shows.
- **Teams page → scannable.** 64 team cards in one 33,900 px column is a reference dump. Compact cards with details on demand.

**Abandon:**
- The "Obsidian Glass" and "Native Dark" layers. Move the rules still in use into Resonance or the owning page's CSS, delete the rest.
- Per-page bespoke heroes, chips, pills and kickers. One component/class each.
- The horizontally scrolling 8-tab bar as the only nav on mobile.

**Visual direction stays dark and element-tuned.** No palette or font change is recommended: the problems are hierarchy, consistency and weight, not taste. Motion stays but must never hide the main image at first paint (LCP).

---

## 3. Findings

Legend: **P** = priority (High / Medium / Low; no Critical issues found). **E** = effort (S / M / L). Task IDs refer to section 4.

### 3.1 Confirmed bugs

| ID | Problem | Location | Evidence | Impact | Fix | P | E | Deps |
|---|---|---|---|---|---|---|---|---|
| B1 | Page title "CHARACTERS" wider than screen at 320 px; only 6 px from the edge at 375 px | `app/characters/page.tsx` (`.ch-hero-title`), `app/characters/hub.css` | 320 px: text box right edge 369 px vs viewport 316 → document `scrollWidth` 369. 375 px: text ends at 369 of 375 (gutter is 20) | Title clipped on small phones (body `overflow-x: clip` hides the scrollbar but cuts the letters) | P1-1 | High | S | – |
| B2 | Character hero content wider than its column at 320 px; description text visibly cut off | `app/characters/[slug]/page.tsx` hero, `detail.css` / `og-pages.css` | `/characters/lynae` @320: `<li>` 289 px inside a 227 px grid parent; `a.og-chip` (`white-space: nowrap`) 320 px inside 272 px; screenshot shows "…universal" cut at the card edge | Main content of the most-visited page type clipped on small phones | P1-2 | High | S | – |
| B3 | Pull Planner account cards overflow at 320 px | `app/pull-planner/page.tsx`, `components/PlannerAccounts.tsx`, `planner.css` | `p.pp-acc-profile`, `div.pp-acc-pick`, `p.pp-acc-note`, `p.pp-acc-also` are 329 px inside a 276 px parent; document `scrollWidth` 373 at 316 | Recommendation text clipped | P1-3 | High | S | – |
| B4 | Echo Sets page is orphaned | `app/echo-sets/page.tsx`; nav in `components/ResonanceNav.tsx`; footer in `app/layout.tsx` | `grep` finds no `href` to `/echo-sets` anywhere; it exists only in the search index (`app/layout.tsx:59`) and `app/sitemap.ts` | A full 8,000 px guide is effectively invisible to users | P4-2, P4-3, P4-4 | High | S | – |
| B5 | Homepage LCP image is hidden at first paint | `.rs-hero-art` in `app/page.tsx` + `rs-art-in` animation in `app/resonance.css` | LCP element is `.rs-hero-art`; a screenshot right after load shows the hero area empty while the title is visible; art appears after the `rs-art-in` entry animation | Slower perceived load; LCP timed later than the image download | P1-4 | Medium | S | – |
| B6 | Version kicker sits on top of the hero art | `.rs-hero-kicker` in `app/page.tsx` | Screenshots at 375 and 706 px: "VERSION 3.7 · PRISM'S ILLUSION…" overlaps the busiest part of the art | Hard to read | P1-4 | Medium | S | – |
| B7 | 404 page uses the homepage `<title>` and offers one link | `app/not-found.tsx` | `/nope-404` title = "WuWa Today — Wuthering Waves Banners, Codes & Events" | Confusing tab title; dead end | P1-5 | Low | S | – |
| B8 | Search hint describes a feature that doesn't exist | `app/layout.tsx` `SEARCH_ITEMS` ("Pull Planner" → "Astrite and pity") | `/pull-planner` has no Astrite or pity inputs: its only controls are 4 account-type buttons | Wrong expectation | P1-6 | Low | S | – |
| B9 | README points to files that don't exist | `README.md` (mentions `DESIGN.md` and `scripts/`) | Neither exists | Misleads contributors and agents | P1-7, P3-1 | Low | S | – |

### 3.2 Performance

| ID | Status | Problem | Location | Evidence | Impact | Fix | P | E |
|---|---|---|---|---|---|---|---|---|
| F1 | Confirmed | Character thumbnails always load the 800 px-tall render (≈430–770 px wide, 60–130 KB) regardless of display size | `lib/renders.ts` `thumbFor()` (picks the smallest listed size), `components/CharThumb.tsx` (no `srcset`) | Homepage @1× DPR: 6 thumbs displayed 73–95 px wide, each 60–130 KB. Teams: 45 unique images = **4,297 KB**; posters 126–171 px wide | 2–5× too many bytes on 1×/2× screens; slow on mobile data. (3× iPhones need ~450 px, so savings there are small) | P2-2 | High | M |
| F2 | Confirmed | Same splash art downloaded 3 times in different sizes on the homepage | `app/page.tsx` hero `<img>` (sizes `(max-width: 760px) 100vw, 640px`) and banner tile `<img>` (sizes `…, 720px`) | @706 px: hero shown at 440 px but `suoming-splash-1024.webp` chosen; `-512`, plain and `-1024` all fetched (~350 KB decoded); the hero `<link rel=preload>` appears twice in `<head>` | Wasted bandwidth on the most visited page | P2-1, P5-1 | High | S |
| F3 | Confirmed | The 61-character search index is serialized into every page | `app/layout.tsx` `SEARCH_ITEMS` → `ResonanceNav` props | Every page's HTML contains 61 `"kind":"character"` entries (e.g. text-only `/glossary` still carries it) | ~10–15 KB extra HTML + RSC per page, parsed on every load | P2-3 | Medium | M |
| F4 | Confirmed | 31 RSC prefetch requests on homepage load | Next `<Link>` prefetch: 8 nav + 9 footer links (duplicates) + content links | 31 `fetch` requests, 74 KB transferred | Bandwidth on mobile data | P2-4 | Low | S |
| F5 | Confirmed | All 6 global stylesheets ship on every route | `app/layout.tsx` imports `globals`, `obsidian`, `og-pages`, `resonance`, `resonance-shared`, `theme-dark` | One 95 KB (21 KB gzip) CSS chunk on every page; heuristic scan: ~61/102 selectors in `obsidian.css`, ~51/183 in `og-pages.css`, ~19/53 in `globals.css` unused | Parse cost + the cascade conflicts behind B1–B3 | P3-3, P3-6 | High | L |
| F6 | Confirmed | Teams page is very heavy | `app/teams/page.tsx`, `components/TeamsExplorer.tsx` (client) | @375: 33,913 px tall, 3,702 DOM nodes, 240 `<img>`, 286 KB HTML, 64 team cards | Slow render + scroll on low-end phones; hard to scan | P5-3, P2-2 | High | M |
| F7 | Potential | Large client components receive all their data as props, so it ships twice (HTML + RSC payload) | `TeamsExplorer.tsx` (571 lines), `TierExplorer.tsx` (483 lines), `CharactersHub.tsx` | `/tier-list` HTML 112 KB of which 70 KB is RSC payload | More JS/parse work than needed | P6-1 | Low | L |
| F8 | Potential | Up to 3 stacked `backdrop-filter` layers while scrolling (bottom nav + sticky section rail + sticky toolbars) | `resonance.css` `.rs-nav`, `components/section-rail.css` `.sr`, `teams.css` `.tm-bar`, `tier-list.css` `.tl-bar` | 22 `backdrop-filter` declarations; known iOS scroll cost; **not measured on a real device** | Possible scroll jank on older iPhones | P6-2 | Low | M |
| F9 | Potential | Display font is 96 KB | `Mona_Sans` with `wdth` axis in `app/layout.tsx` | 2 preloaded woff2 = 134 KB | Font weight on first visit (cached after) | P6-4 | Low | S |
| – | Good | No layout shift; fast TTFB | – | CLS 0.000; TTFB 168 ms; desktop LCP 840 ms | Keep it that way | – | – | – |

### 3.3 Design and UX opportunities

| ID | Problem | Location | Evidence | Impact | Fix | P | E |
|---|---|---|---|---|---|---|---|
| D1 | Homepage first screen has no live data | `app/page.tsx` `.rs-hero` | @375×812 the first screen is kicker + 3-line title + subtitle + 2 buttons + "3.8 preview" strip; the live banner card starts below the fold. "See today" only jumps to content directly below | Core daily task takes a scroll every visit | P5-1 | High | M |
| D2 | Mobile nav shows ~3.5 of 8 tabs; 3 sections not in nav at all | `components/ResonanceNav.tsx`, `.rs-tabs` | @375 the tab strip is 287 px wide with 670 px of tabs; Echo Sets, Beginner, Glossary absent | Most of the site is invisible to phone users | P4-1, P4-2 | High | M |
| D3 | Seven page-hero implementations, two kicker classes, chips/pills in 8 namespaces, two button systems | `rs-hero`, `og-page-hero`, `tm-hero`, `tl-hero`, `pp-hero`, `ev-hero`, `og-char-hero`; `og-kicker`(12)/`rs-kicker`(10); `og-chip`, `rs-chip`, `ch-chip`, `ev-chip`, `ev-pill`, `tl-pill`, `tm-pill`, `sr-pill`; `og-btn`/`rs-btn` | `grep` counts in source | Pages look slightly different from each other; every fix is per-page | P3-4 | High | L |
| D4 | No type scale; much text below 12 px | all CSS | ~50 distinct `font-size` values; 66 declarations below `0.7rem`; text nodes <12 px @375: Teams 530, Events 77, Characters 74, Tier List 63 | Readability on phones; inconsistent hierarchy | P3-2, P3-5 | High | M |
| D5 | Character page answer is buried | `app/characters/[slug]/page.tsx` | `/characters/lynae` @375: 10,334 px tall; H2 offsets: Build 1,712 · Resonance Chain 4,622 · Farming 5,105 · Teams 6,299 · Pull verdict 9,243 | Users who want "best weapon / echoes / worth pulling?" must scroll or use the rail | P5-2 | Medium | M |
| D6 | Characters hub: filters fill the first mobile screen | `components/CharactersHub.tsx` | @375 the first character tile starts at ~690 px of 812 | Browsing starts below the fold | P5-4 | Medium | S |
| D7 | Fragile layered hero art (absolute art + ghost text + masks) keeps breaking on mobile | home hero, character hero, `CharPoster` ghost name | Commits `68d52a3`, `5ab380b`, `186a606`, `fed8023`, `9ef1475` are all fixes for this | Ongoing maintenance cost | P3-4 (shared hero), P5-1 | Medium | M |
| D8 | Data-trust stamps are at the bottom of the page | homepage footer line "codes verified Oct 17, 2026" | Only shown after all content | The site's main differentiator is easy to miss | P5-1 | Medium | S |

### 3.4 Copy (from `design:ux-copy` review)

| ID | Issue | Location | Recommendation | P |
|---|---|---|---|---|
| C1 | One feature has three names: "Planner" (nav), "Pull Planner" (footer, search), "Pull planner" (H1) | `ResonanceNav.tsx`, `layout.tsx`, `app/pull-planner/page.tsx` | Use "Pull Planner" in nav (or "Pulls" if space-limited) and one heading case everywhere (P1-6) | Low |
| C2 | Heading case mixed: "Tier list", "Pull planner" vs "Characters", "Teams", "Echo Sets" | page H1s / footer / nav | Title Case for page names in nav, footer, search and H1s (these are proper section names) | Low |
| C3 | Appearance options "Resonance" / "Dark": both are dark, so "Dark" doesn't say what changes | `components/ThemeSwitch.tsx` | Labels "Element" and "Neutral"; hints "Colours follow the live banner" / "Quiet greys, no element colour". **Keep the stored value `"dark"`** (P1-6) | Low |
| C4 | "(verify in-game)" repeated inside many event reward lines | `data/events.json` strings rendered by `EventsBoard.tsx` / `HomeEndingSoon.tsx` | Keep the caveat (it's a trust signal) but show it once as a small "Unconfirmed rewards" badge instead of inline text (P5-5) | Low |
| C5 | "See today" CTA scrolls to content that should already be visible | `app/page.tsx` | Remove when the homepage becomes dashboard-first (P5-1) | Medium |
| C6 | 404 copy is fine in tone but offers only "Back to today's dashboard" | `app/not-found.tsx` | Add links to Characters, Banners, Events and a "Search" button (P1-5) | Low |

### 3.5 Optional enhancements (only after phases 1–5)

P6-1 server-render static lists in Teams/Tier, P6-2 real-device iOS scroll profiling, P6-3 single source for redirects (`next.config.js` and `vercel.json` duplicate the same 21 rules by hand), P6-4 font review, P6-5 countdown first-paint placeholder.

---

## 4. Implementation plan

Task format: **Objective · Why · Do this · Files · Expected outcome · Depends on · Accept when · Verify.**

### Phase 0 — Baseline (do once, before any change)

#### P0-1 Record baseline measurements
- **Objective:** have numbers and screenshots to compare against.
- **Why:** every later task is judged against these; without them regressions go unnoticed.
- **Do this:**
  1. `npm ci && npm run build && npx serve out -l 3000` (or `npm run dev`; prefer the static `out/` build because production is a static export).
  2. In a Chromium browser at **375×812** (device emulation, DPR 3) and **1440×900**, open each route: `/`, `/banners`, `/events`, `/characters`, `/characters/lynae`, `/characters/suoming`, `/pre-farm`, one `/pre-farm/<slug>`, `/pull-planner`, `/tier-list`, `/teams`, `/echo-sets`, `/beginner`, `/beginner/start-here`, `/glossary`, a 404 URL.
  3. For each: full-page screenshot, and run **Appendix A, snippets A1 and A2**. Also run A1 at **320×700**.
  4. Save everything in `audit/baseline/` (screenshots + one `metrics.md` table). **Do not commit `audit/`**; add `audit/` to `.gitignore`.
- **Files:** `.gitignore`.
- **Accept when:** `audit/baseline/metrics.md` has rows for every route at 320/375/1440 and screenshots exist.
- **Verify:** numbers roughly match section 3 (e.g. `/teams` ≈ 33,900 px tall at 375).

### Phase 1 — Confirmed bug fixes (small, safe, high value)

#### P1-1 Stop the Characters page title overflowing
- **Objective:** "CHARACTERS" fits inside the page gutter at every width ≥ 320 px.
- **Why:** B1. Text is clipped on small phones.
- **Do this:** find the `font-size` rule for `.ch-hero-title` in `app/characters/hub.css` (and any override in `resonance*.css`). Change the minimum of its `clamp()` (or the `vw` term) so the word fits in `100vw − 2 × 1.25rem` at 320 px. Add `overflow-wrap: anywhere` as a safety net. Do **not** reduce letter spacing below the current value or change the font.
- **Files:** `app/characters/hub.css` (possibly `app/resonance.css`).
- **Expected outcome:** title shrinks slightly on narrow phones, unchanged at ≥ 768 px.
- **Depends on:** –
- **Accept when:** Appendix A1 on `/characters` at 320 and 375 reports `docOverflow: false` and no `H1` in `textOver`; the title has ≥ 16 px space on the right at 375.
- **Verify:** screenshots at 320 / 375 / 1440 vs baseline; only the title size differs, only below ~420 px.

#### P1-2 Fix character hero overflow at narrow widths
- **Objective:** no element in the character hero is wider than its container.
- **Why:** B2. Description and chips clipped on 320 px phones.
- **Do this:**
  1. At 320 px on `/characters/lynae`, run Appendix A3 to list the overflowing elements (expected: `<li>`s in the hero meta grid and an `a.og-chip`).
  2. For each overflowing **grid or flex child**, add `min-width: 0` to the child (root cause: grid/flex items default to `min-width: auto`, so a long unbreakable child forces the track wider than the container).
  3. For `.og-chip` with `white-space: nowrap`: allow wrapping inside the hero (`white-space: normal`) **or** make the chip row a horizontal scroller with `overflow-x: auto` — pick wrapping unless it breaks the design.
  4. Check every character, not just Lynae: loop A3 over all slugs from `data/characters-roster.json` (script it in the console using an iframe as in A1).
- **Files:** `app/characters/[slug]/detail.css`, possibly `app/og-pages.css` (where `.og-chip` lives).
- **Expected outcome:** hero reads fully on 320 px; no visual change at ≥ 375 px except possibly chip wrapping.
- **Depends on:** –
- **Accept when:** A1 reports `docOverflow: false` for **every** `/characters/<slug>` at 320.
- **Verify:** screenshots of 3 characters with long names/titles (e.g. `luuk-herssen`, `yangyang-xuanling`, `spectro-rover`) at 320 and 375.

#### P1-3 Fix Pull Planner account card overflow
- **Objective:** account recommendation cards fit at 320 px.
- **Why:** B3.
- **Do this:** same diagnosis as P1-2 using A3 on `/pull-planner` at 320. Expected cause: the grid/flex container of `.pp-acc-*` items has a fixed or min-content column; add `min-width: 0` to the items and make columns `minmax(0, 1fr)`. Also check the four account-type buttons wrap rather than overflow.
- **Files:** `app/pull-planner/planner.css`, `components/PlannerAccounts.tsx` only if markup must change.
- **Depends on:** –
- **Accept when:** A1 on `/pull-planner` at 320 → `docOverflow: false`; each account type (New player, F2P, Low-spender, Veteran) checked by clicking it.
- **Verify:** screenshots for all 4 account types at 320.

#### P1-4 Show the homepage hero art at first paint and make the kicker readable
- **Objective:** the LCP image is visible as soon as it is decoded; the version line is readable.
- **Why:** B5, B6.
- **Do this:**
  1. In `app/resonance.css` find the `.rs-hero-art` rules that apply `rs-art-in` (around the `@supports (animation-timeline: view())` block near line 487). Remove the opacity/transform **entry** animation from the LCP image. The scroll-driven depth effect (`rs-depth-art`) may stay because it starts at the resting state.
  2. If the entry effect is wanted, apply it to a decorative layer (e.g. the glow/wash), never to the `<img>` itself.
  3. Move `.rs-hero-kicker` so it doesn't sit on the art, or give it a solid/blurred backing that guarantees 4.5:1 contrast. (If P5-1 is planned soon, keep this minimal: P5-1 rebuilds this area.)
- **Files:** `app/resonance.css`, `app/page.tsx`.
- **Depends on:** –
- **Accept when:** a screenshot taken within ~300 ms of load (throttled "Fast 4G" in DevTools) shows the art; kicker text contrast ≥ 4.5:1 against what is behind it.
- **Verify:** DevTools Performance panel: LCP timestamp no later than baseline; reduced-motion still shows the art with no motion.

#### P1-5 Proper 404 page
- **Objective:** a 404 with its own title and a way forward.
- **Why:** B7, C6.
- **Do this:** in `app/not-found.tsx` add `export const metadata = { title: "Page not found", robots: { index: false } }`. Under the existing copy add links to Characters, Banners and Events. Add a "Search" button that opens the command palette (dispatch the same keyboard shortcut handler used in `ResonanceNav`, or expose a small `openPalette` event: a `window.dispatchEvent(new Event("wuwa-today:search"))` that `ResonanceNav` listens for).
- **Files:** `app/not-found.tsx`, `components/ResonanceNav.tsx` (only if adding the event).
- **Accept when:** `out/404.html` `<title>` is "Page not found | WuWa Today"; links work; search button opens the palette.
- **Verify:** open a missing URL on the static build.

#### P1-6 Copy fixes (labels, hints, appearance names)
- **Objective:** one name per feature, accurate hints, clear appearance labels.
- **Why:** B8, C1, C2, C3.
- **Do this:**
  1. `app/layout.tsx` search hint for Pull Planner: replace "Astrite and pity" with "Who to pull, by account type".
  2. Nav label "Planner" → "Pull Planner" if it fits; if P4-2 is done later this is decided there. Footer/search already say "Pull Planner".
  3. Make page H1s Title Case where they are section names: "Tier List", "Pull Planner" (check `app/tier-list/page.tsx`, `app/pull-planner/page.tsx`). Do **not** change `<title>`/meta strings unless they contain the same casing inconsistency.
  4. `components/ThemeSwitch.tsx`: labels "Element" / "Neutral", hints "Colours follow the live banner" / "Quiet greys, no element colour". **Do not change** the `ThemeMode` values (`"resonance"`, `"dark"`), the localStorage key, or `data-theme="dark"`: existing users' saved choice must keep working.
- **Files:** `app/layout.tsx`, `components/ResonanceNav.tsx`, `components/ThemeSwitch.tsx`, the two page files.
- **Accept when:** grep shows no "Astrite and pity"; saved "dark" choice from before still applies after reload.
- **Verify:** set Neutral, reload, confirm it persists; set Element, reload.

#### P1-7 Fix README drift
- **Objective:** README only references things that exist.
- **Why:** B9.
- **Do this:** remove the `scripts/` line from the project structure block (or keep it if P2-2/P2-3 create `scripts/`, and describe what's in it). Keep the `DESIGN.md` reference; it is created in P3-1. If P3-1 will not be done, remove the reference.
- **Files:** `README.md`.
- **Accept when:** every path mentioned in README exists.

### Phase 2 — Performance (measurable, low visual risk)

#### P2-1 Correct hero/banner image sizing and remove the duplicate download
- **Objective:** the homepage downloads the splash art **once**, at the right size.
- **Why:** F2.
- **Do this:**
  1. Move the duplicated `srcSetFor()` helper (`app/page.tsx:38` and `app/banners/page.tsx:40`) into `lib/images.ts` and import it in both places.
  2. Measure the real rendered width of `.rs-hero-art` and `.rs-banner-art` at 375, 768, 1024, 1440 (DevTools → element width). Write `sizes` values that match those widths (e.g. if the hero is ~440 px wide at 706 px viewport, `100vw` is wrong).
  3. Ensure both `<img>` elements resolve to the **same** candidate at common widths, or (preferred, and required by P5-1) show the art only once on the page.
  4. Remove the second `<link rel="preload" as="image">` for the same art (it comes from `fetchPriority="high"`/eager on one element and React's preload for the other; only the LCP image should be eager + high priority).
- **Files:** `lib/images.ts` (new), `app/page.tsx`, `app/banners/page.tsx`.
- **Depends on:** –
- **Accept when:** on the homepage at 375 (DPR 3) and 1440 (DPR 1), the Network panel shows exactly **one** request for `suoming-splash*` (or whichever art is current), and only one preload tag for it.
- **Verify:** Appendix A2 before/after; record image KB in `metrics.md`.

#### P2-2 Responsive character thumbnails
- **Objective:** thumbnails load an image close to their displayed size on every screen density.
- **Why:** F1. Teams page images = 4.3 MB; 1×/2× screens download 2–5× more pixels than shown.
- **Do this:**
  1. Add `sharp` as a **devDependency** (the only allowed new package). Create `scripts/make-thumbs.mjs` that, for every render listed in `data/renders.json`, writes two extra WebP files next to the existing ones: widths **240** and **480** px (keep aspect ratio, quality ~80), named `<slug>-w240.webp` and `<slug>-w480.webp`. It must skip files that already exist and print a summary.
  2. Add an npm script `"thumbs": "node scripts/make-thumbs.mjs"`. Run it once. Commit the generated images with the task (when allowed to commit).
  3. Extend the `renders.json` entries with a `thumbs: [{ file, w }]` array **by script** (the same script), never by hand. Do not touch `focusX`, `zoom`, `source`, `sourceUrl`.
  4. In `lib/renders.ts` add `srcSet` to the `Thumb` interface: `"<w240> 240w, <w480> 480w, <smallest existing> <its width>w"`. Keep `src` as the 480 file.
  5. In `components/CharThumb.tsx` `Art`, render `srcSet={t.srcSet}` and a `sizes` value. The rendered `<img>` width is `--z`% of the poster width (`zoom`, e.g. 138–164%), so `sizes` must reflect the **image** width, not the poster width. Measure it at 375 and 1440 in the Teams, Tier List, Characters hub and homepage contexts and choose a `sizes` that covers the largest; if contexts differ a lot, pass a `sizes` prop from each caller.
  6. Do the same for `components/CharactersHub.tsx:216` (`cp-art`), which uses `c.art ?? c.portrait` directly.
- **Files:** `package.json`, `scripts/make-thumbs.mjs` (new), `data/renders.json` (script-generated fields only), `lib/renders.ts`, `components/CharThumb.tsx`, `components/CharactersHub.tsx`, `public/images/renders/*-w240.webp|*-w480.webp` (new).
- **Depends on:** –
- **Accept when:** on `/teams`, total image KB after scrolling to the bottom at **1440 DPR 1** is ≥ 50 % lower than baseline, and at **375 DPR 3** is not higher than baseline; thumbnails look equally sharp (zoom screenshots at DPR 3).
- **Verify:** Appendix A2 + A4 on `/`, `/teams`, `/tier-list`, `/characters` before/after.
- **Risk:** `focusX`/`zoom` cropping must be unchanged; compare thumbnails of 5 characters side by side.

#### P2-3 Load the search index on demand
- **Objective:** pages stop carrying the 61-character search list; the palette fetches it when opened.
- **Why:** F3.
- **Do this:**
  1. Create `app/search-index.json/route.ts` with `export const dynamic = "force-static"` and a `GET` that returns the same array currently built as `SEARCH_ITEMS` in `app/layout.tsx` (move that code into `lib/search-index.ts` and import it in the route). With `output: "export"` this emits a static `out/search-index.json`.
  2. `ResonanceNav` no longer takes `items`. `CommandPalette` fetches `/search-index.json` on first open (cache the promise in module scope so a second open is instant), shows a small "Loading…" row meanwhile, and a clear error row ("Couldn't load search. Check your connection and try again.") with a retry if the fetch fails.
  3. Keep the 11 page entries **inline** in `CommandPalette` as an immediate fallback so page search works even before the fetch resolves.
- **Files:** `app/layout.tsx`, `lib/search-index.ts` (new), `app/search-index.json/route.ts` (new), `components/ResonanceNav.tsx`, `components/CommandPalette.tsx`.
- **Depends on:** –
- **Accept when:** fetching `/glossary` HTML contains 0 occurrences of `"kind":"character"`; ⌘K, Ctrl+K, `/` and the search button all open the palette; typing a character name finds it; offline (DevTools) shows the error row.
- **Verify:** compare `/glossary` HTML KB before/after (Appendix A2 HTML snippet).

#### P2-4 Stop prefetching footer links
- **Objective:** fewer background requests on load.
- **Why:** F4. Footer links duplicate the nav.
- **Do this:** add `prefetch={false}` to every `<Link>` in the footer in `app/layout.tsx`. Leave nav and in-content links alone.
- **Accept when:** homepage `fetch` request count on load drops (record before/after); footer links still navigate client-side.

### Phase 3 — Design system consolidation (enabler for phases 4–5)

> **Highest regression risk in this plan.** Work page by page, screenshot-compare after every step, never delete a selector you haven't proven unused.

#### P3-1 Write `DESIGN.md` (target system, before touching CSS)
- **Objective:** a short, authoritative description of the system the code will converge on.
- **Why:** README already promises it; agents need a target; prevents a fourth system appearing.
- **Do this:** create `DESIGN.md` with these sections, filled from the **existing Resonance tokens** in `app/resonance.css` (do not invent a new palette):
  1. Principles (copy the still-valid rules from the header comments of `resonance.css` and `obsidian.css`: glass on chrome only, gold/element accent rationed, motion gated, contrast ≥ 4.5:1).
  2. Tokens: colours (`--rs-canvas`, `--rs-surface`, `--rs-surface-2`, `--rs-line`, `--rs-ink`, `--rs-ink-2`, `--rs-ink-3`, `--el`, `--rs-el-soft`, `--rs-el-line`, `--rs-on-el`), radius, motion (`--rs-spring`, `--rs-ease`, `--rs-d1..3`), fonts.
  3. **Type scale** (new, see P3-2) with a **12 px floor for readable text** (11 px allowed only for uppercase mono labels with letter-spacing).
  4. **Spacing scale** (4-px based: 4, 8, 12, 16, 24, 32, 48, 64).
  5. Components: Button, Chip, Kicker, PageHero, Tile/Card, SectionHead, CharPoster/CharMedal, Countdown, Toolbar/Filter bar, Section rail, Command palette: one paragraph each (purpose, variants, states).
  6. Layout breakpoints actually used (list the media query values found in the CSS and pick ≤ 4 canonical ones, e.g. 480 / 760 / 1024).
- **Files:** `DESIGN.md` (new).
- **Accept when:** the owner has read and approved `DESIGN.md` (ask them).

#### P3-2 Add the type scale and spacing tokens
- **Objective:** a small set of size tokens everything can use.
- **Why:** D4.
- **Do this:** in `app/resonance.css` `:root, body.rs` block add `--fs-xs` (0.75rem), `--fs-sm` (0.875rem), `--fs-md` (1rem), `--fs-lg` (1.125rem), `--fs-xl` (clamp-based), `--fs-2xl`, `--fs-display` (use the existing display `clamp()` values from `.rs-hero-title` / page titles so nothing jumps), and `--sp-1..--sp-8` from the spacing scale. Don't apply them yet.
- **Accept when:** build passes; no visual change.

#### P3-3 Delete dead CSS (proof-based)
- **Objective:** remove selectors no page uses.
- **Why:** F5.
- **Do this:**
  1. For each class selector in `app/globals.css`, `app/obsidian.css`, `app/og-pages.css`, `app/resonance-shared.css`, `app/characters/hub.css`: search all `.tsx/.ts` files for the class name. **Also** search for its prefix in template literals (e.g. `ch-tier-${…}`, `ts-swatch-${…}`, `r${rarity}`), which plain grep misses. Candidate dead lists from the audit (verify each!): `og-tabbar*` (old bottom bar), `og-badge*`, `og-banner-*`, `og-char-chip*`, `og-filter*`, `phase-rail*`, `team-card-*`, `team-role-*`, `pill-*`, `banner-art-card`, `ch-tile`, `ch-art`, `ch-flag*`.
  2. Remove proven-dead rules in batches of one file at a time. Also remove now-empty media queries.
  3. Remove the `--og-display` reference to `--font-space-grotesk` (that font isn't loaded; Resonance overrides it anyway).
- **Files:** the CSS files above.
- **Accept when:** screenshots of all routes at 375 and 1440 are pixel-identical (or differences explained) to the pre-task screenshots; global CSS chunk size reduced (record KB).
- **Verify:** Appendix A2 CSS KB; visual compare.

#### P3-4 One implementation per primitive
- **Objective:** a single Button, Chip, Kicker and PageHero used everywhere.
- **Why:** D3, D7.
- **Do this:**
  1. **PageHero:** create `components/PageHero.tsx` (server component) with props `kicker`, `title`, `lede`, optional `children` (actions), optional `art`. Base its CSS on the cleanest current one (`tm-hero`/`tl-hero` share the same structure). Replace `og-page-hero` (2 uses), `tm-hero`, `tl-hero`, `pp-hero`, `ev-hero`. **Do not** replace the homepage hero (rebuilt in P5-1) or the character hero (its art composition is special) in this task.
  2. **Kicker:** keep `rs-kicker`; replace the 12 `og-kicker` uses; delete `og-kicker` styles.
  3. **Chip:** define `.rs-chip` with modifiers `is-active`, `is-el` (element-coloured), `size-sm`. Migrate `og-chip`, `ch-chip`, `ev-chip`, `ev-pill`, `tl-pill`, `tm-pill`, `sr-pill`. Keep each page's *behaviour* (aria-pressed/role etc.) unchanged.
  4. **Button:** keep `rs-btn` (+ `rs-btn-solid`); migrate the single `og-btn` use.
  5. Touch targets: interactive chips/buttons ≥ 44×44 px hit area on touch (padding or `::after` hit-slop).
- **Files:** new `components/PageHero.tsx` (+ its CSS in `resonance-shared.css` or a new `components/page-hero.css`), page files under `app/*/page.tsx`, per-page CSS.
- **Depends on:** P3-1, P3-2.
- **Accept when:** grep finds none of the replaced class names; each page's hero/chips look the same as or more consistent than baseline; Appendix A1 "smallTargets" count does not increase.

#### P3-5 Apply the type scale; raise the readability floor
- **Objective:** text sizes come from tokens; no readable text under 12 px.
- **Why:** D4 (Teams has 530 text nodes under 12 px at 375).
- **Do this:** replace literal `font-size` values with `--fs-*` tokens file by file, mapping each to the nearest step. Anything under `0.75rem` becomes `--fs-xs` unless it's an uppercase mono label (then ≥ 0.6875rem / 11 px). Check line lengths and that card heights don't explode (Teams, Tier List, Events are densest).
- **Depends on:** P3-2. Best done together with P3-4 per page.
- **Accept when:** distinct `font-size` values in CSS ≤ 12 (excluding `clamp` display sizes); A1 `tinyText` at 375 is 0 for non-label text on every route.

#### P3-6 Fold the legacy layers into Resonance
- **Objective:** one global token layer; legacy files gone or reduced to clearly named component files.
- **Why:** F5, D3. Today `resonance.css` loads last and re-points `--og-*`/`--bg`/`--gold` tokens: every page still depends on three systems.
- **Do this:**
  1. After P3-3 and P3-4, move each still-used rule from `globals.css`, `obsidian.css`, `og-pages.css` into either `resonance.css` (global primitives/layout) or the CSS of the one page that uses it (e.g. `og-char-*` → `app/characters/[slug]/detail.css`).
  2. Replace `var(--og-*)`, `var(--bg*)`, `var(--gold*)`, `var(--text*)` usages with the `--rs-*` equivalents, then delete the alias block ("re-point the older systems") from `resonance.css`.
  3. Remove `!important` where it only existed to beat the older layers. **Keep** the `!important` in `theme-dark.css` that locks `--el` (it is intentional: see that file's header).
  4. Update the imports in `app/layout.tsx`; target: `resonance.css`, `resonance-shared.css` (or merged), `theme-dark.css`.
- **Depends on:** P3-3, P3-4, P3-5.
- **Accept when:** `obsidian.css`, `og-pages.css`, `globals.css` deleted (or renamed to a component file with only used rules); full visual compare passes for all routes in both appearances (Element and Neutral) at 320/375/768/1440.
- **Risk:** cascade order changes. Do it in small steps; screenshot after each file.

### Phase 4 — Navigation and information architecture

#### P4-1 Group the destinations
- **Objective:** a clear mental model of the 11 sections.
- **Why:** D2, B4.
- **Do this:** adopt these groups (labels can be refined in `DESIGN.md`):
  - **Live:** Today, Banners, Events
  - **Characters & builds:** Characters, Teams, Tier List, Echo Sets
  - **Plan:** Pull Planner, Pre-Farm
  - **Learn:** Beginner Guides, Glossary
  Put the list in one module `lib/nav.ts` (`{ href, label, group, short? }[]`) and use it in the nav, footer, More sheet and the palette page entries, so the four never drift again.
- **Files:** `lib/nav.ts` (new), consumers in P4-2/P4-3/P2-3.
- **Accept when:** nav, footer and palette all import from `lib/nav.ts`.

#### P4-2 Mobile: 4 primary tabs + "More" sheet; desktop: primary + "More" menu
- **Objective:** every section reachable in ≤ 2 taps on a phone, with no horizontally scrolling tab bar.
- **Why:** D2: at 375 only ~3.5 of 8 tabs are visible and 3 sections are missing.
- **Do this:**
  1. Mobile (< 760 px, the current nav breakpoint): bottom bar with **Today, Banners, Characters, Teams, More** (+ the existing search button). Without analytics this choice is a judgement: the daily-check pages plus the two most-linked reference sections. If the owner has Vercel Analytics, check page views and swap Teams/Events accordingly.
  2. "More" opens a bottom sheet (`<dialog>` with `showModal()`, focus trapped by the browser, Esc/backdrop closes, returns focus to the More button) listing **all** sections grouped per P4-1, plus the Appearance switch. Respect safe-area insets (`env(safe-area-inset-bottom)`).
  3. Desktop (≥ 760 px): top bar shows the groups' main items (Today, Banners, Events, Characters, Teams, Tier List) and a "More" button opening a small menu with the rest (Echo Sets, Pull Planner, Pre-Farm, Beginner Guides, Glossary). Keep the gliding active pill.
  4. Active state: if the current route is inside "More", highlight "More".
  5. Keep keyboard shortcuts (⌘K/Ctrl+K and `/`).
- **Files:** `components/ResonanceNav.tsx`, new `components/MoreSheet.tsx` (client), nav CSS in `app/resonance.css`.
- **Depends on:** P4-1. Easier after P3-4.
- **Accept when:** at 320, 375 and 390 px every bottom-bar item is fully visible without scrolling; every section reachable in ≤ 2 taps; sheet passes keyboard test (Tab cycles inside, Esc closes, focus returns); VoiceOver/TalkBack announce it as a dialog with a name.
- **Verify:** iOS Safari (real device or Simulator): sheet sits above the home indicator; page behind doesn't scroll while the sheet is open.

#### P4-3 Complete, grouped footer
- **Objective:** footer is a full sitemap.
- **Why:** B4 (Echo Sets and Beginner missing from footer).
- **Do this:** render the groups from `lib/nav.ts` as 4 short columns (stack on mobile). Keep the disclaimer and Appearance switch.
- **Files:** `app/layout.tsx`, footer CSS.
- **Accept when:** all 11 sections linked in the footer.

#### P4-4 Contextual links into Echo Sets and Glossary
- **Objective:** people reach Echo Sets from where they need it.
- **Why:** B4.
- **Do this:**
  1. Ensure each set on `/echo-sets` has a stable `id` (slug of the set name). If none exist, add them.
  2. On character pages, where an echo set name is shown in the Build section, link it to `/echo-sets#<id>` **only if** the set exists on that page; otherwise leave it as text.
  3. On the homepage "New to Solaris-3?" card, add a secondary link to the Glossary.
- **Files:** `app/echo-sets/page.tsx`, `app/characters/[slug]/page.tsx`, `app/page.tsx`.
- **Accept when:** at least one character page links to an echo-set anchor that scrolls to the right set; no broken anchors (script: collect all `/echo-sets#…` hrefs from the built HTML and check each id exists in `out/echo-sets/index.html`).

### Phase 5 — Page redesigns

#### P5-1 Homepage: dashboard first
- **Objective:** a returning player sees the live state of the game without scrolling on a phone.
- **Why:** D1, D8, F2, C5.
- **Desired outcome (design decisions are yours inside `DESIGN.md`):**
  - At **375×812**, the first screen (above the bottom nav) shows: a compact masthead (version + title in ≤ ~30 % of the screen), the **live banner** (featured name, element tint, art, countdown) and at least the heading of the **Codes** block with its count (e.g. "Redeem codes · 1 working").
  - Directly after: Codes (with "verified <date>" stamp in the block header), Reset timers, Ending soon, then the 3.8 preview strip, then the beginner card.
  - The splash art appears **once** (in the banner card). It is the LCP image: eager, `fetchPriority="high"`, correct `sizes` (P2-1), no entry animation on the `<img>`.
  - Keep the `<h1>` for SEO (text can be "Wuthering Waves today"), but it no longer takes three huge lines.
  - Remove the "See today" button. Keep "Plan my pulls" as a link inside the banner card.
  - Desktop (1440): two-column dashboard (banner card large left; codes + resets right), still no poster-only first screen.
  - Keep: element tint, rolling countdowns, Reveal on below-fold tiles only, Spotlight hover.
- **Files:** `app/page.tsx`, homepage sections in `app/resonance.css` (`.rs-hero*`, `.rs-today`, `.rs-tile*`), `components/NextVersionNote.tsx` (strip variant position only).
- **Depends on:** P1-4, P2-1, P3-4 recommended.
- **Accept when:** screenshot at 375×812 shows banner name + countdown + codes heading above the nav; only one request for the splash art; CLS stays 0.000; LCP (DevTools, "Fast 4G" + 4× CPU) not worse than baseline; all homepage data (banners, codes, resets, events, preview, beginner card, verified stamps) still present.
- **Verify:** compare text content of `<main>` before/after (`get innerText`), nothing missing except "See today".

#### P5-2 Character page: "At a glance"
- **Objective:** the main answers appear in the first 1–1.5 screens on a phone.
- **Why:** D5.
- **Do this:** directly after the hero, add a compact block with: **Best weapon** (rank-1 weapon already shown in Build), **Best echo set** (top set already shown in Build; link per P4-4), **Main stats** (if shown), **Best team** (first team in Teams section, as `CharMedal`s), **Pull verdict** (the short verdict line already in the hero/verdict section) with a "Full verdict" link to `#verdict` (use the existing section ids used by the section rail). Use **only** values the page already renders: reuse the same variables in `app/characters/[slug]/page.tsx`, no new data. If a value is missing for a character, omit that row (no placeholders).
- **Files:** `app/characters/[slug]/page.tsx`, `app/characters/[slug]/detail.css`.
- **Depends on:** P1-2, P3-4.
- **Accept when:** on 5 characters (one 4★, one Rover, one upcoming/unreleased, two 5★) the block shows only correct values that match the sections below; the block ends above ~1,300 px at 375.
- **Verify:** for each of the 5, cross-check every value against the detailed sections on the same page.

#### P5-3 Teams page: compact cards, details on demand
- **Objective:** cut the mobile page height by ≥ 50 % while keeping every team in the HTML (SEO and Ctrl+F).
- **Why:** F6.
- **Do this:**
  1. In `components/TeamsExplorer.tsx`, make each team card show by default: team name, the 3 `CharPoster`/`CharMedal`s, role labels, and one-line summary. Put rotation, notes, substitutes etc. inside a native `<details>`/`<summary>` ("Rotation & notes"). Content stays in the DOM.
  2. Add `content-visibility: auto; contain-intrinsic-size: auto 600px;` (tune the size) to each major section (`Best teams`, `Team variants`, `Tower of Adversity`, `Whimpering Wastes`, `F2P & budget`, `Character index`).
  3. Keep the existing jump bar (`tm-jump*`) and hash links working; opening a `#team-…` hash should expand that card's `<details>`.
  4. Thumbs use P2-2 `srcset`.
- **Files:** `components/TeamsExplorer.tsx`, `app/teams/teams.css`.
- **Depends on:** P2-2, P3-4/P3-5 recommended.
- **Accept when:** `/teams` at 375: page height ≤ 17,000 px, DOM nodes not higher than baseline; all 64 team names present in `out/teams/index.html`; filters/owned-roster features behave as before.
- **Verify:** use every filter and the roster prompt; open/close details with keyboard.

#### P5-4 Characters hub: get to the characters faster on mobile
- **Objective:** first character tiles visible in the first mobile screen.
- **Why:** D6.
- **Do this:** on < 760 px, keep search + element chips visible; move Weapon, Role, Rarity and Sort into a single "Filters" button that opens a sheet (reuse the sheet pattern from P4-2). Show active-filter count on the button. Keep the "On banner now" row but make it one compact line.
- **Files:** `components/CharactersHub.tsx`, `app/characters/hub.css`.
- **Depends on:** P4-2 (sheet pattern).
- **Accept when:** at 375×812 at least one full row of tiles is visible above the nav; all filters still work; result count still announced (`aria-live` status kept).

#### P5-5 Events: present "unconfirmed rewards" once
- **Objective:** keep the trust caveat without repeating it in every line.
- **Why:** C4.
- **Do this:** add an optional boolean `rewardsUnconfirmed` to the event schema in `lib/data.ts` (+ document it in `data/README.md` if that file describes the schema). In `data/events.json`, for each reward string ending with " (verify in-game)", remove **only** that suffix and set `rewardsUnconfirmed: true` on that event. No other data edits. Render a small "Unconfirmed" badge with a tooltip/description "Rewards from early sources — check in-game" in `EventsBoard.tsx` and `HomeEndingSoon.tsx`.
- **Files:** `data/events.json`, `lib/data.ts`, `components/EventsBoard.tsx`, `components/HomeEndingSoon.tsx`.
- **Accept when:** a diff of `events.json` shows only suffix removals + the new flag; every previously caveated event shows the badge.

### Phase 6 — Optional (do only if phases 1–5 are done and the owner agrees)

- **P6-1 Slim client islands.** Render the static parts of `TeamsExplorer`, `TierExplorer` and `CharactersHub` as server components and pass only what filtering needs to the client. Accept: same behaviour; RSC payload KB on `/tier-list` and `/teams` reduced. Risk: ViewTransition names and filter state.
- **P6-2 iOS scroll profiling.** On a real iPhone (Safari Web Inspector → Timelines), scroll `/characters/lynae`, `/teams`, `/tier-list`. If frames drop, keep `backdrop-filter` only on the bottom nav and make sticky toolbars/rail solid `--rs-surface`.
- **P6-3 Single source for redirects.** Add `scripts/check-redirects.mjs` that fails if `vercel.json` redirects differ from `next.config.js`; run it in `npm run lint`. No new deps.
- **P6-4 Font payload.** Check which `font-stretch` values are used after P3-5; if only 100–125 %, confirm `next/font` can't subset the axis and leave as is (it is cached after the first visit). Don't swap fonts.
- **P6-5 Countdown first paint.** `useNow` returns `null` until hydration, so reels roll in from dashes on every load. Consider rendering the server-time value at build and letting it correct after hydration only if it doesn't cause hydration mismatches (likely not worth it: low priority).

---

## 5. Regression risk register

| Change | What can break | Guard |
|---|---|---|
| P3-3/P3-6 CSS deletion and merging | Any page relying on an "unused-looking" class built from a template literal; cascade order (resonance used to win by loading last) | Prefix search for template classes; one file per step; full-route screenshot compare at 4 widths × 2 appearances |
| P1-6 appearance labels | Users' saved theme | Never change `"dark"` value, `wuwa-today:theme` key or `data-theme` attribute |
| `theme-dark.css` `!important` | Neutral mode re-tinted by banner/character element | Keep the `--el` lock; test Neutral on a character page |
| P2-2 thumbnails | Head crop (`focusX`, `zoom`) off; blurry on 3× | Side-by-side zoom compare; `sizes` measured per context |
| P2-3 search index | Palette empty/slow offline; shortcut regressions | Inline page fallback; error row; test ⌘K/Ctrl+K and `/` |
| P4-2 nav | Focus traps, iOS safe areas, active state, view transitions between pages | Keyboard + screen reader test; iOS Simulator/device |
| P5-1 homepage | Lost content, LCP regression, SEO H1 change | innerText diff; LCP measurement; keep one `<h1>` |
| P5-2 at a glance | Showing a value that disagrees with the section below | Reuse the same variables; manual cross-check on 5 characters |
| P5-3 teams `<details>` | Hash links to a team, Ctrl+F, filters | Auto-open on hash; test filters/roster |
| P5-5 events data | Losing a caveat | Diff shows only suffix → flag |
| Static export | Route handler or dynamic API not exportable | `npm run build` must finish with `output: "export"`; check `out/` files |
| Redirects | `vercel.json` drift | P6-3 (optional), or check manually when editing either file |
| ViewTransition | Hub → character morph names (`char-${slug}`) | Click 3 hub tiles in Chrome; verify morph still runs |

---

## 6. Final testing checklist (run at the end of each phase)

**Build & static output**
- [ ] `npm run lint` clean; `npm run build` succeeds with `output: "export"`; `out/` contains every route, `404.html`, `search-index.json` (after P2-3).
- [ ] Legacy URLs (`/codes`, `/guides`, `/guides/is-hsin-worth-pulling`, …) still redirect on the deployed preview (vercel.json).

**Widths** (Chromium device emulation): 320×568, 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080
- [ ] Appendix A1 on every route: `docOverflow: false`, no unexpected `textOver`, `tinyText` 0 for body text.
- [ ] No content hidden under the bottom nav at the end of any page (last element fully visible when scrolled to bottom).

**iOS (real device or Xcode Simulator, Safari)**
- [ ] Bottom nav and More sheet sit above the home indicator; landscape safe areas OK.
- [ ] No cut-off backgrounds/washes while scrolling fast and during rubber-band overscroll (regression of `68d52a3`).
- [ ] Hero art and ghost names don't overlap text (regressions of `5ab380b`, `186a606`, `fed8023`).
- [ ] Inputs don't trigger zoom (font-size ≥ 16 px on inputs).
- [ ] Scrolling `/teams`, `/tier-list`, a character page is smooth (P6-2 if not).

**Performance** (Chrome DevTools, "Fast 4G" + 4× CPU, incognito)
- [ ] Homepage: LCP ≤ baseline, CLS 0, one splash request.
- [ ] `/teams` image KB at 1440 DPR 1 ≥ 50 % lower than baseline.
- [ ] `/glossary` HTML has no character search entries.
- [ ] Record final numbers next to baseline in `audit/metrics.md`.

**Functionality (must behave exactly as before unless a task changed it)**
- [ ] Countdowns tick, roll, and switch to "Ended" (test by temporarily faking time in DevTools: Sensors → or override `Date.now` in console).
- [ ] Site accent changes with the live banner; character pages tint to their element; Neutral appearance overrides both and persists across reloads.
- [ ] Copy code button copies and announces "Copied".
- [ ] Command palette: ⌘K / Ctrl+K / `/` / button; arrow keys; Enter navigates; Esc closes.
- [ ] Characters hub: search, element, weapon, role, rarity, upcoming, sort; result count announced; tile → detail morph.
- [ ] Tier list: explorer, quick-look sheet, filters.
- [ ] Teams: filters, roster prompt, jump bar, hash links.
- [ ] Events filters; Pull Planner account types; Pre-farm checklists (incl. any saved state); Reset timer server switch.
- [ ] Skip link works; all pages have one `<h1>`; focus visible on every interactive element; reduced motion removes animations; reduced transparency removes blur.

**Content accuracy**
- [ ] `git diff main -- data/` shows only the changes allowed by P2-2 (script-generated `thumbs`) and P5-5 (suffix → flag).

---

## Appendix A — audit snippets (paste in the browser console on the site)

**A1 · overflow + small targets + tiny text at the current viewport, for a list of routes** (run from any page of the site; uses hidden same-origin iframes; set the window/device to the width you want first):
```js
const routes=['/','/banners','/events','/characters','/characters/lynae','/pre-farm','/pull-planner','/tier-list','/teams','/echo-sets','/beginner','/glossary'];
const W0=innerWidth;
const audit=p=>new Promise(res=>{const f=document.createElement('iframe');f.style.cssText=`position:fixed;left:0;top:0;width:${W0}px;height:${innerHeight}px;opacity:0;pointer-events:none`;f.src=p;document.body.appendChild(f);
f.onload=()=>setTimeout(()=>{const d=f.contentDocument,w=f.contentWindow,W=d.documentElement.clientWidth;
const textOver=[];d.querySelectorAll('h1,h2,h3,p,a,button,span,strong,td,li').forEach(el=>{if(el.closest('.rs-tabs,.skip-link,[class*=scroll],[class*=rail],[class*=strip]'))return;const r=d.createRange();r.selectNodeContents(el);const b=r.getBoundingClientRect();if(b.width&&b.right>W-4)textOver.push(el.tagName+'.'+String(el.className).split(' ')[0]+':'+Math.round(b.right))});
const smallTargets=[...d.querySelectorAll('a,button,input,select,summary')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.height<32||b.width<32)}).length;
const tinyText=[...d.querySelectorAll('p,li,span,a,td,dd,small')].filter(e=>!e.childElementCount&&e.textContent.trim().length>3&&parseFloat(w.getComputedStyle(e).fontSize)<12).length;
res({p,W,docOverflow:d.documentElement.scrollWidth>W,height:d.documentElement.scrollHeight,dom:d.querySelectorAll('*').length,imgs:d.images.length,smallTargets,tinyText,textOver:[...new Set(textOver)].slice(0,6)});f.remove()},2000)});
const out=[];for(const p of routes)out.push(await audit(p));console.table(out);
```
(Desktop browsers add a scrollbar inside iframes; for exact phone numbers use device emulation, which uses overlay scrollbars.)

**A2 · page weight by type** (reload the page, scroll to the bottom, then run):
```js
const by={};for(const r of performance.getEntriesByType('resource')){const k=(r.name.match(/\.(css|js|woff2|webp|png|jpg|avif|json)/)||[r.initiatorType])[0];by[k]=by[k]||{n:0,kb:0};by[k].n++;by[k].kb+=Math.round(r.decodedBodySize/1024)}
const nav=performance.getEntriesByType('navigation')[0];console.table(by);console.log('HTML KB',Math.round(nav.decodedBodySize/1024),'DOM',document.querySelectorAll('*').length);
```

**A3 · which element is too wide** (on the page, at the failing width):
```js
const W=document.documentElement.clientWidth;[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.width&&r.right>W+2&&p.right<=W+2}).map(el=>{const s=getComputedStyle(el);return `${el.tagName}.${el.className} w${Math.round(el.getBoundingClientRect().width)} parent${Math.round(el.parentElement.getBoundingClientRect().width)} minW:${s.minWidth} ws:${s.whiteSpace}`})
```

**A4 · thumbnail displayed vs downloaded size**:
```js
console.table([...document.querySelectorAll('img.ct-art,img.cp-art')].filter(i=>i.complete).slice(0,15).map(i=>({file:i.currentSrc.split('/').pop(),shownW:Math.round(i.getBoundingClientRect().width),dpr:devicePixelRatio,naturalW:i.naturalWidth})))
```

## Appendix B — further investigation (not answerable from this audit)

1. **Real iOS device testing.** All mobile measurements used Chromium device emulation. iOS-specific behaviour (backdrop-filter cost, rubber-band washes, safe areas, `animation-timeline` support) needs a real iPhone or Simulator.
2. **Traffic data.** Which pages people actually use (Vercel Analytics, if enabled) should decide the 4 primary mobile tabs in P4-2.
3. **Lab/field metrics.** Run Lighthouse (mobile) on the deployed preview before and after each phase; field Core Web Vitals if Speed Insights is enabled.
4. **Code freshness.** The homepage shows codes verified Oct 17, 2026 (19 days before the audit) with one active code. That's a content-process question for the update playbook, not a design one, but stale stamps erode the trust the design promotes.
5. **Pre-Farm pages and Banner history** were checked for overflow and weight only; they had no findings, but weren't critiqued in depth.

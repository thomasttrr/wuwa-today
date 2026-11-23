# Audit Report — wuwa-today

Audited 2026-11-23 against `main` @ `94b96f5` plus the uncommitted working tree. Read-only: no source file was changed.

**Baseline signal:** `npm run check` OK (61 characters, 6 banner ids, 32 events, 1 active code). `npx tsc --noEmit` clean. `npx eslint .` 0 errors, 6 `no-img-element` warnings. No test suite exists.

**Shape of the system:** static export (`output: "export"`), no server runtime, no database, no API beyond the build-emitted `/search-index.json`. The real inputs are: the data JSON files (partly written by an automated refresh agent from web sources), the clock at build time vs. view time, the URL hash, `localStorage`, and the GitHub Actions rebuild trigger. Every finding below sits on one of those seams.

**Severity count:** 0 CRITICAL · 4 HIGH · 11 MEDIUM. Ordered by blast radius.

---

## Phase 2 — Findings

### H1 · HIGH · Expired redeem code stays on the home "Today" strip
- **Location:** `app/page.tsx:227-229`, `components/home/AmGlance.tsx:133-143`, `.github/workflows/rebuild-at-phase-boundaries.yml:43-49`
- **Trigger & failure:** `codeCell` is chosen once at build time from `activeCodes` sorted by soonest expiry, so the strip always shows the code *closest to expiring*. `AmGlance` never re-checks `expiresAt` on the client (`HomeCodes` does, so the two disagree). The rebuild workflow watches banners, events and `nextVersion` only, not `codes.json`. Result: once a livestream code (typically 2–3 day expiry) passes its `expiresAt`, the strip keeps showing it with "Tap to copy" until the next unrelated rebuild — up to ~24 h (daily fallback at 09:00 UTC). This breaks the playbook's "non-negotiable" trust rule. Latent today (the only active code has `expiresAt: null`); it fires on the next timed code.
- **Minimal fix:**
  ```tsx
  // app/page.tsx — pass the list and expiries, not one pre-picked code
  const codeCell = codes.length ? codes.map(({ code, rewards, expiresAt }) => ({ code, expiresAt, rewards: rewards.split(",").slice(0, 2).join(" and").trim() })) : [];
  <AmGlance unlocks={unlocks} codes={codeCell} builtAt={BUILT_AT} />
  // AmGlance.tsx
  const at = now?.getTime() ?? builtAt;
  const live = codes.filter((c) => !c.expiresAt || Date.parse(c.expiresAt) > at);
  const code = live[0] ? { ...live[0], count: live.length } : null;
  ```
  ```python
  # workflow: treat code expiries as boundaries too
  for c in json.load(open("data/codes.json"))["active"]:
      if c.get("expiresAt"):
          records.append({"id": "code " + c["code"], "endsAt": c["expiresAt"]})
  ```

### H2 · HIGH · One offset-less date silently stops every scheduled rebuild
- **Location:** `scripts/check-data.mjs:39`, `.github/workflows/rebuild-at-phase-boundaries.yml:35,55`
- **Trigger & failure:** the `ISO` regex makes the offset optional, so `"2026-12-03"` or `"2026-12-03T10:00"` passes `check-data`. The workflow's Python then does `datetime.fromisoformat(raw)` → naive datetime → `lo <= t` raises `TypeError: can't compare offset-naive and offset-aware datetimes`. The step runs under `bash -e`, so `DUE=$(python3 …)` aborts the job — every hourly run fails, no boundary rebuilds fire, the home hero shows the ended banner until the daily fallback. On the JS side, an offset-less datetime is parsed as the build machine's local time (UTC on Vercel, local on a dev machine): an 8 h shift, and `WUWA_BUILD_NOW` previews disagree with production. `nextVersion.launchAt` (read by both the workflow and `lib/data.ts`) is not validated at all.
- **Minimal fix:**
  ```js
  // check-data.mjs — timestamps must carry an offset; date-only stays a separate check
  const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;
  if (bannersFile.nextVersion?.launchAt && !isDate(bannersFile.nextVersion.launchAt)) err("banners.json nextVersion", "launchAt is not a date");
  ```
  ```python
  t = datetime.datetime.fromisoformat(raw)
  if t.tzinfo is None:  # never let one bad record kill the whole check
      print(f"::warning::{b['id']} {key} has no UTC offset: {raw}", file=sys.stderr)
      t = t.replace(tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
  ```

### H3 · HIGH · A malformed URL hash blanks `/outfits` and `/teams` (verified)
- **Location:** `app/outfits/Wardrobe.tsx:91`, `components/TeamsExplorer.tsx:67` (called from the mount effect at `:86`)
- **Trigger & failure:** open `/outfits#%E0%A4%A` or `/teams#%E0%A4%A`. `decodeURIComponent` throws `URIError: URI malformed` inside a `useEffect`; there is no `app/error.tsx`, so the whole page is replaced by Next's "This page couldn't load". Reproduced against the built `out/` export in a browser on 2026-11-23. Any shared or mistyped link triggers it.
- **Minimal fix:**
  ```ts
  // shared helper, used by both call sites
  export function hashId(): string {
    try { return decodeURIComponent(location.hash.slice(1)); } catch { return ""; }
  }
  ```
  Add a minimal `app/error.tsx` so any future client throw degrades to one section, not the whole page.

### H4 · HIGH (latent) · `/pre-farm/[slug]` route is gone but six places still link to it
- **Location:** `app/page.tsx:536`, `app/characters/[slug]/page.tsx:428` and `:667`, `app/pull-planner/page.tsx:390`, `app/version/page.tsx:321`, `app/sitemap.ts:28-33`. `app/pre-farm/` contains only `page.tsx`; `components/MaterialTable.tsx:9` still names the deleted `app/pre-farm/[slug]/page.tsx`.
- **Trigger & failure:** add any guide to `data/prefarm.json → guides` (currently `[]`) — the documented data-only workflow. The home "Plan ahead" card, the character page "Pre-farm guide" button, the pull planner, the version page and `sitemap.xml` all emit `/pre-farm/<slug>` links that 404. `check-data` skips dynamic segments and passes.
- **Minimal fix:** restore `app/pre-farm/[slug]/page.tsx` (`generateStaticParams` from `prefarmSlugs()`, `dynamicParams = false`), or point all six emitters at `/characters/${slug}#farming`. Then guard it:
  ```js
  // check-data.mjs
  const pf = readJson("data/prefarm.json").guides ?? [];
  if (pf.length && !exists("app/pre-farm/[slug]/page.tsx")) err("data/prefarm.json", "guides exist but app/pre-farm/[slug]/page.tsx does not");
  ```

### M1 · MEDIUM · Overlapping 3.8 phases; no overlap check
- **Location:** `data/banners.json:263` (`3.8-phase-1` ends `2026-12-03T09:59+08:00`) vs `:368` (`3.8-phase-2` starts `2026-12-03T04:00+08:00`); consumer `app/page.tsx:183` (`activeBanners[0]`)
- **Trigger & failure:** for 6 h on Dec 3 both phases are "active". The workflow fires a rebuild at the 04:00 boundary; that build bakes Phase 1 as the home hero (first in file order) with a countdown to 09:59 while Phase 2 is live, and lists two live banners elsewhere. Both dates are flagged estimates, but nothing catches the contradiction.
- **Minimal fix:** correct the data at the in-game notice, and add to `check-data.mjs`:
  ```js
  const byVer = new Map();
  for (const b of bannersFile.banners ?? []) byVer.set(b.version, [...(byVer.get(b.version) ?? []), b]);
  for (const list of byVer.values()) {
    list.sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
    for (let i = 1; i < list.length; i++)
      if (Date.parse(list[i].startsAt) < Date.parse(list[i - 1].endsAt)) err(`banners.json ${list[i].id}`, `starts before ${list[i - 1].id} ends`);
  }
  ```

### M2 · MEDIUM · Bad `WUWA_BUILD_NOW` builds a site where everything has ended
- **Location:** `lib/data.ts:201` (also `:168-170`)
- **Trigger & failure:** `WUWA_BUILD_NOW="Dec 22 noon" npm run build` → `Date.parse` → `NaN`. In `statusFromDates`, `NaN < s` and `NaN < e` are both false, so every dated banner and event becomes `"ended"`. The build succeeds with only the "No active banner" warning. Separately, `activeCodes` filters with `Date.now()`, not `BUILD_NOW`, so a preview of a future day still lists codes that will have expired by then.
- **Minimal fix:**
  ```ts
  const RAW_NOW = process.env.WUWA_BUILD_NOW;
  export const BUILD_NOW = RAW_NOW ? Date.parse(RAW_NOW) : Date.now();
  if (Number.isNaN(BUILD_NOW)) throw new Error(`[wuwa-today] WUWA_BUILD_NOW is not a date: ${RAW_NOW}`);
  // move this below BUILD_NOW and use it:
  export const activeCodes = allActiveCodes.filter((c) => !c.expiresAt || Number.isNaN(Date.parse(c.expiresAt)) || Date.parse(c.expiresAt) > BUILD_NOW);
  ```

### M3 · MEDIUM · Roster storage: cross-tab lost update and type confusion
- **Location:** `components/TeamsExplorer.tsx:96-134`, `components/TierExplorer.tsx:88-110` (shared key `wuwa-today:roster`)
- **Trigger & failure:** (a) `/teams` in tab 1 and `/tier-list` in tab 2. Mark Hsin owned in tab 1, then Lily in tab 2: tab 2 writes its stale in-memory set `{lily}` over storage, so Hsin is lost. No `storage` listener, no read-before-write. (b) A stored value that is valid JSON but not an array (e.g. `"hsin"`) becomes `new Set("hsin")` = `{h,s,i,n}`, with no error.
- **Minimal fix:** one shared `lib/roster.ts`:
  ```ts
  export function readRoster(): Set<string> {
    try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return new Set(Array.isArray(v) ? v.filter((x) => typeof x === "string") : []); } catch { return new Set(); }
  }
  export function toggleRoster(slug: string): Set<string> { const s = readRoster(); s.has(slug) ? s.delete(slug) : s.add(slug); try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch {} return s; }
  // in both explorers: setOwned(toggleRoster(slug)); and
  useEffect(() => { const on = (e: StorageEvent) => e.key === KEY && setOwned(readRoster()); addEventListener("storage", on); return () => removeEventListener("storage", on); }, []);
  ```

### M4 · MEDIUM · An unknown community tier ranks as the best tier, then crashes the tier list
- **Location:** `lib/tiers.ts:165`, `app/banners/page.tsx:56`, `components/TierExplorer.tsx:41` and `:135`
- **Trigger & failure:** `data/tier-list-prydwen.json` gains a key outside `PRYDWEN_TIERS` (e.g. `"T0+"`, `"SS"`). `indexOf` returns `-1`, which the three `reduce` copies treat as better than `T0`, so character pages and banner cards show it as the top placement. `TierExplorer` then hits `buckets.get(best.tier)!.push` → `TypeError` during prerender → the build fails. `check-data` never validates tier keys.
- **Minimal fix:** `const rank = (t: string) => { const i = PRYDWEN_TIERS.indexOf(t); return i < 0 ? Infinity : i; };` in one shared helper used by all three call sites, `buckets.get(best.tier)?.push(...)`, and a `check-data` loop that errors on unknown tier keys.

### M5 · MEDIUM · Unvalidated data shapes fail the build (site freezes on the last good deploy)
- **Location:** `app/banners/page.tsx:376` (`new URL(s)` unguarded; `app/outfits/page.tsx:53-58` guards the same call), `lib/renders.ts:37,45`, `app/characters/[slug]/page.tsx:362`
- **Trigger & failure:** a banner `sources` entry without a scheme (`"game8.co/…"`) throws `TypeError: Invalid URL` at prerender. A `renders.json` entry with `sizes: []` throws in `reduce` / `sizes[-1].file`. Each hourly hook then produces a failed deploy. Vercel keeps serving the previous build, so the site silently stops updating.
- **Minimal fix:** reuse the guarded `host()` from `app/outfits/page.tsx` in `banners/page.tsx`. Add to `check-data`: every `banners[].sources[]` and `codes.active[].verifiedBy[]` matches `/^https?:\/\//`; every `renders.json` entry has non-empty `sizes` whose files exist in `public/`.

### M6 · MEDIUM · `make-thumbs.mjs` writes non-atomically and trusts partial files
- **Location:** `scripts/make-thumbs.mjs:30-36` and `:41`
- **Trigger & failure:** (a) interrupting during `writeFile(MANIFEST)` leaves a truncated `data/renders.json`, and every build then fails at import. (b) Interrupting `sharp().toFile(out)` leaves a partial `.webp`; the next run sees `exists(out)` and skips it, and the broken file ships (or `metadata()` throws). (c) Replacing a source render keeps the old thumbnails forever (skip-if-exists), so the hub shows outdated art.
- **Minimal fix:** write to `out + ".tmp"` / `MANIFEST + ".tmp"`, then `fs.rename`. Regenerate when `(await stat(src)).mtimeMs > (await stat(out)).mtimeMs`.

### M7 · MEDIUM · Thumbnail scripts break under paths with spaces or non-ASCII characters
- **Location:** `scripts/make-thumbs.mjs:9`, `scripts/make-event-thumbs.mjs:10`, `scripts/make-outfit-thumbs.mjs:11`
- **Trigger & failure:** `new URL(import.meta.url).pathname` keeps percent-encoding. A checkout under e.g. `OneDrive - Org` resolves `ROOT` to `…OneDrive%20-%20Org…` → `ENOENT` on the first read. `check-data.mjs:26` already does this correctly.
- **Minimal fix:** `import { fileURLToPath } from "node:url"; const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");`

### M8 · MEDIUM · Pull planner drops the 3.8 Phase 2 headliner's portrait (live now)
- **Location:** `app/pull-planner/page.tsx:35` and `:85`
- **Trigger & failure:** banners.json writes `"Yangyang: Xuanling"`; the record name is `"Yangyang Xuanling"`. The planner uses an exact-name `Map`, so `slug` is `undefined` and `PhaseTrack` renders 3.8 Phase 2 without her medal. Every other page uses the loose `getCharacterByName`.
- **Minimal fix:** `const slug = getCharacterByName(c.name)?.slug;` and delete `slugByName`.

### M9 · MEDIUM · Workflow look-ahead can rebuild just before a boundary
- **Location:** `.github/workflows/rebuild-at-phase-boundaries.yml:39`
- **Trigger & failure:** `hi = now + 5 min`. A boundary at HH:08–HH:12 UTC is "due" at the HH:07 run. The hook fires, Vercel builds before the boundary, and bakes the old state. The correction comes from the next hourly run, so the page is ~1 h stale. GitHub cron delays make this window larger.
- **Minimal fix:** `hi = now` (never build before a boundary). Optionally run every 15 min (`"7,22,37,52 * * * *"`); duplicate hooks are harmless.

### M10 · MEDIUM (latent) · Home "next version" takeover is pinned to 4.0 constants
- **Location:** `app/page.tsx:196-209` and `:496-513`; `lib/v4-cast.ts:17-20`; `components/home/AmHero.tsx:55` and `:197-199`
- **Trigger & failure:** `showNext` keys off the generic `banners.json → nextVersion`, but the title, launch day, trailer, cast and "Seven new Resonators" copy come from hard-coded `V4_*`. When `nextVersion` moves to 4.1, the home page shows 4.0's title, cast and a Dec 22 countdown. `V4_LAUNCH_DAY` duplicates `nextVersion.launchAt`: `AmHero.launched` reads one and `versionNow()` the other, so editing one desynchronises "Out now" from the page kickers. `AmHero` also splits the title by word index (assumes ≥4 words).
- **Minimal fix:** `launchDay: nextVersion.launchAt!`, `title: nextVersion.title ?? \`Version ${nextVersion.version}\``; use the cast/trailer only when `nextVersion.version === "4.0"`; render the title as one string.

### M11 · MEDIUM · Event thumbnails are never validated
- **Location:** `components/EventsBoard.tsx:37`, `scripts/check-data.mjs:87`, `scripts/make-event-thumbs.mjs:26`
- **Trigger & failure:** adding an event without running `npm run thumbs:events` passes `check-data` and ships a broken `<img>` on the `/events` calendar. Images outside `/images/events/` (today: `hiyuki-accessory-flaming-sakura` → `/images/outfits/flaming-sakura.webp`) get no thumbnail (the string replace is a no-op), so the full-size outfit art downloads for a 96 px label. The script writes `thumbs/<basename>` while the component maps the full sub-path, so any image in a sub-folder 404s.
- **Minimal fix:** one shared `eventThumb(image)` used by both script and component (always `/images/events/thumbs/<basename>`). In `check-data`: `if (e.image && !publicFile(eventThumb(e.image))) err(w, "thumb missing — run npm run thumbs:events")`.

### Security & trust boundaries — checked, no exploitable finding
- `dangerouslySetInnerHTML` carries only constant strings: `app/layout.tsx:74-75`, `components/CdBoot.tsx:3`, the JSON-LD in `app/page.tsx:341` (no data interpolated).
- External `href`s from data (`app/banners/page.tsx:375`, `app/outfits/Wardrobe.tsx:512`, `app/tier-list/page.tsx:34`): React 19 neutralises `javascript:` URLs, and `rel="noopener noreferrer"` is set. Residual risk: no domain allowlist on agent-ingested source URLs (phishing link, not code execution).
- No secrets in tracked files. The deploy hook lives only in a GitHub secret; `.env*` and `.claude/` are gitignored; the workflow has `permissions: contents: read`. `actions/checkout@v4` is tag-pinned, not SHA-pinned (low).
- `lib/guides.ts:45 renderBody` escapes only `& < >` — safe for text nodes. It is dead code today; it would be unsafe if later used in an attribute context.

---

## Phase 3 — Structural debt

### Dead code and dead data
| Item | Evidence |
|---|---|
| `data/characters-roster.json` (21 KB) | No importer anywhere. |
| `data/guides.json` (114 KB) + `lib/guides.ts` `guides`, `getGuide`, `renderBody` | Only `type Team` is consumed (`app/beginner/first-teams/page.tsx:8`, `components/ObsidianTeamCard.tsx:2`). |
| `SiteTheme` schedule logic (`components/SiteTheme.tsx:24-49`) | Layout passes `slots={[]}` (`app/layout.tsx:85`). The timer branch can never run; it re-applies the fallback every 60 s. |
| Stored `status` in `banners.json` / `events.json` | Overridden by `statusFromDates`. The fallback path needs an unparsable `startsAt`, which `check-data` forbids. Misleading: events.json lists ended events as `"active"`. |
| `tier_badge.{tier,label,note}` in all 61 character files | Superseded by `lib/tiers.ts` (`:154-156`); only `.uncertain_or_prerelease` is still read. |
| Stale docs | `data/README.md` lists 3 files and a `/codes` page (now redirected), and says expired/excluded codes live in `codes.json` (they are in `codes-excluded.json`). `components/MaterialTable.tsx:9` names a deleted route. |

### Duplicated logic (each copy can drift)
- **Best-tier reduce:** 3 copies (`lib/tiers.ts:164`, `app/banners/page.tsx:52`, `components/TierExplorer.tsx:39`), all with the M4 `-1` bug.
- **Name → slug:** 5 strategies — `lib/characters.ts:169` loose, `lib/teams.ts:121` `teamSlug`, `lib/tiers.ts:69` + `SPECIAL`, `app/pull-planner/page.tsx:35` exact (M8), `app/page.tsx:72` weapon slugify.
- **Relative span:** `lib/dates.ts:91 formatSpan`, `components/home/AmTime.tsx:12 relSpan`, and `S()` in `lib/countdown-boot.ts`. They disagree under 1 minute (`"1m"` vs `"0m"`).
- **Reset math:** `lib/dates.ts:125-149` vs the minified copy in `lib/countdown-boot.ts`. They must stay identical (checked: equivalent today) or first paint and the first tick disagree.
- **Countdown digit math:** `RollingCountdown.parts`, `AmCountdown`, `LaunchCountdown.parts`, and the boot script.
- **Best echo set selection:** `app/characters/[slug]/page.tsx:264-276` and `:464-476` (the comment claims they "can never disagree").
- **Roster storage:** `TeamsExplorer.tsx:96-134` ≈ `TierExplorer.tsx:88-110`.
- **Server-day formatters:** `lib/dates.formatServerDay`, `app/page.tsx:55 SERVER_DAY`, `EventsBoard.tsx:80 shortDate`.
- **Redirects:** `next.config.js` and `vercel.json` (guarded by `check-data`, but still two hand-edited copies).
- **Render size order:** `lib/renders.ts` sorts; `app/characters/[slug]/page.tsx:362` indexes the raw (descending) array. It works only because the data happens to be descending.

### Coupling that will hit the next features (4.0 lands 2026-12-22)
1. **Home next-version slide ↔ `lib/v4-cast.ts`** (M10). Every version needs a code edit, not a data edit.
2. **Pull planner editorial copy is code:** `PLAN_VERSION = "3.8"`, `FIVE_STARS`, the four plans and the hard-coded `Availability` window (`app/pull-planner/page.tsx:30-32`, `:95-108`, `:307`). The 4.0 planner is a code rewrite.
3. **Character registry is two hand-kept lists:** an `import` plus an `ALL[]` entry per character (`lib/characters.ts:31-155`). `check-data` only verifies the import string, so a file that is imported but missing from `ALL` passes and has no page.
4. **`sitemap.ts:10` hand-lists static routes.** New pages (e.g. the coming 4.0 guides) are silently left out.
5. **Build-time state vs view-time state:** every page bakes `BUILD_NOW` decisions (hero, sections shown, `codes.length > 1`) and relies on the hourly workflow. Any new time-dependent surface must either use `useNow` or be added to the workflow's boundary list. Nothing enforces this.

---

## Phase 3 — Adversarial test matrix

No harness exists. Suggested: `node:test` + `child_process` for scripts and the workflow (zero dependencies); Vitest + jsdom + Testing Library for client components (`vite-tsconfig-paths` for the `@/` alias). Tests marked † fail on today's code; that is the point.

| # | Target | Input / mocked failure | Expected assertion |
|---|---|---|---|
| T1† | `check-data` offsets (H2) | Fixture copy of `data/` with `banners[3].endsAt = "2026-12-03T10:00"`, then separately `nextVersion.launchAt = "2026-12-22"` | Exit code 1; stderr contains `endsAt is not a date` / `launchAt is not a date` |
| T2† | Workflow boundary script (H2, M9) | Extract the Python to `scripts/boundary_due.py` with `BOUNDARY_NOW` env. Records: one `"2026-12-22"` (naive), one `endsAt = now − 10 min`, one `startsAt = now + 3 min` | Exit 0, no traceback; stdout lists only the `now − 10 min` record |
| T3† | `AmGlance` expiry (H1) | Codes `[{code:"A", expiresAt: now+60s}, {code:"B", expiresAt:null}]`; fake timers; advance 2 min | No button with text `A`; button `B` shown; label `Code` (count 1) |
| T4† | Hash parsing (H3) | jsdom `location.hash = "#%E0%A4%A"`; mount `<Wardrobe>` and `<TeamsExplorer>` | No throw; then `hash = "#" + firstOutfitId` + `hashchange` puts that outfit on the runway |
| T5† | `BUILD_NOW` (M2, M1) | Child process importing `lib/data.ts` with `WUWA_BUILD_NOW="not a date"`; then `"2026-12-03T05:00:00+08:00"` | First: throws `WUWA_BUILD_NOW is not a date`. Second: `activeBanners.map(b=>b.id)` deep-equals `["3.8-phase-2"]` (today: both phases) |
| T6† | Overlap validator (M1) | Fixture: phase 1 `endsAt 2026-12-03T09:59+08:00`, phase 2 `startsAt 2026-12-03T04:00+08:00`, same version | `check-data` exit 1; stderr `3.8-phase-2 … starts before 3.8-phase-1 ends` |
| T7† | Roster sync (M3) | Storage `'["hsin"]'`; mount `TierExplorer`; set storage to `'["hsin","iuno"]'` and dispatch `StorageEvent{key:"wuwa-today:roster"}`; toggle `lily`. Separately storage `'"hsin"'` | Stored JSON parses to the set `{hsin, iuno, lily}`; the string case yields 0 owned |
| T8† | Unknown tier (M4) | Prydwen fixture `{"Tower of Adversity":{"DPS":{"T0+":["Hsin"],"T1":["Hsin"]}}}` | `tierFor("hsin").community === "T1 DPS"`; `TierExplorer` renders without throwing; `check-data` errors on `T0+` |
| T9† | Pre-farm route integrity (H4) | `prefarm.json.guides = [{slug:"lily", …}]`; run `check-data`; after `next build`, scan `out/**/*.html` for `href="/pre-farm/…"` | `check-data` exit 1 while `app/pre-farm/[slug]/page.tsx` is missing; after the fix, every scanned href has a matching `out/pre-farm/<slug>.html` |
| T10† | `make-thumbs` atomicity (M6) | Run in a temp copy; `SIGKILL` the child right after the first `toFile` (poll for the output file), then re-run | `data/renders.json` still parses and deep-equals the original; no file at the final thumb path is smaller than a valid WebP header; the re-run regenerates it |

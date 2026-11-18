# WuWa Today — Design System ("Resonance", Aftermath look)

The site has one design system: **Resonance**, currently dressed in the
**Aftermath** look for the 4.0 era (Art Deco: champagne gold line work on
slate, a display serif, red kept rare). `app/aftermath.css` loads last and
re-points the Resonance tokens below; the home page's own components are in
`app/home.css` (`am-*` classes, `components/home/`). Older layers ("Native
Dark" in `app/globals.css`, "Obsidian Glass" in `app/obsidian.css` +
`app/og-pages.css`) are being folded in; **don't add new rules to those
files**. New work uses the tokens and components below.

## Principles

1. **Gold house accent, element on character pages.** `--el` (a registered
   `<color>`) is champagne gold (`#d9c49b`) site-wide, set in the root layout.
   Character pages re-tune it to their element (`ElementTheme`), and element
   colours still mark characters on cards and rings (`--c`, `--ec`). The
   **Gold only** appearance (`html[data-theme="dark"]`, `app/theme-dark.css`)
   locks `--el` to the house gold so character pages don't re-tint; it keeps
   the slate surfaces. That `!important` is intentional.
2. **Utility before atmosphere.** The first screen answers the visitor's
   question (what's live, how long, which build). Art supports the data; it
   never replaces it.
3. **No glass.** Every surface is solid, chrome included: the nav, search
   palette and sticky section rail use near-opaque slate
   (`--rs-canvas` at 97%) with a gold hairline, not `backdrop-filter` blur.
   Page bars still carrying blur (characters hub, teams, tier list, outfits,
   leaks) are being moved over page by page.
4. **Contrast ≥ 4.5:1** for all text. Every element colour sits at the same
   lightness, so the accent never changes legibility.
5. **Motion is gated** behind `prefers-reduced-motion`; blur degrades to solid
   under `prefers-reduced-transparency`. Never animate the LCP image in from
   invisible.
6. **Trust is visible.** Verified-on stamps sit next to the data they qualify;
   estimates and unconfirmed values are labelled, never hidden.

## Tokens (`app/resonance.css`, `:root, body.rs`)

| Group | Tokens |
|---|---|
| Canvas & surfaces | `--rs-canvas`, `--rs-surface`, `--rs-surface-2`, `--rs-line`, `--rs-line-soft` |
| Ink | `--rs-ink` (primary), `--rs-ink-2` (secondary, 9:1), `--rs-ink-3` (tertiary, 5.6:1) |
| Accent | `--el`, `--rs-el-soft`, `--rs-el-line`, `--rs-on-el` (text on an `--el` fill) |
| Status | `--rs-warn` (amber, deadlines inside 72h, e.g. expiring codes) |
| Character colour | `--c` on a component = that character's element |
| Type families | `--rs-display` (Cormorant: page and section titles), `--rs-body` and `--rs-mono` (Jost: everything you read and use, numbers with lining figures). Geist Mono (`--font-geist-mono`) only for record-style details, e.g. the home archive. h3 and smaller stay in Jost. |
| Type scale | `--fs-1` 11px · `--fs-2` 12px · `--fs-3` 13px · `--fs-4` 14px · `--fs-5` 15px · `--fs-6` 16px · `--fs-7` 18px |
| Spacing (4px grid) | `--sp-1` 4 · `--sp-2` 8 · `--sp-3` 12 · `--sp-4` 16 · `--sp-5` 24 · `--sp-6` 32 · `--sp-7` 48 · `--sp-8` 64 |
| Radius | 2px everywhere (`--rs-r-tile`, `--rs-r-card`, `--rs-r-ctl`); frames are gold hairlines with an inner keyline, rules are 3px double gold |
| Aftermath palette | slate `#15171d`, ivory `#e8e0d1`, gold `#b99b68` / `#d9c49b`, Atlantic `#233745`, burgundy `#762d3b`, crimson `#a32935` (rare: section diamonds, the archive, deadlines), cyan `#73c9d3` (live) |
| Motion | `--rs-spring`, `--rs-ease`, `--rs-d1` 180ms, `--rs-d2` 420ms, `--rs-d3` 700ms |

**Type rules.** Readable text never goes below `--fs-2` (12px). `--fs-1` is
only for uppercase mono labels and badges. Display sizes (page titles, banner
names) use `clamp()` and must fit a 320px screen (`overflow-wrap: anywhere` as
a safety net). Inputs are ≥ 16px so iOS doesn't zoom.

**Breakpoints.** 760px (phone/tablet layout switch) and 900px (nav: bottom
capsule ↔ full-width 64px top bar). Prefer these two. The home page stacks
its hero and grids below 700px instead, so wide-but-short screens (an
unfolded iPhone Duo, 890×626) keep the side-by-side layout; it was checked at
466×678, 669×951 and 890×626.

## Layout rules

- Grid/flex children that hold text get `min-width: 0`, and grid tracks use
  `minmax(0, 1fr)`, not `1fr` or implicit `auto`. Implicit tracks size to
  min-content, which is how most 320px overflow bugs happened.
- Decorative layers that bleed (glows, rings, grain) need `overflow-x: clip`
  on their container.
- Touch targets ≥ 44×44px.

## Components

| Component | Where | Notes |
|---|---|---|
| **Nav** | `components/ResonanceNav.tsx` | Phones: Today · Banners · Characters · Teams · More. Desktop: + Events, Tier List. Sections come from `lib/nav.ts` (also used by footer, More sheet, palette). Active pill lands on More when the page lives there. |
| **More sheet** | `components/MoreSheet.tsx` | Native `<dialog>`; every section grouped (Live / Characters & builds / Plan / Learn), search, appearance. |
| **Command palette** | `components/CommandPalette.tsx` | ⌘K / Ctrl+K / `/`. Pages inline; characters fetched from `/search-index.json` on first open. |
| **PageHero** | `components/PageHero.tsx` | Kicker + display title + lede for section pages. |
| **Kicker** | `.rs-kicker` | Mono, uppercase, `--el`. |
| **Button** | `.rs-btn`, `.rs-btn-solid` | Pill, 44px min height. |
| **Tile** | `.rs-tile` | Solid surface card. No pointer glow. |
| **CharPoster / CharMedal** | `components/CharThumb.tsx` | Head-cropped render via `--fx`/`--z`; `srcset` from `data/renders.json` (`thumbs`, generated by `npm run thumbs`). |
| **Countdown** | `components/RollingCountdown.tsx` | Reels are `aria-hidden`; a visually hidden sentence carries the value. One shared clock (`useNow`). |
| **Section rail / toolbar** | `components/ObsidianToolbar.tsx`, `section-rail.css` | Sticky in-page jump links. |
| **Unconfirmed badge** | `.rs-unconfirmed` | For values from early sources (e.g. `rewardsUnconfirmed` on events). Explain it in visible text near the list, not only in a `title` (touch has no hover). |
| **Local times** | `components/LocalTime.tsx` | `YourTime` / `LocalDate`: HTML carries server time (UTC+8); the viewer's zone takes over after hydration, labelled "your time". |
| **Home columns** | `.rs-today` > `.rs-col-main` / `.rs-col-side` | Independent columns on desktop; on phones they dissolve (`display: contents`) and each wrap's `order` sets the single-column sequence. |

## Not yet consolidated

Chips/pills still exist in several namespaces (`og-chip`, `ch-chip`,
`ev-chip`, `tl-pill`, `tm-pill`, `sr-pill`) and the legacy files still
re-point `--og-*` / `--bg` / `--gold` tokens to Resonance. Migrate a page at a
time (see `WEBSITE_IMPROVEMENT_PLAN.md`, P3-4 and P3-6) and screenshot-compare.

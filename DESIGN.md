# WuWa Today — Design System (the one direction)

Locked 2026-11-04 for the design-unification pass. This file is the law for
all UI work on this site: read it before touching CSS or TSX. If a value or
pattern isn't in here (or in the token block of `app/design.css`), add it
here first, then use the token — never introduce a one-off value in a
component.

## 1. Visual theme

**Obsidian Glass.** A daily Wuthering Waves dashboard read as a cinematic
game HUD: monumental monochrome on true black, glass only where the
browser-chrome would be glass, and gold rationed to the few moments that
are about *time*. The feel is SpaceX black-and-white restraint plus iOS
Liquid Glass chrome — never a game fan-wiki collage.

Dials (1–10): variance **4** (ordered, one surprise allowed: the beam),
motion **3** (state changes and one signature animation, nothing
decorative), density **7** (a working dashboard, not a gallery).

Signature element — the ONLY one: the golden border beam that travels the
edge of a best-in-slot card. Everything else stays quiet so the beam can
mean something.

Anti-defaults (banned): glass on content surfaces; blue or purple
anywhere; gradients as decoration; filled primary buttons; a second accent
colour; per-page furniture variations (pages differ in content, never in
furniture).

## 2. Colour palette & roles

Semantic roles only — components reference these tokens, never hex values.

| Token | Value | Role |
| --- | --- | --- |
| `--og-canvas` | `#000000` | page floor |
| `--og-surface` | `#101014` | solid content surface (cards, plates) |
| `--og-surface-raised` | `#1a1a20` | raised / inset on a surface |
| `--og-ink` | `#ffffff` | primary text (21:1 on canvas) |
| `--og-muted` | `#b6b6be` | secondary text (~9.4:1 on surface) |
| `--og-faint` | `#8e8e96` | captions, meta (≥4.5:1 on surface) |
| `--og-hairline` | `rgba(255,255,255,.10)` | card borders, strong dividers |
| `--og-hairline-soft` | `rgba(255,255,255,.05)` | quiet dividers |
| `--og-gold` | `#e8b44f` | time, countdowns, live, the beam, and small structural gold: kickers/eyebrows, active states, link hovers — never body text, never fills |
| `--og-gold-soft` | `rgba(232,180,79,.14)` | gold wash behind gold text |
| `--og-green` | `#30d158` | success state (e.g. a working code) |
| `--og-red` | `#ff453a` | expired / error state |
| `--og-glass` | `rgba(255,255,255,.08)` | chrome fill (nav, toolbar, HUD buttons) |
| `--og-glint` | `rgba(255,255,255,.35)` | specular top edge on glass |

Element colours and rarity colours are data, not theme: they live with the
data components that render them and never leak into chrome.

## 3. Typography

Three voices, each with one job:

- **Display** — Space Grotesk 500/600/700, uppercase, tight tracking
  (`--og-display`). Headings, titles, big numbers' labels. Never body text.
- **Body** — Source Sans 3 400/600/700 (`--og-body`). A real shipped font
  (loaded via next/font), never the visitor's system stack. Everything
  readable: ledes, blurbs, card text, prose.
- **Data** — ui-monospace stack (`--og-mono`), tabular. Countdown digits,
  meta lines, micro-captions (10–11px uppercase, letterspaced — the game's
  own HUD voice).

Type scale (size / line-height): display-1 2.6rem/1.04 · title 2rem/1.1 ·
h2 1.35rem/1.2 · h3 1.05rem/1.3 · body 1rem/1.55 · small .875rem/1.5 ·
caption .72rem/1.4 · micro .66rem/1.3 (mono only).

## 4. Components (the whole set — no others)

- **Page hero** (`OgPageHero`): kicker (structural gold) → display title
  → lede (body, muted, ≤62ch) → optional meta row. Every index page opens
  with it. Two sanctioned variants only: the Home showcase panel (same
  type, art behind glass) and the character-detail portrait hero.
  Heading voice: hub and guide pages speak in plain, friendly sentences
  ("New to Solaris-3?"); data-dense pages keep short noun titles
  ("Characters", "Tier List"). One voice per page kind, never mixed
  mid-page. (Existing page titles are content — they migrate to this
  voice only when their copy is next edited, not silently.)
- **Section head** (`ObsidianSectionHead`): display h2 + optional blurb +
  optional "view all" link, hairline divider under. Identical everywhere.
- **Card**: one shell — `--og-surface` fill, 1px `--og-hairline` border,
  `--og-radius-card`, padding from the spacing scale, hover = border
  brightens one step (no lift, no scale). Banner, event, pick, role, team,
  echo-plate, verdict and stat cards are layouts inside this shell, not
  different cards.
- **Badge**: one pill shell (mono micro or small sans, pill radius,
  hairline border, surface-raised fill). Tones: neutral (default), gold
  (time/live only), green, red, dim. Count chips, BiS pills, usage pills
  and tier badges are this badge with a tone — same metrics everywhere.
- **Button** (`ObsidianButton`): ghost (1px white border, transparent) is
  the primary voice; glass is the HUD/chrome variant. Pill radius, 44px
  minimum target. No filled primaries.
- **Portrait tile** (`ObsidianCharTile`): identical geometry for every
  character — radius from token, art carries the colour, mono micro
  captions (element · weapon) under the name. The roster grid is a uniform
  mosaic; no per-tile chrome variation.
- **Divider**: a 1px hairline rule is the section separator everywhere —
  never a card border doing a divider's job, never a gradient fade.

## 5. Layout

Content measure 1080px, centred. Spacing scale (tokens only):
`--og-space-1` 4 · `2` 8 · `3` 12 · `4` 16 · `5` 24 · `6` 32 ·
`--og-space-section` 3.5rem between sections. Radius scale:
`--og-radius-sm` 10 · `--og-radius-card` 16 · `--og-radius-lg` 20 ·
`--og-radius-pill` 999. Grids: uniform tiles, 1rem gaps, auto-fit.

## 6. Depth & elevation

Flat by default. Depth comes from the hairline and the surface step
(canvas → surface → surface-raised), never from drop shadows on content.
Glass + its soft shadow belong to chrome only (nav capsule, toolbar,
scroll-top, HUD buttons). The beam is the single animated elevation cue.

## 7. Motion

Ease-out `cubic-bezier(.22,1,.36,1)`; durations `--og-d1` 160ms (state),
`--og-d2` 320ms (entrances). Animate transform/opacity only. Scroll reveal
is a one-time fade-rise (`.rv` + IntersectionObserver), disabled under
`prefers-reduced-motion`. No bounce, no hover-scale, no infinite loops
except the beam's travel and a live dot's pulse.

## 8. Do / Don't

- Do: one hero pattern, one card shell, one badge, one button; gold only
  for time/live/beam; check text contrast ≥4.5:1 on its actual surface.
- Don't: invent a per-page heading style; put glass behind content; use
  gold for decoration or "premium" flavour; ship a font stack that falls
  back to the visitor's system font for body text; add a component that
  isn't in §4 without adding it here first.

## 9. Responsive

One fluid layout, ~382px folded to wide desktop: no breakpoint-specific
furniture, grids auto-fit, the nav capsule respects safe-area insets,
44px targets at every width.

*History: replaces the three-era stack (globals.css "Native Dark" +
obsidian.css + og-pages.css, two token sets, ~3,230 lines) with the single
`app/design.css` on 2026-11-04.*

## 10. Reference — wuwabuild.com (Tom's pick, 2026-11-04)

A WuWa builds/guides site whose look Tom likes. Studied, never copied.
Adopted: gold as a visible brand thread in small structural places
(kickers, markers, hovers) instead of time-only; element colours as the
sanctioned colour inside content (dots, chips, tile meta); editorial card
anatomy (kicker row with category + freshness + date → bold title →
two-line excerpt → one action); a distinct title font with mono
micro-labels (we already speak this: Space Grotesk + mono).
Deliberately NOT adopted: their blue-tinted navy canvas (ours stays pure
black — the monochrome is our identity), gold as a flood colour, and any
of their components or wording.

## 11. Reference — wavekit.net (Tom's pick, 2026-11-04)

A WuWa team-helper site Tom pointed at the same day. Studied, never
copied. Adopted: plain friendly sentence headlines as the hub/guide
voice (§4); numbered steps (mono 01/02/03) sanctioned for REAL step
sequences only, like the beginner path — never as decoration; freshness
shown proudly (updated stamps and meta rows — already our pattern, now
a stated rule: every hub answers "is this fresh?" in its hero meta row).
Considered and answered: their deep navy canvas — our tint already lives
in the surface token (`#101014` carries the cool cast); the canvas stays
pure black. Not adopted: their tool-first homepage shape (a design-only
pass does not change what our pages are for) and their teal brand colour.

# WuWa Today — design: the wuwabuild reference

On 2026-11-04 Tom rejected three in-house directions in one day
(Resonance, the Author's Register, the vermilion Fresh Start) and
ordered the method changed: follow a real site's look closely.
Reference chosen by Tom: **wuwabuild.com** — "I like this one."

This branch rebuilds the site in that site's design language,
measured from its published stylesheet and markup. Values below
are theirs; every rule in `app/style.css` is written for this
site's own markup and data. No assets, copy, or code were taken.

## Tokens (from the reference's :root)

- Ground `--bg #07090d`; surfaces `#0d1117 / #111720 / #161e2c`
- Glass fills `rgba(255,255,255,.04)`, bright `.07`
- Lines `rgba(255,255,255,.08)`, bright `.14`
- Text `#f3f5f7`, sub `#b8c4d4`, muted `#8e99ab`
- Accent periwinkle `#8fb2ff` (dim `.55`, glow `.22`)
- Gold only for rarity stars and event rewards
- Radii: 16px cards, 10px small, 7px chips, pills round
- Motion: `cubic-bezier(.22,1,.36,1)`, 300–450ms hovers, soft
  accent-glow shadows — no scroll animations

## Type

- Inter for everything; page titles are Inter **light**, uppercase,
  tracking .10em, ~2rem — quiet, not poster-sized
- Bebas Neue for the wordmark, the home hero headline, and section
  heads (17–21px, tracking .10em, uppercase)
- IBM Plex Mono for data stamps and numbers

## Chrome

- Desktop: fixed left sidebar, 220px — Bebas wordmark (accent +
  white) over a hairline, grouped nav with 9px tracked section
  labels, icon + label rows (rounded 8px, active = bright glass +
  accent icon), search pill + beginner link at the foot
- Mobile: 56px sticky top bar (letterspaced wordmark, glass icon
  buttons) + slide-in drawer with the same nav
- Content column max 1240px, generous section spacing

## Components in their language

- Home: compact CENTERED hero (8px tracked eyebrow, Bebas
  headline, one data-composed summary, accent + glass pills),
  featured banner card full width with the countdown in a glass
  pill over the art, then the usual sections as glass cards
- Characters: quiet page hero, element pill row, resonator cards
  (portrait, name, element · weapon, stars) grouped by element;
  portraits are cropped to the top ~69% so the wiki files'
  baked-in name band and rarity strip never show
- Character pages: glass hero panel (portrait, Bebas name, glass
  pill badges), verdict card with an accent edge, Bebas section
  heads, all build blocks as glass panels
- Everything else (banners, events, codes, tier list, planner,
  pre-farm, glossary) restyled through the same tokens

## Not copied

Their intro loader, their 3D-tilted logo gimmick, their content,
their icons. Layout ideas and the token system only.

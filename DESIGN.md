# WuWa Today — design

Written from a blank file on 2026-11-04, on Tom's order: complete
fresh start, same data, no carried-over design ideas, tokens, or
colors. `app/style.css` is the only stylesheet.

## The system

- **Ground:** near-black `#0b0b0d`; panels `#131316`; hairlines at
  13% white; thick 2px warm-white rules under page and section
  titles.
- **Ink:** warm white `#f4f1ea`; muted `#a7a49b`; faint `#6f6d66`.
- **Accent:** vermilion `#ff4b26` — the only accent. It marks the
  current nav section, the live states, the featured countdown
  strip, best-in-slot and top-tier markers, and hovers. Gold is
  reserved for 5-star rarity, element colors only as data labels.
- **Type:** Archivo (900 display, uppercase, tight; 400–700 text),
  IBM Plex Mono for every number, label, and dateline.
- **Shape:** 2px corners everywhere; bordered mono labels instead
  of filled badges; no glass, no tints, no beams, no page
  transitions, no scroll animations.

## Layouts follow the content

- **Home** is a front page: mono dateline, a three-line poster
  headline ("Today in Wuthering Waves"), a one-line summary written
  from live data, the featured banner with its countdown in a
  vermilion strip across the foot of the art, then a two-column
  index (events + what's next | codes + resets).
- **Characters** is a gapless mosaic of square portraits with solid
  name plates, grouped by element behind a mono anchor bar.
  Portraits are scaled from the top so their baked name band and
  arch corners crop out of the square.
- **Character pages** open with the name at poster scale beside the
  captioned portrait, pull verdict first among the sections.
- **Banners** lead with the live banner full-width; history is a
  ruled table.
- **Navigation** is a solid top masthead: two-tone wordmark, text
  links (current section vermilion with an underline bar), search.

Component DOM kept its `og-` class hooks from earlier systems; every
rule those hooks resolve to lives in `app/style.css` and nowhere
else. Two class-name traps found while restyling: `og-seq-rail` is
the aim-order *list* (not a line) and `og-char-chip` means a ruled
row inside banner cards but a text pill inside tier chips — the
stylesheet scopes both.

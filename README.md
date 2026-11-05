# WuWa Today

An unofficial, fan-made daily dashboard for **Wuthering Waves**: live banners with countdowns, verified redeem codes, active events, reset timers, character builds, tier lists, and plain-words guides.

**Live site:** https://wuwa-today.vercel.app

## What's on the site

- **Today** — current banners, working codes, and events ending soon, at a glance
- **Banners** — featured and standard convenes with phase timelines and live countdowns
- **Events** — what's live now and what's closing first
- **Characters** — builds, ranked weapons, echo sets, stat priorities, teams, and a pull verdict for every Resonator
- **Tier List** — community consensus rankings alongside the site's own take
- **Echo Sets** — every set's 2-pc / 5-pc bonuses, member echoes, and where to farm them
- **Pre-Farm** — material checklists for upcoming characters
- **Pull Planner** — work out whether a banner is worth your pulls
- **Beginner guides** — the start-here path, convene explained, first teams, common mistakes
- **Glossary** — the game's jargon in plain words

## Data & trust rules

- **Two-source rule:** a redeem code is listed as working only when two independent sources confirm it, or Kuro Games announces it. Single-source codes are held in an excluded list, with the reason recorded.
- **Estimates are labelled:** banner phase dates that come from community trackers are marked "estimated" in the UI. Leaks are never presented as fact.
- **No invented data.** If a number isn't verified, it doesn't ship — unknown fields are omitted or marked uncertain.
- The sources behind every dataset are recorded in `data/SOURCES.md`.

## Tech

- Next.js 16 + React 19, exported as a fully static site
- Content is data-driven: pages render from the JSON files in `data/`, so content updates are data edits, not code changes
- The design system is documented in `DESIGN.md`

## Project structure

```
app/          # pages (App Router) and the single stylesheet
components/   # cards, countdowns, navigation, search palette
lib/          # data loading, types, helpers
data/         # all game data as JSON — schemas in data/README.md
public/       # images and static assets
scripts/      # data tooling (search index generation)
```

## Disclaimer

WuWa Today is an unofficial fan project. Wuthering Waves is a trademark of Kuro Games. This site is not affiliated with or endorsed by Kuro Games.

# WuWa Today

An unofficial, fan-made daily dashboard for **Wuthering Waves**: live banners with countdowns, verified redeem codes, active events, reset timers, character builds, tier lists, and plain-words guides.

**Live site:** [wuwa-today.vercel.app](https://wuwa-today.vercel.app)

## What's on the site

- **Today** — current banners, working codes, and events ending soon, at a glance
- **Banners** — featured and standard convenes with phase timelines, live countdowns, and the Reverb selector convenes with pool-by-pool pull advice
- **Events** — what's live now, what's closing first, and what's coming up
- **Characters** — builds, ranked weapons, echo sets, stat priorities, materials, teams, sequence priorities, and a pull verdict for every Resonator
- **Teams** — proven team compositions for Tower of Adversity and Whimpering Wastes, refreshed each cycle
- **Tier List** — community consensus rankings alongside the site's own take, split by game mode and role
- **Echo Sets** — every set's 2-pc / 5-pc bonuses, member echoes, and where to farm them
- **Outfits & Cosmetics** — the full wardrobe of Resonator outfits and weapon appearances, with how each one is obtained
- **Version Overview** — what the current version added, plus a launch checklist when a new version lands
- **Pre-Farm** — material checklists for upcoming characters
- **Pull Planner** — work out whether a banner is worth your pulls
- **Beginner guides** — the start-here path, convene explained, first teams, common mistakes
- **Glossary** — the game's jargon in plain words

## Data & trust rules

- **Two-source rule:** a redeem code is listed as working only when two independent sources confirm it, or Kuro Games announces it. Single-source codes are held in an excluded list, with the reason recorded.
- **Estimates are labelled:** banner phase dates that come from community trackers are marked "estimated" in the UI. Leaks are never presented as fact.
- **No invented data.** If a number isn't verified, it doesn't ship — unknown fields are omitted or marked uncertain.
- New characters are re-checked against the live game at launch before their pages lose any pre-release labels.
- The sources behind every dataset are recorded in `data/SOURCES.md`.

## Tech

- Next.js 16 + React 19 + TypeScript, exported as a fully static site
- Content is data-driven: pages render from the JSON files in `data/`, so content updates are data edits, not code changes
- The design system is documented in `DESIGN.md`

## Project structure

```
app/          # pages (App Router) and page styles
components/   # cards, countdowns, navigation, search palette, explorers
lib/          # data loading, types, helpers
data/         # all game data as JSON — schemas in data/README.md
public/       # images and static assets
scripts/      # image tooling (thumbnail generation)
```

## Disclaimer

WuWa Today is an unofficial fan project. Wuthering Waves is a trademark of Kuro Games. This site is not affiliated with or endorsed by Kuro Games.

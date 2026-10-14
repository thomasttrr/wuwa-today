# Sources

Every fact in `data/` was checked against these sources on **2026-10-13**. Source URLs are also stored per-record in the JSON files.

## Banners (Version 3.7)

- https://gurugamer.com/pc-console/wuthering-waves-3-7-banner-value-guide-27328 — Phase 1/2 lineups, dates, weapons, login-event tides, Moonlit Path selector
- https://fandomwire.com/wuthering-waves-reveals-hsin-suoming-version-3-7/ — officially confirmed 3.7 banners (Hsin/Suoming + reruns) from the special program
- https://themagicrain.com/2026/10/wuthering-waves-version-3-7-prisms-illusion-hearts-illumination-now-available/ — Phase 2 begins Oct 22 (server time); Phase 1 = Hsin/Chisa/Iuno
- https://fandomwire.com/all-upcoming-wuthering-waves-3-7-banners/ — pre-release banner estimates (used for cross-checking dates only)
- https://club.jollymax.com/wuthering-waves-3-7-update/ — version contents: new area, permanent event, free tides

Known uncertainty: the third Phase 2 4-star rate-up is Chixia per most sources; one source lists Yangyang. Flagged in `banners.json` (`uncertainFields`). Phase boundary dates are community-tracker estimates (~Oct 21–22, ~Nov 10–12).

## Redeem codes

Verified active (2+ sources each):
- `WUTHERINGGIFT` — confirmed active Oct 12–13, 2026 by: shanethegamer.com, axeetech.com, urgametips.com, gachago.com, topuplive.com, beebom.com, lootbar.com, levelgeeks.net, game8.co. Standing public code, no announced expiry.

Verified expired (multiple sources agree):
- `FALLINGSANCTUM`, `FINDSENTINEL`, `WAKINGMOON` — 3.7 livestream codes, expired Sept 21, 2026
- `HEARTOFSWORD`, `ETERNALFLAME`, `THEANSWER` — 3.6 codes, expired Aug 9, 2026
- `WUWA4PC`, `F5F4D3B2A2` — 3.5 / collab codes, expired

Deliberately excluded (see `codes.json` → `excluded` for reasons):
- `DVME2MOHOQJT` — single source (beebom.com)
- `STARRYSTAGE2`, `KEEPONSHINING` — single source (axeetech.com), expiry window already passed
- `DARKSIDE`, `RABBITHOLE`, `RUNEREADER` — one stale source lists active, multiple others list expired

## Events

- https://www.morganyte.com/wuthering-waves-artisans-search-event-offers-astrite-rewards/ — Artisan's Search: Oct 8–26, 2026
- https://gurugamer.com/pc-console/wuthering-waves-3-7-banner-value-guide-27328 — 3.7 login events (Radiant/Lustrous Tides), Moonlit Path 5★ selector (Carlotta / Shorekeeper / Phoebe at 980-ring tier)
- https://club.jollymax.com/wuthering-waves-3-7-update/ — "Blooms for the Shadow" permanent event, 10 Radiant Tides login rewards

## Redemption instructions

In-game only (no verified global web redemption page): Terminal menu → Settings → Other Settings → Redemption Code. Requires Union Level 2. Rewards arrive via in-game mail.

## Images

All artwork is official Kuro Games art (splash art and full sprites as released for each Resonator), sourced from the Wuthering Waves Wiki gallery pages, which host the official assets. Downloaded 2026-10-14 into `site/public/images/`, converted to WebP for web delivery. No hotlinking — all files served locally.

| File | Depicts | Source page | Direct file URL |
|---|---|---|---|
| `hsin-splash.webp` | Hsin splash art | https://wutheringwaves.fandom.com/wiki/Hsin/Gallery | https://static.wikia.nocookie.net/wutheringwaves/images/c/cb/Hsin_Splash_Art.png |
| `hsin-sprite.webp` | Hsin full sprite | https://wutheringwaves.fandom.com/wiki/Hsin/Gallery | https://static.wikia.nocookie.net/wutheringwaves/images/0/08/Hsin_Full_Sprite.png |
| `iuno-sprite.webp` | Iuno full sprite | https://wutheringwaves.fandom.com/wiki/Iuno/Gallery | https://static.wikia.nocookie.net/wutheringwaves/images/2/20/Iuno_Full_Sprite.png |
| `chisa-sprite.webp` | Chisa full sprite | https://wutheringwaves.fandom.com/wiki/Chisa/Gallery | https://static.wikia.nocookie.net/wutheringwaves/images/8/8a/Chisa_Full_Sprite.png |
| `suoming-splash.webp` | Suoming splash art (upcoming Phase 2) | https://wutheringwaves.fandom.com/wiki/Suoming/Gallery | https://static.wikia.nocookie.net/wutheringwaves/images/f/f9/Suoming_Splash_Art.png |

Hsin's splash art was also officially revealed by Kuro Games on the official Wuthering Waves X account (@Wuthering_Waves), August 26, 2026. Art credit "Kuro Games" is shown under each banner card that uses splash art.

Deliberately not added: event-section artwork (no official event key art found on the wiki for the current events — skipped rather than guessing); 4-star rate-up character sprites (Buling, Taoqi, Youhu) to keep the initial image set focused on the 5-star headliners.

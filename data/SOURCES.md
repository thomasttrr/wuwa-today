# Sources

Every fact in `data/` was checked against these sources. Banner/code data last checked on **2026-10-14**; event schedule refreshed on **2026-10-14** (midday). Source URLs are also stored per-record in the JSON files.

## Banners (Version 3.7)

- https://gurugamer.com/pc-console/wuthering-waves-3-7-banner-value-guide-27328 — Phase 1/2 lineups, dates, weapons, login-event tides, Moonlit Path selector
- https://fandomwire.com/wuthering-waves-reveals-hsin-suoming-version-3-7/ — officially confirmed 3.7 banners (Hsin/Suoming + reruns) from the special program
- https://themagicrain.com/2026/10/wuthering-waves-version-3-7-prisms-illusion-hearts-illumination-now-available/ — Phase 2 begins Oct 22 (server time); Phase 1 = Hsin/Chisa/Iuno
- https://fandomwire.com/all-upcoming-wuthering-waves-3-7-banners/ — pre-release banner estimates (used for cross-checking dates only)
- https://club.jollymax.com/wuthering-waves-3-7-update/ — version contents: new area, permanent event, free tides

Known uncertainty: the third Phase 2 4-star rate-up is Chixia per most sources; one source lists Yangyang. Flagged in `banners.json` (`uncertainFields`). Phase boundary dates are community-tracker estimates (~Oct 21–22, ~Nov 10–12).

## Guides (published 2026-10-14)

All 8 guides were drafted from research verified against at least 2 independent sources each (official program/patch notes preferred for pre-release content). Verdicts are editorial opinion, labeled as such in each guide authorNote field.

- Hsin pull guide: special-program reveal coverage, community kit analysis
- Iuno pull guide: kit analysis plus community tier lists at the 3.7 rerun
- Chisa pull guide: official 2.8 patch notes, GamerOrg, EarlyGame, LDShop blog, Gurugamer 3.7 banner-value guide
- Suoming pull guide: officially revealed kit info plus community pre-release analysis (explicitly labeled pre-release; numbers may change at launch)
- Lynae pull guide: Gurugamer 3.7 banner-value guide, Nerdschalk, DTGre, Game8
- Lucilla pull guide: 3.4 debut coverage plus 3.7 banner-value comparisons
- Hsin build guide: TheGamersCut, Game8, PocketTactics, AllThingsHow, Gurugamer, Sportskeeda, MemuPlay, Wuthering Wiki, Slyraf, Keygold
- Hsin team guide: kit synergy analysis plus community testing

Role corrections applied to banners.json during this batch (roles verified against sources, contradicting our prior labels):
- Chisa: Main DPS to Support / Sub-DPS (LDShop blog, Buffget, Sportskeeda, Gurugamer)
- Lynae: Main DPS to Sub-DPS / Support (Nerdschalk, DTGre, Game8)
- Lucilla: Main DPS to Sub-DPS / Support (2-source kit research)

Removed the unverified term Fractal Proliferation from the Hsin pull guide: no source used the term; replaced with the verified two-Resonance-Modes framing.
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

2026-10-14 re-check: no new codes. WUTHERINGGIFT still the only verified active code (confirmed by urgametips.com, gachago.com, axeetech.com, shanethegamer.com, lootbar.com, topuplive.com). Excluded set unchanged.

## Events

- https://www.morganyte.com/wuthering-waves-artisans-search-event-offers-astrite-rewards/ — Artisan's Search: Oct 8–26, 2026 (also mentions Echo Erase Oct 22, Beyond the Waves Oct 29, Cubie Wars / Dreams in the Capsule longer windows)
- https://gurugamer.com/pc-console/wuthering-waves-3-7-banner-value-guide-27328 — 3.7 login events (Radiant/Lustrous Tides), Moonlit Path 5★ selector (Carlotta / Shorekeeper / Phoebe at 980-ring tier)
- https://club.jollymax.com/wuthering-waves-3-7-update/ — "Blooms for the Shadow" permanent event, 10 Radiant Tides login rewards

## Events (refreshed 2026-10-14)

Full 3.7 event calendar added, from the official Version 3.7 patch notes as reported by coverage plus Game8's event schedule:
- https://www.sportskeeda.com/esports/wuwa-3-7-patch-notes-wuthering-waves-new-characters-location-events — official 3.7 patch notes content: Cubie Wars, Dreams in the Capsule, Past Dreams Traced Seals, Artisan's Search, Echo Erase, Beyond the Waves: Land of Xuanfang, Gifts of Waking Moon (exact server times)
- https://openrss.org/wutheringwaves.kurogames.com/en/main — mirror of the official Kuro Games news feed (crawled 2026-10-13): confirms event times, Gifts of Singing Drizzle rewards (Radiant Tide x5 + Premium Tuner x100 at 1 day; Radiant Tide x5 + Crystal Solvent x5 at 3 days)
- https://finalweapon.net/2026/09/19/wuthering-waves-version-3-7-prisms-illusion-hearts-illumination-release-date/ — release-date writeup: Gifts of Singing Drizzle 10 Radiant Tides total, Back to Solaris / Waking Moon Fishing web events
- http://game8.co/games/wuthering-waves/archives/453473 — Game8 event schedule (updated 2026-10-09): current + upcoming events with dates (Bountiful Crescendo Oct 15–22, Waking Moon Fishing Oct 15–Nov 1, Chord Cleansing Nov 4–11)
- https://game8.co/games/Wuthering-Waves/archives/484720 — Game8 Beyond the Waves guide: event rewards (Astrite, Lustrous Tide, Crystal Solvent, Premium Tuner)
- https://earlygg.com/news/wuthering-waves-battle-rush-event-rewards-rules — Battle Rush community contest (Sep 30–Oct 28, Astrite x2,000 + 10x $50 Amazon gift cards)

## Events (refreshed 2026-10-14, midday)

- https://game8.co/games/Wuthering-Waves/archives/456482 — Ascendant Aces event guide (character trials for the current banners, Sep 30 – Nov 11; Phase 2 trial roster lists Suoming, Lynae, Lucilla, Lumi, Chixia, Danjin — corroborates Chixia as the third Phase 2 4★ rate-up, resolving the Chixia-vs-Yangyang question in `banners.json`)
- http://game8.co/games/wuthering-waves/archives/453473 — Game8 event schedule (re-checked 2026-10-14): Ascendant Aces confirmed on the current calendar; no other new events since the morning check

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

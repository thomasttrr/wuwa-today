# Update Playbook

How WuWa Today stays fresh. This is the runbook for Kit's scheduled refresh jobs — every procedure is a data-file edit plus a rebuild. No code changes.

## 1. Daily code check (every morning)

**Goal:** catch new codes within hours, retire dead ones the same day.

1. Check 2–3 aggregator sources (current rotation in `data/SOURCES.md`) for the code list.
2. For each code listed as "active":
   - **Verified by ≥2 independent sources (or 1 official Kuro post)?** → add to `data/codes.json → active` with `rewards`, `expiresAt` (or `null`), `addedAt`, `verifiedBy` URLs.
   - **Only one source?** → add to `excluded` with the reason. Do NOT publish.
3. For each code in `active` that sources now list as expired → move it to `expired` with `expiredAt` and a note.
4. Bump `data/codes.json → _meta.updatedAt` to now.
5. Add any new verification sources to `data/SOURCES.md`.
6. Rebuild/redeploy.

**Trust rule (non-negotiable):** publishing an unverified or fake code destroys reader trust permanently. When in doubt, leave it out and note why in `excluded`.

## 2. Banner flip (~every 3 weeks)

**Goal:** the home page is never showing a dead banner.

1. When a phase ends (watch the countdown + community trackers):
   - Move the ended phase: `status` → `"ended"` in `banners`, and add a row to `history`.
   - Add the new phase as `"active"`; the previous `"upcoming"` entry becomes the source of truth — verify its lineup against the in-game Convene notice and fix anything the leaks got wrong (especially the 4-star rate-ups).
   - Add the newly announced next phase as `"upcoming"`, labeled with `timeNote` that dates are estimates.
2. Publish a new pull guide in `data/guides.json` for the new featured 5-star (copy the schema from the Hsin sample; verdict is editorial opinion and must read like one).
3. Bump `_meta.updatedAt` in `banners.json` and `guides.json`; update `SOURCES.md`.
4. Rebuild/redeploy.

## 3. Patch update (~every 6 weeks)

**Goal:** version-level refresh + newsletter.

1. Update `data/banners.json → _meta` (`version`, `versionTitle`).
2. Refresh `data/events.json`: retire ended events (`status` → `"ended"`, or remove), add new ones.
3. New redeem codes from the version livestream go through the **daily code check** procedure (they usually expire in ~2–3 days — speed matters).
4. Draft the patch digest newsletter ("what actually changed in 3 minutes") → **Tom approves before sending**. Never auto-send.
5. Bump all `_meta.updatedAt`; update `SOURCES.md`.
6. Rebuild/redeploy.

## 4. Weekly sanity pass (optional, 5 min)

- Home page countdowns pointing at past dates → a phase flip was missed; run procedure 2.
- `active` codes older than 30 days with no re-verification → re-check or move to `expired`.
- Broken source links in `SOURCES.md` → replace.

## Emergency: wrong data published

1. Fix the JSON immediately, rebuild.
2. If a code was published that doesn't work, add a correction note — don't silently delete; readers may have already tried it.

## What Tom approves vs. what runs automatically

- **Automatic:** code checks, banner/event data refreshes, rebuilds.
- **Needs Tom:** newsletter sends, monetization changes (affiliate links, sponsors), design changes, anything involving money or accounts.

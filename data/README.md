# Data layer — how content updates work

All game data lives in three JSON files. **Updating the site = editing these files. No code changes needed.** The site rebuilds (or revalidates) and the new data appears everywhere automatically.

## Files

| File | What it holds | Page(s) that read it |
|---|---|---|
| `banners.json` | Banner phases: characters, weapons, dates, confidence | `/`, `/banners` |
| `codes.json` | Active + expired redeem codes | `/`, `/codes` |
| `events.json` | Active + upcoming events | `/`, `/events` |

`SOURCES.md` (this folder) lists every source used to verify the current data.

## Schema

### banners.json
```jsonc
{
  "_meta": { "version": "3.7", "versionTitle": "...", "updatedAt": "ISO-8601", "comment": "..." },
  "banners": [
    {
      "id": "3.7-phase-1",          // unique, stable
      "version": "3.7",
      "phase": "Phase 1",
      "status": "active | upcoming | ended",  // drives home page + /banners sections
      "startsAt": "2026-09-30T10:00:00+08:00", // ISO-8601 with offset
      "endsAt": "2026-10-22T04:00:00+08:00",
      "timeNote": "human note when a date is estimated",
      "confidence": "high | medium | low",
      "uncertainFields": ["..."],   // optional: which fields are shaky
      "characters": [
        { "name": "Hsin", "rarity": 5, "element": "Electro", "weaponType": "Rectifier",
          "status": "new | rerun | rate-up", "isNew": true, "role": "Main DPS" }
      ],
      "weapons": [
        { "name": "Blooming Jadehaven", "rarity": 5, "type": "Rectifier", "featuredFor": "Hsin" }
      ],
      "sources": ["https://..."]
    }
  ],
  "history": [ { "id", "version", "phase", "startsAt", "endsAt", "note" } ]
}
```

### codes.json
```jsonc
{
  "_meta": { "updatedAt": "ISO-8601", "comment": "..." },
  "active": [
    { "code": "WUTHERINGGIFT",
      "rewards": "human-readable reward string",
      "expiresAt": "ISO-8601 | null",   // null = no announced expiry
      "addedAt": "2024-05-23",
      "verifiedBy": ["https://...", "https://..."],  // >= 2 sources, or 1 official post
      "notes": "..." }
  ],
  "expired": [ { "code": "...", "expiredAt": "2026-09-21", "notes": "..." } ],
  "excluded": [ { "code": "...", "reason": "why it was left out (single source, likely expired, ...)" } ]
}
```

**The two-source rule:** a code goes in `active` only if it is verified by at least two independent aggregator sources checked on `updatedAt`, or by one official Kuro Games post. Anything else goes in `excluded` with the reason. This is the trust contract with readers — see `UPDATE_PLAYBOOK.md`.

### events.json
```jsonc
{
  "_meta": { "updatedAt": "ISO-8601", "comment": "..." },
  "events": [
    { "id": "artisans-search",
      "name": "Artisan's Search",
      "type": "limited | login | spending | permanent | web",
      "status": "active | upcoming | ended",
      "startsAt": "ISO-8601", "endsAt": "ISO-8601 | null",
      "timeNote": "human note when a date is estimated",
      "description": "...", "rewards": "..." }
  ]
}
```

## Update workflow (details in `../UPDATE_PLAYBOOK.md`)

1. Edit the JSON (keep ISO-8601 dates with timezone offsets).
2. Bump `_meta.updatedAt` to now.
3. If you verified against sources, add them to `SOURCES.md`.
4. Commit + push (or just save) — the site rebuild picks it up. Nothing else to touch.

## Conventions

- Dates: ISO-8601 **with** timezone offset (server time is UTC+8; countdowns convert automatically).
- Estimates: always add `timeNote` and list the field in `uncertainFields`. The UI surfaces these as "estimated" badges.
- Never invent data. If a field is unknown, omit it or mark it uncertain — the components handle missing fields gracefully.

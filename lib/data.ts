import bannersRaw from "../data/banners.json";
import codesRaw from "../data/codes.json";
import eventsRaw from "../data/events.json";

export type BannerStatus = "active" | "upcoming" | "ended";
export type CharacterStatus = "new" | "rerun" | "rate-up";

export interface GameCharacter {
  name: string;
  rarity: 4 | 5;
  element: string;
  weaponType: string;
  status: CharacterStatus;
  isNew?: boolean;
  role?: string;
  /** Local path to the character's official full-sprite art, e.g. "/images/hsin-sprite.webp". */
  sprite?: string;
}

export interface BannerWeapon {
  name: string;
  rarity: 5;
  type: string;
  featuredFor: string;
}

export interface Banner {
  id: string;
  version: string;
  phase: string;
  status: BannerStatus;
  startsAt: string;
  endsAt: string;
  timeNote?: string;
  confidence?: "high" | "medium" | "low";
  uncertainFields?: string[];
  characters: GameCharacter[];
  weapons: BannerWeapon[];
  sources: string[];
  /** Local path to official key/splash art used as the card backdrop, e.g. "/images/hsin-splash.webp". */
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
}

export interface BannerHistoryEntry {
  id: string;
  version: string;
  phase: string;
  startsAt: string;
  endsAt: string;
  note: string;
}

export interface RedeemCode {
  code: string;
  rewards: string;
  expiresAt: string | null;
  addedAt?: string;
  verifiedBy?: string[];
  notes?: string;
}

export type EventType = "limited" | "login" | "spending" | "permanent" | "web";
export type EventStatus = "active" | "upcoming" | "ended";

export interface GameEvent {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  startsAt: string;
  endsAt: string | null;
  timeNote?: string;
  description: string;
  rewards: string;
}

export const banners = (bannersRaw as { banners: Banner[] }).banners;
export const bannerHistory = (bannersRaw as { history: BannerHistoryEntry[] }).history;
export const bannerMeta = (bannersRaw as { _meta: { version: string; versionTitle: string; updatedAt: string } })._meta;

export const activeCodes = (codesRaw as { active: RedeemCode[] }).active;
export const codesMeta = (codesRaw as { _meta: { updatedAt: string } })._meta;

export const events = (eventsRaw as { events: GameEvent[] }).events;
export const eventsMeta = (eventsRaw as { _meta: { updatedAt: string } })._meta;

export const activeBanners = banners.filter((b) => b.status === "active");
export const upcomingBanners = banners.filter((b) => b.status === "upcoming");
export const activeEvents = events
  .filter((e) => e.status === "active")
  .sort((a, b) => {
    if (!a.endsAt) return 1;
    if (!b.endsAt) return -1;
    return a.endsAt < b.endsAt ? -1 : 1;
  });
export const upcomingEvents = events.filter((e) => e.status === "upcoming");

/** Site-wide "last verified" stamp: the most recent data-file update. */
export function dataUpdatedAt(): string {
  const stamps = [bannerMeta.updatedAt, codesMeta.updatedAt, eventsMeta.updatedAt];
  return stamps.sort().reverse()[0];
}

// ---------------------------------------------------------------------------
// Pure date/format helpers live in lib/dates.ts so client components can
// import them without pulling the JSON-backed data above into the browser
// bundle. Re-exported here so every existing lib/data import keeps working.
// ---------------------------------------------------------------------------
export {
  formatDate,
  formatDateWithNote,
  SERVER_TIME_ZONE,
  formatServerDate,
  formatServerDateWithNote,
  SERVER_OPTIONS,
  nextDailyReset,
  nextWeeklyReset,
} from "./dates";
export type { ServerOption } from "./dates";

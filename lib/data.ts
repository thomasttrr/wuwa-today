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

/** Confirmed facts about the next version before its banners are announced. */
export interface NextVersion {
  version: string;
  expectedCharacter: string;
  characterSlug: string;
  prefarmSlug: string;
  /** ISO time of the preview broadcast. */
  revealAt: string;
  /** Human label for revealAt, e.g. "Fri Nov 6, 6:00 AM ET". */
  revealLabel: string;
  /** ISO time after which the homepage strip auto-hides. */
  hideAfter: string;
}

export interface RedeemCode {
  code: string;
  rewards: string;
  expiresAt: string | null;
  addedAt?: string;
  verifiedBy?: string[];
  notes?: string;
}

export type EventType =
  | "limited"
  | "login"
  | "spending"
  | "permanent"
  | "web"
  | "leisure"
  | "exploration"
  | "community"
  | "trial";
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
  /** Rewards come from early coverage, not the in-game notice yet. */
  rewardsUnconfirmed?: boolean;
}

export const banners = (bannersRaw as { banners: Banner[] }).banners;
export const bannerHistory = (bannersRaw as { history: BannerHistoryEntry[] }).history;
export const bannerMeta = (bannersRaw as { _meta: { version: string; versionTitle: string; updatedAt: string } })._meta;

// Codes whose announced expiry has passed are dropped at build time so a stale
// JSON file never advertises a dead code (codes without an expiry stay).
const allActiveCodes = (codesRaw as { active: RedeemCode[] }).active;
export const nextVersion: NextVersion | null =
  (bannersRaw as { nextVersion?: NextVersion }).nextVersion ?? null;

export const activeCodes = allActiveCodes.filter(
  (c) => !c.expiresAt || Number.isNaN(Date.parse(c.expiresAt)) || Date.parse(c.expiresAt) > Date.now(),
);
export const codesMeta = (codesRaw as { _meta: { updatedAt: string } })._meta;

export const events = (eventsRaw as { events: GameEvent[] }).events;
export const eventsMeta = (eventsRaw as { _meta: { updatedAt: string } })._meta;

// Status comes from the dates at build time, not the stored `status` field:
// the stored field only changes when someone edits the JSON, so a phase that
// ends between data updates would otherwise stay "live" on the site. The
// stored value is the fallback only when a record has no usable dates.
const BUILD_NOW = Date.now();
function statusFromDates<T extends { startsAt: string; endsAt: string | null; status: string }>(x: T): string {
  const s = Date.parse(x.startsAt);
  const e = x.endsAt ? Date.parse(x.endsAt) : null;
  if (Number.isNaN(s)) return x.status;
  if (BUILD_NOW < s) return "upcoming";
  if (e === null) return "active";
  return BUILD_NOW < e ? "active" : "ended";
}

export const activeBanners = banners.filter((b) => statusFromDates(b) === "active");
if (activeBanners.length === 0) {
  // The home hero, banners page and accent colour are decided at build time.
  // See UPDATE_PLAYBOOK.md ("Scheduled redeploys") — rebuild at each phase boundary.
  console.warn("[wuwa-today] No active banner at build time — the home hero will use fallback art.");
}
export const upcomingBanners = banners.filter((b) => statusFromDates(b) === "upcoming");
export const activeEvents = events
  .filter((e) => statusFromDates(e) === "active")
  .sort((a, b) => {
    if (!a.endsAt) return 1;
    if (!b.endsAt) return -1;
    return Date.parse(a.endsAt) - Date.parse(b.endsAt);
  });
export const upcomingEvents = events.filter((e) => statusFromDates(e) === "upcoming");

function newest(stamps: string[]): string {
  return stamps.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a));
}

/** Banner/event "last verified" stamp: the most recent of the two files. */
export function dataUpdatedAt(): string {
  return newest([bannerMeta.updatedAt, eventsMeta.updatedAt]);
}

/** When the redeem-code list was last verified (tracked separately — it ages faster). */
export function codesUpdatedAt(): string {
  return codesMeta.updatedAt;
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

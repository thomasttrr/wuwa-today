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

export interface ExpiredCode {
  code: string;
  expiredAt?: string;
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
export const expiredCodes = (codesRaw as { expired: ExpiredCode[] }).expired;
export const codesMeta = (codesRaw as { _meta: { updatedAt: string } })._meta;

export const events = (eventsRaw as { events: GameEvent[] }).events;
export const eventsMeta = (eventsRaw as { _meta: { updatedAt: string } })._meta;

export const activeBanners = banners.filter((b) => b.status === "active");
export const upcomingBanners = banners.filter((b) => b.status === "upcoming");
export const activeEvents = events.filter((e) => e.status === "active");
export const upcomingEvents = events.filter((e) => e.status === "upcoming");

/** Site-wide "last verified" stamp: the most recent data-file update. */
export function dataUpdatedAt(): string {
  const stamps = [bannerMeta.updatedAt, codesMeta.updatedAt, eventsMeta.updatedAt];
  return stamps.sort().reverse()[0];
}

/** Format an ISO date for display, e.g. "Oct 22, 2026". */
export function formatDate(iso: string | null): string {
  if (!iso) return "No expiry announced";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Format an ISO date + note, e.g. "Oct 22, 2026 (estimated)". */
export function formatDateWithNote(iso: string | null, note?: string): string {
  const base = formatDate(iso);
  return note ? `${base} — ${note}` : base;
}

// ---------------------------------------------------------------------------
// Reset timers. WuWa resets daily at 04:00 server time. Server offsets (hours
// from UTC): America -5, Europe +1, Asia/TW/HK/MO +8, (SEA servers vary).
// ---------------------------------------------------------------------------

export interface ServerOption {
  id: string;
  label: string;
  offsetHours: number;
}

export const SERVER_OPTIONS: ServerOption[] = [
  { id: "america", label: "America", offsetHours: -5 },
  { id: "europe", label: "Europe", offsetHours: 1 },
  { id: "asia", label: "Asia / TW / HK / MO", offsetHours: 8 },
];

/** Next daily reset (04:00 server time) as a Date. */
export function nextDailyReset(offsetHours: number, now = new Date()): Date {
  const serverNow = new Date(now.getTime() + offsetHours * 3600_000);
  const reset = new Date(serverNow);
  reset.setUTCHours(4, 0, 0, 0);
  if (reset.getTime() <= serverNow.getTime()) {
    reset.setUTCDate(reset.getUTCDate() + 1);
  }
  // Convert back from "server wall clock treated as UTC" to a real instant.
  return new Date(reset.getTime() - offsetHours * 3600_000);
}

/** Next weekly reset: Monday 04:00 server time. */
export function nextWeeklyReset(offsetHours: number, now = new Date()): Date {
  const serverNow = new Date(now.getTime() + offsetHours * 3600_000);
  const reset = new Date(serverNow);
  // Days until Monday (UTC day math on the shifted clock)
  const day = reset.getUTCDay(); // 0 = Sunday
  const daysUntilMonday = (8 - day) % 7;
  reset.setUTCDate(reset.getUTCDate() + daysUntilMonday);
  reset.setUTCHours(4, 0, 0, 0);
  if (reset.getTime() <= serverNow.getTime()) {
    reset.setUTCDate(reset.getUTCDate() + 7);
  }
  return new Date(reset.getTime() - offsetHours * 3600_000);
}

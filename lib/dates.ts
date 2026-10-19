/**
 * lib/dates.ts — pure date/format helpers with ZERO JSON imports.
 *
 * Client components (ResetTimers, EventCard, …) import from here instead of
 * lib/data.ts, so the ~20KB of banners/codes/events JSON that lib/data.ts
 * pulls in never ships in their client JS. lib/data.ts re-exports every
 * helper below, so all server-component imports keep working untouched.
 */

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

/** Server time zone for the game's Asia/TW/HK/MO servers (UTC+8, no DST). */
export const SERVER_TIME_ZONE = "Asia/Shanghai";

/**
 * Format a game date in server time, e.g. "Oct 26, 2026".
 * Game dates are authored in server time, so they must be pinned to the
 * server zone — rendering in the viewer's timezone shifts them by a day.
 */
export function formatServerDate(iso: string | null): string {
  if (!iso) return "No expiry announced";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: SERVER_TIME_ZONE,
  });
}

/** Format a game date in server time + note, e.g. "Oct 26, 2026 (estimated)". */
export function formatServerDateWithNote(iso: string | null, note?: string): string {
  const base = formatServerDate(iso);
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

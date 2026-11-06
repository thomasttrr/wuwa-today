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

/** Game date + time in server time, 24h, e.g. "Nov 11, 04:00". */
export function formatServerDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: SERVER_TIME_ZONE,
  });
}

/** Short game date in server time, no year, e.g. "Nov 12". */
export function formatServerDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: SERVER_TIME_ZONE });
}

/**
 * The viewer's own wall clock, e.g. "Tue, Nov 10, 3:00 PM EST".
 * Client-only: the static export has no idea where the viewer is, so call
 * this after hydration (useNow() !== null) and render a server-time
 * fallback before that.
 */
export function formatLocalDateTime(iso: string | Date): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** The viewer's local date, e.g. "Nov 6, 2026". Client-only (see above). */
export function formatLocalDate(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** The viewer's local time of day, e.g. "9:00 AM" or "Mon 9:00 AM". Client-only. */
export function formatLocalTime(iso: string | Date, withWeekday = false): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    ...(withWeekday ? { weekday: "short" as const } : {}),
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Compact span for relative labels: "1d 15h", "4h 12m", "12m". */
export function formatSpan(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 60_000));
  const d = Math.floor(total / 1440);
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  if (d > 0) return h ? `${d}d ${h}h` : `${d}d`;
  if (h > 0) return m ? `${h}h ${m}m` : `${h}h`;
  return `${Math.max(1, m)}m`;
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

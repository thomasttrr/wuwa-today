"use client";

import useNow from "./useNow";
import { formatLocalDate, formatLocalDateTime } from "../lib/dates";

/*
 * Viewer-local times for a static page. The export is built once, with no
 * idea where the visitor is, so the server render shows the authored
 * server-time text (`fallback`) and the visitor's own clock takes over after
 * hydration. useNow() is null during hydration, which keeps the first client
 * render identical to the HTML.
 */

/** " · Tue, Nov 10, 3:00 PM EST your time", rendered only once the clock is known. */
export function YourTime({ iso, prefix = " · " }: { iso: string; prefix?: string }) {
  const now = useNow(60_000);
  if (!now) return null;
  return (
    <>
      {prefix}
      <time dateTime={iso}>{formatLocalDateTime(iso)}</time> your time
    </>
  );
}

/** A date in the viewer's zone, falling back to the server-time date before hydration. */
export function LocalDate({ iso, fallback }: { iso: string; fallback: string }) {
  const now = useNow(60_000);
  return <time dateTime={iso}>{now ? formatLocalDate(iso) : fallback}</time>;
}

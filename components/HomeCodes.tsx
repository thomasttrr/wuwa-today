"use client";

import CopyButton from "./CopyButton";
import useNow from "./useNow";
import { formatLocalDate, formatLocalDateTime, formatServerDate, formatSpan } from "../lib/dates";
import type { RedeemCode } from "../lib/data";

/** Codes inside this window get the "expires soon" treatment. */
const SOON_MS = 72 * 3_600_000;

/**
 * Homepage redeem-code tile. Codes arrive sorted soonest-expiry first.
 *
 * The page is a static export, so a code can expire while the HTML is still
 * being served: the list re-filters on the shared clock and drops a code the
 * moment its announced expiry passes. Expiry and "verified" times switch to
 * relative + viewer-local text after hydration; before that (and in the
 * HTML) they show the server-time date.
 */
export default function HomeCodes({
  codes,
  updatedAt,
  builtAt,
  title = "Redeem codes",
  headingId = "codes-h",
  emptyText = "No verified working codes right now.",
}: {
  codes: Pick<RedeemCode, "code" | "rewards" | "expiresAt">[];
  updatedAt: string;
  builtAt: number;
  title?: string;
  headingId?: string;
  emptyText?: string;
}) {
  const clock = useNow(60_000);
  const now = clock ? clock.getTime() : builtAt;
  const live = codes.filter((c) => !c.expiresAt || Date.parse(c.expiresAt) > now);

  return (
    <>
      <header className="rs-tile-head">
        <h2 id={headingId}>{title}</h2>
        <span className="rs-count" aria-label={`${live.length} working codes`}>
          {live.length}
        </span>
      </header>
      <p className="rs-verified">
        Verified{" "}
        <time dateTime={updatedAt} title={clock ? formatLocalDateTime(updatedAt) : undefined}>
          {clock ? `${formatSpan(now - Date.parse(updatedAt))} ago (${formatLocalDate(updatedAt)})` : formatServerDate(updatedAt)}
        </time>{" "}
        · two sources or official
      </p>
      {live.length === 0 ? (
        <p className="rs-muted">{emptyText}</p>
      ) : (
        <ul className="rs-codes">
          {live.map((c) => {
            const left = c.expiresAt ? Date.parse(c.expiresAt) - now : null;
            const soon = left !== null && left < SOON_MS;
            return (
              <li key={c.code} className={soon ? "is-soon" : undefined}>
                <div>
                  <span className="rs-code">{c.code}</span>
                  <span className="rs-code-rewards">{c.rewards}</span>
                  <span className="rs-code-exp">
                    {!c.expiresAt ? (
                      "No expiry announced"
                    ) : clock && left !== null ? (
                      <>
                        {soon && <span className="rs-soon-tag">Expires soon</span>}
                        <span>
                          {soon ? "In" : "Expires in"} {formatSpan(left)} ·{" "}
                          <time dateTime={c.expiresAt}>{formatLocalDateTime(c.expiresAt)}</time>
                        </span>
                      </>
                    ) : (
                      `Expires ${formatServerDate(c.expiresAt)}`
                    )}
                  </span>
                </div>
                <CopyButton text={c.code} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

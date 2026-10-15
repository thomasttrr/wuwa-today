import CopyButton from "./CopyButton";
import ObsidianCountdown from "./ObsidianCountdown";
import { formatServerDate, type RedeemCode } from "../lib/data";

/**
 * Obsidian code row. Solid #101014 surface; code value in mono;
 * expiry is time, so it gets gold; "no expiry" stays neutral.
 */
export default function CodeRow({ code }: { code: RedeemCode }) {
  return (
    <article className="og-code-row" aria-label={`Redeem code ${code.code}`}>
      <div className="og-code-top">
        <span className="og-code-value">{code.code}</span>
        <CopyButton text={code.code} />
        {code.expiresAt ? (
          <span className="og-badge og-badge-gold">
            Expires {formatServerDate(code.expiresAt)}
          </span>
        ) : (
          <span className="og-badge">No expiry announced</span>
        )}
      </div>
      <p className="og-code-meta">{code.rewards}</p>
      {code.expiresAt && (
        <ObsidianCountdown target={code.expiresAt} label="Time left" />
      )}
      {code.notes && <p className="og-code-meta">{code.notes}</p>}
    </article>
  );
}

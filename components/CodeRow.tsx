import CopyButton from "./CopyButton";
import Countdown from "./Countdown";
import { formatServerDate, type RedeemCode } from "../lib/data";

export default function CodeRow({ code }: { code: RedeemCode }) {
  return (
    <article className="code-row-item" aria-label={`Redeem code ${code.code}`}>
      <div className="code-row">
        <span className="code-value">{code.code}</span>
        <CopyButton text={code.code} />
        {code.expiresAt ? (
          <span className="badge red">Expires {formatServerDate(code.expiresAt)}</span>
        ) : (
          <span className="badge green">No expiry announced</span>
        )}
      </div>
      <p className="code-meta">{code.rewards}</p>
      {code.expiresAt && (
        <Countdown target={code.expiresAt} label="Time left" />
      )}
      {code.notes && <p className="code-meta">{code.notes}</p>}
    </article>
  );
}

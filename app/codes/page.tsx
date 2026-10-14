import type { Metadata } from "next";
import CodeRow from "../../components/CodeRow";
import Reveal from "../../components/Reveal";
import ShareButton from "../../components/ShareButton";
import UpdatedStamp from "../../components/UpdatedStamp";
import { activeCodes, expiredCodes, formatServerDate } from "../../lib/data";

export const metadata: Metadata = {
  title: "Wuthering Waves Redeem Codes — Working Codes (October 2026)",
  description:
    "Every working Wuthering Waves redeem code, verified against multiple sources, with rewards and one-tap copy. Expired codes listed so you don't waste time.",
};

export default function CodesPage() {
  return (
    <>
      <h1>Wuthering Waves redeem codes</h1>
      <p className="lede">
        Every code below was verified working by at least two independent
        sources on the check date. Redeem in-game: Terminal → Settings → Other
        Settings → Redemption Code (requires Union Level 2). Rewards arrive via
        in-game mail.
      </p>
      <div className="page-meta-row">
        <UpdatedStamp />
        <ShareButton />
      </div>

      <h2>Working codes</h2>
      {activeCodes.length === 0 ? (
        <p>No verified working codes right now — check back after the next livestream.</p>
      ) : (
        <div className="grid">
          {activeCodes.map((c, i) => (
            <Reveal key={c.code} delay={Math.min(i, 3) * 60}>
              <CodeRow code={c} />
            </Reveal>
          ))}
        </div>
      )}

      <h2>Expired codes</h2>
      <p className="lede">
        Listed so you don&apos;t waste time trying them. Moved here the day they&apos;re
        confirmed dead.
      </p>
      <div className="table-scroll">
      <table className="data">
        <thead>
          <tr>
            <th>Code</th>
            <th>Expired</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {expiredCodes.map((c) => (
            <tr key={c.code}>
              <td className="mono">{c.code}</td>
              <td>{c.expiredAt ? formatServerDate(c.expiredAt) : "—"}</td>
              <td>{c.notes ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}

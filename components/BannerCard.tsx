import Countdown from "./Countdown";
import { formatDateWithNote, type Banner } from "../lib/data";

function stars(rarity: number): string {
  return "★".repeat(rarity);
}

export default function BannerCard({ banner, showCountdown = true }: { banner: Banner; showCountdown?: boolean }) {
  const fiveStars = banner.characters.filter((c) => c.rarity === 5);
  const fourStars = banner.characters.filter((c) => c.rarity === 4);

  return (
    <article className="card" aria-label={`${banner.version} ${banner.phase} banner`}>
      <div>
        <span className="badge gold">{banner.version}</span>
        <span className="badge">{banner.phase}</span>
        {banner.status === "active" ? (
          <span className="badge green">Live now</span>
        ) : (
          <span className="badge purple">Upcoming</span>
        )}
        {banner.timeNote && <span className="badge dim">Dates estimated</span>}
      </div>
      <h3 style={{ marginTop: "0.6rem" }}>
        {fiveStars
          .map((c) => `${c.name}${c.isNew ? " (NEW)" : ""}`)
          .join(" · ")}
      </h3>
      {showCountdown && <Countdown target={banner.endsAt} label={`${banner.status === "active" ? "Ends" : "Starts"} ${formatDateWithNote(banner.status === "active" ? banner.endsAt : banner.startsAt, banner.timeNote)}`} />}
      <ul className="char-list">
        {fiveStars.map((c) => (
          <li key={c.name}>
            <span className="stars" aria-label={`${c.rarity} star`}>{stars(c.rarity)}</span>
            <strong>{c.name}</strong>
            <span style={{ color: "var(--text-dim)" }}>
              {c.element} {c.weaponType}
              {c.role ? ` — ${c.role}` : ""}
            </span>
            {c.status === "new" ? (
              <span className="badge gold">New</span>
            ) : (
              <span className="badge dim">Rerun</span>
            )}
          </li>
        ))}
        {fourStars.map((c) => (
          <li key={c.name}>
            <span className="stars" aria-label={`${c.rarity} star`}>{stars(c.rarity)}</span>
            {c.name}
            <span style={{ color: "var(--text-dim)" }}>
              {c.element} {c.weaponType}
            </span>
            <span className="badge dim">Rate-up</span>
          </li>
        ))}
      </ul>
      {banner.weapons.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.95rem", color: "var(--text-dim)" }}>Featured weapons</h3>
          <ul className="weapon-list">
            {banner.weapons.map((w) => (
              <li key={w.name}>
                <span className="stars" aria-label="5 star">{stars(w.rarity)}</span>
                {w.name}
                <span style={{ color: "var(--text-dim)" }}>
                  {w.type} — for {w.featuredFor}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
}

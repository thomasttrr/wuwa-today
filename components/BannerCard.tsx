import Countdown from "./Countdown";
import PhaseRail from "./PhaseRail";
import ArtCardSheen from "./ArtCardSheen";
import {
  formatServerDateWithNote,
  type Banner,
  type GameCharacter,
  type GameEvent,
} from "../lib/data";

function stars(rarity: number): string {
  return "★".repeat(rarity);
}

function CharacterChip({ c }: { c: GameCharacter }) {
  return (
    <li className="char-chip">
      {c.sprite && (
        <img
          src={c.sprite}
          alt={`${c.name} official character art`}
          loading="lazy"
          width={96}
          height={96}
        />
      )}
      <div className="char-chip-body">
        <div className="char-chip-name">
          <span className="stars" aria-label={`${c.rarity} star`}>
            {stars(c.rarity)}
          </span>{" "}
          <strong>{c.name}</strong>
          {c.status === "new" ? (
            <span className="badge gold">New</span>
          ) : c.status === "rerun" ? (
            <span className="badge dim">Rerun</span>
          ) : (
            <span className="badge dim">Rate-up</span>
          )}
        </div>
        <div className="char-chip-sub">
          {c.element} {c.weaponType}
          {c.role ? ` — ${c.role}` : ""}
        </div>
      </div>
    </li>
  );
}

export default function BannerCard({
  banner,
  showCountdown = true,
  featured = false,
  events = [],
  priority = false,
}: {
  banner: Banner;
  showCountdown?: boolean;
  featured?: boolean;
  events?: GameEvent[];
  priority?: boolean;
}) {
  const fiveStars = banner.characters.filter((c) => c.rarity === 5);
  const fourStars = banner.characters.filter((c) => c.rarity === 4);

  return (
    <ArtCardSheen label={`${banner.version} ${banner.phase} banner`}>
      {banner.image && (
        <img
          className="banner-art-bg"
          src={banner.image}
          alt=""
          aria-hidden="true"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
        />
      )}
      <div className="banner-art-content">
        <div>
          <span className="badge dim">{banner.version}</span>
          <span className="badge dim">{banner.phase}</span>
          {banner.status === "active" ? (
            <span className="badge live">Live now</span>
          ) : (
            <span className="badge dim">Upcoming</span>
          )}
          {banner.timeNote && <span className="badge dim">Dates estimated</span>}
        </div>
        <h3 className="banner-headline">
          {fiveStars.map((c) => c.name).join(" · ")}
        </h3>
        {showCountdown && (
          <Countdown
            target={banner.endsAt}
            label={`${banner.status === "active" ? "Ends" : "Starts"} ${formatServerDateWithNote(
              banner.status === "active" ? banner.endsAt : banner.startsAt,
              banner.timeNote
            )}`}
          />
        )}
        {featured && banner.status === "active" && (
          <PhaseRail
            startsAt={banner.startsAt}
            endsAt={banner.endsAt}
            events={events}
          />
        )}
        <ul className="char-chip-list">
          {fiveStars.map((c) => (
            <CharacterChip key={c.name} c={c} />
          ))}
        </ul>
        {fourStars.length > 0 && (
          <p className="four-star-line">
            <span className="stars" aria-label="4 star">
              {stars(4)}
            </span>{" "}
            {fourStars.map((c) => c.name).join(" · ")}{" "}
            <span className="badge dim">Rate-up</span>
          </p>
        )}
        {banner.weapons.length > 0 && (
          <p className="weapon-line">
            <strong>Featured weapons:</strong>{" "}
            {banner.weapons
              .map((w) => `${w.name} (${w.type} — ${w.featuredFor})`)
              .join(" · ")}
          </p>
        )}
        {banner.imageCredit && (
          <p className="img-credit">{banner.imageCredit}</p>
        )}
      </div>
    </ArtCardSheen>
  );
}

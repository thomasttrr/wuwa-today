import ObsidianCountdown from "./ObsidianCountdown";
import PhaseRail from "./PhaseRail";
import Image from "next/image";
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
    <li className="og-char-chip">
      {c.sprite && (
        <Image
          src={c.sprite}
          alt={`${c.name} official character art`}
          loading="lazy"
          width={96}
          height={96}
        />
      )}
      <div className="og-char-chip-body">
        <div className="og-char-chip-name">
          <span className="og-stars" aria-label={`${c.rarity} star`}>
            {stars(c.rarity)}
          </span>{" "}
          <strong>{c.name}</strong>
          {c.status === "new" ? (
            <span className="og-badge">New</span>
          ) : c.status === "rerun" ? (
            <span className="og-badge">Rerun</span>
          ) : (
            <span className="og-badge">Rate-up</span>
          )}
        </div>
        <div className="og-char-chip-sub">
          {c.element} {c.weaponType}
          {c.role ? ` — ${c.role}` : ""}
        </div>
      </div>
    </li>
  );
}

/**
 * Obsidian banner card. Solid #101014 content surface (never glass): the
 * key art is a fixed 16/9 strip on top that melts into the surface via a
 * monochrome fade; countdown is gold mono tabular with digit-roll
 * (gold because it is time); the phase rail stays for the featured card.
 */
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
    <article
      className={`og-banner-card${featured ? " og-banner-card-featured" : ""}`}
      aria-label={`${banner.version} ${banner.phase} banner`}
    >
      {banner.image && (
        <div className="og-banner-art">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative key-art strip: next/image's wrapper spans would break the fade-mask styling, and images are unoptimized in this static export so next/image adds nothing. */}
          <img
            src={banner.image}
            alt=""
            aria-hidden="true"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
          />
        </div>
      )}
      <div className="og-banner-body">
        <div className="og-badge-row">
          <span className="og-badge">{banner.version}</span>
          <span className="og-badge">{banner.phase}</span>
          {banner.status === "active" ? (
            <span className="og-live">Live now</span>
          ) : (
            <span className="og-badge">Upcoming</span>
          )}
          {banner.timeNote && (
            <span className="og-badge">Dates estimated</span>
          )}
        </div>
        <h3 className="og-banner-headline">
          {fiveStars.map((c) => c.name).join(" · ")}
        </h3>
        {showCountdown && (
          <ObsidianCountdown
            target={banner.status === "active" ? banner.endsAt : banner.startsAt}
            label={`${
              banner.status === "active" ? "Ends" : "Starts"
            } ${formatServerDateWithNote(
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
        <ul className="og-char-chip-list">
          {fiveStars.map((c) => (
            <CharacterChip key={c.name} c={c} />
          ))}
        </ul>
        {fourStars.length > 0 && (
          <p className="og-four-star">
            <span className="og-stars" aria-label="4 star">
              {stars(4)}
            </span>{" "}
            {fourStars.map((c) => c.name).join(" · ")}{" "}
            <span className="og-badge">Rate-up</span>
          </p>
        )}
        {banner.weapons.length > 0 && (
          <p className="og-weapon-line">
            <strong>Featured weapons:</strong>{" "}
            {banner.weapons
              .map((w) => `${w.name} (${w.type} — ${w.featuredFor})`)
              .join(" · ")}
          </p>
        )}
        {banner.imageCredit && (
          <p className="og-credit">{banner.imageCredit}</p>
        )}
      </div>
    </article>
  );
}

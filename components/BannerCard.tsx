import ObsidianCountdown from "./ObsidianCountdown";
import PhaseRail from "./PhaseRail";
import Image from "next/image";
import {
  formatServerDate,
  formatServerDateWithNote,
  type Banner,
  type GameCharacter,
  type GameEvent,
} from "../lib/data";
import { elementColor } from "../lib/elements";

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
          <span
            className="element-dot"
            style={{ background: elementColor(c.element) }}
            aria-hidden="true"
          />{" "}
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
  variant = "card",
}: {
  banner: Banner;
  showCountdown?: boolean;
  featured?: boolean;
  events?: GameEvent[];
  priority?: boolean;
  /** "tile" = the compact art-fill tile used in the Today grid. */
  variant?: "card" | "tile";
}) {
  const fiveStars = banner.characters.filter((c) => c.rarity === 5);
  const fourStars = banner.characters.filter((c) => c.rarity === 4);
  const bannerBase = banner.image?.replace(/\.webp$/, "");
  const accentStyle = fiveStars[0]
    ? ({ "--el-accent": elementColor(fiveStars[0].element) } as React.CSSProperties)
    : undefined;
  const countdownTarget =
    banner.status === "active" ? banner.endsAt : banner.startsAt;

  if (variant === "tile") {
    return (
      <article
        className="og-banner-card og-banner-tile"
        aria-label={`${banner.version} ${banner.phase} banner`}
        style={accentStyle}
      >
        {banner.image && (
          /* eslint-disable-next-line @next/next/no-img-element -- art-fill tile, static export */
          <img
            src={banner.image}
            srcSet={`${bannerBase}-512.webp 512w, ${bannerBase}-1024.webp 1024w, ${bannerBase}-1200.webp 1200w`}
            sizes="(max-width: 640px) 100vw, 380px"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="og-banner-tile-body">
          <div className="og-badge-row">
            <span className="og-badge">{banner.phase}</span>
            {banner.status === "active" ? (
              <span className="og-live">Live now</span>
            ) : (
              <span className="og-badge">Upcoming</span>
            )}
          </div>
          <h3 className="og-banner-tile-name">
            {fiveStars.map((c) => c.name).join(" · ")}
          </h3>
          {showCountdown && (
            <ObsidianCountdown
              target={countdownTarget}
              label={`${banner.status === "active" ? "Ends" : "Starts"} ${formatServerDate(countdownTarget)}`}
            />
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`og-banner-card${featured ? " og-banner-card-featured" : ""}`}
      aria-label={`${banner.version} ${banner.phase} banner`}
      style={accentStyle}
    >
      {banner.image && (
        <div className="og-banner-art">
          {/* Fix 3, static-export safe: plain <img> srcset. All variants are
              downscales of the full-size wiki originals (same artworks,
              WebP q80 — re-downloaded 2026-11-02, see data/SOURCES.md).
              A new banner image needs matching -512/-1024/-1200/-1920
              variants. CORRECTED 2026-11-02: the old srcset stopped at
              1024w and sizes claimed a 512px display, but the cards sit in
              an auto-fit grid — a lone/featured card spans the full 1080px
              container, so browsers loaded the 512w file and CSS stretched
              it ~2x (the visible blur). sizes now matches the real layout:
              featured cards display up to 1080px, grid cards up to ~532px. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- key-art strip: next/image's wrapper spans would break the fade-mask styling, and images are unoptimized in this static export so next/image adds nothing. */}
          <img
            src={banner.image}
            srcSet={`${bannerBase}-512.webp 512w, ${bannerBase}-1024.webp 1024w, ${bannerBase}-1200.webp 1200w, ${bannerBase}-1920.webp 1920w`}
            sizes={
              featured
                ? "(max-width: 640px) 100vw, 1080px"
                : "(max-width: 640px) 100vw, 532px"
            }
            alt={`Official key art for the ${banner.version} ${banner.phase} banner${fiveStars.length > 0 ? `, featuring ${fiveStars.map((c) => c.name).join(" and ")}` : ""}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "low"}
          />
          {featured && fiveStars[0]?.sprite?.includes("-sprite.webp") && (
            /* eslint-disable-next-line @next/next/no-img-element -- official full-sprite cut-out over the banner art */
            <img
              className="og-banner-sprite"
              src={fiveStars[0].sprite}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
            />
          )}
          {featured && showCountdown && (
            <div className="og-banner-overlay">
              <ObsidianCountdown
                target={banner.status === "active" ? banner.endsAt : banner.startsAt}
                label={`${
                  banner.status === "active" ? "Ends" : "Starts"
                } ${formatServerDate(
                  banner.status === "active" ? banner.endsAt : banner.startsAt
                )}`}
              />
            </div>
          )}
        </div>
      )}
      <div className="og-banner-body">
        {featured && banner.status === "active" && (
          <PhaseRail
            startsAt={banner.startsAt}
            endsAt={banner.endsAt}
            events={events}
          />
        )}
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
        {featured && banner.timeNote && (
          <p className="og-event-meta">{banner.timeNote}</p>
        )}
        {showCountdown && !featured && (
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

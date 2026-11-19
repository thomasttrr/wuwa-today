import type { CSSProperties } from "react";
import type { Team } from "@/lib/guides";
import { elementColor } from "@/lib/elements";
import { thumbFor } from "@/lib/renders";
import { CharPoster } from "@/components/CharThumb";

/**
 * Obsidian team card — visual-first per Tom's approved standard: portraits,
 * role labels, and element dots lead; notes stay compact. SOLID #101014
 * surface (never glass). Tags are restrained monochrome — no gold (gold is
 * reserved for time). The one exception: when `first` is true (the first
 * team on a character page, confirmed best by Tom), the shared golden beam
 * from content.css marks the card — beam only, no new label or badge.
 */
export default function ObsidianTeamCard({ team, first = false }: { team: Team; first?: boolean }) {
  const tagClass =
    team.tag === "Premium" ? "og-team-tag og-team-tag-premium" : "og-team-tag";
  return (
    <section className={first ? "og-team-card og-team-card-first" : "og-team-card"} aria-label={team.name}>
      <div className="og-team-head">
        <span className={tagClass}>{team.tag}</span>
        <h3 className="og-team-title">{team.name}</h3>
      </div>

      {/* Visual team row: the site's own head-cropped portraits (same as the
          hub, tier list and /teams), each on its element's colour, with a
          gold chevron between slots to read left to right as the rotation. */}
      <ol className="og-team-slots">
        {team.members.map((m, i) => {
          const el = elementColor(m.element);
          return (
            <li key={m.slug} className="og-team-slot" style={{ "--c": el } as CSSProperties}>
              <span className="og-team-art">
                <CharPoster thumb={thumbFor(m.slug)} name={m.name} hideName />
                {i < team.members.length - 1 && (
                  <span className="og-team-flow" aria-hidden="true">
                    ›
                  </span>
                )}
              </span>
              <p className="og-team-name">{m.name}</p>
              <p className="og-team-role">
                <span>{m.role}</span>
                <span className="og-team-elem">
                  <span className="element-dot" style={{ background: el }} aria-hidden="true" />
                  {m.element}
                </span>
              </p>
            </li>
          );
        })}
      </ol>

      {/* Compact role notes, element-accented left rule. */}
      <ul className="og-team-notes">
        {team.members.map((m) => {
          const el = elementColor(m.element);
          return (
            <li
              key={m.slug}
              className="og-team-note"
              style={{ "--el": el } as CSSProperties}
            >
              <span className="og-team-note-name">{m.name}</span>
              <span className="og-team-note-text">
                {m.role} — {m.note}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="og-team-rotation">
        <p className="og-team-rotation-label">Rotation</p>
        <p>{team.rotation}</p>
      </div>
    </section>
  );
}

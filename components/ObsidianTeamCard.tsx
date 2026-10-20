import Image from "next/image";
import type { CSSProperties } from "react";
import type { Team } from "@/lib/guides";
import { elementColor } from "@/lib/elements";

/**
 * Obsidian team card — visual-first per Tom's approved standard: portraits,
 * role labels, and element dots lead; notes stay compact. SOLID #101014
 * surface (never glass). Tags are restrained monochrome — no gold (gold is
 * reserved for time). Rotation sits in a raised inset panel.
 */
export default function ObsidianTeamCard({ team }: { team: Team }) {
  const tagClass =
    team.tag === "Premium" ? "og-team-tag og-team-tag-premium" : "og-team-tag";
  return (
    <section className="og-team-card" aria-label={team.name}>
      <div className="og-team-head">
        <span className={tagClass}>{team.tag}</span>
        <h3 className="og-team-title">{team.name}</h3>
      </div>

      {/* Visual team row: portraits first, with flow chevrons. */}
      <div className="og-team-slots">
        {team.members.map((m, i) => {
          const el = elementColor(m.element);
          return (
            <div key={m.slug} className="og-team-slot-flow">
              <div className="og-team-slot">
                <Image
                  src={`/images/chars/${m.slug}.webp`}
                  alt={`${m.name} portrait`}
                  className="og-team-portrait"
                  width={104}
                  height={104}
                  loading="lazy"
                  decoding="async"
                />
                <p className="og-team-name">{m.name}</p>
                <p className="og-team-role">
                  <span>{m.role}</span>
                  <span className="element-dot" style={{ background: el }} aria-hidden="true" />
                  <span>{m.element}</span>
                </p>
              </div>
              {i < team.members.length - 1 && (
                <span className="og-team-flow" aria-hidden="true">
                  ›
                </span>
              )}
            </div>
          );
        })}
      </div>

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

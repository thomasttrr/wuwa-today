import Image from "next/image";
import type { Team } from "../lib/guides";

/** Game-element accent colors (dots, rings, pills — the page stays dark). */
const ELEMENT_COLORS: Record<string, string> = {
  Electro: "#a78bfa",
  Aero: "#6ee7a0",
  Havoc: "#f472b6",
  Spectro: "#e879f9",
  Glacio: "#7dd3fc",
  Fusion: "#fb923c",
};

const TAG_BADGE: Record<string, string> = {
  Premium: "badge gold",
  Budget: "badge green",
  Alternative: "badge dim",
};

export default function TeamCard({ team }: { team: Team }) {
  const tagClass = TAG_BADGE[team.tag] ?? "badge";
  return (
    <section className="card team-card" aria-label={team.name}>
      <div className="team-card-head">
        <span className={tagClass}>{team.tag}</span>
        <h3 className="team-card-title">{team.name}</h3>
      </div>

      {/* Visual team row: portraits first, Game8-style, with flow chevrons. */}
      <div className="team-slots">
        {team.members.map((m, i) => {
          const el = ELEMENT_COLORS[m.element] ?? "#6e6e73";
          return (
            <div key={m.slug} className="team-slot-flow">
              <div
                className="team-slot"
                style={{ "--el": el } as React.CSSProperties}
              >
                <Image
                  src={`/images/chars/${m.slug}.png`}
                  alt={`${m.name} portrait`}
                  className="team-portrait"
                  width={104}
                  height={104}
                />
                <p className="team-slot-name">{m.name}</p>
                <p className="team-role-pill">
                  <span className="pill-role">{m.role}</span>
                  <span className="pill-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="pill-el">
                    <span
                      className="element-dot"
                      style={{ background: el }}
                      aria-hidden
                    />
                    {m.element}
                  </span>
                </p>
              </div>
              {i < team.members.length - 1 && (
                <span className="team-flow" aria-hidden="true">
                  ›
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Compact role notes, element-accented. */}
      <ul className="team-roles">
        {team.members.map((m) => {
          const el = ELEMENT_COLORS[m.element] ?? "#6e6e73";
          return (
            <li
              key={m.slug}
              className="team-role-row"
              style={{ "--el": el } as React.CSSProperties}
            >
              <p className="team-role-name">
                {m.name} <span>· {m.role}</span>
              </p>
              <p className="team-role-note">{m.note}</p>
            </li>
          );
        })}
      </ul>

      <div className="team-rotation">
        <p className="team-rotation-label">Rotation</p>
        <p>{team.rotation}</p>
      </div>
    </section>
  );
}

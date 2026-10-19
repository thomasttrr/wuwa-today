"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Source = "prydwen" | "editorial";

const SOURCES: { key: Source; label: string; blurb: string }[] = [
  {
    key: "prydwen",
    label: "Prydwen",
    blurb: "Community consensus — split by game mode and combat role.",
  },
  {
    key: "editorial",
    label: "Our Rankings",
    blurb: "Our take — one list, with a pull note per character.",
  },
];

/**
 * Source switcher for the tier list page. Renders Prydwen's mode×role
 * reference and our editorial list as two views instead of stacking them.
 * Children are server components passed through as props.
 */
export default function TierListViews({
  prydwen,
  editorial,
}: {
  prydwen: ReactNode;
  editorial: ReactNode;
}) {
  const [source, setSource] = useState<Source>("prydwen");
  const active = SOURCES.find((s) => s.key === source) ?? SOURCES[0];

  return (
    <div>
      <div className="og-source-toggle" role="tablist" aria-label="Tier list source">
        {SOURCES.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={source === s.key}
            className={source === s.key ? "active" : ""}
            onClick={() => setSource(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="og-source-blurb">{active.blurb}</p>
      <div role="tabpanel" aria-label={active.label}>
        {source === "prydwen" ? prydwen : editorial}
      </div>
    </div>
  );
}

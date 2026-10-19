"use client";

import { useState } from "react";
import Link from "next/link";
import prydwenData from "@/data/tier-list-prydwen.json";
import { characterSlugs, getCharacter } from "@/lib/characters";

type Mode = "Tower of Adversity" | "Whimpering Wastes";
type Role = "DPS" | "Hybrid" | "Support";

const MODES: Mode[] = ["Tower of Adversity", "Whimpering Wastes"];
const ROLES: { key: Role; label: string; dot: string }[] = [
  { key: "DPS", label: "DPS", dot: "#e5484d" },
  { key: "Hybrid", label: "Hybrid / Sub-DPS", dot: "#d4a017" },
  { key: "Support", label: "Support", dot: "#3fb68b" },
];
const TIERS = ["T0", "T0.5", "T1", "T1.5", "T2", "T3", "T4"];

// Map Prydwen names to our character slugs for linking
function nameToSlug(name: string): string | null {
  const lower = name.toLowerCase();
  // Handle special cases
  const special: Record<string, string> = {
    "the shorekeeper": "shorekeeper",
    "yangyang xuanling": "yangyang-xuanling",
    "rover (havoc)": "havoc-rover",
    "rover (spectro)": "spectro-rover",
    "rover (aero)": "aero-rover",
    "rover (electro)": "electro-rover",
    "luuk herssen": "luuk-herssen",
  };
  if (special[lower]) return special[lower];
  // Default: lowercase, spaces to hyphens
  const slug = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return slug;
}

export default function PrydwenTierList() {
  const [mode, setMode] = useState<Mode>("Tower of Adversity");
  const hubSlugs = new Set(characterSlugs());
  const modeData = (prydwenData.modes as Record<string, Record<string, Record<string, string[]>>>)[mode];

  return (
    <div>
      {/* Mode toggle */}
      <div className="og-mode-toggle" role="tablist" aria-label="Game mode">
        {MODES.map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Role sections */}
      {ROLES.map(({ key, label, dot }) => {
        const roleData = modeData[key];
        const total = TIERS.reduce((n, t) => n + (roleData[t]?.length ?? 0), 0);
        if (total === 0) return null;
        return (
          <section key={key} className="og-role-section" aria-label={`${label} tier list`}>
            <h3 className="og-role-header">
              <span className="og-role-dot" style={{ background: dot }} aria-hidden="true" />
              {label}
              <span className="og-role-count">{total}</span>
            </h3>
            {TIERS.map((tier) => {
              const chars = roleData[tier] ?? [];
              if (chars.length === 0) return null;
              const isTop = tier === "T0";
              return (
                <div key={tier} className="og-tier-row">
                  <div className={`og-tier-badge tier-${tier.replace(".", "h")}`}>{tier}</div>
                  <ul className="og-tier-chips">
                    {chars.map((name) => {
                      const slug = nameToSlug(name);
                      const inHub = slug && hubSlugs.has(slug);
                      const chip = (
                        <span className={`og-char-chip${isTop ? " og-char-chip-top" : ""}`}>
                          {name}
                        </span>
                      );
                      return (
                        <li key={name}>
                          {inHub ? (
                            <Link href={`/characters/${slug}`} className="og-chip-link" aria-label={`${name} — character page`}>
                              {chip}
                            </Link>
                          ) : (
                            chip
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </section>
        );
      })}

      {/* Attribution */}
      <p className="og-tier-source">
        Tier data from <a href={prydwenData.sourceUrl} target="_blank" rel="noopener noreferrer">Prydwen</a>{" "}
        (3.7 patch, updated {prydwenData.lastUpdated}). Our editorial tier list is also available below.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import prydwenData from "@/data/tier-list-prydwen.json";
import { characterSlugs } from "@/lib/characters";

type Mode = "Tower of Adversity" | "Whimpering Wastes";
type Role = "DPS" | "Hybrid" | "Support";

// Inline SVG role icons (thin stroke, Obsidian Glass HUD style)
function RoleIcon({ role }: { role: Role }) {
  const common = {
    width: 14, height: 14, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  if (role === "DPS") {
    // crossed swords
    return (
      <svg {...common}>
        <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
        <line x1="13" x2="19" y1="19" y2="13" />
        <line x1="16" x2="20" y1="16" y2="20" />
        <line x1="19" x2="21" y1="21" y2="19" />
        <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
        <line x1="5" x2="9" y1="14" y2="18" />
        <line x1="7" x2="4" y1="17" y2="20" />
        <line x1="3" x2="5" y1="19" y2="21" />
      </svg>
    );
  }
  if (role === "Hybrid") {
    // layers (dual-role)
    return (
      <svg {...common}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  // Support: shield
  return (
    <svg {...common}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const MODES: Mode[] = ["Tower of Adversity", "Whimpering Wastes"];
const ROLES: { key: Role; label: string; color: string }[] = [
  { key: "DPS", label: "DPS", color: "#e5484d" },
  { key: "Hybrid", label: "Hybrid / Sub-DPS", color: "#d4a017" },
  { key: "Support", label: "Support", color: "#3fb68b" },
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
      <p className="og-mode-label" id="og-mode-label">Game mode</p>
      <div className="og-mode-toggle" role="tablist" aria-labelledby="og-mode-label">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            className={mode === m ? "active" : ""}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Role sections — one card per role, flat tier rows inside */}
      {ROLES.map(({ key, label, color }) => {
        const roleData = modeData[key];
        const total = TIERS.reduce((n, t) => n + (roleData[t]?.length ?? 0), 0);
        if (total === 0) return null;
        return (
          <section key={key} className="og-role-card" aria-label={`${label} tier list`}>
            <h3 className="og-role-header">
              <span className="og-role-icon" style={{ color }} aria-hidden="true">
                <RoleIcon role={key} />
              </span>
              {label}
              <span className="og-role-count">{total}</span>
            </h3>
            <div className="og-ptiers">
              {TIERS.map((tier) => {
                const chars = roleData[tier] ?? [];
                if (chars.length === 0) return null;
                const isTop = tier === "T0";
                const sparse = chars.length <= 2 ? " og-ptier-sparse" : "";
                return (
                  <div key={tier} className={`og-ptier${sparse}`}>
                    <span className={`og-tier-badge og-ptier-badge tier-${tier.replace(".", "h")}`}>
                      {tier}
                    </span>
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
            </div>
          </section>
        );
      })}

      {/* Attribution */}
      <p className="og-tier-source">
        Tier data from <a href={prydwenData.sourceUrl} target="_blank" rel="noopener noreferrer">Prydwen</a>{" "}
        (3.7 patch, updated {prydwenData.lastUpdated}).
      </p>
    </div>
  );
}

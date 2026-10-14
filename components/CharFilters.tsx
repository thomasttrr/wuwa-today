"use client";

import { useEffect, useState } from "react";
import { elementColor } from "@/lib/elements";

export interface CharFilterState {
  element: string | null;
  weapon: string | null;
  rarity: number | null;
  role: string | null;
}

export const EMPTY_FILTERS: CharFilterState = {
  element: null,
  weapon: null,
  rarity: null,
  role: null,
};

export function filtersActive(f: CharFilterState): boolean {
  return f.element !== null || f.weapon !== null || f.rarity !== null || f.role !== null;
}

function Chip({
  active,
  onToggle,
  label,
  dot,
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      type="button"
      className="char-chip"
      aria-pressed={active}
      onClick={onToggle}
    >
      {dot && (
        <span className="element-dot" style={{ background: dot }} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

/**
 * Sticky filter bar: element / weapon / rarity / role chip groups.
 * Sticks below the site header (header height measured so it never overlaps).
 */
export default function CharFilters({
  elements,
  weapons,
  rarities,
  roles,
  value,
  onChange,
  shown,
  total,
}: {
  elements: string[];
  weapons: string[];
  rarities: number[];
  roles: string[];
  value: CharFilterState;
  onChange: (next: CharFilterState) => void;
  shown: number;
  total: number;
}) {
  const [top, setTop] = useState(64);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector(".site-header");
      if (header) setTop(Math.ceil(header.getBoundingClientRect().height));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const active = filtersActive(value);
  const toggle = <K extends keyof CharFilterState>(key: K, v: CharFilterState[K]) =>
    onChange({ ...value, [key]: value[key] === v ? null : v });

  return (
    <div className="char-filters" style={{ top }}>
      <div className="char-filter-groups" role="group" aria-label="Filter characters">
        <div className="char-filter-group" role="group" aria-label="Element">
          <span className="char-filter-label" aria-hidden="true">Element</span>
          {elements.map((e) => (
            <Chip
              key={e}
              label={e}
              dot={elementColor(e)}
              active={value.element === e}
              onToggle={() => toggle("element", e)}
            />
          ))}
        </div>
        <div className="char-filter-group" role="group" aria-label="Weapon">
          <span className="char-filter-label" aria-hidden="true">Weapon</span>
          {weapons.map((w) => (
            <Chip
              key={w}
              label={w}
              active={value.weapon === w}
              onToggle={() => toggle("weapon", w)}
            />
          ))}
        </div>
        <div className="char-filter-group" role="group" aria-label="Rarity">
          <span className="char-filter-label" aria-hidden="true">Rarity</span>
          {rarities.map((r) => (
            <Chip
              key={r}
              label={`★${r}`}
              active={value.rarity === r}
              onToggle={() => toggle("rarity", r)}
            />
          ))}
        </div>
        <div className="char-filter-group" role="group" aria-label="Role">
          <span className="char-filter-label" aria-hidden="true">Role</span>
          {roles.map((r) => (
            <Chip
              key={r}
              label={r}
              active={value.role === r}
              onToggle={() => toggle("role", r)}
            />
          ))}
        </div>
        {active && (
          <div className="char-filter-group">
            <button
              type="button"
              className="char-chip char-chip-reset"
              onClick={() => onChange(EMPTY_FILTERS)}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <p className="char-count" aria-live="polite">
        <strong>{shown}</strong> of {total} characters
      </p>
    </div>
  );
}

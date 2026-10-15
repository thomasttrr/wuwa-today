"use client";

import { elementColor } from "@/lib/elements";

export interface CharFilterState {
  element: string | null;
  weapon: string | null;
  rarity: number | null;
  role: string | null;
  /** Show only pre-release / upcoming characters (e.g. Lily, 3.8). */
  upcoming: boolean;
}

export const EMPTY_FILTERS: CharFilterState = {
  element: null,
  weapon: null,
  rarity: null,
  role: null,
  upcoming: false,
};

export function filtersActive(f: CharFilterState): boolean {
  return (
    f.element !== null ||
    f.weapon !== null ||
    f.rarity !== null ||
    f.role !== null ||
    f.upcoming
  );
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
      className="og-chip"
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
 * Obsidian filter toolbar for the character hub. The toolbar is chrome, so
 * glass (frosted tint + specular glint) is allowed here. Sticky offset
 * clears the floating desktop nav capsule; on mobile the bar sits below
 * the top edge (nav is a bottom thumb bar there). Chips are >= 44px for
 * iPhone-safe touch targets.
 */
export default function ObsidianCharFilters({
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
  const active = filtersActive(value);
  const toggle = <K extends keyof CharFilterState>(key: K, v: CharFilterState[K]) =>
    onChange({ ...value, [key]: value[key] === v ? null : v });

  return (
    <div className="og-filterbar">
      <div className="og-filter-groups" role="group" aria-label="Filter characters">
        <div className="og-filter-group" role="group" aria-label="Status">
          <span className="og-filter-label" aria-hidden="true">Status</span>
          <Chip
            label="Upcoming"
            active={value.upcoming}
            onToggle={() => onChange({ ...value, upcoming: !value.upcoming })}
          />
        </div>
        <div className="og-filter-group" role="group" aria-label="Element">
          <span className="og-filter-label" aria-hidden="true">Element</span>
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
        <div className="og-filter-group" role="group" aria-label="Weapon">
          <span className="og-filter-label" aria-hidden="true">Weapon</span>
          {weapons.map((w) => (
            <Chip
              key={w}
              label={w}
              active={value.weapon === w}
              onToggle={() => toggle("weapon", w)}
            />
          ))}
        </div>
        <div className="og-filter-group" role="group" aria-label="Rarity">
          <span className="og-filter-label" aria-hidden="true">Rarity</span>
          {rarities.map((r) => (
            <Chip
              key={r}
              label={`★${r}`}
              active={value.rarity === r}
              onToggle={() => toggle("rarity", r)}
            />
          ))}
        </div>
        <div className="og-filter-group" role="group" aria-label="Role">
          <span className="og-filter-label" aria-hidden="true">Role</span>
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
          <div className="og-filter-group">
            <button
              type="button"
              className="og-chip og-chip-reset"
              onClick={() => onChange(EMPTY_FILTERS)}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      <p className="og-count" aria-live="polite">
        <strong>{shown}</strong> of {total} characters
      </p>
    </div>
  );
}

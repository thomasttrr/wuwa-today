"use client";

import { useLayoutEffect, useRef, useState } from "react";
import ObsidianCharFilters, {
  EMPTY_FILTERS,
  type CharFilterState,
} from "./ObsidianCharFilters";
import ObsidianCharGrid from "./ObsidianCharGrid";
import { isPreRelease, type CharacterRecordLoose } from "@/lib/characters";

const FLIP_MS = 350;
const FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Obsidian filter state + FLIP-animated portrait grid for the character hub.
 *
 * FLIP-lite: before a filter change we snapshot every mounted tile's rect;
 * after React re-renders, surviving tiles are WAAPI-animated from their old
 * position to the new one. Entering tiles mount fresh and ride the Reveal
 * stagger; exiting tiles unmount instantly (the glide + stagger masks it).
 * Skipped entirely under prefers-reduced-motion.
 */
export default function ObsidianCharactersExplorer({
  chars,
  elements,
  weapons,
  rarities,
  roles,
}: {
  chars: CharacterRecordLoose[];
  elements: string[];
  weapons: string[];
  rarities: number[];
  roles: string[];
}) {
  const [filters, setFilters] = useState<CharFilterState>(EMPTY_FILTERS);
  const [filterSig, setFilterSig] = useState(0);
  const cellEls = useRef(new Map<string, HTMLDivElement>());
  const prevRects = useRef(new Map<string, DOMRect>());
  // Client-only; used in handlers/effects, never in rendered output.
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const filtered = chars.filter((c) => {
    if (filters.upcoming && !isPreRelease(c)) return false;
    if (filters.element && c.profile.element !== filters.element) return false;
    if (filters.weapon && c.profile.weapon_type !== filters.weapon) return false;
    if (filters.rarity && c.profile.rarity !== filters.rarity) return false;
    if (filters.role && c.profile.role !== filters.role) return false;
    return true;
  });

  const handleFilterChange = (next: CharFilterState) => {
    if (!reducedMotion) {
      prevRects.current = new Map();
      cellEls.current.forEach((el, slug) => {
        prevRects.current.set(slug, el.getBoundingClientRect());
      });
    }
    setFilters(next);
    setFilterSig((s) => s + 1);
  };

  useLayoutEffect(() => {
    const prev = prevRects.current;
    prevRects.current = new Map();
    if (prev.size === 0 || reducedMotion) return;
    cellEls.current.forEach((el, slug) => {
      const first = prev.get(slug);
      if (!first) return; // entering tile — the Reveal stagger handles it
      const last = el.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (dx === 0 && dy === 0) return;
      el.style.willChange = "transform";
      const anim = el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        { duration: FLIP_MS, easing: FLIP_EASING }
      );
      const done = () => {
        el.style.willChange = "";
      };
      anim.onfinish = done;
      anim.oncancel = done;
    });
  }, [filterSig, reducedMotion]);

  const handleCellRef = (slug: string, el: HTMLDivElement | null) => {
    if (el) cellEls.current.set(slug, el);
    else cellEls.current.delete(slug);
  };

  return (
    <>
      <ObsidianCharFilters
        elements={elements}
        weapons={weapons}
        rarities={rarities}
        roles={roles}
        value={filters}
        onChange={handleFilterChange}
        shown={filtered.length}
        total={chars.length}
      />
      <ObsidianCharGrid
        chars={filtered}
        filterSig={filterSig}
        onCellRef={handleCellRef}
        onClear={() => handleFilterChange(EMPTY_FILTERS)}
      />
    </>
  );
}

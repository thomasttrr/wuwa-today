"use client";

import Reveal from "./Reveal";
import ObsidianCharTile from "./ObsidianCharTile";
import type { CharacterRecordLoose } from "@/lib/characters";

const INITIAL_STAGGER_CAP = 12;
const INITIAL_STAGGER_MS = 55;
const FILTER_STAGGER_CAP = 6;
const FILTER_STAGGER_MS = 45;

/**
 * Obsidian portrait grid. Entrance stagger rides the <Reveal>
 * IntersectionObserver component (first N tiles staggered, the rest reveal
 * on scroll). Cells register their DOM nodes so the parent can FLIP-animate
 * surviving tiles across filter changes.
 */
export default function ObsidianCharGrid({
  chars,
  filterSig,
  onCellRef,
}: {
  chars: CharacterRecordLoose[];
  /** Bumps on every filter change; entering tiles use the tighter stagger. */
  filterSig: number;
  onCellRef: (slug: string, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="og-grid" role="list" aria-label="Characters">
      {chars.map((char, idx) => {
        const cap = filterSig === 0 ? INITIAL_STAGGER_CAP : FILTER_STAGGER_CAP;
        const step = filterSig === 0 ? INITIAL_STAGGER_MS : FILTER_STAGGER_MS;
        const delay = idx < cap ? idx * step : 0;
        return (
          <div
            key={char.slug}
            role="listitem"
            className="og-cell"
            ref={(el) => onCellRef(char.slug, el)}
          >
            <Reveal delay={delay}>
              <ObsidianCharTile char={char} />
            </Reveal>
          </div>
        );
      })}
      {chars.length === 0 && (
        <div className="og-char-empty" role="status">
          <p>No characters match these filters.</p>
        </div>
      )}
    </div>
  );
}

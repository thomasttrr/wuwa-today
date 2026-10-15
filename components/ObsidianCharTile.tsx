"use client";

import Image from "next/image";
import Link from "next/link";
import type { CharacterHubTile } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

/**
 * ObsidianCharTile — portrait-led character tile for the Obsidian Glass
 * system. SOLID #101014 surface (never glass — tiles are content, not
 * chrome). Hover lifts the CARD; the image never scales. Meta is
 * ellipsis-clipped so role/element never bleeds into adjacent tiles.
 */
export default function ObsidianCharTile({ char }: { char: CharacterHubTile }) {
  const el = elementColor(char.element);
  return (
    <Link
      href={`/characters/${char.slug}`}
      className="og-char-tile"
      aria-label={`${char.name} — ${char.role}, ${char.element}`}
    >
      <span className="og-char-tile-art">
        <span className="og-char-tile-mono" aria-hidden="true">
          {char.name.charAt(0)}
        </span>
        <Image
          src={char.portrait_url}
          alt={`${char.name} portrait`}
          width={256}
          height={256}
          loading="lazy"
          decoding="async"
        />
        {char.preRelease && <span className="og-char-tile-flag">Pre-release</span>}
      </span>
      <span className="og-char-tile-body">
        <span className="og-char-tile-name">{char.name}</span>
        <span className="og-char-tile-meta">
          <span>{char.role}</span>
          <span className="element-dot" style={{ background: el }} aria-hidden="true" />
          <span>{char.element}</span>
        </span>
      </span>
    </Link>
  );
}

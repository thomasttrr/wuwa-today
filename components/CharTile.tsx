"use client";

import Image from "next/image";
import Link from "next/link";
import { isPreRelease, type CharacterRecordLoose } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

/**
 * Whole-tile link for the /characters portrait grid.
 * Monogram fallback sits behind the portrait so the grid never reflows
 * if an image fails to load.
 */
export default function CharTile({ char }: { char: CharacterRecordLoose }) {
  const el = elementColor(char.profile.element);
  const preRelease = isPreRelease(char);
  return (
    <Link
      href={`/characters/${char.slug}`}
      className="char-tile"
      style={{ "--el": el } as React.CSSProperties}
      aria-label={`${char.name} — ${char.profile.role}, ${char.profile.element}`}
    >
      <span className="char-tile-art">
        <span className="char-tile-mono" aria-hidden="true">
          {char.name.charAt(0)}
        </span>
        <Image
          src={char.profile.portrait_url}
          alt=""
          width={256}
          height={256}
          loading="lazy"
          decoding="async"
        />
        {preRelease && <span className="char-tile-flag">Pre-release</span>}
      </span>
      <span className="char-tile-name">{char.name}</span>
      <span className="char-tile-meta">
        <span>{char.profile.role}</span>
        <span className="element-dot" style={{ background: el }} aria-hidden="true" />
        <span>{char.profile.element}</span>
      </span>
    </Link>
  );
}

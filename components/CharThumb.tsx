import type { CSSProperties, ReactNode } from "react";
import type { Thumb } from "@/lib/renders";
import "./char-thumb.css";

/* Character thumbnails, two shapes:
   - CharPoster: the /characters hub poster at grid size (tier list, teams,
     banner cards). Fills its container's width; set --c on an ancestor.
   - CharMedal: round head-and-shoulders crop for chips and headers.
   Both take a resolved Thumb from lib/renders (server-side). */

const vars = (t: Thumb, extra?: Record<string, string | number>) =>
  ({ "--fx": t.fx, "--z": t.z, ...extra }) as CSSProperties;

/* The art is drawn at --z% (x a per-shape factor) of its frame, so `sizes`
   is the frame width scaled the same way. Posters vary by grid; 160px is the
   largest common frame. Medals know their exact diameter. */
const POSTER_FRAME = 160;
const sizesFor = (t: Thumb, frame: number, k: number) => `${Math.round((frame * t.z * k) / 100)}px`;

function Art({ t, eager, sizes }: { t: Thumb; eager?: boolean; sizes: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export is unoptimized; sizes come from renders.json.
    <img
      className={`ct-art${t.render ? "" : " is-portrait"}`}
      src={t.src}
      srcSet={t.srcSet}
      sizes={t.srcSet ? sizes : undefined}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export function CharPoster({
  thumb,
  name,
  rarity,
  eager,
  hideName,
  className,
  children,
}: {
  thumb: Thumb | null;
  name: string;
  rarity?: number;
  eager?: boolean;
  /** Name is already printed right next to the poster. */
  hideName?: boolean;
  className?: string;
  /** Corner badges (owned tick, role, tier...). */
  children?: ReactNode;
}) {
  return (
    <span className={`ct-poster${hideName ? " ct-poster-bare" : ""}${className ? ` ${className}` : ""}`} style={thumb ? vars(thumb) : undefined}>
      <span className="ct-ghost" aria-hidden="true">{name.split(/[\s:]/)[0]}</span>
      {thumb ? <Art t={thumb} eager={eager} sizes={sizesFor(thumb, POSTER_FRAME, 1.05)} /> : <span className="ct-mono" aria-hidden="true">{name.charAt(0)}</span>}
      {children}
      {!hideName && (
        // Shrink rather than split long single words ("Shorekeeper").
        <span className={`ct-name${Math.max(...name.split(/\s+/).map((w) => w.length)) > 8 ? " ct-name-long" : ""}`}>{name}</span>
      )}
      {rarity ? <span className={`ct-rar r${rarity}`} aria-hidden="true" /> : null}
    </span>
  );
}

export function CharMedal({
  thumb,
  name,
  size,
  rarity,
  eager,
  className,
}: {
  thumb: Thumb | null;
  name: string;
  /** Outer diameter in px. */
  size: number;
  rarity?: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`ct-medal${rarity ? ` r${rarity}` : ""}${className ? ` ${className}` : ""}`}
      style={vars(thumb ?? { src: "", fx: 0.5, z: 100, render: false }, { "--s": `${size}px` })}
    >
      <span className="ct-medal-in">
        {thumb ? <Art t={thumb} eager={eager} sizes={sizesFor(thumb, size, 1.55)} /> : <span className="ct-mono" aria-hidden="true">{name.charAt(0)}</span>}
      </span>
    </span>
  );
}

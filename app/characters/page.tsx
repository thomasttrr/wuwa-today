import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import CharactersHub, { type HubChar } from "@/components/CharactersHub";
import {
  characters,
  isPreRelease,
  CHARACTER_ELEMENTS,
  CHARACTER_ROLES,
  CHARACTER_WEAPONS,
} from "@/lib/characters";
import { activeBanners } from "@/lib/data";
import { ELEMENT_COLORS, elementColor } from "@/lib/elements";
import rendersData from "@/data/renders.json";
import { thumbFor } from "@/lib/renders";
import { CharMedal } from "@/components/CharThumb";
import { buildTierModel, OUR_TIER_LABELS } from "@/lib/tiers";
import "./hub.css";

export const metadata: Metadata = {
  title: "Characters — Builds, Weapons, Echoes & Teams",
  description:
    "Every Wuthering Waves character in one hub: builds, ranked weapons, echo sets, stat priorities, team comps and pull verdicts — current as of version 3.8.",
  alternates: { canonical: "/characters" },
};

export default function CharactersPage() {
  const ours = new Map(buildTierModel().chars.map((c) => [c.slug, c.ours?.tier ?? null]));
  const bannerNames = new Set(activeBanners.flatMap((b) => b.characters.map((c) => c.name)));

  const renders = rendersData.renders as Record<string, { sizes: { file: string }[]; focusX?: number; zoom?: number }>;
  const chars: HubChar[] = characters.map((c) => ({
    slug: c.slug,
    name: c.name,
    portrait: c.profile.portrait_url,
    element: c.profile.element,
    color: elementColor(c.profile.element),
    weapon: c.profile.weapon_type,
    rarity: c.profile.rarity,
    role: c.profile.role,
    preRelease: isPreRelease(c),
    tier: ours.get(c.slug) ?? null,
    onBanner: bannerNames.has(c.name),
    art: renders[c.slug]?.sizes.at(-1)?.file ?? null,
    artSrcSet: renders[c.slug] ? thumbFor(c.slug)?.srcSet ?? null : null,
    // Head x position (0..1), clamped so the crop never exposes empty edges.
    fx: Math.min(0.75, Math.max(0.25, renders[c.slug]?.focusX ?? 0.5)),
    zoom: renders[c.slug]?.zoom ?? 138,
    ghost: c.name.split(" ")[0],
  }));
  const live = chars.filter((c) => c.onBanner);

  return (
    <>
      <header className="ch-hero">
        <p className="rs-kicker">Version 3.8 · {chars.length} Resonators</p>
        <h1 className="ch-hero-title">Characters</h1>
        <div className="ch-hero-row">
          <p className="ch-hero-lede">
            Builds, ranked weapons, echo sets, teams and pull verdicts for every
            Resonator. Pick an element and the whole page tunes to it.
          </p>
        {live.length > 0 && (
          <div className="ch-live" aria-label="On the live banner">
            <p className="ch-live-h">
              <span className="rs-live-dot" aria-hidden="true" /> On banner now
            </p>
            <ul>
              {live.map((c) => (
                <li key={c.slug} style={{ "--c": c.color } as CSSProperties}>
                  <Link href={`/characters/${c.slug}`}>
                    <CharMedal thumb={thumbFor(c.slug, c.portrait)} name={c.name} size={32} rarity={c.rarity} eager />
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </header>
      <CharactersHub
        chars={chars}
        elements={CHARACTER_ELEMENTS}
        weapons={CHARACTER_WEAPONS}
        roles={CHARACTER_ROLES}
        elementColors={ELEMENT_COLORS}
        tierLabels={OUR_TIER_LABELS}
      />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import OgPageHero from "@/components/OgPageHero";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import { getCharacter } from "@/lib/characters";
import { prefarmGuides } from "@/lib/prefarm";

export const metadata: Metadata = {
  title: "Pre-Farm Guides — What to Farm Before the Banner | WuWa Today",
  description:
    "Pre-farm checklists for upcoming Wuthering Waves banners: every ascension and forte material with verified quantities and farming routes.",
};

export default function PrefarmIndex() {
  // The section lists upcoming characters only: live characters' guides stay
  // reachable from their character pages and the pull planner.
  const upcoming = prefarmGuides.filter((g) => g.prerelease);
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Pre-farm guides"
        title="Farm before the banner"
        lede="Every material for the featured characters — quantities verified against two or more independent sources, with the routes to farm them."
        meta={
          <UpdatedStamp />
        }
      />

      {upcoming.filter((g) => getCharacter(g.character_slug)).length > 0 && (
        <ObsidianToolbar
          label="Jump to a guide"
          items={upcoming
            .filter((g) => getCharacter(g.character_slug))
            .map((g) => ({
              href: `#prefarm-${g.slug}`,
              label: g.character,
            }))}
        />
      )}

      <div className="og-grid">
        {upcoming.map((g, i) => {
          const char = getCharacter(g.character_slug);
          if (!char) return null;
          const p = char.profile;
          return (
            <Reveal key={g.slug} delay={Math.min(i * 60, 240)}>
              <Link
                id={`prefarm-${g.slug}`}
                href={`/pre-farm/${g.slug}`}
                className="og-radius-card"
                style={{ display: "block", textDecoration: "none" }}
              >
                <div className="og-char-art" style={{ maxWidth: 220 }}>
                  <Image
                    src={p.portrait_url}
                    alt={`${char.name} portrait`}
                    width={440}
                    height={440}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="og-char-kicker">
                  {p.element} · {p.weapon_type} · {"★".repeat(p.rarity)}
                </p>
                <h2 className="og-h2" style={{ margin: "0.25rem 0" }}>
                  {g.character} pre-farm
                </h2>
                <p className="og-section-blurb">{g.banner}</p>
                {g.prerelease && (
                  <span className="og-char-badge og-char-badge-dim">
                    Pre-release
                  </span>
                )}
                {g.partial && (
                  <span className="og-char-badge og-char-badge-dim">
                    Partial guide
                  </span>
                )}
              </Link>
            </Reveal>
          );
        })}
      </div>
      {upcoming.length === 0 && (
        <p className="og-section-blurb">
          No upcoming banners have farming guides yet — check back when the
          next character is revealed.
        </p>
      )}
    </>
  );
}

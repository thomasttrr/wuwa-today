import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import tierList from "@/data/tier-list.json";
import { characterSlugs } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Character Tier List (3.7) — WuWa Today",
  description:
    "Who's actually worth building in Wuthering Waves 3.7? Our meta tier list for the current patch, updated for the featured five-stars.",
};

const TIER_STYLES: Record<string, { badge: string; label: string }> = {
  SS: { badge: "tier-badge tier-ss", label: "Meta-defining" },
  S: { badge: "tier-badge tier-s", label: "Excellent" },
  A: { badge: "tier-badge tier-a", label: "Excellent" },
  B: { badge: "tier-badge tier-b", label: "Situational" },
};

export default function TierListPage() {
  const hubSlugs = new Set(characterSlugs());
  return (
    <div className="page">
      <div className="page-hero">
        <div className="guide-kicker">Version 3.7 · Updated {tierList.updatedAt}</div>
        <h1 className="page-title">Character Tier List</h1>
        <p className="guide-sub">{tierList.note}</p>
      </div>

      {(tierList.tiers as { tier: string; label: string; members: { name: string; slug: string; note: string }[] }[]).map((row) => {
        const style = TIER_STYLES[row.tier] ?? TIER_STYLES.B;
        return (
          <section key={row.tier} className="tier-row" aria-label={`Tier ${row.tier}`}>
            <div className="tier-side">
              <span className={style.badge}>{row.tier}</span>
              <span className="tier-label">{row.label}</span>
            </div>
            <ul className="tier-members">
              {row.members.map((m) => {
                const inHub = hubSlugs.has(m.slug);
                const face = (
                  <Image
                    src={`/images/chars/${m.slug}.png`}
                    alt={m.name}
                    width={64}
                    height={64}
                    className="tier-face"
                    loading="lazy"
                  />
                );
                return (
                  <li key={m.slug} className="tier-member">
                    {inHub ? (
                      <Link href={`/characters/${m.slug}`} aria-label={`${m.name} — character page`}>
                        {face}
                      </Link>
                    ) : (
                      face
                    )}
                    <div className="tier-info">
                      {inHub ? (
                        <Link href={`/characters/${m.slug}`} className="tier-name">
                          {m.name}
                        </Link>
                      ) : (
                        <span className="tier-name">{m.name}</span>
                      )}
                      <span className="tier-note">{m.note}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="tier-foot">
        <p>
          Want the details?{" "}
          <Link href="/characters">Browse the character hub</Link> for builds,
          weapons, echo sets, and team comps.
        </p>
      </div>
    </div>
  );
}

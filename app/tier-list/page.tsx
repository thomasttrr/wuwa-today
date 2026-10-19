import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ShareButton from "@/components/ShareButton";
import UpdatedStamp from "@/components/UpdatedStamp";
import PrydwenTierList from "@/components/PrydwenTierList";
import tierList from "@/data/tier-list.json";
import { characterSlugs, getCharacter, isPreRelease } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

export const metadata: Metadata = {
  title: "Character Tier List (3.7) — WuWa Today",
  description:
    "Who's actually worth building in Wuthering Waves 3.7? Prydwen's meta tier list split by game mode (Tower of Adversity / Whimpering Wastes) and role, plus our editorial rankings.",
  alternates: { canonical: "/tier-list" },
};

const TIER_BADGE_CLASS: Record<string, string> = {
  SS: "og-tier-badge tier-SS",
  S: "og-tier-badge tier-S",
  A: "og-tier-badge tier-A",
  B: "og-tier-badge tier-B",
};

interface TierMember {
  name: string;
  slug: string;
  note: string;
}

interface TierRow {
  tier: string;
  label: string;
  members: TierMember[];
}

export default function TierListPage() {
  const hubSlugs = new Set(characterSlugs());
  const rows = tierList.tiers as TierRow[];
  const rankedSlugs = new Set(rows.flatMap((r) => r.members.map((m) => m.slug)));
  // Pre-release characters are deliberately unranked — never invent a tier.
  const unranked = [...hubSlugs]
    .map((slug) => getCharacter(slug))
    .filter((c) => c && isPreRelease(c) && !rankedSlugs.has(c.slug));

  return (
    <>
      <OgPageHero
        kicker={`Version ${tierList.version} · Updated ${tierList.updatedAt}`}
        title="Character Tier List"
        lede={tierList.note}
        meta={
          <>
            <UpdatedStamp />
            <ShareButton />
          </>
        }
      />

      {/* Prydwen reference tier list: mode + role split */}
      <section id="prydwen" aria-label="Prydwen tier list by game mode and role">
        <h2 className="og-section-title">Prydwen Tier List (3.7)</h2>
        <p className="og-section-lede">
          The community reference, split by game mode and combat role. Tap a mode to switch.
        </p>
        <PrydwenTierList />
      </section>

      <h2 className="og-section-title" style={{ marginTop: "3rem" }}>Our Editorial Rankings</h2>

      {rows.map((row) => {
        const badgeClass = TIER_BADGE_CLASS[row.tier] ?? "og-tier-badge tier-B";
        return (
          <section
            key={row.tier}
            id={`tier-${row.tier.toLowerCase()}`}
            className="og-tier-row"
            aria-label={`Tier ${row.tier}`}
          >
            <h2 className="og-tier-side" style={{ margin: 0 }}>
              <span className={badgeClass}>{row.tier}</span>
              <span className="og-tier-label">{row.label}</span>
            </h2>
            <ul className="og-tier-members">
              {row.members.map((m) => {
                const inHub = hubSlugs.has(m.slug);
                const char = getCharacter(m.slug);
                const el = char ? elementColor(char.profile.element) : "#6e6e73";
                const face = (
                  <Image
                    src={`/images/chars/${m.slug}.png`}
                    alt={m.name}
                    width={64}
                    height={64}
                    className="og-tier-face"
                    loading="lazy"
                    decoding="async"
                  />
                );
                return (
                  <li key={m.slug} className="og-tier-member">
                    {inHub ? (
                      <Link
                        href={`/characters/${m.slug}`}
                        className="og-tier-face-link"
                        aria-label={`${m.name} — character page`}
                      >
                        {face}
                      </Link>
                    ) : (
                      face
                    )}
                    <div className="og-tier-info">
                      {inHub ? (
                        <Link href={`/characters/${m.slug}`} className="og-tier-name">
                          {m.name}
                        </Link>
                      ) : (
                        <span className="og-tier-name">{m.name}</span>
                      )}
                      {char && (
                        <p className="og-tier-meta">
                          <span>{char.profile.role}</span>
                          <span
                            className="element-dot"
                            style={{ background: el }}
                            aria-hidden="true"
                          />
                          <span>{char.profile.element}</span>
                        </p>
                      )}
                      <p className="og-tier-note">{m.note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {unranked.length > 0 && (
        <div id="unranked" className="og-tier-unranked" role="note">
          <p style={{ margin: 0 }}>
            <strong>Not yet ranked: </strong>
            {unranked.map((c, i) => (
              <span key={c!.slug}>
                {i > 0 && ", "}
                <Link href={`/characters/${c!.slug}`}>{c!.name}</Link>
              </span>
            ))}{" "}
            — pre-release, so no tier placement until launch.
          </p>
        </div>
      )}

      <div className="og-tier-foot">
        <p>
          Want the details?{" "}
          <Link href="/characters">Browse the character hub</Link> for builds,
          weapons, echo sets, and team comps.
        </p>
      </div>
    </>
  );
}

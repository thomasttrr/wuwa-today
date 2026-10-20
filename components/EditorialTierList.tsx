import Image from "next/image";
import Link from "next/link";
import tierList from "@/data/tier-list.json";
import { characterSlugs, getCharacter } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

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

/** Our editorial tier list — the SS/S/A/B/C face-card rows. Server-rendered. */
export default function EditorialTierList() {
  const hubSlugs = new Set(characterSlugs());
  const rows = tierList.tiers as TierRow[];

  return (
    <>
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
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import UpdatedStamp from "@/components/UpdatedStamp";
import TierListViews from "@/components/TierListViews";
import PrydwenTierList from "@/components/PrydwenTierList";
import EditorialTierList from "@/components/EditorialTierList";
import tierList from "@/data/tier-list.json";
import { characterSlugs, getCharacter, isPreRelease } from "@/lib/characters";

export const metadata: Metadata = {
  title: "Character Tier List (3.7) — WuWa Today",
  description:
    "Who's actually worth building in Wuthering Waves 3.7? Prydwen's meta tier list split by game mode (Tower of Adversity / Whimpering Wastes) and role, plus our editorial rankings.",
  alternates: { canonical: "/tier-list" },
};

export default function TierListPage() {
  const hubSlugs = new Set(characterSlugs());
  const rankedSlugs = new Set(
    (tierList.tiers as { members: { slug: string }[] }[]).flatMap((r) =>
      r.members.map((m) => m.slug)
    )
  );
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
        meta={<UpdatedStamp />}
      />

      <TierListViews
        prydwen={<PrydwenTierList hubSlugs={[...hubSlugs]} />}
        editorial={<EditorialTierList />}
      />

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

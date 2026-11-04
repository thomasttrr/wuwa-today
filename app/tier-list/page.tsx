import type { Metadata } from "next";
import Link from "next/link";
import TierExplorer from "@/components/TierExplorer";
import { buildTierModel } from "@/lib/tiers";
import "./tier-list.css";

export const metadata: Metadata = {
  title: "Character Tier List (3.7) — WuWa Today",
  description:
    "Who's actually worth building in Wuthering Waves 3.7? Community tier lists by game mode (Tower of Adversity / Whimpering Wastes) and role, plus our editorial rankings — with portraits, element filters and your own roster.",
  alternates: { canonical: "/tier-list" },
};

export default function TierListPage() {
  const model = buildTierModel();
  const { meta } = model;

  return (
    <>
      <header className="tl-hero">
        <p className="rs-kicker">
          Version {meta.oursVersion} · {model.chars.length} Resonators
        </p>
        <h1 className="tl-hero-title">Tier list</h1>
        <p className="tl-hero-lede">
          Who&apos;s worth building right now. Switch game mode to watch the
          meta shift, filter by element, or mark your roster to see what you
          already own that&apos;s strong.
        </p>
      </header>

      <TierExplorer model={model} />

      <footer className="tl-foot">
        <div>
          <h2>Sources</h2>
          <p>
            <strong>Community</strong> and <strong>Value</strong> placements are from{" "}
            <a href={meta.sourceUrl} target="_blank" rel="noopener noreferrer">
              Prydwen
            </a>{" "}
            ({meta.prydwenPatch} list updated {meta.prydwenUpdated}; value list {meta.valuePatch},
            updated {meta.valueUpdated}).
          </p>
          <p>
            <strong>WuWa Today</strong> is our editorial list (updated {meta.oursUpdated}). {meta.oursNote}
          </p>
        </div>
        {model.unranked.length > 0 && (
          <div>
            <h2>Not ranked yet</h2>
            <p>
              {model.unranked.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && ", "}
                  <Link href={`/characters/${c.slug}`}>{c.name}</Link>
                </span>
              ))}
              . Pre-release Resonators get no placement until launch.
            </p>
          </div>
        )}
        <div>
          <h2>Going deeper</h2>
          <p>
            Tap any portrait for both lists side by side, or{" "}
            <Link href="/characters">browse the character hub</Link> for full builds and teams.
          </p>
        </div>
      </footer>
    </>
  );
}

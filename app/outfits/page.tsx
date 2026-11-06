import PageHero from "@/components/PageHero";
import type { Metadata } from "next";
import Link from "next/link";
import UpdatedStamp from "../../components/UpdatedStamp";
import { outfits, bannerMeta, type OutfitItem } from "../../lib/data";
import "./outfits.css";

export const metadata: Metadata = {
  title: "Wuthering Waves Outfits & Cosmetics — The Complete Catalog",
  description:
    "Every outfit, accessory, weapon skin, bike skin and Phantom Echo skin in Wuthering Waves — official art, who it is for, and how to get it.",
  alternates: { canonical: "/outfits" },
};

const SECTIONS: { title: string; compact: boolean; match: (kind: string) => boolean }[] = [
  { title: "Outfits", compact: false, match: (k) => k.endsWith("Outfit") },
  { title: "Accessories", compact: true, match: (k) => k === "Accessory" },
  { title: "Weapon Skins", compact: true, match: (k) => k === "Weapon Skin" },
  { title: "Bike Skins", compact: true, match: (k) => k === "Bike Skin" },
  { title: "Display Themes", compact: true, match: (k) => k === "Display Theme" },
  { title: "Gliders", compact: true, match: (k) => k === "Glider Skin" },
  { title: "Wings", compact: true, match: (k) => k === "Wing Skin" },
  { title: "Phantom Echo Skins", compact: true, match: (k) => k === "Phantom Echo Skin" },
  { title: "Collection Items", compact: true, match: (k) => k === "Collection Item" },
];

function Card({ o, compact }: { o: OutfitItem; compact: boolean }) {
  return (
    <article className="of-card">
      {o.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="of-img" src={o.image} alt={o.imageAlt} loading="lazy" />
      ) : (
        <div className={compact ? "of-noimg" : "of-noimg of-noimg-wide"}>
          No official art found yet
        </div>
      )}
      <div className="of-body">
        <p className="of-meta">
          {o.kind} · Version {o.version}
        </p>
        <h3 className="of-name">{o.name}</h3>
        <p className="of-for">
          For{" "}
          {o.characterSlug ? (
            <Link href={`/characters/${o.characterSlug}`}>{o.character}</Link>
          ) : (
            o.character
          )}
        </p>
        <p className="of-desc">{o.description}</p>
        <p className="of-avail">{o.availability}</p>
        {o.image ? <p className="of-credit">Art: {o.imageCredit}</p> : null}
      </div>
    </article>
  );
}

export default function OutfitsPage() {
  return (
    <>
      <PageHero
        kicker={
          <>
            Version {bannerMeta.version} · {bannerMeta.versionTitle}
          </>
        }
        title="Outfits & Cosmetics"
      >
        The complete catalog — all {outfits.length} outfits, accessories,
        weapon skins, bike skins and more, newest first in each section, with
        the official art and how to get each one.
      </PageHero>
      {SECTIONS.map((s) => {
        const items = outfits.filter((o) => s.match(o.kind));
        if (items.length === 0) return null;
        return (
          <section key={s.title} className="of-section">
            <h2 className="of-section-h">
              {s.title} <span className="of-section-n">{items.length}</span>
            </h2>
            <div className={s.compact ? "of-grid of-grid-compact" : "of-grid"}>
              {items.map((o) => (
                <Card key={o.id} o={o} compact={s.compact} />
              ))}
            </div>
          </section>
        );
      })}
      <div className="of-stamp">
        <UpdatedStamp />
      </div>
    </>
  );
}

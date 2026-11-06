import PageHero from "@/components/PageHero";
import type { Metadata } from "next";
import Link from "next/link";
import UpdatedStamp from "../../components/UpdatedStamp";
import { outfits, bannerMeta } from "../../lib/data";
import "./outfits.css";

export const metadata: Metadata = {
  title: "Wuthering Waves Outfits & Accessories — New in 3.8",
  description:
    "Every new outfit and accessory in Wuthering Waves, by version — official art, who it is for, and how to get it.",
  alternates: { canonical: "/outfits" },
};

export default function OutfitsPage() {
  return (
    <>
      <PageHero
        kicker={
          <>
            Version {bannerMeta.version} · {bannerMeta.versionTitle}
          </>
        }
        title="Outfits"
      >
        Every outfit in the game, newest first — with the official art, who
        each one is for, and how to get it. Accessories and more categories
        are on the way.
      </PageHero>
      <div className="of-grid">
        {outfits.map((o) => (
          <article key={o.id} className="of-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="of-img"
              src={o.image}
              alt={o.imageAlt}
              loading="lazy"
            />
            <div className="of-body">
              <p className="of-meta">
                {o.kind} · Version {o.version}
              </p>
              <h2 className="of-name">{o.name}</h2>
              <p className="of-for">
                For{" "}
                <Link href={`/characters/${o.characterSlug}`}>
                  {o.character}
                </Link>
              </p>
              <p className="of-desc">{o.description}</p>
              <p className="of-avail">{o.availability}</p>
              <p className="of-credit">Art: {o.imageCredit}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="of-stamp">
        <UpdatedStamp />
      </div>
    </>
  );
}

import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { outfits, outfitsMeta, formatServerDate } from "../../lib/data";
import { getCharacter } from "../../lib/characters";
import { ELEMENT_COLORS, elementColor } from "../../lib/elements";
import Wardrobe from "./Wardrobe";
import type { Cosmetic, Shelf, ShelfKey } from "./types";
import "./outfits.css";

export const metadata: Metadata = {
  title: "Wuthering Waves Outfits & Cosmetics — The Complete Catalog",
  description:
    "Every outfit, accessory, weapon skin, bike skin and Phantom Echo skin in Wuthering Waves — official art, who it is for, and how to get it.",
  alternates: { canonical: "/outfits" },
};

/** Shelf order, copy and accent. Each shelf borrows an element colour so the
 *  catalog reads as distinct "departments" at the site's fixed lightness. */
const SHELVES: Shelf[] = [
  { key: "outfits", title: "Outfits", blurb: "Full costume changes for Resonators, deluxe and signature.", color: ELEMENT_COLORS.Havoc, shape: "wide" },
  { key: "accessories", title: "Accessories", blurb: "Hats, ribbons and trinkets worn on top of any outfit.", color: ELEMENT_COLORS.Spectro, shape: "square" },
  { key: "weapons", title: "Weapon Skins", blurb: "New looks for a Resonator's weapon. Stats stay the same.", color: ELEMENT_COLORS.Fusion, shape: "square" },
  { key: "bikes", title: "Bike Skins", blurb: "Liveries for the Expedition Motorbike.", color: ELEMENT_COLORS.Electro, shape: "wide", preview: 12 },
  { key: "echoes", title: "Phantom Echo Skins", blurb: "Alternate appearances for Echoes you summon in combat.", color: ELEMENT_COLORS.Aero, shape: "square", preview: 12 },
  { key: "flight", title: "Gliders & Wings", blurb: "Traversal cosmetics for gliding and flight.", color: ELEMENT_COLORS.Glacio, shape: "square" },
  { key: "themes", title: "Display Themes", blurb: "Backdrops for your in-game profile and terminal.", color: ELEMENT_COLORS.Havoc, shape: "square" },
  { key: "collection", title: "Collection", blurb: "Keepsakes and one-offs.", color: ELEMENT_COLORS.Spectro, shape: "wide" },
  { key: "other", title: "Everything else", blurb: "Cosmetics that don't fit a shelf yet.", color: "#a7a9b4", shape: "square" },
];

function shelfFor(kind: string): ShelfKey {
  if (kind.endsWith("Outfit")) return "outfits";
  switch (kind) {
    case "Accessory": return "accessories";
    case "Weapon Skin": return "weapons";
    case "Bike Skin": return "bikes";
    case "Phantom Echo Skin": return "echoes";
    case "Glider Skin":
    case "Wing Skin": return "flight";
    case "Display Theme": return "themes";
    case "Collection Item": return "collection";
    default: return "other";
  }
}

const isPlainVersion = (v: string) => /^\d+\.\d+$/.test(v);
const versionNum = (v: string) => (isPlainVersion(v) ? parseFloat(v) : -1);
const NEWEST = Math.max(...outfits.map((o) => versionNum(o.version)));

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** A generated "-w480" sibling, when scripts/make-outfit-thumbs.mjs made one. */
function thumbOf(image: string | null): string | null {
  if (!image) return null;
  const thumb = image.replace(/\.webp$/, "-w480.webp");
  return thumb !== image && existsSync(path.join(process.cwd(), "public", thumb)) ? thumb : null;
}

const shelfColor = new Map(SHELVES.map((s) => [s.key, s.color]));

const items: Cosmetic[] = outfits.map((o) => {
  const shelf = shelfFor(o.kind);
  const char = o.characterSlug ? getCharacter(o.characterSlug) : undefined;
  return {
    id: o.id,
    name: o.name,
    character: o.character,
    characterSlug: o.characterSlug && char ? o.characterSlug : null,
    kind: o.kind,
    version: o.version,
    versionShort: isPlainVersion(o.version) ? o.version : null,
    isNew: versionNum(o.version) === NEWEST,
    availability: o.availability,
    description: o.description,
    image: o.image || null,
    thumb: thumbOf(o.image || null),
    imageAlt: o.imageAlt,
    imageCredit: o.imageCredit,
    sources: (o.sources ?? []).map((url) => ({ url, host: host(url) })),
    shelf,
    color: char ? elementColor(char.profile.element) : shelfColor.get(shelf) ?? "#a7a9b4",
  };
});

const shelves = SHELVES.filter((s) => items.some((i) => i.shelf === s.key));
const count = (k: ShelfKey) => items.filter((i) => i.shelf === k).length;
const plainVersions = outfits.map((o) => versionNum(o.version)).filter((v) => v > 0);
const oldest = Math.min(...plainVersions).toFixed(1);

export default function OutfitsPage() {
  return (
    <>
      <PageHero kicker={<>The Wardrobe · {items.length} pieces</>} title="Outfits & Cosmetics">
        Every outfit, accessory, weapon skin, bike livery and Phantom Echo skin
        in Wuthering Waves, with the official art and how to get each one.
      </PageHero>

      <dl className="wd-stats" aria-label="Catalog at a glance">
        <div>
          <dt>Pieces</dt>
          <dd>{items.length}</dd>
        </div>
        <div>
          <dt>Outfits</dt>
          <dd>{count("outfits")}</dd>
        </div>
        <div>
          <dt>Bike liveries</dt>
          <dd>{count("bikes")}</dd>
        </div>
        <div>
          <dt>Echo skins</dt>
          <dd>{count("echoes")}</dd>
        </div>
        <div>
          <dt>Versions</dt>
          <dd>
            {oldest}–{NEWEST.toFixed(1)}
          </dd>
        </div>
      </dl>

      <Wardrobe items={items} shelves={shelves} newest={NEWEST.toFixed(1)} />

      <p className="wd-stamp">
        Catalog verified {formatServerDate(outfitsMeta.updatedAt)}. Art © Kuro
        Games. Where no official art exists anywhere, the card says so instead
        of guessing.
      </p>
    </>
  );
}

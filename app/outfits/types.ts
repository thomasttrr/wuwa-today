/** Shapes shared by the outfits page (server) and the Wardrobe (client).
 *  No JSON imports here, so nothing from data/ leaks into the client bundle. */

export type ShelfKey =
  | "outfits"
  | "accessories"
  | "weapons"
  | "bikes"
  | "echoes"
  | "flight"
  | "themes"
  | "collection"
  | "other";

export interface Shelf {
  key: ShelfKey;
  title: string;
  /** One line under the shelf title. */
  blurb: string;
  /** Accent for the shelf's display cases (an element colour). */
  color: string;
  /** "wide" = 4:3 cases for landscape art, "square" = 1:1 cases. */
  shape: "wide" | "square";
  /** In the "All" view, show this many and a "Show all" button. */
  preview?: number;
}

export interface Cosmetic {
  id: string;
  name: string;
  character: string;
  characterSlug: string | null;
  kind: string;
  /** Raw version string from the data, shown as-is in the quick look. */
  version: string;
  /** "3.8" when the version is a plain number, else null (badge hidden). */
  versionShort: string | null;
  isNew: boolean;
  availability: string;
  description: string;
  image: string | null;
  /** Smaller variant for rails and phones, when one was generated. */
  thumb: string | null;
  imageAlt: string;
  imageCredit: string;
  sources: { url: string; host: string }[];
  shelf: ShelfKey;
  /** Character element colour, or the shelf colour. */
  color: string;
}

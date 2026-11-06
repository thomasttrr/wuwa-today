import type { SearchItem } from "@/components/ResonanceNav";
import { characters, toCharacterHubTile } from "@/lib/characters";
import { elementColor } from "@/lib/elements";

/** Character entries for the command palette, served as /search-index.json. */
export function buildCharacterSearchItems(): SearchItem[] {
  return characters.map((c) => {
    const t = toCharacterHubTile(c);
    return {
      kind: "character" as const,
      label: t.name,
      href: `/characters/${t.slug}`,
      hint: `${t.element} · ${t.weapon_type}`,
      color: elementColor(t.element),
      image: t.portrait_url,
    };
  });
}

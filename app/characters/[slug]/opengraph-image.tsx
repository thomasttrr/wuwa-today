import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";
import { characterSlugs, getCharacter } from "@/lib/characters";
import rendersData from "@/data/renders.json";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves character build";

export function generateStaticParams() {
  return characterSlugs().map((slug) => ({ slug }));
}

const renders = rendersData.renders as Record<string, { sizes: { file: string }[] }>;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCharacter(slug);
  if (!c) throw new Error(`[wuwa-today] no character "${slug}" for its preview image`);
  const p = c.profile;
  const art = renders[slug]?.sizes[0]?.file;
  return ogImage({
    kicker: `${p.element} · ${p.weapon_type} · ${p.rarity}-star`,
    title: c.name,
    sub: `${p.role}. Build, weapons, echoes, teams and pull verdict.`,
    art: art ? { src: art, kind: "figure" } : { src: p.portrait_url, kind: "figure" },
  });
}

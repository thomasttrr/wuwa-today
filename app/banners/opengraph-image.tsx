import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";
import { activeBanners, banners, bannerMeta } from "@/lib/data";

/** Live banner splash, else the newest banner that has one. */
const splash = activeBanners.find((b) => b.image)?.image ?? [...banners].reverse().find((b) => b.image)?.image;

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Current Wuthering Waves banners";

const live = activeBanners.flatMap((b) => b.characters.filter((c) => c.rarity === 5).map((c) => c.name));

export default function Image() {
  return ogImage({
    kicker: `Version ${bannerMeta.version} · Banners`,
    title: "Banners",
    sub: live.length ? `Live now: ${[...new Set(live)].join(", ")}` : "Every banner, with countdowns in your time.",
    art: splash ? { src: splash, kind: "scene" } : undefined,
  });
}

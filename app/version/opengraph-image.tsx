import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";
import { activeBanners, banners, bannerMeta } from "@/lib/data";

/** Live banner splash, else the newest banner that has one. */
const splash = activeBanners.find((b) => b.image)?.image ?? [...banners].reverse().find((b) => b.image)?.image;

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves version overview";

export default function Image() {
  return ogImage({
    kicker: `Version ${bannerMeta.version} · Overview`,
    title: bannerMeta.versionTitle,
    sub: "The whole patch on one page: banners, events and what's new.",
    art: splash ? { src: splash, kind: "scene" } : undefined,
  });
}

import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";
import { activeBanners, banners, bannerMeta } from "@/lib/data";

/** Live banner splash, else the newest banner that has one. */
const splash = activeBanners.find((b) => b.image)?.image ?? [...banners].reverse().find((b) => b.image)?.image;

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "WuWa Today: Wuthering Waves banners, codes and events";

export default function Image() {
  return ogImage({
    kicker: `Wuthering Waves · Version ${bannerMeta.version}`,
    title: "WuWa Today",
    sub: "Live banners, working codes, events and builds, checked every day.",
    art: splash ? { src: splash, kind: "scene" } : undefined,
  });
}

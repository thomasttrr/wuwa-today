import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves pre-farm guides";

export default function Image() {
  return ogImage({
    "kicker": "Pre-farm guides",
    "title": "Farm before the banner",
    "sub": "Every material for the featured characters, with routes."
  });
}

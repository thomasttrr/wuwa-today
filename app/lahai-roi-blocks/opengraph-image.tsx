import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Lahai-Roi Blocks";

export default function Image() {
  return ogImage({
    "kicker": "Event",
    "title": "Lahai-Roi Blocks",
    "sub": "The block-puzzle event is back, now with rotation."
  });
}

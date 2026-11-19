import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves teams";

export default function Image() {
  return ogImage({
    "kicker": "Teams",
    "title": "Teams",
    "sub": "Who to field together, and why it works."
  });
}

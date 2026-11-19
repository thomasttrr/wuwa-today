import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves tier list";

export default function Image() {
  return ogImage({
    "kicker": "Tier list",
    "title": "Tier list",
    "sub": "Who's worth building right now, by game mode."
  });
}

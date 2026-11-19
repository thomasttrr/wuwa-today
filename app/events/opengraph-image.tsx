import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves events";

export default function Image() {
  return ogImage({
    "kicker": "Events",
    "title": "Events",
    "sub": "Every live and upcoming event, with dates in your time."
  });
}

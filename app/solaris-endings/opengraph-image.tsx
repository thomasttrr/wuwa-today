import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Solaris endings";

export default function Image() {
  return ogImage({
    "kicker": "Event · Second Coming of Solaris",
    "title": "All 12 endings",
    "sub": "Every ending requirement, and a two-run plan to collect them all."
  });
}

import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Version 4.0";

export default function Image() {
  return ogImage({
    "kicker": "Version 4.0 · Revealed Nov 17, 2026",
    "title": "Embers of the Everbright",
    "sub": "The New Federation opens December 22, 2026."
  });
}

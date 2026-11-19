import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves 4.0 leaks";

export default function Image() {
  return ogImage({
    "kicker": "Version 4.0 and later · Leaks",
    "title": "4.0+ leaks",
    "sub": "Every rumor, tagged by how solid the evidence is."
  });
}

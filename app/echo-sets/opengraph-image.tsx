import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves echo sets";

export default function Image() {
  return ogImage({
    "kicker": "Echo sets",
    "title": "Echo sets worth farming",
    "sub": "Every bonus, member echo and farm route."
  });
}

import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves: your first week";

export default function Image() {
  return ogImage({
    "kicker": "Beginner guides · Start here",
    "title": "Your first week",
    "sub": "Free characters, the unlocks that matter, and the milestones that gate your power."
  });
}

import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves pull planner";

export default function Image() {
  return ogImage({
    "kicker": "Pull planner",
    "title": "Pull planner",
    "sub": "Plan your Astrite across the coming banners."
  });
}

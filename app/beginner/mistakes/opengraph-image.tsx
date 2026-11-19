import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves beginner mistakes";

export default function Image() {
  return ogImage({
    "kicker": "Beginner guides · 5 mistakes",
    "title": "The traps, and the fixes",
    "sub": "Five mistakes that cost resources you cannot get back."
  });
}

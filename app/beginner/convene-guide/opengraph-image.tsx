import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves beginner banners";

export default function Image() {
  return ogImage({
    "kicker": "Beginner guides · Convene guide",
    "title": "Beginner banners, decoded",
    "sub": "Pity, the beginner banners, and which ones are worth your pulls."
  });
}

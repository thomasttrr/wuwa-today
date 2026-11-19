import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves first teams";

export default function Image() {
  return ogImage({
    "kicker": "Beginner guides · First teams",
    "title": "Your first teams",
    "sub": "Three teams you can build without spending a cent."
  });
}

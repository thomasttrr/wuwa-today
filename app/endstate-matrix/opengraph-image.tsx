import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Endstate Matrix";

export default function Image() {
  return ogImage({
    "kicker": "Endgame",
    "title": "Endstate Matrix",
    "sub": "The boss-rush endgame: bosses, rewards and teams."
  });
}

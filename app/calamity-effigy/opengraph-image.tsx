import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Calamity Effigy";

export default function Image() {
  return ogImage({
    "kicker": "Tactical Hologram",
    "title": "Calamity Effigy",
    "sub": "Unlock, mechanics, rewards and who to bring."
  });
}

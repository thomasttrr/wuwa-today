import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves characters";

export default function Image() {
  return ogImage({
    "kicker": "Characters",
    "title": "Characters",
    "sub": "Builds, weapons, echo sets, teams and pull verdicts for every Resonator."
  });
}

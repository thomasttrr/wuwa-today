import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves Phase 2 banners";

export default function Image() {
  return ogImage({
    "kicker": "Phase 2 · Dec 3",
    "title": "The returning three",
    "sub": "Yangyang: Xuanling, Suisui and Hiyuki return on December 3."
  });
}

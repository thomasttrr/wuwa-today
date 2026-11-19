import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves beginner guides";

export default function Image() {
  return ogImage({
    "kicker": "Beginner guides",
    "title": "New to Solaris-3?",
    "sub": "Four short guides that cover the whole onboarding arc."
  });
}

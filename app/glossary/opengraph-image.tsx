import { ogImage, OG_SIZE, OG_TYPE } from "@/lib/og";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Wuthering Waves glossary";

export default function Image() {
  return ogImage({
    "kicker": "Glossary",
    "title": "Plain words",
    "sub": "Every build word, explained in everyday sentences."
  });
}

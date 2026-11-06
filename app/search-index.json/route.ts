import { buildCharacterSearchItems } from "@/lib/search-index";

// Emitted as a static file by `output: "export"`; the palette fetches it on open.
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildCharacterSearchItems());
}

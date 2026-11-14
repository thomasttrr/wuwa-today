// Generates 96px square thumbnails of each event's key art for the Events
// timeline labels. Source: the `image` of every event in data/events.json.
// Output: public/images/events/thumbs/<same file name>.webp. The component
// derives the thumb path from `image` by convention, so data is untouched.
// Safe to re-run: existing files are skipped. Run after adding an event.
import { readFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const raw = JSON.parse(await readFile(path.join(ROOT, "data", "events.json"), "utf8"));
const events = Array.isArray(raw) ? raw : raw.events;
const outDir = path.join(ROOT, "public", "images", "events", "thumbs");
await mkdir(outDir, { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);
let made = 0;
let skipped = 0;
const noArt = [];

for (const e of events) {
  if (!e.image) {
    noArt.push(e.name);
    continue;
  }
  const out = path.join(outDir, path.basename(e.image));
  if (await exists(out)) {
    skipped++;
    continue;
  }
  // `attention` crops to the most detailed region, which keeps faces in frame.
  await sharp(path.join(ROOT, "public", e.image))
    .resize(96, 96, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 78 })
    .toFile(out);
  made++;
}

console.log(`event thumbs: ${made} made, ${skipped} already there`);
if (noArt.length) console.log(`NO ART (${noArt.length}): ${noArt.join(" | ")}`);

// Generates a 480w thumbnail next to every large outfit image listed in
// data/outfits.json (e.g. /images/outfits/lune-noire.webp →
// /images/outfits/lune-noire-w480.webp). The outfits page uses the thumb for
// the runway rail and small screens when the file exists.
// Safe to re-run: existing thumbs are skipped. data/outfits.json is only read,
// never written, and the original images are never modified.
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const WIDTH = 480;
const exists = (p) => access(p).then(() => true, () => false);

const { items } = JSON.parse(await readFile(path.join(ROOT, "data", "outfits.json"), "utf8"));
let made = 0, skipped = 0, small = 0;

for (const it of items) {
  if (!it.image) continue;
  const src = path.join(ROOT, "public", it.image);
  const out = src.replace(/\.webp$/, `-w${WIDTH}.webp`);
  if (out === src) continue;
  if (await exists(out)) { skipped++; continue; }
  const meta = await sharp(src).metadata();
  // Only worth it for genuinely large art (the 1280px outfit showcases).
  if ((meta.width ?? 0) < WIDTH * 1.5) { small++; continue; }
  await sharp(src).resize({ width: WIDTH }).webp({ quality: 80 }).toFile(out);
  made++;
}

console.log(`outfit thumbs: ${made} made, ${skipped} already there, ${small} small enough already`);

// Generates small thumbnail variants (240w, 480w) for every character render
// in data/renders.json, and records them under each entry's `thumbs` field.
// Safe to re-run: existing files are skipped. Only `thumbs` is written back;
// every other field in renders.json is left exactly as it was.
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const MANIFEST = path.join(ROOT, "data", "renders.json");
const WIDTHS = [240, 480];

const exists = (p) => access(p).then(() => true, () => false);

const raw = await readFile(MANIFEST, "utf8");
const data = JSON.parse(raw);
let made = 0, skipped = 0;

for (const [slug, r] of Object.entries(data.renders)) {
  const largest = r.sizes.reduce((a, b) => (b.w > a.w ? b : a));
  const minFull = Math.min(...r.sizes.map((s) => s.w));
  const src = path.join(ROOT, "public", largest.file);
  const thumbs = [];
  for (const w of WIDTHS) {
    // Only worth having when clearly smaller than the smallest existing render
    // (lib/renders.ts never offers anything larger than that one).
    if (w >= minFull * 0.85) continue;
    const file = `/images/renders/${slug}-w${w}.webp`;
    const out = path.join(ROOT, "public", file);
    if (await exists(out)) skipped++;
    else {
      await sharp(src).resize({ width: w }).webp({ quality: 80 }).toFile(out);
      made++;
    }
    const meta = await sharp(out).metadata();
    thumbs.push({ file, w: meta.width, h: meta.height });
  }
  r.thumbs = thumbs;
}

const eol = raw.includes("\r\n") ? "\r\n" : "\n";
await writeFile(MANIFEST, JSON.stringify(data, null, 1).replace(/\n/g, eol) + (raw.endsWith("\n") ? eol : ""));
console.log(`thumbs: ${made} created, ${skipped} already existed, ${Object.keys(data.renders).length} renders`);

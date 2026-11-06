import rendersData from "@/data/renders.json";

/**
 * What a character thumbnail draws: the full-body render (cropped around the
 * head via focusX/zoom) when we have one, otherwise the square portrait with
 * its baked-in name label cropped away. Server-only lookup; client components
 * receive the resolved Thumb as a prop so renders.json stays out of the bundle.
 */
export interface Thumb {
  src: string;
  /** Head x position, 0..1, clamped so the crop never shows empty edges. */
  fx: number;
  /** Render width as % of the poster width (the hub's framing). */
  z: number;
  /** False = square-portrait fallback. */
  render: boolean;
  /** Width-described candidates (renders only); pair with a `sizes`. */
  srcSet?: string;
}

type Size = { file: string; w: number };
type Render = { sizes: Size[]; thumbs?: Size[]; focusX?: number; zoom?: number };

/** All candidates, smallest first. A thumb is only offered when it is clearly
 *  smaller than the smallest full render; otherwise it would cost more bytes. */
function candidates(r: Render): Size[] {
  const full = r.sizes;
  const minFull = Math.min(...full.map((f) => f.w));
  const thumbs = (r.thumbs ?? []).filter((t) => t.w < minFull * 0.85);
  // Never offer more than the smallest full render: thumbnails were always
  // served from it, so the srcset can only ever save bytes.
  const smallestFull = full.reduce((a, b) => (b.w < a.w ? b : a));
  return [...thumbs, smallestFull].sort((a, b) => a.w - b.w);
}
const renders = rendersData.renders as Record<string, Render>;

export function thumbFor(slug: string | null | undefined, portrait?: string | null): Thumb | null {
  const r = slug ? renders[slug] : undefined;
  if (r) {
    const smallest = r.sizes.reduce((a, b) => (b.w < a.w ? b : a));
    const all = candidates(r);
    return {
      src: smallest.file,
      fx: Math.min(0.75, Math.max(0.25, r.focusX ?? 0.5)),
      z: r.zoom ?? 138,
      render: true,
      srcSet: all.map((c) => `${c.file} ${c.w}w`).join(", "),
    };
  }
  const src = portrait ?? (slug ? `/images/chars/${slug}.webp` : null);
  return src ? { src, fx: 0.5, z: 100, render: false } : null;
}

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
}

type Render = { sizes: { file: string; w: number }[]; focusX?: number; zoom?: number };
const renders = rendersData.renders as Record<string, Render>;

export function thumbFor(slug: string | null | undefined, portrait?: string | null): Thumb | null {
  const r = slug ? renders[slug] : undefined;
  if (r) {
    const smallest = r.sizes.reduce((a, b) => (b.w < a.w ? b : a));
    return { src: smallest.file, fx: Math.min(0.75, Math.max(0.25, r.focusX ?? 0.5)), z: r.zoom ?? 138, render: true };
  }
  const src = portrait ?? (slug ? `/images/chars/${slug}.webp` : null);
  return src ? { src, fx: 0.5, z: 100, render: false } : null;
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * Social preview cards (Open Graph / X), rendered at build time.
 * Aftermath look: slate canvas, one gold hairline frame, gold kicker,
 * Cormorant uppercase title, art on the right fading into the slate.
 * Fonts are static TTFs in assets/og-fonts (OFL, from Fontsource), because
 * the image renderer cannot read the site's woff2 files.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const ROOT = process.cwd();
const font = (f: string) => readFile(path.join(ROOT, "assets/og-fonts", f));

/** A /public image as a PNG data URL, or null. Renders are webp, which the
 *  renderer can't draw, so they go through sharp (bundled with Next). If
 *  sharp is unavailable the card is simply drawn without art. */
async function artUrl(publicPath: string, box: { w: number; h: number }, fit: "contain" | "cover"): Promise<string | null> {
  try {
    const sharp = (await import("sharp")).default;
    const buf = await sharp(path.join(ROOT, "public", publicPath))
      .resize(box.w, box.h, { fit, position: fit === "cover" ? "right" : "centre", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export interface OgCard {
  kicker: string;
  title: string;
  /** One short line under the title. */
  sub?: string;
  /** /public path. "figure" = a character render standing right;
   *  "scene" = splash art covering the right half. */
  art?: { src: string; kind: "figure" | "scene" };
}

export async function ogImage({ kicker, title, sub, art }: OgCard) {
  const [cormorant, jost500, jost400] = await Promise.all([
    font("cormorant-latin-600-normal.ttf"),
    font("jost-latin-500-normal.ttf"),
    font("jost-latin-400-normal.ttf"),
  ]);
  const figure = art?.kind === "figure";
  const artBox = figure ? { w: 520, h: 630 } : { w: 640, h: 630 };
  const img = art ? await artUrl(art.src, artBox, figure ? "contain" : "cover") : null;
  const n = title.length;
  const titleSize = n <= 12 ? 116 : n <= 20 ? 92 : n <= 32 ? 72 : 58;
  const textWidth = img ? 640 : 1000;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#15171d", fontFamily: "Jost" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", background: "radial-gradient(60% 80% at 85% 30%, rgba(185,155,104,0.16), rgba(21,23,29,0) 70%)" }} />
        {img && (
          // eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og, not the DOM.
          <img src={img} width={artBox.w} height={artBox.h} style={{ position: "absolute", right: figure ? 40 : 0, top: 0, objectFit: figure ? "contain" : "cover" }} alt="" />
        )}
        {img && !figure && (
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 640, display: "flex", background: "linear-gradient(90deg, #15171d 0%, rgba(21,23,29,0.55) 30%, rgba(21,23,29,0) 60%)" }} />
        )}
        <div style={{ position: "absolute", top: 28, left: 28, right: 28, bottom: 28, display: "flex", border: "1px solid rgba(185,155,104,0.45)" }} />
        <div style={{ position: "absolute", left: 76, top: 72, bottom: 72, width: textWidth, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 500, color: "#d9c49b" }}>{kicker}</div>
          <div style={{ display: "flex", marginTop: 22, fontFamily: "Cormorant", fontWeight: 600, fontSize: titleSize, lineHeight: 0.95, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#ece6da" }}>
            {title}
          </div>
          {sub && <div style={{ display: "flex", marginTop: 26, fontSize: 30, lineHeight: 1.35, color: "#c8c1b4", maxWidth: 600 }}>{sub}</div>}
          <div style={{ display: "flex", marginTop: "auto", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", width: 44, height: 1, background: "#b99b68" }} />
            <div style={{ display: "flex", fontFamily: "Cormorant", fontWeight: 600, fontSize: 38, color: "#d9c49b" }}>WuWa Today</div>
            <div style={{ display: "flex", fontSize: 22, color: "#a29c91", marginLeft: 8 }}>wuwa-today.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Cormorant", data: cormorant, weight: 600, style: "normal" },
        { name: "Jost", data: jost500, weight: 500, style: "normal" },
        { name: "Jost", data: jost400, weight: 400, style: "normal" },
      ],
    },
  );
}

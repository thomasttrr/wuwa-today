import type { MetadataRoute } from "next";

// Required for static export: prerender the manifest at build time.
export const dynamic = "force-static";

/**
 * Web app manifest — lets users install WuWa Today to their home screen.
 * Dark-first to match the Obsidian Glass theme.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WuWa Today — Wuthering Waves Banners, Codes & Events",
    short_name: "WuWa Today",
    description:
      "Your daily Wuthering Waves dashboard: current banners with countdowns, working redeem codes, active events, and reset timers.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#0a0a0c",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

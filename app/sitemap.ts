import type { MetadataRoute } from "next";
import { guides } from "../lib/guides";

const BASE = "https://wuwa-today.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/banners", "/codes", "/events", "/guides"].map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const guidePages = guides.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: new Date(g.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}

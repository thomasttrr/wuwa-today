import type { MetadataRoute } from "next";
import { characters } from "../lib/characters";
import { prefarmSlugs } from "../lib/prefarm";

const BASE = "https://wuwa-today.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/banners", "/events", "/characters", "/pull-planner", "/tier-list", "/pre-farm"].map(
    (p) => ({
      url: `${BASE}${p}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: p === "" ? 1 : 0.8,
    })
  );

  const prefarmPages = prefarmSlugs().map((slug) => ({
    url: `${BASE}/pre-farm/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const characterPages = characters.map((c) => ({
    url: `${BASE}/characters/${c.slug}`,
    lastModified: new Date(c.pull_verdict.published_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...prefarmPages, ...characterPages];
}

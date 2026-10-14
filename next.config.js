/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export keeps hosting cheap and portable (Vercel, Netlify, any static host).
  // Note: with `output: "export"`, dynamic routes like /characters/[slug] are
  // pre-rendered at build time from the data files — exactly what we want.
  output: "export",
  images: { unoptimized: true },
  // The old /guides model is retired. Every legacy guide URL (and the /guides
  // index itself) permanently redirects to its replacement in the character hub.
  // Note: static export cannot apply redirects at runtime, so the production
  // static host (Vercel) applies the same mapping via vercel.json. This config
  // stays the canonical, single-source-of-truth list and applies in `next dev`
  // and any non-export build.
  async redirects() {
    return [
      // Retired /guides index -> character hub.
      { source: "/guides", destination: "/characters", permanent: true },
      // Pull guides -> character pages.
      { source: "/guides/is-hsin-worth-pulling", destination: "/characters/hsin", permanent: true },
      { source: "/guides/is-iuno-worth-pulling", destination: "/characters/iuno", permanent: true },
      { source: "/guides/is-chisa-worth-pulling", destination: "/characters/chisa", permanent: true },
      { source: "/guides/is-suoming-worth-pulling", destination: "/characters/suoming", permanent: true },
      { source: "/guides/is-lynae-worth-pulling", destination: "/characters/lynae", permanent: true },
      { source: "/guides/is-lucilla-worth-pulling", destination: "/characters/lucilla", permanent: true },
      // Build guides -> character pages.
      { source: "/guides/hsin-build-guide", destination: "/characters/hsin", permanent: true },
      { source: "/guides/iuno-build-guide", destination: "/characters/iuno", permanent: true },
      { source: "/guides/chisa-build-guide", destination: "/characters/chisa", permanent: true },
      { source: "/guides/suoming-build-guide", destination: "/characters/suoming", permanent: true },
      { source: "/guides/lynae-build-guide", destination: "/characters/lynae", permanent: true },
      { source: "/guides/lucilla-build-guide", destination: "/characters/lucilla", permanent: true },
      // Team guides -> character pages.
      { source: "/guides/hsin-team-guide", destination: "/characters/hsin", permanent: true },
      { source: "/guides/best-iuno-teams", destination: "/characters/iuno", permanent: true },
      { source: "/guides/best-chisa-teams", destination: "/characters/chisa", permanent: true },
      { source: "/guides/best-suoming-teams", destination: "/characters/suoming", permanent: true },
      { source: "/guides/best-lynae-teams", destination: "/characters/lynae", permanent: true },
      { source: "/guides/best-lucilla-teams", destination: "/characters/lucilla", permanent: true },
      // Selector guide (not character-specific) -> character hub.
      { source: "/guides/moonlit-path-selector", destination: "/characters", permanent: true },
    ];
  },
};

module.exports = nextConfig;

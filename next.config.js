/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export keeps hosting cheap and portable (Vercel, Netlify, any static host).
  // Note: with `output: "export"`, dynamic routes like /guides/[slug] are
  // pre-rendered at build time from the data files — exactly what we want.
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;

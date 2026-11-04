"use client";

import { useEffect } from "react";

/**
 * ElementTheme — re-tunes the whole site to one element while mounted.
 * Sets --el on <body>; @property makes the change ease across the canvas,
 * accents and borders. On unmount it restores the site default (the
 * featured banner's element) stored on body[data-site-el].
 */
export default function ElementTheme({ color }: { color: string }) {
  useEffect(() => {
    const body = document.body;
    body.style.setProperty("--el", color);
    return () => {
      const fallback = body.dataset.siteEl;
      if (fallback) body.style.setProperty("--el", fallback);
    };
  }, [color]);
  return null;
}

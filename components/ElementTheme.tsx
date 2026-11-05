"use client";

import { useEffect } from "react";
import { popElement, pushElement } from "@/lib/site-element";

/**
 * ElementTheme — re-tunes the whole site to one element while mounted
 * (character pages). @property makes the change ease across the canvas,
 * accents and borders; on unmount the live site default comes back.
 */
export default function ElementTheme({ color }: { color: string }) {
  useEffect(() => {
    pushElement(color);
    return () => popElement();
  }, [color]);
  return null;
}

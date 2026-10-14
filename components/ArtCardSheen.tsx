"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Stage 3: client wrapper that gives banner art cards their subtle
 * pointer-tracked sheen. Only the pointer position is tracked here;
 * the visible effect is CSS-gated to (hover: hover) and (pointer: fine)
 * and disabled under prefers-reduced-motion, so this is inert on
 * touch devices and for reduced-motion users.
 */
function handleSheen(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--sheen-x", `${Math.round(e.clientX - r.left)}px`);
  el.style.setProperty("--sheen-y", `${Math.round(e.clientY - r.top)}px`);
}

export default function ArtCardSheen({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <article
      className="card banner-art-card"
      aria-label={label}
      onMouseMove={handleSheen}
    >
      {children}
    </article>
  );
}

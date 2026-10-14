"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Pointer-tracked art effects for banner cards: a faint sheen that follows
 * the cursor, plus subtle parallax (translate + tilt) on the art layer.
 *
 * Only the pointer position is tracked here; every visible effect is
 * CSS-gated to (hover: hover) and (pointer: fine) and disabled under
 * prefers-reduced-motion — inert on touch devices and for reduced-motion
 * users. rAF-throttled so mousemove can't flood style writes.
 */
export default function ArtCardSheen({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const raf = useRef<number | null>(null);

  function handleMove(e: MouseEvent<HTMLElement>) {
    if (raf.current !== null) return;
    const el = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      const r = el.getBoundingClientRect();
      const x = ((clientX - r.left) / r.width - 0.5) * 2; // -1..1
      const y = ((clientY - r.top) / r.height - 0.5) * 2; // -1..1
      el.style.setProperty("--px", x.toFixed(3));
      el.style.setProperty("--py", y.toFixed(3));
      el.style.setProperty("--sheen-x", `${Math.round(clientX - r.left)}px`);
      el.style.setProperty("--sheen-y", `${Math.round(clientY - r.top)}px`);
    });
  }

  function handleLeave(e: MouseEvent<HTMLElement>) {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    e.currentTarget.style.setProperty("--px", "0");
    e.currentTarget.style.setProperty("--py", "0");
  }

  return (
    <article
      className="card banner-art-card"
      aria-label={label}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </article>
  );
}

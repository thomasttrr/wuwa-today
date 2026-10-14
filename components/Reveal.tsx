"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Staggered scroll reveal, progressively enhanced.
 *
 * Content is fully visible without JS: the hidden initial state only exists
 * once JS adds .js-anim to <html>. IntersectionObserver then adds
 * .is-visible per element (with an optional stagger delay) and unobserves it.
 * Under prefers-reduced-motion the CSS snaps everything visible instantly.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("js-anim");
    const el = ref.current;
    if (!el) return;
    if (delay > 0) el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

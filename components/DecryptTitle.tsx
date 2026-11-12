"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "█▓▒░<>/\\|#*+=—";

/**
 * One-shot decrypt settle for the /leaks hero title: the final text is the
 * SSR content (SEO + no-JS safe); on mount, characters scramble and lock in
 * left-to-right over ~700ms. Skipped entirely for reduced-motion visitors.
 */
export default function DecryptTitle({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const DURATION = 700;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const locked = Math.floor(t * text.length);
      let out = text.slice(0, locked);
      for (let i = locked; i < text.length; i++) {
        out += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setShown(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return <>{shown}</>;
}

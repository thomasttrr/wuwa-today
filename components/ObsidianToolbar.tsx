"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "./section-rail.css";

/**
 * Section rail (Resonance). Replaces the old static "On this page" box.
 * A slim glass strip that sticks under the nav, numbers each section,
 * tracks the section you are reading (scroll-spy) with a sliding
 * element-colored pill, and shows page progress as a hairline. Same
 * props as before, so every page that used ObsidianToolbar upgrades.
 */
export default function ObsidianToolbar({
  items,
  label,
}: {
  items: { href: string; label: ReactNode }[];
  label: string;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  // While a tapped link is smooth-scrolling, hold the pill on the target so
  // it doesn't flicker through every section in between.
  const lockUntil = useRef(0);
  const firstMeasure = useRef(true);
  const hrefKey = items.map((i) => i.href).join("|");

  // Scroll-spy: the active section is the last one whose top has passed
  // a line ~35% down the viewport.
  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.href.replace(/^#/, "")))
      .filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (performance.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.35;
      let idx = 0;
      targets.forEach((t, i) => {
        if (t.getBoundingClientRect().top - line <= 0) idx = i;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) idx = targets.length - 1;
      setActive(idx);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScrollEnd = () => {
      lockUntil.current = 0;
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onScroll);
    };
    // hrefKey stands in for `items`: same sections, same effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hrefKey]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const a = list.querySelectorAll<HTMLElement>(":scope > a")[active];
      if (!a) return;
      setPill({ x: a.offsetLeft, w: a.offsetWidth });
      if (list.scrollWidth > list.clientWidth) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        list.scrollTo({
          left: a.offsetLeft - (list.clientWidth - a.offsetWidth) / 2,
          behavior: firstMeasure.current || reduced ? "auto" : "smooth",
        });
      }
      firstMeasure.current = false;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  return (
    <nav className="sr" aria-label={label}>
      <div ref={listRef} className="sr-links">
        {pill && (
          <span className="sr-pill" aria-hidden="true" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} />
        )}
        {items.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            aria-current={i === active ? "location" : undefined}
            onClick={() => {
              // Fallback for browsers without `scrollend`: release after 1.2s.
              lockUntil.current = performance.now() + 1200;
              setActive(i);
            }}
          >
            <span className="sr-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            {item.label}
          </a>
        ))}
      </div>
      <span className="sr-progress" aria-hidden="true" />
    </nav>
  );
}

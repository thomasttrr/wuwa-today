"use client";

import { useEffect, useState } from "react";

/**
 * ScrollTop — floating glass button that appears once the user has
 * scrolled down. 44px touch target, sits above the floating mobile nav,
 * hides while the footer is on screen so it never overlaps footer
 * content, and respects prefers-reduced-motion.
 */
export default function ScrollTop() {
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer.site-footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  if (!visible || footerVisible) return null;

  const goTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      className="og-scrolltop"
      aria-label="Scroll back to top"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

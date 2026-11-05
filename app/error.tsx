"use client";

import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <OgPageHero
        kicker="Something broke"
        title="This page hit a snag"
        lede="An error stopped this page from loading. Trying again usually fixes it — nothing about your visit was lost."
      />
      <p style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
        <button type="button" className="og-btn" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="og-btn og-btn-glass">
          Back to today&apos;s dashboard
        </Link>
      </p>
    </>
  );
}

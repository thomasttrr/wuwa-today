import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";

export const metadata: Metadata = {
  title: "Beginner Guides — Start Wuthering Waves Right | WuWa Today",
  description:
    "New-player guides for Wuthering Waves: what to do first, how beginner banners work, F2P starter teams, and the mistakes that cost you Astrite.",
  alternates: { canonical: "/beginner" },
};

const GUIDES = [
  {
    slug: "start-here",
    title: "Start here",
    blurb:
      "Your free roster, the first things to unlock, and the Union Level milestones that actually matter.",
    art: "/images/chars/yangyang.png",
  },
  {
    slug: "convene-guide",
    title: "Beginner Convene guide",
    blurb:
      "Utterance of Marvels, Beginner's Choice, pity rules, and which banners are worth your pulls.",
    art: "/images/chars/verina.png",
  },
  {
    slug: "first-teams",
    title: "Your first teams",
    blurb:
      "F2P-friendly starter teams built from free characters and beginner-banner picks, with simple rotations.",
    art: "/images/chars/chixia.png",
  },
  {
    slug: "mistakes",
    title: "5 mistakes to avoid",
    blurb:
      "The traps every new account walks into — and what to do instead before they cost you resources.",
    art: "/images/chars/baizhi.png",
  },
];

export default function BeginnerHub() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Beginner guides"
        title="New to Solaris-3?"
        lede="Four short guides that cover the whole onboarding arc: what to do first, how beginner banners work, who to team up, and the mistakes that cost you Astrite. Every fact below is verified against two or more sources."
        meta={
          <>
            <UpdatedStamp />
          </>
        }
      />

      <div className="og-grid">
        {GUIDES.map((g, i) => (
          <Reveal key={g.slug} delay={Math.min(i * 60, 240)}>
            <Link
              href={`/beginner/${g.slug}`}
              className="og-radius-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <div className="og-char-art" style={{ maxWidth: 220 }}>
                <Image
                  src={g.art}
                  alt={`${g.title} guide art`}
                  width={440}
                  height={440}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="og-char-kicker">Beginner guide</p>
              <h2 className="og-h2" style={{ margin: "0.25rem 0" }}>
                {g.title}
              </h2>
              <p className="og-section-blurb">{g.blurb}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <p className="og-version-note">
        Beginner banners are re-verified in game version 3.7. The newer New
        Voyage Companions flow is still being confirmed for fresh accounts — see
        the Convene guide for what&apos;s verified so far.
      </p>
    </>
  );
}

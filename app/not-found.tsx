import type { Metadata } from "next";
import Link from "next/link";
import SearchButton from "@/components/SearchButton";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="nf">
      <h1>Page not found</h1>
      <p className="lede">
        That page doesn&apos;t exist — maybe it expired like a livestream code.
      </p>
      <ul className="nf-links">
        <li><Link href="/">Today&apos;s dashboard</Link></li>
        <li><Link href="/characters">Characters</Link></li>
        <li><Link href="/banners">Banners</Link></li>
        <li><Link href="/events">Events</Link></li>
      </ul>
      <SearchButton />
    </section>
  );
}

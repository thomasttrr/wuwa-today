import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";

export default function NotFound() {
  return (
    <>
      <OgPageHero
        kicker="404"
        title="Page not found"
        lede="That page doesn't exist — maybe it expired like a livestream code."
      />
      <p>
        <Link href="/" className="og-btn">
          Back to today&apos;s dashboard
        </Link>
      </p>
    </>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p className="lede">
        That page doesn't exist — maybe it expired like a livestream code.
      </p>
      <p>
        <Link href="/">Back to today's dashboard →</Link>
      </p>
    </>
  );
}

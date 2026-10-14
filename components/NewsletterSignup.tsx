"use client";

import { useState } from "react";

/**
 * Newsletter signup — MVP stub. No backend yet: submitting shows a
 * confirmation and logs the address to the console. Wire to a real provider
 * (Buttondown, ConvertKit, etc.) before launch. See README.md.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    // PLACEHOLDER: replace with a real newsletter provider API call.
    console.log("[newsletter-stub] signup:", email);
    setDone(true);
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading" style={{ marginTop: 0 }}>
        The Rover's Briefing
      </h2>
      <p className="lede" style={{ marginBottom: 0 }}>
        One short email per patch: what changed, what's worth pulling, and which
        codes expire soon. No spam, unsubscribe anytime.
      </p>
      {done ? (
        <p style={{ color: "var(--green)", fontWeight: 700 }}>
          You're on the list — see you at the next patch.
        </p>
      ) : (
        <form onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit">Sign up</button>
        </form>
      )}
      <p className="note">
        MVP note: signups are not stored anywhere yet — connect a newsletter
        provider before promoting this.
      </p>
    </section>
  );
}

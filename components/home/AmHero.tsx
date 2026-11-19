"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import useNow from "../useNow";
import AmSky from "./AmSky";
import { AmCountdown, AmProgress } from "./AmTime";
import { YourTime } from "../LocalTime";
import type { FullRender } from "@/lib/renders";

export interface AmHeroProps {
  version: string;
  versionTitle: string;
  /** Null when no banner is live: the hero then shows only the next-version slide. */
  lead: { name: string; href: string | null } | null;
  blurb: string;
  render: FullRender | null;
  renderAlt: string;
  banner: { startsAt: string; endsAt: string; phase: string; endLabel: string; estimated: boolean } | null;
  /** Build time, seeds the launch-day check so hydration matches. */
  builtAt: number;
  next: null | {
    version: string;
    title: string;
    launchDay: string;
    launchLabel: string;
    revealedAt: string;
    revealedLabel: string;
    trailer: string;
    blurb: string;
    cast: { name: string; art: string }[];
  };
}

const HERO_SIZES = "(max-width: 900px) 92vw, 62vw";

/**
 * The home hero. Two slides share one stage: "Live now" (the featured
 * Resonator, her banner countdown and how far the phase has run) and, once
 * the next version is revealed, its takeover (the reveal cards fanned out,
 * the version title and the countdown to launch day). The sky canvas
 * cross-fades between the two palettes. With no live banner (between
 * versions) the takeover is the whole hero; once launch day passes it says
 * the version has arrived instead of counting down.
 */
export default function AmHero(p: AmHeroProps) {
  const live = p.banner && p.lead ? { banner: p.banner, lead: p.lead } : null;
  const both = !!live && !!p.next;
  const [slide, setSlide] = useState<"now" | "fed">(live ? "now" : "fed");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const fed = slide === "fed" && !!p.next;
  const clock = useNow(60_000);
  const launched = !!p.next && (clock ? clock.getTime() : p.builtAt) >= Date.parse(p.next.launchDay);
  const keys = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const nextSlide = slide === "now" ? "fed" : "now";
    setSlide(nextSlide);
    tabs.current[nextSlide === "now" ? 0 : 1]?.focus();
  };

  return (
    <section className="am-hero" data-s={fed ? "fed" : "now"} aria-labelledby="am-h1">
      <AmSky fed={fed} />
      {live && p.render && (
        /* eslint-disable-next-line @next/next/no-img-element -- LCP art layer with its own srcset. */
        <img
          className="am-fig"
          src={p.render.src}
          srcSet={p.render.srcSet}
          sizes={HERO_SIZES}
          width={p.render.w}
          height={p.render.h}
          alt={p.renderAlt}
          loading="eager"
          fetchPriority="high"
        />
      )}

      <div className="am-hero-top">
        <div className="am-wrap">
          <p className="am-era">
            <b>{fed && p.next ? p.next.version : p.version}</b>
            <i>{fed && p.next ? "The New Federation" : p.versionTitle}</i>
          </p>
          {both && p.next && (
            <div className="am-tabs" role="tablist" aria-label="Hero view">
              <button
                ref={(el) => {
                  tabs.current[0] = el;
                }}
                type="button"
                role="tab"
                id="am-tab-now"
                aria-controls="am-panel-now"
                aria-selected={!fed}
                tabIndex={fed ? -1 : 0}
                onClick={() => setSlide("now")}
                onKeyDown={keys}
              >
                Live now
              </button>
              <button
                ref={(el) => {
                  tabs.current[1] = el;
                }}
                type="button"
                role="tab"
                id="am-tab-fed"
                aria-controls="am-panel-fed"
                aria-selected={fed}
                tabIndex={fed ? 0 : -1}
                onClick={() => setSlide("fed")}
                onKeyDown={keys}
              >
                Version {p.next.version}
              </button>
            </div>
          )}
        </div>
      </div>

      {live && (
      <div
        className="am-wrap am-slide am-slide-now"
        id="am-panel-now"
        role={both ? "tabpanel" : undefined}
        aria-labelledby={both ? "am-tab-now" : undefined}
        aria-hidden={fed || undefined}
        inert={fed || undefined}
      >
        <h1 id="am-h1" className="am-name">
          <span className="am-sr">Wuthering Waves today. Featured on the live banner: </span>
          {live.lead.name}
        </h1>
        <div className="am-under">
          <div>
            <p className="am-lead">
              {live.banner.phase} closes in{live.banner.estimated ? " (estimated)" : ""}
            </p>
            <AmCountdown target={live.banner.endsAt} label={`${live.lead.name}'s banner closes in`} />
          </div>
          <div className="am-cta">
            <p>{p.blurb}</p>
            <div className="am-btns">
              {live.lead.href && (
                <Link href={live.lead.href} className="am-btn">
                  {live.lead.name} build
                </Link>
              )}
              <Link href="/pull-planner" className="am-btn am-ghost">
                Plan my pulls
              </Link>
            </div>
          </div>
        </div>
        <AmProgress
          start={live.banner.startsAt}
          end={live.banner.endsAt}
          label={(pct) => `${live.banner.phase} is ${pct}% through`}
          note={
            <>
              Closes {live.banner.endLabel}, server time
              <YourTime iso={live.banner.endsAt} prefix="; " />
            </>
          }
        />
      </div>
      )}

      {p.next && (
        <div
          className={live ? "am-slide am-slide-fed" : "am-slide am-slide-fed am-slide-solo"}
          id="am-panel-fed"
          role={both ? "tabpanel" : undefined}
          aria-labelledby={both ? "am-tab-fed" : undefined}
          aria-hidden={!fed || undefined}
          inert={!fed || undefined}
        >
          <div className="am-fan" aria-hidden="true">
            {p.next.cast.map((c, i) => (
              /* eslint-disable-next-line @next/next/no-img-element -- decorative fan. */
              <img key={c.name} src={c.art} alt="" loading="lazy" decoding="async" style={{ "--i": i - 3 } as React.CSSProperties} />
            ))}
          </div>
          <div className="am-wrap">
            <FedTitle solo={!live}>
              {!live && <span className="am-sr">Wuthering Waves today. Next: Version {p.next.version}, </span>}
              <span className="am-emb">{p.next.title.split(" ")[0]}</span> {p.next.title.split(" ").slice(1, 3).join(" ")}
              <br />
              <em>{p.next.title.split(" ").slice(3).join(" ")}</em>
            </FedTitle>
            <div className="am-under">
              <div>
                {launched ? (
                  <>
                    <p className="am-lead">Version {p.next.version}</p>
                    <p className="am-fed-out">Out now</p>
                  </>
                ) : (
                  <>
                    <p className="am-lead">Launch day, in server time</p>
                    <AmCountdown target={p.next.launchDay} label={`Time until Version ${p.next.version} launch day`} />
                  </>
                )}
              </div>
              <div className="am-cta">
                <p>
                  {launched
                    ? `Version ${p.next.version} arrived ${p.next.launchLabel}. Its banners go up here once Kuro's official notice is checked; the seven new Resonators are below.`
                    : p.next.blurb}
                </p>
                <div className="am-btns">
                  <a href="#fed" className="am-btn">
                    Meet the seven
                  </a>
                  <Link href="/version-4-0" className="am-btn am-ghost">
                    What we know
                  </Link>
                </div>
              </div>
            </div>
            <AmProgress
              start={p.next.revealedAt}
              end={p.next.launchDay}
              label={() => (
                <>
                  Revealed {p.next!.revealedLabel} with <em>{p.next!.trailer}</em>
                </>
              )}
              note={`${launched ? "Arrived" : "Arrives"} ${p.next.launchLabel}`}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/** The takeover title: the page's h1 when it is the whole hero, else an h2. */
function FedTitle({ solo, children }: { solo: boolean; children: React.ReactNode }) {
  return solo ? (
    <h1 id="am-h1" className="am-fed-title">
      {children}
    </h1>
  ) : (
    <h2 className="am-fed-title">{children}</h2>
  );
}

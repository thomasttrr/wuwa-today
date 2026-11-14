import type { Metadata } from "next";
import Link from "next/link";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import DecryptTitle from "@/components/DecryptTitle";
import SpoilerCover, { RevealAllSpoilers } from "@/components/SpoilerCover";
import "./leaks.css";

export const metadata: Metadata = {
  title: "4.0 and later leaks & rumors — Anna, Lucille, the New Federation, and the wider 4.x cast",
  description:
    "Everything leaked or rumored about Wuthering Waves Version 4.0 and beyond: Anna and Lucille, the New Federation region, a flying vehicle in the game files, a reworked Tune Break, and the wider 4.x roster — every claim tagged by how solid its evidence is.",
  alternates: { canonical: "/leaks" },
};

type Tag = "Datamined" | "Repeated leak" | "Single leak" | "Speculation" | "In-game lore";

const TAG_COLORS: Record<Tag, string> = {
  Datamined: "#7ee2a8",
  "Repeated leak": "#8ecbff",
  "Single leak": "#ffd97e",
  Speculation: "#c9a7ff",
  "In-game lore": "#ffb3c2",
};

const TAG_STRENGTH: Record<Tag, number> = {
  Datamined: 5,
  "In-game lore": 5,
  "Repeated leak": 4,
  "Single leak": 2,
  Speculation: 1,
};

function Chip({ tag }: { tag: Tag }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.1rem 0.5rem",
        borderRadius: "999px",
        border: `1px solid ${TAG_COLORS[tag]}`,
        color: TAG_COLORS[tag],
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {tag}
    </span>
  );
}

function Meter({ tag }: { tag: Tag }) {
  const n = TAG_STRENGTH[tag];
  return (
    <span className="lk-meter" style={{ color: TAG_COLORS[tag] }} aria-label={`Evidence strength ${n} of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className={i < n ? "on" : undefined} />
      ))}
    </span>
  );
}

function Claim({ tag, children }: { tag: Tag; children: React.ReactNode }) {
  return (
    <div className="lk-claim" style={{ ["--tag" as string]: TAG_COLORS[tag] }}>
      <div className="lk-claim-meta">
        <Chip tag={tag} />
        <Meter tag={tag} />
      </div>
      <p>{children}</p>
    </div>
  );
}

function FileHead({ file, title, blurb }: { file: string; title: string; blurb: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p className="lk-file">{file}</p>
      <h2 className="og-h2" style={{ margin: "0 0 0.3rem" }}>
        {title}
      </h2>
      <p className="og-section-blurb" style={{ margin: 0 }}>
        {blurb}
      </p>
    </div>
  );
}

const TIMELINE: { when: string; what: string; hot?: boolean }[] = [
  { when: "Dec 21, 2026", what: "Version 3.8 ends — the last patch of the 3.X arc" },
  { when: "Late Nov – early Dec", what: "4.0 closed beta runs; kit details usually leak here" },
  { when: "Mid-December", what: "Version 4.0 Special Broadcast — final banner order, codes, events" },
  { when: "≈ Dec 23, 2026", what: "Version 4.0 launches: New Federation, Anna's banner", hot: true },
  { when: "Mid-January 2027", what: "Phase 2 — Lucille's projected banner window" },
  { when: "Early Feb 2027", what: "Version 4.1 on the 42-day cycle — Amethyst's rumored slot" },
];

export default function LeaksPage() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <header className="og-page-hero">
        <span className="lk-signal">
          <span className="lk-signal-dot" aria-hidden />
          Signal live · Last sweep Nov 14, 2026 · Nothing here is official
        </span>
        <p className="og-page-kicker" style={{ marginTop: "1.1rem" }}>
          Version 4.0 and later · Unreleased · Leaks and rumors
        </p>
        <h1 className="og-page-title og-display">
          <DecryptTitle text="4.0+ LEAKS" />
        </h1>
        <p className="og-page-lede">
          Version 4.0 is expected to skip 3.9 entirely and open a whole new region — the New
          Federation — around December 23, 2026. Kuro Games has announced none of it. This page
          collects every leak and rumor worth knowing, tags each claim by how solid the evidence
          is, and names its sources — so you can tell the datamined facts from the wishful
          thinking.
        </p>
        <div className="og-meta-row">
          <UpdatedStamp />
          <RevealAllSpoilers />
        </div>
      </header>

      <ObsidianToolbar
        label="Jump to"
        items={[
          { href: "#timeline", label: "Timeline" },
          { href: "#anna", label: "Anna" },
          { href: "#lucille", label: "Lucille" },
          { href: "#region", label: "Region & systems" },
          { href: "#wider-cast", label: "The wider 4.x cast" },
          { href: "#sources", label: "Sources" },
        ]}
      />

      <div className="og-section" id="timeline" style={{ scrollMarginTop: "120px" }}>
        <Reveal>
          <p style={{ margin: "0 0 1rem", lineHeight: 1.6 }}>
            <strong>How the tags work:</strong> the meter beside each claim is its evidence
            strength. <strong>Datamined</strong> means seen in game data or model files.{" "}
            <strong>Repeated leak</strong> means several trackers agree. <strong>Single leak</strong>{" "}
            is one source so far. <strong>Speculation</strong> is community inference.{" "}
            <strong>In-game lore</strong> is the one solid ground — checkable in the live game
            today. All dates below are estimates worked out from the game&rsquo;s 42-day version
            cycle.
          </p>
          <div className="lk-tl">
            {TIMELINE.map((n) => (
              <div key={n.what} className={n.hot ? "lk-tl-node hot" : "lk-tl-node"}>
                <div className="lk-tl-when">{n.when}</div>
                <div className="lk-tl-what">{n.what}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="anna" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 01 · Subject"
          title="Anna — the rumored Phase 1 banner"
          blurb="The steadiest name in the whole 4.x leak pile, and the only one with a leaked model."
        />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>Model — datamined render</span>
              <span>Not official art · AI-enhanced</span>
            </div>
            <SpoilerCover label="Anna — datamined model render">
            <div className="lk-view-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-model-enh-1200.webp"
                srcSet="/images/leaks/anna-model-enh-1200.webp 1200w, /images/leaks/anna-model-enh-1920.webp 1920w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="Leaked model renders of Anna: front view, side view, and a face close-up with a wide rose-trimmed hat"
                width={1200}
                height={453}
                loading="lazy"
              />
              <span className="lk-corner tl" aria-hidden />
              <span className="lk-corner tr" aria-hidden />
              <span className="lk-corner bl" aria-hidden />
              <span className="lk-corner br" aria-hidden />
            </div>
            </SpoilerCover>
            <div className="lk-specs">
              <div className="lk-spec">
                <div className="lk-spec-k">Rumored slot</div>
                <div className="lk-spec-v">4.0 · Phase 1</div>
              </div>
              <div className="lk-spec">
                <div className="lk-spec-k">Attribute</div>
                <div className="lk-spec-v">Fusion</div>
              </div>
              <div className="lk-spec">
                <div className="lk-spec-k">Design read</div>
                <div className="lk-spec-v">Noble vampire</div>
              </div>
              <div className="lk-spec">
                <div className="lk-spec-k">Art status</div>
                <div className="lk-spec-v">Full 3D model leaked</div>
              </div>
            </div>
          </div>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>3D model — full rotation</span>
              <span>Front · Side · Back · Side · AI-enhanced</span>
            </div>
            <SpoilerCover label="Anna — full rotation render">
            <div className="lk-view-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-rotation-enh-1280.webp"
                srcSet="/images/leaks/anna-rotation-enh-1280.webp 1280w, /images/leaks/anna-rotation-enh-1920.webp 1920w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="Leaked 3D model of Anna shown from four angles: front, side, back, and side"
                width={1280}
                height={640}
                loading="lazy"
              />
              <span className="lk-corner tl" aria-hidden />
              <span className="lk-corner tr" aria-hidden />
              <span className="lk-corner bl" aria-hidden />
              <span className="lk-corner br" aria-hidden />
            </div>
            </SpoilerCover>
          </div>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>3D model — upper-body detail</span>
              <span>Hat off · Costume close-up · AI-enhanced</span>
            </div>
            <SpoilerCover label="Anna — upper-body detail render">
            <div className="lk-view-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-bust-enh-1000.webp"
                srcSet="/images/leaks/anna-bust-enh-1000.webp 1000w, /images/leaks/anna-bust-enh-1600.webp 1600w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="Close-up of the leaked Anna 3D model from the waist up, showing the corset, rose pendant, and armored sleeves"
                width={1000}
                height={761}
                loading="lazy"
              />
              <span className="lk-corner tl" aria-hidden />
              <span className="lk-corner tr" aria-hidden />
              <span className="lk-corner bl" aria-hidden />
              <span className="lk-corner br" aria-hidden />
            </div>
            </SpoilerCover>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            The full model set leaked on November 9–10: a four-angle rotation, this waist-up
            detail render, and the hat-on sheet above. No raw model file (PMX, FBX, or GLB) has
            been posted anywhere we can find — what circulates is renders, and these are all of
            them.
          </p>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-claims">
            <Claim tag="Repeated leak">
              <strong>She opens Version 4.0</strong> as the Phase 1 banner and the player&rsquo;s
              guide into the New Federation — every roadmap summary puts her first.
            </Claim>
            <Claim tag="Datamined">
              <strong>The model above.</strong> Blonde hair fading to red at the tips, pointed
              ears, red eyes, and a gothic red-and-white gown trimmed with roses. This design is
              the one earlier trackers described, sight unseen, as the &ldquo;vampire femme
              fatale&rdquo; — they are the same character, not two. The leak is a full 3D model:
              rotation, close-ups, and in-world shots all match, detail for detail.
            </Claim>
            <Claim tag="In-game lore">
              <strong>A noble of the New Federation.</strong> Leaks make her the daughter of an
              aristocratic family; the Federation&rsquo;s upper class is real in-game lore
              (Mortefi was born into it), and Lily&rsquo;s official profile ties the Federated
              Cities to the Resonator War her story just covered.
            </Claim>
            <Claim tag="Single leak">
              <strong>The &ldquo;Underwater Queen,&rdquo; and Lily&rsquo;s old friend.</strong>{" "}
              Story leaks make Anna a former doctor of the Clotho Doctors Alliance — the
              alliance named in Lily&rsquo;s official profile — who was Lily&rsquo;s classmate
              before the Resonator War split them up, and who now rules the Federation&rsquo;s
              elite. Lily&rsquo;s 3.8 beta lines, shared from Tieba, are the source; her
              Japanese voice is given as Aya Endo.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>Fusion attribute.</strong> Every current tracker has her as Fusion, though
              the earliest posts disagreed.
            </Claim>
            <Claim tag="Single leak">
              <strong>Broadblade, on the newest render</strong> — her weapon has moved with
              every round of leaks: Pistols or Rectifier in the early posts, then a Rectifier
              built around a reworked Tune Break, and the November 10 render tags her a Fusion
              Broadblade hybrid DPS dealing Basic Attack damage. The newest addition (FS,
              November 13, in a post flaired &ldquo;Reliable&rdquo;): the Broadblade takes
              scythe form. Latest word wins for now, but the weapon story rests on leak posts
              until the beta.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>Five-star.</strong> The November render summary states her rarity
              outright, and no tracker disputes it — the opening character of a new region has
              always been a limited five-star.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her Tacet Mark sits on her upper thigh.</strong> A close-up render
              gallery (FS, November 10) shows it there — faint and reddish in the shot, and
              readers dispute how visible it really is, so treat the placement as likely, not
              settled.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her English voice is out there too.</strong> An 11-second in-game clip
              (pero, November 10) carries her English lines. No English voice actor is named
              anywhere yet — the names in the comments are guesses.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her leaked model is already being animated.</strong> A roughly
              37-second fan video (circulating on Facebook, November 14) orbits the leaked
              model in a fan-made night scene — the model matches the datamined renders,
              but the scene and animation are fan work, and no model file comes with it.
            </Claim>
            <Claim tag="Single leak">
              <strong>She may already be in the game.</strong> A Seele text graphic
              (November 9) says Anna — and Amethyst — appear in the Version 3.8 storyline,
              months before her own banner. No screenshots came with the claim, so for now it
              is one text post; players finishing the 3.8 story will settle it either way.
            </Claim>
          </div>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>Model — in-world placement</span>
              <span>Via leak trackers · AI-enhanced</span>
            </div>
            <SpoilerCover label="Anna — in-world placement">
            <div className="lk-view-media lk-drift">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-ingame-enh-1024.webp"
                srcSet="/images/leaks/anna-ingame-enh-1024.webp 1024w, /images/leaks/anna-ingame-enh-1600.webp 1600w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="The leaked Anna model standing in a live-game environment"
                width={1024}
                height={576}
                loading="lazy"
              />
            </div>
            </SpoilerCover>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            The same model placed in the live game world — the usual way model leaks get shown
            off. The design details (rose at the hip, detached sleeves, leg markings) match the
            model sheet exactly.
          </p>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>In-game — story stills</span>
              <span>Via Sleepy · Nov 11 · AI-enhanced</span>
            </div>
            <SpoilerCover label="Anna — story stills">
            <div className="lk-stills">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-1-enh-1200.webp"
                alt="Story still: close profile of Anna — chin, lips, rose earring and high collar"
                width={1200}
                height={508}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-2-enh-1200.webp"
                alt="Story still: Anna in side profile, red eyes and a pointed ear"
                width={1200}
                height={506}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-3-enh-1200.webp"
                alt="Story still: Anna facing forward, raising a clawed black glove"
                width={1200}
                height={504}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-4-enh-1200.webp"
                alt="Story still: Anna close-up beside a glowing red drink"
                width={1200}
                height={508}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-5-enh-1200.webp"
                alt="Story still: Anna front view, the red drink on a stand beside her"
                width={1200}
                height={675}
                loading="lazy"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-story-6-enh-1200.webp"
                alt="Story still: Anna seated on a throne-like chair in a dark hall"
                width={1200}
                height={506}
                loading="lazy"
              />
            </div>
            </SpoilerCover>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            Six stills from an in-game story scene — the glowing red drink, the clawed glove,
            the throne-like chair — posted by the leaker Sleepy on November 11. The costume
            matches the leaked model detail for detail, roses and all.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="lucille" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 02 · Subject"
          title="Lucille — the rumored Phase 2 banner"
          blurb="Thinner evidence than Anna — one bust portrait, no full model, and her element has already changed three times."
        />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>3D model — bust portrait only</span>
              <span>Via StepLeaks · Oct 29 · AI-enhanced</span>
            </div>
            <SpoilerCover label="Lucille — bust portrait">
            <div className="lk-view-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/lucille-model-enh-1200.webp"
                srcSet="/images/leaks/lucille-model-enh-1200.webp 1200w, /images/leaks/lucille-model-enh-1924.webp 1924w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="Leaked 3D model bust portrait of Lucille: blonde twin braids, green eyes, red outfit and black choker, with the StepLeaks watermark"
                width={1200}
                height={859}
                loading="lazy"
              />
              <span className="lk-corner tl" aria-hidden />
              <span className="lk-corner tr" aria-hidden />
              <span className="lk-corner bl" aria-hidden />
              <span className="lk-corner br" aria-hidden />
            </div>
            </SpoilerCover>
            <div className="lk-specs" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <div className="lk-spec">
                <div className="lk-spec-k">Full-body model</div>
                <div className="lk-spec-v">Not acquired</div>
              </div>
              <div className="lk-spec" style={{ borderLeft: "1px solid var(--rs-line-soft)" }}>
                <div className="lk-spec-k">In-game shots</div>
                <div className="lk-spec-v">None</div>
              </div>
            </div>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            The only model visual that has surfaced — a bust portrait carrying the leaker&rsquo;s
            own watermark, mouse cursor and all. The fuller artwork circulating under her name
            elsewhere is fan-made, so it stays off this page.
          </p>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-claims">
            <Claim tag="Single leak">
              <strong>The portrait above</strong> leaked on October 29 through StepLeaks and has
              been reshared everywhere since: green eyes, twin braids, a red outfit, and a black
              choker. It is a bust shot only — the cat ears and cowboy styling from the written
              descriptions don&rsquo;t appear in it, so her full design is still unseen.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>The name isn&rsquo;t final.</strong> She appears as Lucille, Luciel, and
              Luxier across posts. Not to be confused with <strong>Lucilla</strong>, the Glacio
              Rectifier already in the game — a different character, and the most common mix-up
              in 4.0 threads.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>An affectionate catgirl with cowboy styling</strong> — the description has
              been consistent since Seele&rsquo;s original 4.x character list.
            </Claim>
            <Claim tag="Single leak">
              <strong>The Phase 2 slot</strong>, in the back half of 4.0.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her element is unsettled.</strong> Posts have tagged her Fusion, then
              Havoc, then Electro Flare, and most recently Spectro with Pistols as a sub-DPS.
              Treat every version as weak until the beta lands.
            </Claim>
            <Claim tag="Speculation">
              <strong>A Hsin + Suoming team link</strong> — if she is an off-field sub-DPS, she
              would tighten that rotation rather than replace anyone in it.
            </Claim>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="region" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 03 · Theater"
          title="The region and the systems"
          blurb="What 4.0 is expected to add beyond the banners."
        />
        <Reveal>
          <div className="lk-grid2">
            <Claim tag="In-game lore">
              <strong>The New Federation is established lore.</strong> A cyberpunk,
              technology-worshipping nation — home of Calcharo, Mortefi, Lynae, Verina, Aalto,
              Encore, and Mornye — with an aristocracy on top and the Lawless Zone, where
              Calcharo built the Ghost Hounds, at the bottom. Its Sentinel, Prometheus, is named
              in existing lore dialogue.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>4.0 opens the region.</strong> The map leaks describe dense urban districts,
              heavy industry, and elevated transit, with rougher ground outside the city — and,
              like Jinzhou and Ragunna before it, only the first slice of the nation at launch.
            </Claim>
            <Claim tag="Datamined">
              <strong>A flying vehicle sits in the game files</strong>, labelled as Anna&rsquo;s
              flying car. Whether it becomes a summonable exploration tool, a story vehicle, or
              a transit network is unknown — every region so far has shipped its own way of
              getting around.
            </Claim>
            <Claim tag="Single leak">
              <strong>A reworked Tune Break.</strong> Leaks describe a revision of the Version
              3.0 system — likely a third branch beside Tune Rupture and Tune Strain — with Anna
              introducing it and Lucille extending it. Whether existing Resonators get access
              matters more than the details, and nobody knows yet.
            </Claim>
            <Claim tag="Single leak">
              <strong>One rerun name: Qingxiao</strong>, the Aero Sword main DPS from Version 3.6,
              tipped for a Phase 1 rerun — which would be her first.
            </Claim>
            <Claim tag="Speculation">
              <strong>A second Starpath Reverbs selector.</strong> The 3.5 selector let players
              pick an older five-star outright; a 2.X pool for 4.0 is community reasoning, not a
              leak. New Echoes and Sonata Effects are likewise expected by pattern — every region
              has brought them — with no specifics yet.
            </Claim>
            <Claim tag="Single leak">
              <strong>The map&rsquo;s place names are out.</strong> Seele&rsquo;s post
              (translated from Chinese) names them by zone. Former Federation Territory:
              Abandoned Plains, Iron Whale&rsquo;s Fall, and 21GUNS. The Lawless Zone&rsquo;s
              surface: Sacramento Underground Settlement, the Underground Central Commercial
              District, the &ldquo;Drunken Hound&rdquo; tavern, the &ldquo;Ghost Hound&rdquo;
              Mercenary Group headquarters, and the Underground Sewers. The Fallen Old Federation
              City: Dream Road Entrance and Dreamcatcher Settlement.
            </Claim>
            <Claim tag="Single leak">
              <strong>Roughly 3.0-sized.</strong> The same source puts the 4.0 map at about the
              size of Version 3.0&rsquo;s map — a full region, not a small starter area. No map
              graphic has leaked with the names; the posts are text only.
            </Claim>
            <Claim tag="Single leak">
              <strong>Even the login music has leaked.</strong> A clip of the 4.0 login
              soundtrack is circulating (Brantleaks, November 10). Listeners describe an open,
              windswept feel with sirens under it — a fit for the Federated Cities. No track
              name or composer yet, and the description is second-hand, from the post&rsquo;s
              comments.
            </Claim>
            <Claim tag="Single leak">
              <strong>A &ldquo;Dark Tide&rdquo; encounter mode — version unknown.</strong> One
              post (Gamedataleaks, November 11) claims a future version adds random overworld
              encounter points that trigger boss events — Hyvatia, Sigillum, Hecate, and
              others. The post is flaired &ldquo;Questionable,&rdquo; names no version, and
              nothing backs it up yet; the 4.x link is commenters guessing.
            </Claim>
            <Claim tag="Single leak">
              <strong>Old Eden — the sunken city under Anna.</strong> Seele&rsquo;s latest
              (November 13) describes a drowned entertainment city tied to Anna: abandoned
              after the Old Federal Civil War, then rebuilt by three oligarchs on
              &ldquo;Blood of the Age&rdquo; technology, and now run outside the law — illegal
              tech, smuggling, underground auctions, human experimentation. The post names
              eleven spots, from the Paradise Main Stage and the Faust Auction House to
              &ldquo;Anna&rsquo;s Room&rdquo; — which would make her &ldquo;Underwater
              Queen&rdquo; title literal. One source so far.
            </Claim>
            <Claim tag="Speculation">
              <strong>A November 18 drip date is floating around.</strong> One X user with
              no track record (@kyryllmitya, November 12) claims Kuro drops an official 4.x
              character reveal on November 18. Nothing backs it — no characters named, nothing
              shown. It is a dated claim, so it settles itself within the week.
            </Claim>
            <Claim tag="Single leak">
              <strong>Two of the returning three are tipped for 4.1 skins.</strong>{" "}
              Yangyang: Xuanling and Suisui — both back on banners December 3 — are claimed
              to get skins in Version 4.1, themed Valentine / casual outfits. The
              &ldquo;skins next&rdquo; claim itself came from Seele (October 19); the 4.1
              timing and the theme rest on one newer post (DNIA, November 13), so the new
              parts grade as a single leak.
            </Claim>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="wider-cast" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 04 · Roster board"
          title="The wider 4.x cast"
          blurb="Seele's leaked list describes eight New Federation characters. Beyond Anna and Lucille, treat all of it as early roadmap talk."
        />
        <Reveal>
          <div className="lk-cast">
            <div className="lk-cast-row">
              <p>
                <Chip tag="Repeated leak" />{" "}
                <strong>Amethyst (also Aimoshesh / Aimoxishen)</strong> — an anti-Resonance
                humanoid weapon, most often placed in Version 4.1 Phase 1. One leak graphic tags
                her Glacio. The same Seele graphic behind Anna&rsquo;s file also names her in
                the 3.8 story (single leak — see File 01).
              </p>
              <span className="lk-ver">4.1 · P1?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>A masked male Resonator</strong> and a{" "}
                <strong>nano-tech male</strong>, both pointed at Version 4.1; a{" "}
                <strong>masked assassin</strong> floats around 4.3.
              </p>
              <span className="lk-ver">4.1 – 4.3?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>Christine (possibly Kristin)</strong> — a
                celebrity &ldquo;satellite girl from the stars,&rdquo; loosely placed around
                Version 4.2. The remaining descriptions — a former military-police instructor, a
                museum curator, a pigeon detective — have no names or versions attached at all.
              </p>
              <span className="lk-ver">4.2?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Speculation" /> <strong>SP forms for Verina and Calcharo.</strong>{" "}
                Both are New Federation natives, and Yangyang set the SP precedent in 3.5 — but
                the leak sources openly contradict each other on whether these are still in
                development. An older rumor of a Sanhua SP has never landed anywhere.
              </p>
              <span className="lk-ver">4.x?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Speculation" /> <strong>A Sword Art Online crossover</strong> (Kirito
                and Asuna) circulates as a whisper in pull-planning threads. Nothing datamined,
                nothing repeated — the weakest claim on this page.
              </p>
              <span className="lk-ver">Unknown</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="sources" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 05 · Chain of custody"
          title="Sources and how this page is kept"
          blurb="Checked November 12, 2026. Re-checked whenever the beta, drip marketing, or the Special Broadcast lands."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              The 4.x character list originates with <strong>Seele Leaks</strong> (Telegram);
              banner tracking comes from <strong>Wuwaguy</strong> (X) and the dataminer{" "}
              <strong>Nanoka</strong>. The model visuals are sourced post-by-post: Anna&rsquo;s
              render set came via <strong>WuWaLand</strong> (reshared by WuWa Universe on X,
              November 9–10, and mirrored in the PTT C_Chat leak thread), and Lucille&rsquo;s
              bust portrait via <strong>StepLeaks</strong> (October 29). Anna&rsquo;s in-game
              story stills come via <strong>Sleepy</strong> (November 11, relayed by the WuWa
              News channel and PTT), A fan-made animation of Anna&rsquo;s leaked model surfaced on Facebook on November 14 — reshares only, origin unverified, and noted on this page as fan work rather than a leak drop — and the 4.0 map place names and map-size note come from{" "}
              <strong>Seele Leaks</strong> posts of November 11–12 — text only; no map graphic
              has leaked. Roundups consulted:
              GamsGo&rsquo;s 4.0 banner guide and Anna profile (updated November 11, 2026),
              LDShop&rsquo;s banner schedule (November 2), TopUpLive&rsquo;s 4.0–4.2 leak
              summary, and BitTopup&rsquo;s 3.8/4.0 coverage.
              Where the trackers disagree — Lucille&rsquo;s element above all — this page says
              so instead of picking a winner. Every image on this page is AI-upscaled for
              clarity (Real-ESRGAN, anime model) from the file that actually leaked —
              enhancement sharpens, it does not add real detail. The unedited originals stay
              on the site:{" "}
              <a href="/images/leaks/anna-model-1920.webp">model sheet</a>,{" "}
              <a href="/images/leaks/anna-rotation-1920.webp">rotation</a>,{" "}
              <a href="/images/leaks/anna-bust-1400.webp">upper-body detail</a>,{" "}
              <a href="/images/leaks/anna-ingame-1600.webp">in-world shot</a>,{" "}
              <a href="/images/leaks/anna-story-1-800.webp">story stills</a>,{" "}
              <a href="/images/leaks/lucille-model-962.webp">Lucille portrait</a>. For what is
              actually live, see the{" "}
              <Link href="/banners">banners page</Link> and the{" "}
              <Link href="/phase-2">December 3 Phase 2 preview</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import PageHero from "@/components/PageHero";
import SpoilerCover, { RevealAllSpoilers } from "@/components/SpoilerCover";
import "./leaks.css";

export const metadata: Metadata = {
  title: "4.0 and later leaks & rumors — Anna, Lucielle, the New Federation, and the wider 4.x cast",
  description:
    "Everything leaked or rumored about Wuthering Waves 4.0 and beyond: Anna, Lucielle, the New Federation, and the wider 4.x roster — every claim evidence-tagged.",
  alternates: { canonical: "/leaks" },
};

type Tag = "Datamined" | "Repeated leak" | "Single leak" | "Speculation" | "In-game lore" | "Official";

// Aftermath: tones step down with the evidence instead of a rainbow. Solid
// sources read gold, repeated leaks ivory, single leaks grey, and
// speculation the one muted red (red stays rare on the site).
const TAG_COLORS: Record<Tag, string> = {
  Official: "#d9c49b",
  Datamined: "#d9c49b",
  "In-game lore": "#d9c49b",
  "Repeated leak": "#ece6da",
  "Single leak": "#a29c91",
  Speculation: "#c07a82",
};

const TAG_STRENGTH: Record<Tag, number> = {
  Datamined: 5,
  "In-game lore": 5,
  Official: 5,
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
        borderRadius: "2px",
        border: `1px solid color-mix(in srgb, ${TAG_COLORS[tag]} 60%, transparent)`,
        color: TAG_COLORS[tag],
        fontSize: "0.78rem",
        fontWeight: 500,
        letterSpacing: "0.01em",
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
  { when: "Nov 17, 2026", what: "Kuro reveals 4.0 — the trailer and all seven character drips land in one evening" },
  { when: "Late Nov – early Dec", what: "4.0 closed beta runs; kit details usually leak here" },
  { when: "Dec 21, 2026", what: "Version 3.8 ends — the last patch of the 3.X arc" },
  { when: "Dec 22, 2026", what: "Version 4.0 launches (UTC+8): New Federation, Anna's banner", hot: true },
  { when: "Mid-January 2027", what: "Phase 2 — Lucielle's projected banner window" },
  { when: "Early Feb 2027", what: "Version 4.1 on the 42-day cycle — Amethyst's rumored slot" },
];

export default function LeaksPage() {
  return (
    <>
      <Link href="/" className="og-back" transitionTypes={["nav-back"]}>
        ← Home
      </Link>

      <PageHero kicker="Version 4.0 and later · Leaks and rumors · Last sweep Nov 17, 2026" title="4.0+ leaks"
        meta={<><UpdatedStamp /><RevealAllSpoilers /></>}
      >
        Version 4.0 skips 3.9 entirely and opens a whole new region — the New Federation —
        on December 22, 2026. Kuro revealed the version and its seven-character cast on
        November 17; everything past that reveal is still leak and rumor. This page collects
        the rumor side of it, tags each claim by how solid the evidence is, and names its
        sources — the official announcements themselves live on the Version 4.0 page.
      </PageHero>

      <div className="og-notice" role="note" style={{ marginBottom: "1.2rem" }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          <strong>The November 17 reveal is official.</strong> The trailer, the December 22
          date, and all seven character cards now live on the{" "}
          <Link href="/version-4-0">Version 4.0 page</Link>. This page keeps the rumor
          record — every claim below stays evidence-tagged, settled ones included.
        </p>
      </div>

      <ObsidianToolbar
        label="Jump to"
        items={[
          { href: "#timeline", label: "Timeline" },
          { href: "#anna", label: "Anna" },
          { href: "#lucille", label: "Lucielle" },
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
            <strong>In-game lore</strong> is checkable in the live game today, and{" "}
            <strong>Official</strong> means Kuro has published it — a trailer, a drip post, a
            notice. Dates from the official reveal are confirmed; the rest are estimates
            worked out from the game&rsquo;s 42-day version cycle.
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
          title="Anna — officially revealed, Phase 1 per the leaks"
          blurb="Revealed by Kuro on November 17 — and still the only one of the seven with a leaked model."
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
              guide into the New Federation — every roadmap summary puts her first. Kuro&rsquo;s
              November 17 reveal made her the face of the version; her official card leads the
              Version 4.0 page. The Phase 1 slot itself still rests on the leaks.
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
            <Claim tag="Official">
              <strong>Her Tacet Mark sits on her outer right thigh.</strong> The leaked
              render gallery (FS, November 10) put it on her upper thigh — faint and
              reddish, with readers disputing how visible it was. Her official character
              card (on the Version 4.0 page) settles it: the mark is plainly there, on
              the outer right thigh.
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
              <strong>A height-comparison video is circulating too.</strong> WuWa
              Timeline (@wuwaguy, November 16) posted a short clip titled as
              Anna&rsquo;s height comparison demo; a hosted copy is shown below. The
              13 seconds show characters in a golden field beside a large red
              machine — Anna herself is not clearly identifiable in it, so what it
              proves about her height stays unverified.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her model is now a downloadable Garry&rsquo;s Mod port.</strong>{" "}
              A playermodel of Anna went up on Steam Workshop on November 10
              (SheepyLord, 81 MB), with faceposing, fingerposing and bodygroups. The
              listing credits the model itself to Kuro and the porting and rigging to
              its author — and its previews match the datamined renders above detail
              for detail, down to the mark on her leg. It is a game-mod file, not the
              raw model: no PMX, FBX or GLB version has surfaced, and model files are
              not hosted here. A fan-made Blender recreation also circulates
              (qiqi3d, DeviantArt, November 10, shared through Patreon) — that one
              is fan work, not the game model.
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
            <div className="lk-view-media">
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
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>Circulating clip — height comparison demo</span>
              <span>Via WuWa Timeline · Nov 16 · Hosted copy</span>
            </div>
            <SpoilerCover label="Anna — height comparison clip">
              <video
                src="/images/leaks/anna-height-demo.mp4"
                poster="/images/leaks/anna-height-demo-poster.webp"
                controls
                playsInline
                preload="none"
                width={1280}
                height={720}
              />
            </SpoilerCover>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            The 13-second clip WuWa Timeline posted on November 16 under the title
            &ldquo;Anna&rsquo;s Height Comparison Demo&rdquo; — hosted here, never embedded.
            It shows characters in a golden field beside a large red machine; Anna herself
            is not clearly identifiable in it, so treat the title as the claim, not the
            footage.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="lucille" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 02 · Subject"
          title="Lucielle — the rumored Phase 2 banner"
          blurb="Officially revealed on November 17 — animal ears and all. Her element is still only narrowed to two options, and the Phase 2 slot itself is still leak-grade."
        />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>3D model — bust portrait only</span>
              <span>Via StepLeaks · Oct 29 · AI-enhanced</span>
            </div>
            <SpoilerCover label="Lucielle — bust portrait">
            <div className="lk-view-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/lucille-model-enh-1200.webp"
                srcSet="/images/leaks/lucille-model-enh-1200.webp 1200w, /images/leaks/lucille-model-enh-1924.webp 1924w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="Leaked 3D model bust portrait of Lucielle: blonde twin braids, green eyes, red outfit and black choker, with the StepLeaks watermark"
                width={1200}
                height={859}
                loading="lazy"
              />
            </div>
            </SpoilerCover>
            <div className="lk-specs" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <div className="lk-spec">
                <div className="lk-spec-k">Full-body model</div>
                <div className="lk-spec-v">Not acquired — official art only</div>
              </div>
              <div className="lk-spec" style={{ borderLeft: "1px solid var(--rs-line-soft)" }}>
                <div className="lk-spec-k">In-game shots</div>
                <div className="lk-spec-v">None</div>
              </div>
            </div>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            The only leaked model visual — a bust portrait carrying the leaker&rsquo;s own
            watermark, mouse cursor and all. Her official card, on the Version 4.0 page, is
            the first full look at her design.
          </p>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-claims">
            <Claim tag="Single leak">
              <strong>The portrait above</strong> leaked on October 29 through StepLeaks and has
              been reshared everywhere since: green eyes, twin braids, a red outfit, and a black
              choker. It is a bust shot only — the cat ears and cowboy styling from the written
              descriptions don&rsquo;t appear in it. Her official card has since shown the full
              design, ears included — the cowboy styling is at most a hint in the fur trim.
            </Claim>
            <Claim tag="Official">
              <strong>The name is settled: Lucielle.</strong> Kuro&rsquo;s November 17 drip
              post fixes the spelling — the leaks wrote her as Lucille, Luciel, and Luxier.
              Not to be confused with <strong>Lucilla</strong>, the Glacio Rectifier already
              in the game — a different character, and the most common mix-up in 4.0 threads.
            </Claim>
            <Claim tag="Repeated leak">
              <strong>An affectionate catgirl with cowboy styling</strong> — the description has
              been consistent since Seele&rsquo;s original 4.x character list.
            </Claim>
            <Claim tag="Single leak">
              <strong>The Phase 2 slot</strong>, in the back half of 4.0.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her element has narrowed to Electro or Spectro.</strong> The newest
              word (Seele and Fractured Shores, via WuWa Timeline, November 13, marked
              subject to change) cuts it down to those two. Earlier posts tagged her Fusion,
              then Havoc, then Electro Flare, and Spectro with Pistols as a sub-DPS — treat
              the whole trail as weak until the beta lands.
            </Claim>
            <Claim tag="Speculation">
              <strong>A Hsin + Suoming team link</strong> — if she is an off-field sub-DPS, she
              would tighten that rotation rather than replace anyone in it.
            </Claim>
            <Claim tag="Single leak">
              <strong>Her grandfather may be in the trailer — as a boss.</strong> A
              November 18 post (Seele, via @WutheringNews) claims the old man glimpsed in
              the 4.0 trailer is Lucielle&rsquo;s grandfather, and that he appears as a
              boss. Nothing backs either part yet beyond the trailer still itself — no
              render, no second source.
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
              introducing it and Lucielle extending it. Whether existing Resonators get access
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
              character reveal on November 18. Nothing backed it — no characters named, nothing
              shown. Settled a day early: the full reveal landed on November 17.
            </Claim>
            <Claim tag="Single leak">
              <strong>Anna&rsquo;s drip is tipped for this week.</strong> WuWa Timeline
              (@wuwaguy, November 15) says Anna&rsquo;s official drip marketing lands
              this week — a different guess from the November 18 date above, from a
              tracker with a record rather than a no-name account. The same post
              repeats her known Fusion / Broadblade / scythe claims; only the timing
              was new. Settled: her drip posted on November 17, inside his window.
            </Claim>
            <Claim tag="Speculation">
              <strong>A November 16 drip date is the newest guess.</strong> One X
              account (@LordArbiterWW, November 15) says 4.x drip marketing lands
              tomorrow, November 16 — no source, no image, and the leak
              megathread&rsquo;s own estimate points later, at November 20/21. It is
              the third different drip date in circulation. Settled: nothing landed on
              November 16 — the reveal came on November 17.
            </Claim>
            <Claim tag="Speculation">
              <strong>A bigger reveal is claimed for November 18/19.</strong> One X
              reply (Assa byL, November 16) says Version 4.0 reveals five characters
              plus a New Federation trailer on November 18 or 19. No names, no
              images, nothing behind it — the date overlaps the November 18 guess
              above; the five-character count and the trailer were the new parts. Settled, and
              bigger than claimed: the reveal landed on November 17 with a trailer and
              seven characters, not five.
            </Claim>
            <Claim tag="Speculation">
              <strong>The beta is tipped for November 23.</strong> Legion
              (@LegionGachaYT, November 16) lays out a pattern-based prediction: the
              4.x drip lands November 17–19, the closed beta opens November 23, and
              the reveal could cover five to six New Federation characters plus a
              region trailer. It is calendar math from Kuro&rsquo;s past cycles, not
              a source inside — the drip window matches the guesses above; the dated
              beta start was the new part — and his drip window (November 17–19) hit on
              its first day, trailer included. The November 23 beta date itself is still
              open.
            </Claim>
            <Claim tag="Single leak">
              <strong>Beta recruitment is claimed to be open.</strong> A screenshot
              posted by Riju (@Riju1T_T, November 17) shows a notice saying 4.0 beta
              invitations go out by in-game mail, with recruitment running November
              17–20, closing 18:00 (UTC+8). Nobody else has repeated it and the beta
              databases still show only 3.8, so this is uncorroborated — but if it
              is real, a beta start in the November 23 window above follows.
            </Claim>
            <Claim tag="Single leak">
              <strong>The 4.0 beta client is already in testers&rsquo; hands.</strong> A
              Seele installer screenshot (November 19) shows the game updating
              3.8.1 to 4.0.0: the full pack downloads at 56.51 GiB and needs
              67.81 GB of space — the aggregator post travelling with it says
              68.81 GiB, and the screenshot&rsquo;s own figure is the one printed
              here. The sizes exclude video files, hotfix patches and voice
              packs. For scale, the 3.0 pack was about 93 GB. If the screenshot
              is real, the recruitment claim above has a client behind it — the
              beta databases still show only 3.8, so this stays a single leak.
            </Claim>
            <Claim tag="Speculation">
              <strong>One post names their elements — against the stronger claims.</strong>{" "}
              Jimmy Patel (@jpatel02, November 19) says Anna is Glacio with a
              Broadblade in Phase 1 and Lucielle is Fusion with Pistols in
              Phase 2, both five-star. The post names no leaker (marked only
              &ldquo;Via STC&rdquo;), and both elements fight this page&rsquo;s stronger
              lines: every tracker puts Anna on Fusion, and Lucielle&rsquo;s element
              has narrowed to Electro or Spectro. The Broadblade and the phase
              order match what is already claimed — the elements are the new
              part, and they grade as speculation.
            </Claim>
            <Claim tag="Single leak">
              <strong>A Mosasaurus boss is claimed for 4.X.</strong> A Seele item
              reshared on November 17 (@WutheringNews, @Wutheringnewss,
              @Gameverse_Leaks) names a coming boss as a Mosasaurus, also called
              Canglong. The images travelling with it are Jurassic World film
              stills, not game art — there is no model, no screenshot, no kit
              detail and no date, just the name and the creature type.
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
          blurb="Seven of these characters were officially revealed on November 17 — their cards live on the Version 4.0 page. The rows here are the rumor record: Amethyst, who was not among the seven, and everything still unconfirmed."
        />
        <Reveal>
          <div className="lk-cast">
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>Their Tacet Marks, read from the
                official art.</strong> One reader&rsquo;s pass over the drip cards
                (Tyson, November 17) puts them at: April&rsquo;s right eye, Gordia&rsquo;s
                inner right thigh, Cairn&rsquo;s right shoulder, and Simulsys&rsquo;s
                upper left thigh — Anna&rsquo;s is confirmed in her file above.
                Lucielle&rsquo;s and Iya&rsquo;s marks are not visible in their cards.
              </p>
              <span className="lk-ver">4.0</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>The banner order, per Seele&rsquo;s
                chart.</strong> A chart posted on November 17 (Seele, via the leaks
                subreddit, flaired &ldquo;Questionable&rdquo;) pairs them up: 4.0 Anna
                and Lucielle, 4.1 Amethyst and Cairn, 4.2 Iya and Gordia, 4.3 Simulsys
                and April. The 4.0 pair and Amethyst&rsquo;s 4.1 slot match what this
                page already had; the new parts are Cairn beside Amethyst and the 4.2
                and 4.3 pairings. The chart itself flags the info as early and subject
                to change.
              </p>
              <span className="lk-ver">4.0 – 4.3?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Repeated leak" />{" "}
                <strong>Amethyst (also Aimoshesh / Aimoxishen)</strong> — an anti-Resonance
                humanoid weapon, most often placed in Version 4.1 Phase 1. One leak graphic tags
                her Glacio. The same Seele graphic behind Anna&rsquo;s file also names her in
                the 3.8 story (single leak — see File 01). A November 15 post guesses she
                will be blue-themed (speculation — it reuses 3.8 flashback stills and shows
                nothing new). A November 16 post also guesses she and Shorekeeper get
                VFX skins in the later half of 4.x (speculation — the poster calls it
                cope themselves; the fan illustration travelling with the post is
                shown below, credited to its artist). A November 17 post resharing a
                Tieba item claims she has three forms and a clone mechanic
                (speculation — the poster flags it as suspect themselves and says it
                may be mixed up with Fusion Rover). She was not among the seven
                characters Kuro revealed on November 17, so her 4.1 placement stays a
                leak claim.
              </p>
              <span className="lk-ver">4.1 · P1?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>Amethyst and Eris as the cycle&rsquo;s
                two leads?</strong> A November 17 post (@Wutheringnewss) claims 4.x is
                built as a &ldquo;main push&rdquo; in two halves — Amethyst headlining the
                first half, and Eris — named in earlier coverage as Fractsidus&rsquo; Vice
                Architect — the second. The account is tiny and cites no source, so this
                is the weakest sourcing on the page; the pairing itself is the new part.
              </p>
              <span className="lk-ver">4.x?</span>
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
            <div className="lk-cast-row">
              <p>
                <Chip tag="Single leak" /> <strong>Only two males in the whole cycle?</strong>{" "}
                A Tieba claim relayed on X (@Wutheringnewss, November 16) says 4.x gets just
                two male characters — one original and one collaboration, possibly Kirito —
                which would tie the male count to the crossover whisper above. The sourcing
                is the weakest kind: an unnamed forum post through a reshare account, with
                nothing behind it.
              </p>
              <span className="lk-ver">4.x?</span>
            </div>
            <div className="lk-cast-row">
              <p>
                <Chip tag="Speculation" /> <strong>No Square Enix crossover, says one
                account.</strong> A November 17 post (@Wutheringnewss) claims Square Enix
                will not collaborate with Kuro — its stated reason is that Square Enix
                supposedly barred Kuro from writing story for their NieR collaboration in
                Punishing: Gray Raven, which the post says spoiled that patch. Nothing
                backs any of it, and the fan whose post it quoted replied disputing it
                outright.
              </p>
              <span className="lk-ver">4.x?</span>
            </div>
          </div>
        </Reveal>
        <div style={{ height: "0.9rem" }} />
        <Reveal>
          <div className="lk-view">
            <div className="lk-view-bar">
              <span>VFX skins — the illustration going around</span>
              <span>Fan art by Ima Dei Tup · Via Riju · Nov 16</span>
            </div>
            <SpoilerCover label="Fan illustration — VFX skins">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/vfx-skins-fanart.webp"
                alt="Fan illustration by Ima Dei Tup: Shorekeeper and Aemeath in white and blue gala outfits, watermarked by the artist"
                width={1200}
                height={947}
                loading="lazy"
              />
            </SpoilerCover>
          </div>
          <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
            Fan illustration by Ima Dei Tup — the artist&rsquo;s watermark runs across it —
            shared with Riju&rsquo;s November 16 VFX-skins speculation. It is not official
            art and not a leak; it is shown, credited and covered, because it travels with
            the claim.
          </p>
        </Reveal>
      </div>

      <div className="og-section" id="sources" style={{ scrollMarginTop: "120px" }}>
        <FileHead
          file="File 05 · Chain of custody"
          title="Sources and how this page is kept"
          blurb="Checked November 17, 2026 — the drip marketing has landed and the reveal set is on the page. Re-checked again when the beta opens."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              The 4.x character list originates with <strong>Seele Leaks</strong> (Telegram);
              banner tracking comes from <strong>Wuwaguy</strong> (X) and the dataminer{" "}
              <strong>Nanoka</strong>. The model visuals are sourced post-by-post: Anna&rsquo;s
              render set came via <strong>WuWaLand</strong> (reshared by WuWa Universe on X,
              November 9–10, and mirrored in the PTT C_Chat leak thread), and Lucielle&rsquo;s
              bust portrait via <strong>StepLeaks</strong> (October 29). Anna&rsquo;s in-game
              story stills come via <strong>Sleepy</strong> (November 11, relayed by the WuWa
              News channel and PTT), A fan-made animation of Anna&rsquo;s leaked model surfaced on Facebook on November 14 — reshares only, origin unverified, and noted on this page as fan work rather than a leak drop — the height-comparison clip in File 01 is a hosted copy of WuWa Timeline&rsquo;s November 16 post (never an embed), and the VFX-skins illustration in File 04 is fan art by Ima Dei Tup, shared via Riju&rsquo;s November 16 post and credited to the artist — and the 4.0 map place names and map-size note come from{" "}
              <strong>Seele Leaks</strong> posts of November 11–12 — text only; no map graphic
              has leaked. Roundups consulted:
              GamsGo&rsquo;s 4.0 banner guide and Anna profile (updated November 11, 2026),
              LDShop&rsquo;s banner schedule (November 2), TopUpLive&rsquo;s 4.0–4.2 leak
              summary, and BitTopup&rsquo;s 3.8/4.0 coverage.
              Where the trackers disagree — Lucielle&rsquo;s element above all — this page says
              so instead of picking a winner. The leaked images on this page are AI-upscaled for
              clarity (Real-ESRGAN, anime model) from the files that actually leaked —
              enhancement sharpens, it does not add real detail. The seven character
              cards are Kuro&rsquo;s official art from the November 17 drip posts —
              they live on the Version 4.0 page now, mirrored there via the
              wiki&rsquo;s uploads of the same art, unedited and uncovered. The unedited originals stay
              on the site:{" "}
              <a href="/images/leaks/anna-model-1920.webp">model sheet</a>,{" "}
              <a href="/images/leaks/anna-rotation-1920.webp">rotation</a>,{" "}
              <a href="/images/leaks/anna-bust-1400.webp">upper-body detail</a>,{" "}
              <a href="/images/leaks/anna-ingame-1600.webp">in-world shot</a>,{" "}
              <a href="/images/leaks/anna-story-1-800.webp">story stills</a>,{" "}
              <a href="/images/leaks/lucille-model-962.webp">Lucielle portrait</a>. For what is
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

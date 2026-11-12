import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import ObsidianToolbar from "@/components/ObsidianToolbar";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";

export const metadata: Metadata = {
  title: "4.0+ Leaks & Rumors — Anna, Lucille, the New Federation, and the Wider 4.X Cast",
  description:
    "Everything leaked or rumored about Wuthering Waves Version 4.0 and beyond: Anna and Lucille, the New Federation region, a flying vehicle in the game files, a reworked Tune Break, and the wider 4.X roster — every claim tagged by how solid its evidence is.",
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

function Claim({ tag, children }: { tag: Tag; children: React.ReactNode }) {
  return (
    <li
      style={{
        display: "flex",
        gap: "0.6rem",
        alignItems: "flex-start",
        padding: "0.45rem 0",
        borderBottom: "1px solid var(--line, #232833)",
      }}
    >
      <span style={{ paddingTop: "0.15rem" }}>
        <Chip tag={tag} />
      </span>
      <span style={{ lineHeight: 1.55 }}>{children}</span>
    </li>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--line, #2a2f3a)",
  borderRadius: "16px",
  overflow: "hidden",
  background: "var(--panel, #12151d)",
};

export default function LeaksPage() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Version 4.0+ · Unreleased · Leaks & rumors"
        title="4.0+ Leaks"
        lede="Version 4.0 is expected to skip 3.9 entirely and open a whole new region — the New Federation — around December 23, 2026. None of it is official. This page collects every leak and rumor worth knowing, tags each claim by how solid the evidence is, and names its sources, so you can tell the datamined facts from the wishful thinking."
        meta={<UpdatedStamp />}
      />

      <ObsidianToolbar
        label="Jump to"
        items={[
          { href: "#anna", label: "Anna" },
          { href: "#lucille", label: "Lucille" },
          { href: "#region", label: "Region & systems" },
          { href: "#wider-cast", label: "The wider 4.X cast" },
          { href: "#sources", label: "Sources" },
        ]}
      />

      <div className="og-section">
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              <strong>Read this first:</strong> Kuro Games has announced{" "}
              <strong>nothing</strong> about Version 4.0 — no characters, no dates, no art. Every
              claim below comes from leakers, dataminers, and the trackers who round them up, and
              any of it can change or turn out wrong. The tags are the point:{" "}
              <strong>Datamined</strong> means seen in game data or model files.{" "}
              <strong>Repeated leak</strong> means several trackers agree.{" "}
              <strong>Single leak</strong> means one source so far. <strong>Speculation</strong>{" "}
              is community inference. <strong>In-game lore</strong> is the one solid ground —
              things you can check in the live game today.
            </p>
            <p>
              <strong>The expected timeline</strong> (all estimates, from the game&rsquo;s
              42-day version cycle): 3.8 ends December 21 → the 4.0 closed beta runs late
              November into early December, which is when kit details usually leak → the 4.0
              Special Broadcast lands mid-December → <strong>Version 4.0 around December 23</strong>{" "}
              → Phase 2 in mid-January 2027 → Version 4.1 around early February 2027. There is no
              3.9 in the roadmap — the version number jumps straight from 3.8 to 4.0.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="anna" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Anna — the rumored Phase 1 banner"
          blurb="The steadiest name in the whole 4.X leak pile, and the only one with a leaked model."
        />
        <Reveal>
          <div style={cardStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/leaks/anna-model-1200.webp"
              srcSet="/images/leaks/anna-model-1200.webp 1200w, /images/leaks/anna-model-1920.webp 1920w"
              sizes="(max-width: 760px) 100vw, 900px"
              alt="Leaked model renders of Anna: front view, side view, and a face close-up with a wide rose-trimmed hat"
              width={1200}
              height={460}
              loading="lazy"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
              <p style={{ margin: "0 0 0.9rem", opacity: 0.8, fontSize: "0.92rem" }}>
                Leaked in-game model — front, side, and face close-up. Datamined renders like
                these have been circulating since early November 2026. Kuro has published no
                official art of her.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <Claim tag="Repeated leak">
                  <strong>She opens Version 4.0</strong> as the Phase 1 banner and the
                  player&rsquo;s guide into the New Federation — every roadmap summary puts her
                  first.
                </Claim>
                <Claim tag="Datamined">
                  <strong>The model above.</strong> Blonde hair fading to red at the tips,
                  pointed ears, red eyes, and a gothic red-and-white gown trimmed with roses.
                  This design is the one earlier trackers described, sight unseen, as the
                  &ldquo;vampire femme fatale&rdquo; — they are the same character, not two.
                </Claim>
                <Claim tag="In-game lore">
                  <strong>A noble of the New Federation.</strong> Leaks make her the daughter of
                  an aristocratic family; the Federation&rsquo;s upper class is real in-game lore
                  (Mortefi was born into it), and Lily&rsquo;s official profile ties the
                  Federated Cities to the Resonator War her story just covered.
                </Claim>
                <Claim tag="Repeated leak">
                  <strong>Fusion attribute.</strong> Every current tracker has her as Fusion,
                  though the earliest posts disagreed.
                </Claim>
                <Claim tag="Single leak">
                  <strong>Rectifier, built around a reworked Tune Break</strong> — a dual-mode
                  kit spanning the current Tune Break branch and a new one. One tracker&rsquo;s
                  latest word; another describes a Fusion Basic Attack main DPS instead, so her
                  exact role is not settled.
                </Claim>
                <Claim tag="Speculation">
                  <strong>Five-star.</strong> Nothing states her rarity outright — but the
                  opening character of a new region has always been a limited five-star.
                </Claim>
              </ul>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/anna-ingame-1024.webp"
                srcSet="/images/leaks/anna-ingame-1024.webp 1024w, /images/leaks/anna-ingame-1600.webp 1600w"
                sizes="(max-width: 760px) 100vw, 900px"
                alt="The leaked Anna model standing in a live-game environment"
                width={1024}
                height={576}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "12px",
                  marginTop: "1rem",
                }}
              />
              <p style={{ margin: "0.6rem 0 0", opacity: 0.8, fontSize: "0.92rem" }}>
                The same model placed in the live game world — the usual way model leaks get
                shown off. The design details (rose at the hip, detached sleeves, leg markings)
                match the model sheet exactly.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="lucille" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Lucille — the rumored Phase 2 banner"
          blurb="Thinner evidence than Anna, and her element has already changed three times."
        />
        <Reveal>
          <div style={cardStyle}>
            <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
              <p style={{ margin: "0 0 0.9rem", opacity: 0.8, fontSize: "0.92rem" }}>
                No image here, on purpose: no model of Lucille has surfaced. The artwork
                circulating under her name is fan-made — the roundups say so themselves.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <Claim tag="Repeated leak">
                  <strong>The name isn&rsquo;t final.</strong> She appears as Lucille, Luciel,
                  and Luxier across posts. Not to be confused with <strong>Lucilla</strong>, the
                  Glacio Rectifier already in the game — a different character, and the most
                  common mix-up in 4.0 threads.
                </Claim>
                <Claim tag="Repeated leak">
                  <strong>An affectionate catgirl with cowboy styling</strong> — the description
                  has been consistent since Seele&rsquo;s original 4.X character list.
                </Claim>
                <Claim tag="Single leak">
                  <strong>The Phase 2 slot</strong>, in the back half of 4.0.
                </Claim>
                <Claim tag="Single leak">
                  <strong>Her element is unsettled.</strong> Posts have tagged her Fusion, then
                  Havoc, then Electro Flare, and most recently Spectro with Pistols as a
                  sub-DPS. Treat every version as weak until the beta lands.
                </Claim>
                <Claim tag="Speculation">
                  <strong>A Hsin + Suoming team link</strong> — if she is an off-field sub-DPS,
                  she would tighten that rotation rather than replace anyone in it.
                </Claim>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="region" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The region & the systems"
          blurb="What 4.0 is expected to add beyond the banners."
        />
        <Reveal>
          <div style={cardStyle}>
            <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <Claim tag="In-game lore">
                  <strong>The New Federation is established lore.</strong> A cyberpunk,
                  technology-worshipping nation — home of Calcharo, Mortefi, Lynae, Verina,
                  Aalto, Encore, and Mornye — with an aristocracy on top and the Lawless Zone,
                  where Calcharo built the Ghost Hounds, at the bottom. Its Sentinel,
                  Prometheus, is named in existing lore dialogue.
                </Claim>
                <Claim tag="Repeated leak">
                  <strong>4.0 opens the region.</strong> The map leaks describe dense urban
                  districts, heavy industry, and elevated transit, with rougher ground outside
                  the city — and, like Jinzhou and Ragunna before it, only the first slice of
                  the nation at launch.
                </Claim>
                <Claim tag="Datamined">
                  <strong>A flying vehicle sits in the game files</strong>, labelled as
                  Anna&rsquo;s flying car. Whether it becomes a summonable exploration tool, a
                  story vehicle, or a transit network is unknown — every region so far has
                  shipped its own way of getting around.
                </Claim>
                <Claim tag="Single leak">
                  <strong>A reworked Tune Break.</strong> Leaks describe a revision of the
                  Version 3.0 system — likely a third branch beside Tune Rupture and Tune
                  Strain — with Anna introducing it and Lucille extending it. Whether existing
                  Resonators get access matters more than the details, and nobody knows yet.
                </Claim>
                <Claim tag="Single leak">
                  <strong>One rerun name: Qingxiao</strong>, the Aero Sword main DPS from
                  Version 3.6, tipped for a Phase 1 rerun — which would be her first.
                </Claim>
                <Claim tag="Speculation">
                  <strong>A second Starpath Reverbs selector.</strong> The 3.5 selector let
                  players pick an older five-star outright; a 2.X pool for 4.0 is community
                  reasoning, not a leak. New Echoes and Sonata Effects are likewise expected by
                  pattern — every region has brought them — with no specifics yet.
                </Claim>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="wider-cast" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="The wider 4.X cast"
          blurb="Seele's leaked list describes eight New Federation characters. Beyond Anna and Lucille, treat all of it as early roadmap talk."
        />
        <Reveal>
          <div style={cardStyle}>
            <div style={{ padding: "1.1rem 1.25rem 1.25rem" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <Claim tag="Repeated leak">
                  <strong>Amethyst (also Aimoshesh / Aimoxishen)</strong> — an anti-Resonance
                  humanoid weapon, most often placed in Version 4.1 Phase 1. One leak graphic
                  tags her Glacio.
                </Claim>
                <Claim tag="Single leak">
                  <strong>A masked male Resonator</strong> and a <strong>nano-tech male</strong>,
                  both pointed at Version 4.1; a <strong>masked assassin</strong> floats around
                  4.3.
                </Claim>
                <Claim tag="Single leak">
                  <strong>Christine (possibly Kristin)</strong> — a celebrity &ldquo;satellite
                  girl from the stars,&rdquo; loosely placed around Version 4.2. The remaining
                  descriptions — a former military-police instructor, a museum curator, a
                  pigeon detective — have no names or versions attached at all.
                </Claim>
                <Claim tag="Speculation">
                  <strong>SP forms for Verina and Calcharo.</strong> Both are New Federation
                  natives, and Yangyang set the SP precedent in 3.5 — but the leak sources
                  openly contradict each other on whether these are still in development. An
                  older rumor of a Sanhua SP has never landed anywhere.
                </Claim>
                <Claim tag="Speculation">
                  <strong>A Sword Art Online crossover</strong> (Kirito and Asuna) circulates as
                  a whisper in pull-planning threads. Nothing datamined, nothing repeated — the
                  weakest claim on this page.
                </Claim>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section" id="sources" style={{ scrollMarginTop: "120px" }}>
        <ObsidianSectionHead
          title="Sources & how this page is kept"
          blurb="Checked November 12, 2026. Re-checked whenever the beta, drip marketing, or the Special Broadcast lands."
        />
        <Reveal>
          <div className="og-notice" role="note">
            <p>
              The 4.X character list originates with <strong>Seele Leaks</strong> (Telegram);
              banner tracking comes from <strong>Wuwaguy</strong> (X) and the dataminer{" "}
              <strong>Nanoka</strong>. Roundups consulted: GamsGo&rsquo;s 4.0 banner guide
              (updated November 11, 2026), LDShop&rsquo;s banner schedule (November 2), TopUpLive&rsquo;s
              4.0–4.2 leak summary, and BitTopup&rsquo;s 3.8/4.0 coverage. Where the trackers
              disagree — Lucille&rsquo;s element above all — this page says so instead of picking
              a winner. For what is actually live, see the{" "}
              <Link href="/banners">banners page</Link> and the{" "}
              <Link href="/phase-2">December 3 Phase 2 preview</Link>.
            </p>
          </div>
        </Reveal>
      </div>
    </>
  );
}

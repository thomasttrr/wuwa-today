import type { Metadata } from "next";
import Link from "next/link";
import OgPageHero from "@/components/OgPageHero";
import ObsidianSectionHead from "@/components/ObsidianSectionHead";
import Reveal from "@/components/Reveal";
import UpdatedStamp from "@/components/UpdatedStamp";
import "./version-4-0.css";

export const metadata: Metadata = {
  title: "Version 4.0 — Embers of the Everbright: release date, trailer and the seven revealed Resonators",
  description:
    "Wuthering Waves Version 4.0, Embers of the Everbright — Chapter of the Year, launches December 22, 2026. The official trailer, and all seven revealed Resonators: Anna, April, Gordia, Lucielle, Cairn, Iya and Simulsys.",
  alternates: { canonical: "/version-4-0" },
};

interface Resonator {
  n: string;
  name: string;
  drip: string;
  time: string;
  art: string;
  alt: string;
  note: string;
  mark: string;
}

const CAST: Resonator[] = [
  {
    n: "02",
    name: "April",
    drip: "Truth & Illusion",
    time: "10:10 PM",
    art: "/images/leaks/official-card-april.webp",
    alt: "Official character card art of April: pale pink hair, white and teal maid-style dress, holding a camera-like device",
    note: "Pale pink hair and a maid-style white and teal dress, with a camera-like device raised in one hand — the most playful design of the seven.",
    mark: "Right eye",
  },
  {
    n: "03",
    name: "Gordia",
    drip: "Silent & Honed",
    time: "10:15 PM",
    art: "/images/leaks/official-card-gordia.webp",
    alt: "Official character card art of Gordia: black hair, military cap, black and red uniform with a red cape, holding a whip",
    note: "Black hair under a military cap, a black and red uniform with a sweeping red cape — and a whip carried like a dress accessory.",
    mark: "Inner right thigh",
  },
  {
    n: "04",
    name: "Lucielle",
    drip: "Future & Falsehoods",
    time: "10:20 PM",
    art: "/images/leaks/official-card-lucielle.webp",
    alt: "Official character card art of Lucielle: long blonde hair, animal ears, green eyes, red and black outfit with white fur trim",
    note: "The animal ears are real — her official card settles the oldest argument in her leak file. Green eyes, and a red and black outfit trimmed with white fur.",
    mark: "Not visible on her card",
  },
  {
    n: "05",
    name: "Cairn",
    drip: "Blood Debts & Purifying Rain",
    time: "10:25 PM",
    art: "/images/leaks/official-card-cairn.webp",
    alt: "Official character card art of Cairn: white-haired man, black mask over the lower face, dark outfit, one glowing blue arm",
    note: "The only man in the reveal set: white hair, a black mask over the lower face, and one arm glowing blue to the shoulder.",
    mark: "Right shoulder",
  },
  {
    n: "06",
    name: "Iya",
    drip: "UFOs & Sparkles",
    time: "10:30 PM",
    art: "/images/leaks/official-card-iya.webp",
    alt: "Official character card art of Iya: long light-blue hair, white and blue outfit, ring and sparkle motifs",
    note: "Light-blue hair and a white and blue outfit built around rings and sparkles — she floats inside a halo-like ring on her card. Her name is styled I.YA on the art itself.",
    mark: "Not visible on her card",
  },
  {
    n: "07",
    name: "Simulsys",
    drip: "Bones & Bygones",
    time: "10:35 PM",
    art: "/images/leaks/official-card-simulsys.webp",
    alt: "Official character card art of Simulsys: long blonde hair, elegant black and white gown",
    note: "The last drip of the night: long blonde hair and an elegant black and white gown — the most formal design of the seven, and the least leaked beforehand.",
    mark: "Upper left thigh",
  },
];

function CastCard({ c, delay }: { c: Resonator; delay: number }) {
  return (
    <Reveal delay={delay}>
      <figure className="v4-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.art} alt={c.alt} width={720} height={1280} loading="lazy" />
        <figcaption>
          <div className="v4-card-top">
            <span className="v4-num">{c.n}</span>
            <span className="v4-time">{c.time} ET</span>
          </div>
          <h3 className="v4-name">{c.name}</h3>
          <p className="v4-drip">&ldquo;{c.drip}&rdquo;</p>
          <p className="v4-note">{c.note}</p>
          <p className="v4-mark">
            Tacet Mark: <strong>{c.mark}</strong>
          </p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function Version40Page() {
  return (
    <>
      <Link href="/" className="og-back">
        ← Home
      </Link>

      <OgPageHero
        kicker="Version 4.0 · Officially revealed November 17, 2026"
        title="Embers of the Everbright"
        lede={
          <>
            Chapter of the Year. Kuro revealed Version 4.0 on the evening of November 17 — a
            trailer, a launch date, and seven new Resonators inside forty minutes. This page
            collects every official 4.x announcement from that reveal onward. If it is not
            official, it is not here — the rumors live on the{" "}
            <Link href="/leaks">leaks page</Link>.
          </>
        }
        meta={<UpdatedStamp />}
      />

      <Reveal>
        <div className="v4-launch">
          <div className="v4-launch-main">
            <p className="v4-launch-k">
              <span className="v4-dot" aria-hidden /> Launches
            </p>
            <p className="v4-launch-date">December 22, 2026</p>
            <p className="v4-launch-sub">Server time (UTC+8) · The New Federation opens</p>
          </div>
          <div className="v4-launch-side">
            <p>
              There is no Version 3.9 — the game jumps straight from 3.8 to 4.0. Version 3.8
              ends on December 21, and 4.0 opens the next day.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="og-section">
        <ObsidianSectionHead
          title="The trailer"
          blurb="“Beneath Promeus's Embrace” — the 1:44 animated reveal, first shown on November 17."
        />
        <Reveal>
          <div className="v4-cols">
            <div className="gk-card">
              <h3>What it showed</h3>
              <p>
                The seven Resonators below, the New Federation&rsquo;s city, and the
                version&rsquo;s full title on the end card:{" "}
                <strong>Embers of the Everbright — Chapter of the Year</strong>, coming
                December 22 (UTC+8).
              </p>
            </div>
            <div className="gk-card">
              <h3>One name with no face</h3>
              <p>
                A spoken line in the trailer says: <em>&ldquo;This time, I&rsquo;ll come to
                you, Glenn.&rdquo;</em> Glenn is named and never shown — no face, no role,
                and no drip post. Whoever he is, he is the reveal&rsquo;s one loose thread.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          title="The seven"
          blurb="Kuro's character cards, posted five minutes apart on November 17, in reveal order. No element, weapon, or kit was given for any of them."
        />
        <Reveal>
          <figure className="v4-feature">
            <div className="v4-feature-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/leaks/official-card-anna.webp"
                alt="Official character card art of Anna: long blonde hair, red wide-brim hat, red black and white outfit with roses, holding a slender sword"
                width={720}
                height={1280}
                loading="lazy"
              />
            </div>
            <figcaption className="v4-feature-body">
              <div className="v4-card-top">
                <span className="v4-num">01</span>
                <span className="v4-time">10:05 PM ET · First drip</span>
              </div>
              <h3 className="v4-name v4-name-lg">Anna</h3>
              <p className="v4-drip">&ldquo;Roses &amp; Desires&rdquo;</p>
              <p className="v4-note">
                The face of the version. Anna&rsquo;s design leaked months ahead of the
                reveal — a full 3D model, renders, even a Garry&rsquo;s Mod port — and her
                official card matches it detail for detail: the red wide-brim hat, the
                roses, the dark markings running down her leg. She is the only one of the
                seven whose design was public before Kuro said a word.
              </p>
              <p className="v4-mark">
                Tacet Mark: <strong>Outer right thigh</strong> — visible on her card, exactly
                where the leaked renders put it.
              </p>
            </figcaption>
          </figure>
        </Reveal>
        <div className="v4-grid">
          {CAST.map((c, i) => (
            <CastCard key={c.name} c={c} delay={(i % 3) * 90} />
          ))}
        </div>
        <Reveal>
          <p className="v4-foot">
            Tacet Mark positions are read from the official cards themselves. Amethyst — the
            name the leaks place in Version 4.1 — was <strong>not</strong> among the seven;
            she has no official card yet.
          </p>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          title="Confirmed, and not yet announced"
          blurb="The line between this page and the leaks page, kept current with every official post."
        />
        <Reveal>
          <div className="v4-cols">
            <div className="gk-card">
              <h3>Confirmed by Kuro</h3>
              <ul className="v4-list">
                <li>Version title: Embers of the Everbright — Chapter of the Year</li>
                <li>Launch date: December 22, 2026 (UTC+8)</li>
                <li>No Version 3.9 — 3.8 is the last 3.x patch</li>
                <li>Seven Resonators: Anna, April, Gordia, Lucielle, Cairn, Iya, Simulsys</li>
                <li>Every design above, exactly as shown on the cards</li>
              </ul>
            </div>
            <div className="gk-card">
              <h3>Not yet announced</h3>
              <ul className="v4-list">
                <li>Elements, weapons, and kits for all seven</li>
                <li>Banner order and phases inside 4.0</li>
                <li>Events, codes, and login rewards</li>
                <li>Who Glenn is</li>
              </ul>
              <p>
                The rumor versions of all of these are tracked on the{" "}
                <Link href="/leaks">leaks page</Link> — when Kuro makes any of them
                official, they move here.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="og-section">
        <ObsidianSectionHead
          title="What happens next"
          blurb="This page is the standing home for official 4.x news — every announcement from here on lands here first."
        />
        <Reveal>
          <div className="v4-next">
            <div className="v4-next-row">
              <span className="v4-next-when">Dec 3, 2026</span>
              <span className="v4-next-what">
                Version 3.8 Phase 2 opens — Xuanling, Suisui, and Hiyuki return.{" "}
                <Link href="/phase-2">Phase 2 preview</Link>
              </span>
            </div>
            <div className="v4-next-row">
              <span className="v4-next-when">Late Nov – early Dec</span>
              <span className="v4-next-what">
                The 4.0 closed beta is expected in this window — kits usually surface here
                first. Still an expectation, not an announcement.
              </span>
            </div>
            <div className="v4-next-row">
              <span className="v4-next-when">Dec 21, 2026</span>
              <span className="v4-next-what">Version 3.8 ends — the last day of the 3.x arc.</span>
            </div>
            <div className="v4-next-row hot">
              <span className="v4-next-when">Dec 22, 2026</span>
              <span className="v4-next-what">
                <strong>Version 4.0 launches.</strong> Embers of the Everbright opens the New
                Federation.
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <p className="v4-foot">
            Sources: Kuro&rsquo;s official @Wuthering_Waves posts of November 17, 2026 — the
            reveal trailer and the seven character cards, mirrored here via the wiki&rsquo;s
            uploads of the same official art and shown unedited.
          </p>
        </Reveal>
      </div>
    </>
  );
}

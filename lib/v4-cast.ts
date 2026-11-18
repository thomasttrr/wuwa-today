/**
 * The seven Resonators Kuro revealed for Version 4.0 on Nov 17, 2026, in
 * reveal order. Names, taglines and card art are official; nothing else
 * (element, weapon, rarity, banner order) has been announced. The full
 * write-up, with notes and Tacet Marks, lives on /version-4-0.
 */
export interface V4Resonator {
  name: string;
  /** The drip-post tagline, as posted. */
  tagline: string;
  art: string;
  alt: string;
  /** Accent sampled from the official card, for hover rings. */
  accent: string;
}

export const V4_TITLE = "Embers of the Everbright";
export const V4_TRAILER = "Beneath Promeus's Embrace";
/** Start of launch day in server time (UTC+8). Kuro gave the date, not the hour. */
export const V4_LAUNCH_DAY = "2026-12-22T00:00:00+08:00";

export const V4_CAST: V4Resonator[] = [
  {
    name: "Anna",
    tagline: "Roses & Desires",
    art: "/images/leaks/official-card-anna.webp",
    alt: "Official character card art of Anna: long blonde hair, red wide-brim hat, red black and white outfit with roses, holding a slender sword",
    accent: "#c13445",
  },
  {
    name: "April",
    tagline: "Truth & Illusion",
    art: "/images/leaks/official-card-april.webp",
    alt: "Official character card art of April: pale pink hair, white and teal maid-style dress, holding a camera-like device",
    accent: "#e7a7bb",
  },
  {
    name: "Gordia",
    tagline: "Silent & Honed",
    art: "/images/leaks/official-card-gordia.webp",
    alt: "Official character card art of Gordia: black hair, military cap, black and red uniform with a red cape, holding a whip",
    accent: "#d9d3c7",
  },
  {
    name: "Lucielle",
    tagline: "Future & Falsehoods",
    art: "/images/leaks/official-card-lucielle.webp",
    alt: "Official character card art of Lucielle: long blonde hair, animal ears, green eyes, red and black outfit with white fur trim",
    accent: "#cd956f",
  },
  {
    name: "Cairn",
    tagline: "Blood Debts & Purifying Rain",
    art: "/images/leaks/official-card-cairn.webp",
    alt: "Official character card art of Cairn: white-haired man, black mask over the lower face, dark outfit, one glowing blue arm",
    accent: "#73c9d3",
  },
  {
    name: "Iya",
    tagline: "UFOs & Sparkles",
    art: "/images/leaks/official-card-iya.webp",
    alt: "Official character card art of Iya: long light-blue hair, white and blue outfit, ring and sparkle motifs",
    accent: "#7f9de0",
  },
  {
    name: "Simulsys",
    tagline: "Bones & Bygones",
    art: "/images/leaks/official-card-simulsys.webp",
    alt: "Official character card art of Simulsys: long blonde hair, elegant black and white gown",
    accent: "#b99b68",
  },
];

import guidesRaw from "../data/guides.json";

export interface GuideSection {
  heading: string;
  body: string;
}

export interface TeamMember {
  name: string;
  slug: string;
  role: string;
  element: string;
  note: string;
}

export interface Team {
  name: string;
  tag: string;
  members: TeamMember[];
  rotation: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  character: string;
  bannerId: string;
  publishedAt: string;
  verdict: string;
  verdictLabel: string;
  authorNote: string;
  sections: GuideSection[];
  teams?: Team[];
}

export const guides = (guidesRaw as { guides: Guide[] }).guides;

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

/** Render "\n- " list syntax inside section bodies as HTML lists. */
export function renderBody(body: string): string {
  const lines = body.split("\n");
  let html = "";
  let inList = false;
  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      if (line.trim()) html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

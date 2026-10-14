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

/** Render list syntax inside section bodies as HTML lists:
 *  "- " bullet lines -> <ul>, "1. "/"2. " numbered lines -> <ol>. */
export function renderBody(body: string): string {
  const lines = body.split("\n");
  let html = "";
  let list: "ul" | "ol" | null = null;
  const closeList = () => {
    if (list) {
      html += `</${list}>`;
      list = null;
    }
  };
  const openList = (kind: "ul" | "ol") => {
    if (list !== kind) {
      closeList();
      html += `<${kind}>`;
      list = kind;
    }
  };
  for (const line of lines) {
    const ordered = /^(\d+)\.\s+/.exec(line);
    if (line.startsWith("- ")) {
      openList("ul");
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
    } else if (ordered) {
      openList("ol");
      html += `<li>${escapeHtml(line.slice(ordered[0].length))}</li>`;
    } else {
      closeList();
      if (line.trim()) html += `<p>${escapeHtml(line)}</p>`;
    }
  }
  closeList();
  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

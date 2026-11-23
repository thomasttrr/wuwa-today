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



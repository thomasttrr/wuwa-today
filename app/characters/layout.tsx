import type { ReactNode } from "react";

/** Character-hub styles now live in app/og-pages.css (imported by the root layout). */
export default function CharactersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

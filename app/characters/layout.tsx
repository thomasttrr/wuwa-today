import type { ReactNode } from "react";

/** Character-hub styles live in app/style.css (imported by the root layout). */
export default function CharactersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

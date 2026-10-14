import type { ReactNode } from "react";
import "./characters.css";

/** Scoped character-hub styles (index + detail) live in characters.css. */
export default function CharactersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Responsive srcset for splash art exported at 512/640/1024/1200/1920w. */
export function srcSetFor(art: string) {
  const base = art.replace(/\.webp$/, "");
  return `${base}-512.webp 512w, ${base}.webp 640w, ${base}-1024.webp 1024w, ${base}-1200.webp 1200w, ${base}-1920.webp 1920w`;
}

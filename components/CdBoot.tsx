/** Fills the parent countdown placeholder before first paint. See lib/countdown-boot.ts. */
export default function CdBoot() {
  return <script dangerouslySetInnerHTML={{ __html: "window.__cd&&__cd(document.currentScript.parentNode)" }} />;
}

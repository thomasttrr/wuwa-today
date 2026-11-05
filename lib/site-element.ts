/**
 * Site accent (--el) ownership, client-side.
 *
 * Two writers share one CSS variable on <body>:
 *  - SiteTheme sets the *site default* (body[data-site-el]) from the banner
 *    schedule, live, and re-applies it whenever no page override is active.
 *  - Page overrides (a character page, the hub's single-element filter) take
 *    the accent while mounted via pushElement() and hand it back with
 *    popElement(), which restores whatever the site default is *now*, even
 *    if the banner changed while the override was up.
 */
export function applySiteElement(color: string) {
  const body = document.body;
  body.dataset.siteEl = color;
  if (!body.dataset.elOverride) body.style.setProperty("--el", color);
}

export function pushElement(color: string) {
  const body = document.body;
  body.dataset.elOverride = color;
  body.style.setProperty("--el", color);
}

export function popElement() {
  const body = document.body;
  delete body.dataset.elOverride;
  const site = body.dataset.siteEl;
  if (site) body.style.setProperty("--el", site);
}

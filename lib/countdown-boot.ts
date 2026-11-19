/**
 * First-paint countdowns. Static HTML is built hours or days before it is
 * read, and the shared clock (useNow) only starts after hydration, so every
 * countdown would otherwise paint dashes first. Each countdown placeholder
 * ends in an inline <CdBoot /> script that calls __cd on its root while the
 * page is still parsing, before first paint.
 *
 * __cd only writes what React does not compare when hydrating: the
 * data-v attribute (shown by CSS through ::before, see resonance.css) and
 * the reel transforms. So hydration still matches the server HTML, and the
 * first clock tick replaces the placeholder with the real render.
 *
 * Markup it reads:
 *   [data-cd=ISO]            root: the target instant
 *   [data-cd-u=d|h|m|s|rel]  a unit: two digits, or the short span "5d 6h"
 *   [data-cd-reset=daily|weekly][data-cd-off=hours]  next 04:00 / Monday
 *                            04:00 at that server offset (lib/dates.ts)
 *   .rs-cd-col inside a unit: rolling reel columns, one per digit
 * The root loses .cd-pending when filled. A target already in the past is
 * left alone (React renders "Ended" on its first tick).
 */
export const countdownBootScript = 'window.__cd=function(r){try{var n=Date.now(),D=864e5,H=36e5,M=6e4,P=function(x){return(x<10?"0":"")+x},S=function(l){var d=Math.floor(l/D),h=Math.floor(l%D/H),m=Math.floor(l%H/M);return d?d+"d "+h+"h":h?h+"h "+m+"m":m+"m"};var q="[data-cd-u],[data-cd-reset]",els=[].slice.call(r.querySelectorAll(q));if(r.matches(q))els.unshift(r);var l=Date.parse(r.getAttribute("data-cd")||"")-n;for(var i=0;i<els.length;i++){var e=els[i],u=e.getAttribute("data-cd-u"),z=e.getAttribute("data-cd-reset"),v;if(z){var o=+e.getAttribute("data-cd-off"),s=new Date(n+o*H),x=Date.UTC(s.getUTCFullYear(),s.getUTCMonth(),s.getUTCDate(),4)-o*H;if(z==="daily"){if(x<=n)x+=D;v=Math.floor((x-n)/H)+":"+P(Math.floor((x-n)%H/M))}else{x-=(s.getUTCDay()+6)%7*D;if(x<=n)x+=7*D;v=S(x-n)}}else{if(!(l>0))return;v=u==="rel"?S(l):P(Math.floor(u==="d"?l/D:u==="h"?l%D/H:u==="m"?l%H/M:l%M/1e3))}var c=e.querySelectorAll(".rs-cd-col");if(c.length){if(c.length!==v.length)return;for(var j=0;j<c.length;j++)c[j].style.transform="translateY(-"+v.charAt(j)+"em)"}else e.setAttribute("data-cd-v",v)}r.classList.remove("cd-pending")}catch(y){}};';

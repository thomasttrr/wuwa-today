"use client";

import { useEffect, useRef } from "react";

/**
 * AmSky — the home hero's living sky, drawn on one canvas.
 * Live slide: Somnoire amber light shafts over a faint crimson undertone
 * (the war under the memory). 4.0 slide: blue-hour Atlantic with a
 * procedural Art Deco skyline and the monument ring. Stars drift upward;
 * an occasional streak crosses.
 *
 * The loop pauses while the hero is off screen or the tab is hidden, and
 * draws a single still frame under prefers-reduced-motion.
 */
export default function AmSky({ fed }: { fed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fedRef = useRef(fed);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    fedRef.current = fed;
    redrawRef.current();
  }, [fed]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    let fm = fedRef.current ? 1 : 0;
    let raf = 0;
    let visible = true;
    const t0 = performance.now();
    type Star = { x: number; y: number; z: number; tw: number };
    type Streak = { x: number; y: number; l: number; v: number };
    let stars: Star[] = [];
    const streaks: Streak[] = [];
    const beams = document.createElement("canvas");
    const bx = beams.getContext("2d")!;
    const city = document.createElement("canvas");
    const sx = city.getContext("2d")!;

    function buildCity() {
      if (!W || !H) return;
      city.width = Math.round(W * dpr);
      city.height = Math.round(H * dpr);
      sx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sx.clearRect(0, 0, W, H);
      let seed = 11;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      const base = H;
      const unit = Math.max(0.6, Math.min(1.3, W / 1280));
      const tower = (x: number, w: number, h: number, col: string, winA: number, spire: boolean) => {
        const y = base - h;
        sx.fillStyle = col;
        sx.fillRect(x, y, w, h);
        const s1 = w * 0.16;
        const h1 = h * 0.07;
        sx.fillRect(x + s1, y - h1, w - 2 * s1, h1);
        const s2 = w * 0.34;
        const h2 = h * 0.06;
        sx.fillRect(x + s2, y - h1 - h2, w - 2 * s2, h2);
        if (spire) {
          sx.beginPath();
          sx.moveTo(x + w / 2 - 2.5, y - h1 - h2);
          sx.lineTo(x + w / 2, y - h1 - h2 - h * 0.22);
          sx.lineTo(x + w / 2 + 2.5, y - h1 - h2);
          sx.fill();
          sx.fillStyle = "rgba(163,41,53,.85)";
          sx.beginPath();
          sx.arc(x + w / 2, y - h1 - h2 - h * 0.22, 1.6, 0, 6.3);
          sx.fill();
        }
        if (winA > 0) {
          for (let wx = x + 4; wx < x + w - 4; wx += 5 * unit) {
            for (let wy = y + 6; wy < base - 4; wy += 7 * unit) {
              if (rnd() < winA) {
                sx.fillStyle = rnd() < 0.9 ? `rgba(232,200,140,${(0.35 + rnd() * 0.5).toFixed(2)})` : "rgba(115,201,211,.55)";
                sx.fillRect(wx, wy, 1.4 * unit, 2.4 * unit);
              }
            }
          }
        }
        sx.fillStyle = "rgba(185,155,104,.18)";
        for (let vx = x + 3; vx < x + w; vx += Math.max(6, w / 6)) sx.fillRect(vx, y, 1, h);
      };
      let x = -30;
      while (x < W + 30) {
        const w = (30 + rnd() * 60) * unit;
        tower(x, w, H * (0.16 + rnd() * 0.24), "#1f2d3a", 0.06, rnd() < 0.2);
        x += w + (4 + rnd() * 14) * unit;
      }
      sx.fillStyle = "rgba(35,55,69,.35)";
      sx.fillRect(0, base - H * 0.42, W, H * 0.42);
      const mx = W * 0.72;
      const mw = 70 * unit;
      const mh = H * 0.5;
      tower(mx - mw / 2, mw, mh, "#18222d", 0.12, true);
      sx.strokeStyle = "rgba(185,155,104,.35)";
      sx.lineWidth = 1;
      sx.beginPath();
      sx.arc(mx, base - mh * 1.02, mw * 0.9, 0, 6.283);
      sx.stroke();
      sx.strokeStyle = "rgba(185,155,104,.16)";
      sx.beginPath();
      sx.arc(mx, base - mh * 1.02, mw * 0.9 + 5, 0, 6.283);
      sx.stroke();
      x = -20;
      while (x < W + 20) {
        const w2 = (36 + rnd() * 70) * unit;
        tower(x, w2, H * (0.07 + rnd() * 0.15), "#121921", 0.14, rnd() < 0.08);
        x += w2 + (2 + rnd() * 10) * unit;
      }
      const fog = sx.createLinearGradient(0, base - H * 0.5, 0, base);
      fog.addColorStop(0, "rgba(21,23,29,0)");
      fog.addColorStop(1, "rgba(21,23,29,.55)");
      sx.fillStyle = fog;
      sx.fillRect(0, base - H * 0.5, W, H * 0.5);
    }

    function size() {
      const r = cv!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv!.width = Math.round(W * dpr);
      cv!.height = Math.round(H * dpr);
      cx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 5200);
      stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, z: Math.random(), tw: Math.random() * 6.28 }));
      buildCity();
    }

    function beamLayer(sw: number, cols: string[], alphas: number[], mul: number) {
      if (beams.width !== cv!.width || beams.height !== cv!.height) {
        beams.width = cv!.width;
        beams.height = cv!.height;
      }
      bx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bx.globalCompositeOperation = "source-over";
      bx.clearRect(0, 0, W, H);
      const rays: [number, number, number, number, number, number, string][] = [
        [W * 0.98, -H * 0.08, 2.05 + sw * 0.04, H * 1.6, W * 0.16, alphas[0], cols[0]],
        [W * 0.86, -H * 0.12, 2.2 + sw * 0.05, H * 1.5, W * 0.05, alphas[1], cols[1]],
        [W * 1.05, H * 0.05, 2.42 - sw * 0.03, H * 1.4, W * 0.22, alphas[2], cols[2]],
      ];
      for (const [x0, y0, ang, len, wid, a, col] of rays) {
        bx.save();
        bx.translate(x0, y0);
        bx.rotate(ang);
        const g = bx.createLinearGradient(0, -wid / 2, 0, wid / 2);
        g.addColorStop(0, `rgba(${col},0)`);
        g.addColorStop(0.5, `rgba(${col},${a})`);
        g.addColorStop(1, `rgba(${col},0)`);
        bx.globalCompositeOperation = "lighter";
        bx.fillStyle = g;
        bx.fillRect(0, -wid / 2, len, wid);
        bx.restore();
      }
      bx.globalCompositeOperation = "destination-in";
      const fade = bx.createLinearGradient(W, 0, W * 0.25, H);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.55, "rgba(0,0,0,.5)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      bx.fillStyle = fade;
      bx.fillRect(0, 0, W, H);
      cx!.globalAlpha = mul;
      cx!.drawImage(beams, 0, 0, W, H);
      cx!.globalAlpha = 1;
    }

    function frame(now: number) {
      const c = cx!;
      const t = (now - t0) / 1000;
      const target = fedRef.current ? 1 : 0;
      fm = reduce ? target : fm + (target - fm) * 0.06;
      c.globalCompositeOperation = "source-over";
      c.clearRect(0, 0, W, H);
      const hg = c.createRadialGradient(W * 0.62, H * 0.05, 0, W * 0.62, H * 0.05, Math.max(W, H) * 0.7);
      hg.addColorStop(0, `rgba(236,196,140,${(0.12 * (1 - fm)).toFixed(3)})`);
      hg.addColorStop(0.4, `rgba(170,110,60,${(0.04 * (1 - fm)).toFixed(3)})`);
      hg.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = hg;
      c.fillRect(0, 0, W, H);
      if (fm < 0.99) {
        const cg = c.createRadialGradient(W * 0.74, H * 0.78, 0, W * 0.74, H * 0.78, Math.max(W, H) * 0.48);
        cg.addColorStop(0, `rgba(163,41,53,${(0.11 * (1 - fm)).toFixed(3)})`);
        cg.addColorStop(0.5, `rgba(118,45,59,${(0.05 * (1 - fm)).toFixed(3)})`);
        cg.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = cg;
        c.fillRect(0, 0, W, H);
      }
      if (fm > 0.01) {
        const ag = c.createLinearGradient(0, 0, 0, H);
        ag.addColorStop(0, `rgba(35,55,69,${(0.55 * fm).toFixed(3)})`);
        ag.addColorStop(0.55, `rgba(35,55,69,${(0.25 * fm).toFixed(3)})`);
        ag.addColorStop(1, `rgba(118,45,59,${(0.12 * fm).toFixed(3)})`);
        c.fillStyle = ag;
        c.fillRect(0, 0, W, H);
      }
      c.save();
      c.translate(W * 0.66, -H * 0.06);
      c.strokeStyle = "rgba(185,155,104,.05)";
      c.lineWidth = 1;
      for (let i = 0; i < 44; i++) {
        const an = Math.PI * (0.06 + (0.88 * i) / 43);
        c.beginPath();
        c.moveTo(Math.cos(an) * 40, Math.sin(an) * 40);
        c.lineTo(Math.cos(an) * H * 1.6, Math.sin(an) * H * 1.6);
        c.stroke();
      }
      c.strokeStyle = "rgba(185,155,104,.08)";
      for (const rr of [90, 96]) {
        c.beginPath();
        c.arc(0, 0, rr, 0, Math.PI);
        c.stroke();
      }
      c.restore();
      c.globalCompositeOperation = "lighter";
      const sw = reduce ? 0 : Math.sin(t * 0.18);
      if (fm < 0.99) beamLayer(sw, ["255,226,180", "255,248,235", "236,170,96"], [0.17, 0.39, 0.078], 1 - fm);
      if (fm > 0.01) beamLayer(sw, ["190,212,226", "232,224,209", "115,201,211"], [0.13, 0.28, 0.05], fm);
      c.globalCompositeOperation = "lighter";
      for (const s of stars) {
        if (!reduce) {
          s.y -= 0.04 + 0.18 * s.z;
          s.x += 0.03 * s.z;
          if (s.y < -2) {
            s.y = H + 2;
            s.x = Math.random() * W;
          }
        }
        const a = (0.25 + 0.6 * s.z) * (0.65 + 0.35 * Math.sin(t * 1.4 + s.tw));
        c.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        const r = 0.5 + s.z * 1.1;
        c.fillRect(s.x, s.y, r, r);
      }
      if (fm > 0.01) {
        c.globalCompositeOperation = "source-over";
        c.globalAlpha = fm;
        c.drawImage(city, 0, 0, W, H);
        c.globalAlpha = 1;
        c.globalCompositeOperation = "lighter";
      }
      if (!reduce && Math.random() < 0.008 && streaks.length < 2) {
        streaks.push({ x: W * (0.3 + Math.random() * 0.7), y: H * Math.random() * 0.45, l: 0, v: 9 + Math.random() * 7 });
      }
      for (let k = streaks.length - 1; k >= 0; k--) {
        const st = streaks[k];
        st.l += st.v;
        const x2 = st.x - st.l;
        const y2 = st.y + st.l * 0.42;
        const len = Math.min(st.l, 180);
        const g = c.createLinearGradient(x2, y2, x2 + len, y2 - len * 0.42);
        g.addColorStop(0, "rgba(255,255,255,.585)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.strokeStyle = g;
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(x2, y2);
        c.lineTo(x2 + len, y2 - len * 0.42);
        c.stroke();
        if (st.l > W) streaks.splice(k, 1);
      }
      c.globalCompositeOperation = "source-over";
      if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(frame);
      else raf = 0;
    }

    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    redrawRef.current = () => {
      if (reduce) frame(performance.now());
      else start();
    };

    size();
    const ro = new ResizeObserver(() => {
      size();
      if (reduce) frame(performance.now());
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(cv);
    const onVis = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVis);
    frame(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="am-sky" aria-hidden="true" />;
}

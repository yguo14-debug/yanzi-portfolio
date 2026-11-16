// E7 — Playground field (Yanzi 2026-11-13, after junezhao.studio/playground for the quantity and the
// arrangement, made more experimental): the real pieces repeat on an endless grid that can be dragged
// in every direction. The grid itself is the experiment, after Yanzi's own type-warp / non-uniform
// scaling tool:
//   · non-uniform scaling — around the cursor, columns widen and rows grow separately (x and y each
//     have their own warp), so the pieces near the mouse swell and stretch, the ones around them squeeze
//   · drag stretch — a fast drag pulls every piece along its direction; it springs back as it slows
// One <canvas> draws everything (each video exists once and is painted into every cell that shows it).
// Click a piece (without dragging) to open it in the Playground's quick view (playground.js → window.PG).
(() => {
const PG = window.PG; if (!PG) return;
const host = document.getElementById("cl"), tip = document.getElementById("cl-tip"), cursor = document.getElementById("cl-cursor");
if (!host) return;
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");

// the real pieces only (grey slots are not repeated)
const P = PG.items.map((it, n) => ({ it, n })).filter((p) => p.it.src);
const N = P.length;
P.forEach((p) => {
  const srcs = [p.it.src, ...(p.it.seq || [])];
  p.media = srcs.map((s) => {
    if (/\.(mp4|webm)$/i.test(s)) {
      const v = document.createElement("video");
      Object.assign(v, { src: s, muted: true, loop: true, playsInline: true, autoplay: true, preload: "auto" });
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.play().catch(() => {});
      return v;
    }
    const im = new Image(); im.decoding = "async"; im.src = s; return im;
  });
  p.r = p.it.r || 1;
});
const ready = (m) => (m.tagName === "VIDEO" ? m.readyState >= 2 : m.complete && m.naturalWidth > 0);
// the other modes (modes.js) paint from the same images and videos — each video exists once
const isGrid = () => (host.dataset.mode || "grid") === "grid";

// canvas
const cv = document.createElement("canvas"); cv.className = "fd-canvas"; cv.setAttribute("aria-hidden", "true");
host.appendChild(cv);   // beside the cloud's track (the two modes share the scene)
const ctx = cv.getContext("2d");
let W = 0, H = 0, DPR = 1, CW = 200, CH = 240;
function size() {
  const r = host.getBoundingClientRect();
  W = r.width; H = r.height; DPR = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  cv.style.width = W + "px"; cv.style.height = H + "px";
  CW = Math.max(150, Math.min(260, W * (W < 700 ? 0.42 : 0.15))); CH = CW * 1.18;   // cell: about 6–7 columns on a laptop
}
size(); addEventListener("resize", size);

// state
let ox = 0, oy = 0;             // pan offset (px)
let vx = 0, vy = 0;             // pan velocity (px/s), drives inertia + stretch
let sx = 0, sy = 0;             // eased stretch amount
let mx = W / 2, my = H / 2, tx = mx, ty = my;   // warp centre (eased toward the pointer)
let amp = 0, ampT = 0;          // warp strength (eased): 0 = flat grid
let inside = false, dragging = false, moved = 0, lx = 0, ly = 0, lt = 0, downAt = null;
const DRIFT = calm ? 0 : 14;    // slow drift on its own (px/s), so the field is alive at rest

// one axis of the warp: x' = x + A·d·e^(−d²/2σ²), d = x − centre. Near the centre the axis is
// stretched by (1 + A); a little further it is squeezed; far away it is untouched. x and y are
// warped separately, which is what makes the scaling non-uniform.
const warp = (x, c, s, a) => { const d = x - c; return x + a * d * Math.exp(-(d * d) / (2 * s * s)); };

const mod = (a, b) => ((a % b) + b) % b;
// Yanzi 2026-11-13 "更 balance": a curated order — every neighbour (across, down and diagonal) differs
// in brightness, colour and shape: no two greens, no two dark posters, no two wide pieces side by side.
// Rows shift by 4, so the same piece never lines up in a visible diagonal. New pieces join at the end.
const ORDER = ["Backsplash Typeface", "ASCII Motion", "Artificial Coral Reef", "Type Warp Tool", "Make Art, Inevitable",
  "Noise Visualiser", "Type Outline Tool", "Offmap Open Launch", "3D Type Path"];
// 9 pieces, solved exactly (2026-11-13): with rows shifted by 4, two pieces placed 2 apart in this list never touch —
// not across, down or diagonally — so each same-colour pair sits 2 apart: the blues (Make Art, Type Outline), the
// yellows (Type Warp, Noise) and the neutrals (Backsplash, Coral). Light / dark alternate as far as possible.   // 8 pieces: light / dark strictly alternating (2026-11-13)   // 7 pieces, light / colour alternating (2026-11-13)   // the strong six, light / dark alternating (2026-11-13)   // light / dark alternating (7 pieces, 2026-11-13)   // light / dark / light / dark … (9 pieces, 2026-11-13)   // re-sorted for the 8 pieces kept (2026-11-13)
P.sort((a, b) => { const i = ORDER.indexOf(a.it.en), j = ORDER.indexOf(b.it.en); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j); });
const SHIFT = 4;
const pieceAt = (c, r) => P[mod(c + r * SHIFT, N)];
let rects = [];                                     // what is on screen this frame, for hover / click

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - (frame.t || now)) / 1000); frame.t = now;
  if (host.hidden || PG.isOpen() || document.hidden || !isGrid()) return;

  // motion: inertia after a drag, then the slow drift takes over again
  if (!dragging) {
    vx *= Math.pow(0.04, dt); vy *= Math.pow(0.04, dt);
    ox += (vx + DRIFT) * dt; oy += (vy + DRIFT * 0.45) * dt;
  }
  const e = 1 - Math.pow(0.0015, dt);
  mx += (tx - mx) * e; my += (ty - my) * e;
  ampT = calm ? 0 : inside ? 0.95 : 0;
  amp += (ampT - amp) * (1 - Math.pow(0.02, dt));
  const sTx = calm ? 0 : Math.min(0.55, Math.abs(vx) / 2600), sTy = calm ? 0 : Math.min(0.55, Math.abs(vy) / 2600);
  sx += (sTx - sx) * (1 - Math.pow(0.002, dt)); sy += (sTy - sy) * (1 - Math.pow(0.002, dt));

  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, W, H);
  const sgx = CW * 1.25, sgy = CH * 1.1;   // reach of the warp
  const c0 = Math.floor((-ox) / CW) - 2, c1 = Math.ceil((W - ox) / CW) + 2;
  const r0 = Math.floor((-oy) / CH) - 2, r1 = Math.ceil((H - oy) / CH) + 2;
  const PAD = 0.16;   // white space around each piece inside its cell
  const flip = Math.floor(now / 3000), fade = Math.min(1, (now % 3000) / 800);
  rects = [];
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
    const p = pieceAt(c, r);
    // the piece at its own ratio, centred in the cell (contain)
    // every piece about the same AREA (tall posters no longer tower over the wide pieces), within its cell
    const bw = CW * 0.84, bh = CH * (1 - PAD * 2), area = CW * CW * 0.34;
    let iw = Math.sqrt(area * p.r), ih = Math.sqrt(area / p.r);
    const fit = Math.min(1, bw / iw, bh / ih); iw *= fit; ih *= fit;
    const cx = ox + (c + 0.5) * CW, cy = oy + (r + 0.5) * CH;
    let x0 = warp(cx - iw / 2, mx, sgx, amp), x1 = warp(cx + iw / 2, mx, sgx, amp);
    let y0 = warp(cy - ih / 2, my, sgy, amp), y1 = warp(cy + ih / 2, my, sgy, amp);
    // drag stretch, about the piece's own centre
    const mcx = (x0 + x1) / 2, mcy = (y0 + y1) / 2, hw = (x1 - x0) / 2 * (1 + sx), hh = (y1 - y0) / 2 * (1 + sy);
    x0 = mcx - hw; x1 = mcx + hw; y0 = mcy - hh; y1 = mcy + hh;
    if (x1 < 0 || x0 > W || y1 < 0 || y0 > H) continue;
    const m = p.media, k = m.length > 1 ? flip % m.length : 0;
    if (ready(m[k])) { ctx.globalAlpha = 1; drawCover(m[k], x0, y0, x1 - x0, y1 - y0, p.r); }
    else { ctx.fillStyle = "#eee"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    if (m.length > 1 && fade < 1) {   // the flipping piece: cross-fade from the previous image
      const kp = mod(k - 1, m.length);
      if (ready(m[kp])) { ctx.globalAlpha = 1 - fade; drawCover(m[kp], x0, y0, x1 - x0, y1 - y0, p.r); ctx.globalAlpha = 1; }
    }
    rects.push({ p, x0, y0, x1, y1 });
  }
}
// draw the source into the box, cropping (not squashing) any difference between its real ratio and
// the piece's listed ratio — the box itself is what gets warped
function drawCoverOn(g, m, x, y, w, h, r) {
  const sw = m.videoWidth || m.naturalWidth, sh = m.videoHeight || m.naturalHeight;
  let cw = sw, ch = sw / r; if (ch > sh) { ch = sh; cw = sh * r; }
  g.drawImage(m, (sw - cw) / 2, (sh - ch) / 2, cw, ch, x, y, w, h);
}
const drawCover = (m, x, y, w, h, r) => drawCoverOn(ctx, m, x, y, w, h, r);
requestAnimationFrame(frame);
PG.field = { P, ready, drawCoverOn };

// ---------- input ----------
const hit = (x, y) => { for (let i = rects.length - 1; i >= 0; i--) { const q = rects[i]; if (x >= q.x0 && x <= q.x1 && y >= q.y0 && y <= q.y1) return q; } return null; };
const local = (e) => { const b = host.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
let hot = null;
function setHot(q) {
  const p = q ? q.p : null;
  if (p === hot) return; hot = p;
  cursor.classList.toggle("big", !!p);
  if (!p) { tip.classList.remove("on"); return; }
  tip.innerHTML = `${p.it[lang()]} <span class="tip-y">${p.it.year || ""}</span>`; tip.classList.add("on");
}
host.addEventListener("pointerenter", () => { if (isGrid()) inside = true; });
host.addEventListener("pointerleave", () => { inside = false; setHot(null); });
host.addEventListener("pointerdown", (e) => {
  if (!isGrid()) return;
  const [x, y] = local(e);
  dragging = true; moved = 0; lx = x; ly = y; lt = performance.now(); vx = vy = 0;
  downAt = hit(x, y);
  host.setPointerCapture(e.pointerId); host.dataset.down = "1";
  if (e.pointerType !== "mouse") { inside = true; tx = x; ty = y; }
});
host.addEventListener("pointermove", (e) => {
  if (!isGrid()) return;
  const [x, y] = local(e);
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  tip.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`;
  tx = x; ty = y;
  if (dragging) {
    const now = performance.now(), d = Math.max(1, now - lt);
    const dx = x - lx, dy = y - ly; moved += Math.abs(dx) + Math.abs(dy);
    ox += dx; oy += dy;
    vx = vx * 0.6 + (dx / d * 1000) * 0.4; vy = vy * 0.6 + (dy / d * 1000) * 0.4;
    lx = x; ly = y; lt = now;
    if (moved > 6) setHot(null);
    return;
  }
  setHot(hit(x, y));
});
const end = (e) => {
  if (!dragging) return;
  dragging = false; delete host.dataset.down;
  if (performance.now() - lt > 80) { vx = 0; vy = 0; }   // held still before letting go: no throw
  if (moved <= 6 && downAt) {   // open from where the piece sits (the quick view grows out of its rectangle)
    const b = host.getBoundingClientRect(), q = downAt;
    setHot(null);
    PG.open(q.p.n, { getBoundingClientRect: () => new DOMRect(b.left + q.x0, b.top + q.y0, q.x1 - q.x0, q.y1 - q.y0) }, 0);
  }
  if (e.pointerType !== "mouse") inside = false;
};
host.addEventListener("pointerup", end);
host.addEventListener("pointercancel", end);
host.addEventListener("wheel", (e) => {   // trackpad / wheel pans the field
  if (!isGrid()) return;
  e.preventDefault();
  ox -= e.deltaX; oy -= e.deltaY;
  vx = vx * 0.7 - e.deltaX * 6; vy = vy * 0.7 - e.deltaY * 6;
}, { passive: false });
document.addEventListener("langchange", () => { const p = hot; hot = null; if (p) setHot({ p }); });
})();

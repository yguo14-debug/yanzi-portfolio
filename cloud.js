// E6 — Playground cloud: the floating archive that used to be the homepage (E2–E5, after
// experiment.obys.agency), now filled with the experiments. Images drift round slowly in 3D;
// grey at rest, the one under the mouse turns to colour and shows its name; drag or scroll to spin
// faster; click opens the piece in the Playground's quick view (playground.js → window.PG).
// "Experiment" slots without work yet float as grey blocks and don't open.
(() => {
const PG = window.PG; if (!PG) return;
const ITEMS = PG.items;
const isCloud = () => document.getElementById("cl").dataset.mode === "cloud";   // E7: one of the Playground's two modes (modes.js)
const reel = document.getElementById("cl"), track = document.getElementById("cl-track");
const tip = document.getElementById("cl-tip"), cursor = document.getElementById("cl-cursor");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const seed = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- build: every image of a piece floats once; an empty slot floats one grey block ---------- */
const ASPECTS = [4 / 5, 1, 3 / 4, 16 / 10, 2 / 3, 5 / 4, 4 / 5, 3 / 2];
const SLOTS = [];
ITEMS.forEach((it, n) => {
  const imgs = it.src ? [it.src] : [null];   // Yanzi 2026-11-13: a piece with several images floats ONCE and flips through them by itself
  imgs.forEach((src, k) => SLOTS.push({ n, k, src, r: it.r }));
});
// mix the pieces so one piece's images don't sit next to each other in the list (seeded, same every visit)
SLOTS.sort((a, b) => (a.k - b.k) || (seed(a.n + 1) - seed(b.n + 1)));
track.innerHTML = SLOTS.map(({ n, k, src, r }, j) => {
  const it = ITEMS[n], tone = 78 + Math.round(seed(j + 9) * 14);
  const ar = src ? (k === 0 && r ? r : 1.4) : ASPECTS[Math.floor(seed(j + 3) * ASPECTS.length)];
  if (!src) return `<span class="img is-empty" data-n="${n}" aria-hidden="true" style="--ar:${ar};--tone:${tone}%"></span>`;
  return `<button type="button" class="img" data-n="${n}" data-k="${k}" style="--ar:${ar}"${k ? ' tabindex="-1"' : ""}
      aria-label="${it.en}">${it.seq ? `<span class="cl-seq">${[src, ...it.seq].map((m, q) => `<img src="${m}" alt="" draggable="false"${q ? "" : ' class="on"'}>`).join("")}</span>` : /\.(mp4|webm)$/i.test(src) ? `<video src="${src}" autoplay muted loop playsinline preload="auto"></video>` : `<img src="${src}" alt="" draggable="false">`}</button>`;
}).join("");
const items = [...track.children];
const setShape = (el, ar) => { el.style.setProperty("--ar", ar.toFixed(4)); el.style.setProperty("--sq", Math.sqrt(ar).toFixed(4)); };
items.forEach((el) => setShape(el, parseFloat(el.style.getPropertyValue("--ar")) || 1));
// real images keep their own shape
items.forEach((el) => {
  const m = el.firstElementChild; if (!m) return;
  if (m.tagName === "VIDEO") {   // moving pieces play straight away, in colour
    const fitV = () => { if (m.videoWidth) setShape(el, m.videoWidth / m.videoHeight); };
    if (m.readyState >= 1) fitV(); else m.addEventListener("loadedmetadata", fitV, { once: true });
    return;
  }
  const fit = () => { if (m.naturalWidth) setShape(el, m.naturalWidth / m.naturalHeight); };
  if (m.complete) fit(); else m.addEventListener("load", fit, { once: true });
});

/* ---------- placement (same as the old homepage: Halton spread, big / small mix) ---------- */
let spin = 0, vel = 0, hot = null;
let W = innerWidth, H = 600;
const halton = (n, base) => { let f = 1, r = 0; while (n > 0) { f /= base; r += f * (n % base); n = Math.floor(n / base); } return r; };
const SIZES_REAL = [1, 0.55, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45];
const SIZES_GREY = [0.3, 0.1, 0.45, 0.2, 0.05, 0.35];
let nReal = 0, nGrey = 0;
const R = items.map((el, j) => {
  const real = !el.classList.contains("is-empty");
  if (j === 0) return { a: 0.5, b: 0.47, c: 0.45, d: 0.55 };   // Yanzi 2026-11-13: the first piece (Backsplash) is not the biggest any more
  return {
    a: 0.06 + 0.88 * halton(j + 1, 2), b: 0.08 + 0.84 * halton(j + 1, 3), c: halton(j + 1, 5),
    d: real ? SIZES_REAL[nReal++ % SIZES_REAL.length] : SIZES_GREY[nGrey++ % SIZES_GREY.length],
  };
});
const deg = (r) => r * 180 / Math.PI;
const ZERO = { z: 0, gy: 0, lx: 0, ly: 0, lz: 0, ry: 0, s: 1, o: 1 };
function targetFor(j) {
  const r = R[j], g = spin * 0.35;
  // Yanzi 2026-11-13: the pieces closer in size — a narrower depth range and a small size spread
  // Yanzi 2026-11-13: tighter — the pieces sit closer together (was W × 0.75, H × 0.68)
  const px = (r.a * 2 - 1) * W * 0.5, py = (r.b * 2 - 1) * H * 0.5, pz = -900 + r.c * 1100;
  const zr = px * Math.sin(g) + pz * Math.cos(g);
  return { z: -300, gy: deg(g), lx: px, ly: py, lz: pz, ry: -deg(g), s: 0.95 + r.d * 0.25, o: zr > 900 ? 0 : 1 };
}
const RES = 0.5;   // frames are laid out at 2× (CSS --w) and scaled down, so they stay crisp
const cur = items.map(() => ({ ...ZERO, o: 0 }));
const ANG = ["gy", "ry"];
let lastT = performance.now();
function tick(now) {
  requestAnimationFrame(tick);
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  if (reel.hidden || PG.isOpen() || !isCloud()) return;   // nothing to draw while the grid or the quick view is showing
  W = innerWidth; H = reel.clientHeight;
  if (!reduce) spin += 0.2 * (hot ? 0.15 : 1) * dt + vel * dt;   // Yanzi 2026-11-13: turns on its own, clearly (was 0.09)
  vel *= Math.pow(0.12, dt);
  const k = reduce ? 1 : 1 - Math.pow(0.02, dt);
  items.forEach((el, j) => {
    const t = { ...ZERO, ...targetFor(j) }, v = cur[j];
    if (el === hot) t.s *= 1.08;
    if (Math.abs(t.gy - v.gy - 360 * Math.round((t.gy - v.gy) / 360)) > 100) { Object.assign(v, t); v.o = 0; }
    for (const key in t) {
      if (ANG.includes(key)) v[key] += 360 * Math.round((t[key] - v[key]) / 360);
      v[key] += (t[key] - v[key]) * k;
    }
    el.style.transform = `translate3d(0,0,${v.z}px) rotateY(${v.gy}deg) translate3d(${v.lx}px,${v.ly}px,${v.lz}px) rotateY(${v.ry}deg) scale(${(v.s * RES).toFixed(4)})`;
    const o = Math.max(0, Math.min(1, v.o));
    el.style.opacity = o.toFixed(3);
    el.style.pointerEvents = o < 0.3 ? "none" : "";
  });
}

/* ---------- hover: colour + name by the cursor ---------- */
function showTip(el) {
  if (!el || el.classList.contains("is-empty")) { tip.classList.remove("on"); return; }
  const it = ITEMS[+el.dataset.n], l = lang();
  tip.innerHTML = `${it[l]} <span class="tip-y">${it.year || ""}</span>`;
  tip.classList.add("on");
}
function setHot(el) {
  if (el === hot) return;
  items.forEach((x) => x.classList.remove("hot", "kin"));
  hot = el;
  if (hot && !hot.classList.contains("is-empty")) {
    hot.classList.add("hot");
    items.filter((x) => x !== hot && x.dataset.n === hot.dataset.n).forEach((x) => x.classList.add("kin"));   // the piece's other images warm up a little
  }
  showTip(hot);
}

/* ---------- input: our own hit test (3D hit-testing is unreliable in Safari) ---------- */
let down = null, moved = 0, lastX = 0, pid = null;
const PAD = 12;
function pickAt(x, y) {
  let best = null, bestArea = 0;
  items.forEach((el, j) => {
    if (cur[j].o < 0.2) return;
    const r = el.getBoundingClientRect();
    if (x < r.left - PAD || x > r.right + PAD || y < r.top - PAD || y > r.bottom + PAD) return;
    const area = r.width * r.height;
    if (area > bestArea) { best = el; bestArea = area; }
  });
  return best;
}
const openEl = (el) => { if (el && !el.classList.contains("is-empty")) { setHot(null); PG.open(+el.dataset.n, el, +el.dataset.k || 0); } };
reel.addEventListener("pointerdown", (e) => { if (!isCloud()) return; down = pickAt(e.clientX, e.clientY); moved = 0; lastX = e.clientX; pid = e.pointerId; reel.dataset.down = "1"; });
reel.addEventListener("pointermove", (e) => {
  if (!isCloud()) return;
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  tip.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`;
  if (reel.dataset.down) {
    const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
    if (moved > 6 && !reel.hasPointerCapture(pid)) { try { reel.setPointerCapture(pid); } catch (err) {} setHot(null); }
    if (moved > 6) vel += dx * 0.004;
    return;
  }
  const el = pickAt(e.clientX, e.clientY);
  setHot(el);
  cursor.classList.toggle("big", !!el && !el.classList.contains("is-empty"));
});
reel.addEventListener("pointerleave", () => { if (!reel.dataset.down) setHot(null); });
reel.addEventListener("pointerup", () => {
  if (!isCloud()) return;
  if (!reel.dataset.down) return;
  delete reel.dataset.down;
  if (moved <= 6) openEl(down);
});
reel.addEventListener("pointercancel", () => { delete reel.dataset.down; });
track.addEventListener("click", (e) => e.preventDefault());
track.addEventListener("keydown", (e) => { const c = e.target.closest(".img"); if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openEl(c); } });
reel.addEventListener("wheel", (e) => {
  if (!isCloud()) return;
  e.preventDefault();
  vel += (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.0025;
}, { passive: false });
document.addEventListener("langchange", () => showTip(hot));

requestAnimationFrame(tick);
// the flipping pieces: next image every 3 s (cross-fade)
if (!reduce) setInterval(() => {
  if (document.hidden) return;
  track.querySelectorAll(".cl-seq").forEach((q) => {
    const imgs = [...q.children], k = imgs.findIndex((x) => x.classList.contains("on"));
    imgs[k].classList.remove("on"); imgs[(k + 1) % imgs.length].classList.add("on");
  });
}, 3000);
})();

// Frame E2 homepage archive — after experiment.obys.agency.
//
// Many images (4 per project) in a 3D scene that turns slowly by itself. Everything
// is grey; the image under the mouse turns to colour and its name appears next to
// the cursor; click opens the project page. Drag or scroll to spin faster.
//
// One view only — **Let go 放下** (Yanzi, 2026-10-17: "其他的都不要"): images float loose
// in space and drift round slowly; they face you. Pack / Carry / World / Arrive were
// built and cut (see git history of frames/e2/home.js).
//
// Every image eases toward numeric targets each frame. One transform chain serves all
// views:  translate(x,y,z) rotateZ(gz) rotateX(gx) rotateY(gy) rotateX(ga)
//         translate(lx,ly,lz) rotateY(ry) scale(s)
// so a view is "a centre, a rotation, an offset".

(() => {
const PROJECTS = window.PROJECTS;   // from projects.js
const N = PROJECTS.length;
const PER = 4;                      // floating images per project at most (the archive feels full, mixed sizes)
const SHOW = 3;                     // images you can flip through in the preview; the rest live on the details page

const reel = document.getElementById("reel");
const track = document.getElementById("track");
const tip = document.getElementById("tip");
const cursor = document.getElementById("cursor");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const lang = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");

const seed = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ---------- build ---------- */
// placeholder colour per project (shows on hover until real images are added)
const HUES = [12, 205, 145, 38, 280, 350, 180, 60, 230, 100];
// the floating archive mixes frame sizes (big / small, tall / wide); the preview cover is always 5:4
const ASPECTS = [4 / 5, 1, 3 / 4, 16 / 10, 2 / 3, 5 / 4, 4 / 5, 3 / 2];
const FRAME = 5 / 4;
// each project's media, no repeats: the preview list first (p.preview, else the cover), then the
// gallery — at most PER. The first SHOW of them are the images you flip through in the preview.
const mediaOf = (p) => [...new Set([...(p.preview || []), p.cover, ...(p.gallery || []).map((g) => g.src)].filter(Boolean))].slice(0, PER);
// floating frames: a project with real media floats each image once (no duplicates);
// a project without media yet floats PER grey placeholders
const SLOTS = [];
for (let k = 0; k < PER; k++) PROJECTS.forEach((p, i) => {
  const list = mediaOf(p);
  if (!list.length) SLOTS.push({ i, k, src: null });
  else if (k < list.length) SLOTS.push({ i, k, src: list[k] });
});
track.classList.add("cloud");
track.innerHTML = SLOTS.map(({ i, k, src }, j) => {
  const p = PROJECTS[i];
  const inner = !src ? "" : /\.(mp4|webm)$/i.test(src)
    ? `<video src="${src}" autoplay muted loop playsinline preload="metadata"></video>`
    : `<img src="${src}" alt="" draggable="false">`;
  const ar = ASPECTS[Math.floor(seed(j + 3) * ASPECTS.length)];
  const tone = 78 + Math.round(seed(j + 9) * 14);                       // grey value of the placeholder
  return `<a class="img" href="project.html?id=${p.id}" draggable="false" data-i="${i}" data-j="${j}"
      style="--ar:${ar};--hue:${HUES[i % HUES.length]};--tone:${tone}%"${k ? ' tabindex="-1"' : ""}
      aria-label="${p.en}">${inner}</a>`;
}).join("");
const items = [...track.children];
// videos with black bars baked in (measured): frame = the real picture, the bars get cropped
const CROP = {
  "RHV2v2xVQCZ3WEYdyOniS3I.mp4": 1620 / 1080,   // 150px bar each side
  "poster_1_mp4.mp4": 1536 / 1080,              // 192px
  "T21150_8.mp4": 1618 / 1080,                  // 151px
};
const fileOf = (m) => (m.getAttribute("src") || "").split("/").pop();
// a frame's shape: --ar = width / height, --sq = √ratio keeps every frame the same area
const setShape = (el, ar) => { el.style.setProperty("--ar", ar.toFixed(4)); el.style.setProperty("--sq", Math.sqrt(ar).toFixed(4)); };
items.forEach((el) => setShape(el, parseFloat(el.style.getPropertyValue("--ar")) || 1));
// real images keep their own shape (landscape stays landscape); placeholders keep the mixed sizes
items.forEach((el) => {
  const m = el.firstElementChild; if (!m) return;
  const fit = (w, h) => { if (w && h) setShape(el, CROP[fileOf(m)] || w / h); };
  if (m.tagName === "VIDEO") {
    if (m.readyState >= 1) fit(m.videoWidth, m.videoHeight);
    else m.addEventListener("loadedmetadata", () => fit(m.videoWidth, m.videoHeight), { once: true });
  } else if (m.complete) fit(m.naturalWidth, m.naturalHeight);
  else m.addEventListener("load", () => fit(m.naturalWidth, m.naturalHeight), { once: true });
});

/* ---------- state ---------- */
let spin = 0;            // radians, grows forever
let vel = 0;             // extra spin from drag / scroll, decays
let hot = null;          // the image under the mouse
let W = innerWidth, H = 600, U = 120;   // viewport, scene height, base image width

// fixed per-image values (seeded → same every visit)
const R = items.map((_, j) => ({
  a: seed(j + 11), b: seed(j + 23), c: seed(j + 37), d: seed(j + 51),
}));

const deg = (r) => r * 180 / Math.PI;
const ZERO = { x: 0, y: 0, z: 0, gz: 0, gx: 0, gy: 0, ga: 0, lx: 0, ly: 0, lz: 0, ry: 0, s: 1, o: 1 };

/* ---------- Let go: loose in space, drifting round slowly; images face you ---------- */
function targetFor(j) {
  const r = R[j];
  const g = spin * 0.35;
  const px = (r.a * 2 - 1) * W * 0.75, py = (r.b * 2 - 1) * H * 0.55, pz = -1400 + r.c * 1700;
  const zr = px * Math.sin(g) + pz * Math.cos(g);
  return { z: -300, gy: deg(g), lx: px, ly: py, lz: pz, ry: -deg(g),
           s: 0.55 + r.d * 0.9, o: zr > 900 ? 0 : 0.35 + 0.65 * Math.min(1, (zr + 1400) / 1800) };
}

/* ---------- loop ---------- */
const cur = items.map(() => ({ ...ZERO, o: 0 }));
const ANG = ["gz", "gx", "gy", "ga", "ry"];
let lastT = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  W = innerWidth; H = reel.clientHeight; U = items[0].offsetWidth || U;
  // slow turning by itself; much slower while an image is under the mouse
  if (!reduce) spin += (0.09 * (hot ? 0.15 : 1) * (pvOpen ? 0.4 : 1)) * dt + vel * dt;
  vel *= Math.pow(0.12, dt);
  const k = reduce ? 1 : 1 - Math.pow(0.02, dt);   // ~same feel at any frame rate
  items.forEach((el, j) => {
    const t = { ...ZERO, ...targetFor(j) }, v = cur[j];
    if (el === hot) t.s *= 1.08;
    // an image wrapping round the back of a ring jumps there unseen
    if (Math.abs(t.gy - v.gy - 360 * Math.round((t.gy - v.gy) / 360)) > 100) { Object.assign(v, t); v.o = 0; }
    for (const key in t) {
      // angles: take the short way round, so a view switch never spins wildly
      if (ANG.includes(key)) v[key] += 360 * Math.round((t[key] - v[key]) / 360);
      v[key] += (t[key] - v[key]) * k;
    }
    el.style.transform =
      `translate3d(${v.x}px,${v.y}px,${v.z}px) rotateZ(${v.gz}deg) rotateX(${v.gx}deg) rotateY(${v.gy}deg) rotateX(${v.ga}deg) ` +
      `translate3d(${v.lx}px,${v.ly}px,${v.lz}px) rotateY(${v.ry}deg) scale(${v.s})`;
    const o = Math.max(0, Math.min(1, v.o));
    el.style.opacity = o.toFixed(3);
    el.style.pointerEvents = o < 0.3 ? "none" : "";
  });
  if (pvOpen) drawFrost();
  requestAnimationFrame(tick);
}

/* Frosted glass: the images drifting behind the panel, drawn as soft blurred shapes on a
   canvas inside it (CSS backdrop-filter doesn't pick up the 3D layer in Chrome). */
const frost = document.getElementById("pv-blur"), fctx = frost.getContext("2d");
function drawFrost() {
  const pr = pv.getBoundingClientRect();
  const w = Math.round(pr.width / 2), h = Math.round(pr.height / 2);   // half resolution: it is blurred anyway
  if (frost.width !== w || frost.height !== h) { frost.width = w; frost.height = h; }
  fctx.clearRect(0, 0, w, h);
  fctx.filter = "blur(16px)";
  items.forEach((el, j) => {
    const o = cur[j].o; if (o < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.right < pr.left || r.left > pr.right) return;
    const dark = el.firstElementChild ? 0.75 : 0.32 + (92 - parseFloat(el.style.getPropertyValue("--tone"))) / 40;
    fctx.fillStyle = `rgba(70,70,70,${Math.min(0.85, dark * o).toFixed(3)})`;
    const g = 0.15;   // grow each shape a little — glass spreads light
    fctx.fillRect((r.left - pr.left - r.width * g) / 2, (r.top - pr.top - r.height * g) / 2, r.width * (1 + 2 * g) / 2, r.height * (1 + 2 * g) / 2);
  });
}

/* ---------- hover: colour + name by the cursor ---------- */
function showTip(el) {
  if (!el) { tip.classList.remove("on"); return; }
  const i = +el.dataset.i, p = PROJECTS[i], L = lang();
  tip.innerHTML = `<span class="tip-n">${String(i + 1).padStart(2, "0")}</span> ${p[L]} <span class="tip-y">${p.year}</span>`;
  tip.classList.add("on");
}
function setHot(el) {
  if (el === hot) return;
  if (hot) items.filter((x) => x.dataset.i === hot.dataset.i).forEach((x) => x.classList.remove("hot", "kin"));
  hot = el;
  if (hot) {
    hot.classList.add("hot");
    // the project's other images warm up a little too
    items.filter((x) => x !== hot && x.dataset.i === hot.dataset.i).forEach((x) => x.classList.add("kin"));
  }
  showTip(hot);
}

/* ---------- input ---------- */
let down = null, moved = 0, lastX = 0, pid = null;
reel.addEventListener("pointerdown", (e) => {
  down = e.target.closest(".img"); moved = 0; lastX = e.clientX; pid = e.pointerId;
  reel.dataset.down = "1";
});
reel.addEventListener("pointermove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  tip.style.transform = `translate(${e.clientX + 18}px, ${e.clientY + 14}px)`;
  const overUI = false;
  if (reel.dataset.down) {
    const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
    if (moved > 6 && !reel.hasPointerCapture(pid)) { try { reel.setPointerCapture(pid); } catch (err) {} setHot(null); }
    if (moved > 6) vel += dx * 0.004;
    return;
  }
  const el = overUI ? null : e.target.closest(".img");
  setHot(el);
  cursor.classList.toggle("big", !!el);
});
reel.addEventListener("pointerleave", () => { if (!reel.dataset.down) setHot(null); });
const release = (e) => {
  if (!reel.dataset.down) return;
  delete reel.dataset.down;
  if (moved <= 6 && down) openPreview(+down.dataset.j);
};
reel.addEventListener("pointerup", release);
reel.addEventListener("pointercancel", () => { delete reel.dataset.down; });
track.addEventListener("click", (e) => { if (e.target.closest(".img")) e.preventDefault(); });
track.addEventListener("keydown", (e) => { const c = e.target.closest(".img"); if (c && e.key === "Enter") openPreview(+c.dataset.j); });

reel.addEventListener("wheel", (e) => {
  e.preventDefault();
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  vel += d * 0.0025;
}, { passive: false });

/* ---------- preview panel ("bookstore" card) ---------- */
const pv = document.getElementById("pv");
let pvOpen = false, pvI = -1;
// the project's preview set: its first SHOW images (the 4th floating copy repeats one of them)
const imgsOf = (i) => {
  // one dot per different image (a project with 1 video shows 1, not 3 copies of it)
  const seen = new Set();
  return items.filter((x) => {
    if (+x.dataset.i !== i) return false;
    const m = x.firstElementChild, key = m ? m.getAttribute("src") : "j" + x.dataset.j;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, SHOW);
};
function fillCover(el, src) {
  // copy one image of the project into the cover (its own colour, no grey)
  el.style.setProperty("--ar", src.style.getPropertyValue("--ar"));
  el.style.setProperty("--hue", src.style.getPropertyValue("--hue"));
  el.style.setProperty("--tone", src.style.getPropertyValue("--tone"));
  el.innerHTML = src.innerHTML;
  const v = el.querySelector("video"); if (v) { v.muted = true; v.play().catch(() => {}); }
}
let pvJ = -1;
function renderPreview(j) {
  const src = items[j], i = +src.dataset.i, p = PROJECTS[i], L = lang();
  pvI = i; pvJ = j;
  const set = imgsOf(i);
  let k = set.indexOf(src);
  if (k < 0) {   // a repeated floating copy → the same image in the set
    const key = src.firstElementChild ? src.firstElementChild.getAttribute("src") : null;
    k = Math.max(0, set.findIndex((x) => x.firstElementChild && x.firstElementChild.getAttribute("src") === key));
    pvJ = +set[k].dataset.j;
  }
  fillCover(document.getElementById("pv-cover"), src);
  // level 3 — the label line: number · category · year
  document.getElementById("pv-num").textContent = `${String(i + 1).padStart(2, "0")}/${String(N).padStart(2, "0")}`;
  document.getElementById("pv-cat").textContent = p.type ? p.type[L] : "";
  document.getElementById("pv-yr").textContent = p.year;
  document.getElementById("pv-name").textContent = p[L];   // level 1 (with the cover)
  document.getElementById("pv-sum").textContent = p.summary ? p.summary[L] : "";
  const href = `project.html?id=${p.id}${L === "zh" ? "&lang=zh" : ""}`;
  document.getElementById("pv-title").href = href;
  document.getElementById("pv-open").href = href;
  document.getElementById("pv-dots").innerHTML = set.map((x, n) =>
    `<button type="button" class="pv-dot${n === k ? " on" : ""}" data-j="${x.dataset.j}" aria-label="${n + 1} / ${set.length}"></button>`).join("");
}
function openPreview(j) {
  renderPreview(j);
  pvOpen = true; setHot(null);
  pv.setAttribute("aria-hidden", "false");
  reel.classList.add("is-previewing");
}
function closePreview() {
  if (!pvOpen) return;
  pvOpen = false;
  pv.setAttribute("aria-hidden", "true");
  reel.classList.remove("is-previewing");
}
document.getElementById("pv-x").addEventListener("click", closePreview);
document.getElementById("pv-dots").addEventListener("click", (e) => {
  const t = e.target.closest(".pv-dot"); if (t) renderPreview(+t.dataset.j);
});
// click the cover → the project's next image, like turning a page
document.getElementById("pv-cover").addEventListener("click", () => {
  const set = imgsOf(pvI), k = set.indexOf(items[pvJ]);
  renderPreview(+set[(k + 1) % set.length].dataset.j);
});
const openFull = (e) => { e.preventDefault(); if (pvI >= 0) goToProject(pvI); };
document.getElementById("pv-open").addEventListener("click", openFull);
document.getElementById("pv-title").addEventListener("click", openFull);
pv.addEventListener("pointerdown", (e) => e.stopPropagation());   // clicks inside the panel don't drive the scene
pv.addEventListener("pointermove", (e) => { e.stopPropagation(); setHot(null); });
addEventListener("keydown", (e) => { if (e.key === "Escape") closePreview(); });
// a click on empty space (not an image) while the panel is open closes it
reel.addEventListener("click", (e) => { if (pvOpen && !e.target.closest(".img, .pv")) closePreview(); });

function goToProject(i) {
  const url = new URL("project.html", location.href);
  url.searchParams.set("id", PROJECTS[i].id);
  if (lang() === "zh") url.searchParams.set("lang", "zh");
  document.body.classList.add("leaving");
  setTimeout(() => { location.href = url; }, reduce ? 0 : 380);
}
{ const id = new URLSearchParams(location.search).get("project"); if (id) location.replace(`project.html?id=${encodeURIComponent(id)}`); }

document.addEventListener("langchange", () => { showTip(hot); if (pvOpen) renderPreview(pvJ); });

// E2 has one style only (Refined). It ignores the Original/Refined choice saved by E / E1
// in this browser — that saved "original" broke the E2 layout.
document.getElementById("home").classList.add("refined");
// …and reset that saved choice, so E and E1 also stop opening in the old Original look
try { localStorage.setItem("homeStyle", "refined"); } catch (e) {}

// ?pv=<image number> opens the preview straight away (for screenshots / sharing one project)
{ const q = new URLSearchParams(location.search).get("pv"); if (q !== null && items[+q]) setTimeout(() => openPreview(+q), 300); }

requestAnimationFrame(tick);
})();

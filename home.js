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
// E5 perf: the floating archive shows stills only (a project falls back to video only if it has
// no images) — an HD video decoding inside a small spinning frame cost frames on every turn
const isVideo = (m) => /\.(mp4|webm)$/i.test(m);
const cloudOf = (p) => {
  const all = [...new Set([...(p.preview || []), p.cover, ...(p.gallery || []).map((g) => g.src)].filter(Boolean))];
  const stills = all.filter((m) => !isVideo(m));
  return (stills.length ? stills : all).slice(0, PER);
};
for (let k = 0; k < PER; k++) PROJECTS.forEach((p, i) => {
  const list = cloudOf(p);
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
  // E5 UX: an empty slot is a grey block but not a link — no hand cursor; hover says "Coming soon"
  if (p.empty) return `<span class="img is-empty" data-i="${i}" data-j="${j}" aria-hidden="true"
      style="--ar:${ar};--hue:${HUES[i % HUES.length]};--tone:${tone}%"></span>`;
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
// Balanced placement (E3, Yanzi: 有大有小 balance): positions follow a Halton sequence, which
// spreads points evenly — no clumps, no empty corners — instead of plain random numbers.
// Sizes cycle big / small / medium so neighbours differ; real work gets the bigger sizes.
const halton = (n, base) => { let f = 1, r = 0; while (n > 0) { f /= base; r += f * (n % base); n = Math.floor(n / base); } return r; };
const SIZES_REAL = [1, 0.55, 0.8, 0.35, 0.95, 0.6, 0.75, 0.45];   // → scale 0.55 + d × 0.9
const SIZES_GREY = [0.3, 0.1, 0.45, 0.2, 0.05, 0.35];
let nReal = 0, nGrey = 0;
const R = items.map((el, j) => {
  const real = !!el.firstElementChild;
  if (j === 0) return { a: 0.5, b: 0.47, c: 0.9, d: 1.75 };   // Project 01's first image: centre, near, biggest
  return {
    a: 0.06 + 0.88 * halton(j + 1, 2),   // across  (kept off the very edges)
    b: 0.08 + 0.84 * halton(j + 1, 3),   // up / down
    c: halton(j + 1, 5),                 // depth
    d: real ? SIZES_REAL[nReal++ % SIZES_REAL.length] : SIZES_GREY[nGrey++ % SIZES_GREY.length],
  };
});

const deg = (r) => r * 180 / Math.PI;
const ZERO = { x: 0, y: 0, z: 0, gz: 0, gx: 0, gy: 0, ga: 0, lx: 0, ly: 0, lz: 0, ry: 0, s: 1, o: 1 };

/* ---------- Let go: loose in space, drifting round slowly; images face you ---------- */
function targetFor(j) {
  const r = R[j];
  const g = spin * 0.35;
  const px = (r.a * 2 - 1) * W * 0.75, py = (r.b * 2 - 1) * H * 0.68, pz = -1400 + r.c * 1700;
  const zr = px * Math.sin(g) + pz * Math.cos(g);
  return { z: -300, gy: deg(g), lx: px, ly: py, lz: pz, ry: -deg(g),
           s: 0.55 + r.d * 0.9, o: zr > 900 ? 0 : 1 };   // E3 (Yanzi): solid images — depth shows through size only, never transparency
}

const RES = 0.5;   // frames are drawn at 2× (see --w in home.css) and scaled by RES
/* ---------- loop ---------- */
const cur = items.map(() => ({ ...ZERO, o: 0 }));
const ANG = ["gz", "gx", "gy", "ga", "ry"];
let lastT = performance.now();
function tick(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
  W = innerWidth; H = reel.clientHeight; U = items[0].offsetWidth || U;
  // slow turning by itself; much slower while an image is under the mouse
  // E3: keeps turning at full speed while the panel is open, so the blurred left side stays alive
  if (!reduce) spin += (0.09 * (hot && !pvOpen ? 0.15 : 1)) * dt + vel * dt;
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
    // crisp images: frames are laid out at 2× size (CSS --w) and scaled DOWN here, so the browser
    // never stretches a small render (that was what made them look blurry)
    el.style.transform =
      `translate3d(${v.x}px,${v.y}px,${v.z}px) rotateZ(${v.gz}deg) rotateX(${v.gx}deg) rotateY(${v.gy}deg) rotateX(${v.ga}deg) ` +
      `translate3d(${v.lx}px,${v.ly}px,${v.lz}px) rotateY(${v.ry}deg) scale(${(v.s * RES).toFixed(4)})`;
    const o = Math.max(0, Math.min(1, v.o));
    el.style.opacity = o.toFixed(3);
    el.style.pointerEvents = o < 0.3 ? "none" : "";
  });
  // E3: the whole page blurs behind the panel (CSS), so no frosted shapes are drawn in it
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
  tip.innerHTML = `${p[L]} <span class="tip-y">${p.year || ""}</span>`;   // E5 (Yanzi): no project numbers   // no "view →" (Yanzi: not needed)
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
// Which image is at (x, y)? Our own test instead of the browser's: 3D hit-testing is unreliable
// in some browsers (Safari), and people click quickly / near edges. Pick the frontmost (largest
// on screen) visible image whose box, grown by 12px, contains the point.
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
reel.addEventListener("pointerdown", (e) => {
  down = pickAt(e.clientX, e.clientY); moved = 0; lastX = e.clientX; pid = e.pointerId;
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
  const el = overUI ? null : pickAt(e.clientX, e.clientY);
  setHot(el);
  cursor.classList.toggle("big", !!el && !el.classList.contains("is-empty"));   // no "open" cursor on empty slots
});
reel.addEventListener("pointerleave", () => { if (!reel.dataset.down) setHot(null); });
const release = (e) => {
  if (!reel.dataset.down) return;
  delete reel.dataset.down;
  if (moved <= 6 && down && !PROJECTS[+down.dataset.i].empty) openPreview(+down.dataset.j);   // E5: "Coming soon" slots don't open
};
reel.addEventListener("pointerup", release);
reel.addEventListener("pointercancel", () => { delete reel.dataset.down; });
track.addEventListener("click", (e) => { if (e.target.closest(".img")) e.preventDefault(); });
track.addEventListener("keydown", (e) => { const c = e.target.closest(".img"); if (c && e.key === "Enter" && !PROJECTS[+c.dataset.i].empty) openPreview(+c.dataset.j); });

reel.addEventListener("wheel", (e) => {
  e.preventDefault();
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  vel += d * 0.0025;
}, { passive: false });

/* ---------- preview panel ("bookstore" card) ---------- */
const pv = document.getElementById("pv");
let pvOpen = false, pvI = -1, pvOpener = null;
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
  // label line on the nav line: number · category · year
  document.getElementById("pv-num").textContent = "";   // E5 (Yanzi): no project numbers
  document.getElementById("pv-cat").textContent = p.type ? p.type[L] : "";   // keeps its own capitals (UI/UX)
  document.getElementById("pv-yr").textContent = p.year;
  document.getElementById("pv-name").textContent = p[L];
  document.getElementById("pv-tags").textContent = (p.tags || []).map((t) => t[L]).join(L === "zh" ? "、" : ", ");
  document.getElementById("pv-sum").textContent = p.summary && !/placeholder|占位/i.test(p.summary[L]) ? p.summary[L] : "";   // E5 UX: no placeholder copy in the panel
  // Client and Special thanks (Yanzi) — always shown on every project; "—" until filled in
  const f = p.facts || {};
  const facts = [
    [L === "zh" ? "客户" : "Client", (f.client && f.client[L]) || "—"],
    [L === "zh" ? "特别感谢" : "Special thanks", (f.thanks && f.thanks[L]) || "—"],
  ];
  document.getElementById("pv-facts").innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  // every image / video of the project, one under the other (no separate cover, no dots)
  // media with a layout size: "full" (default), "half" (2 per row) or "third" (3 per row),
  // taken from the gallery entry's `size`; consecutive halves / thirds share one row
  const sizeOf = {};
  (p.gallery || []).forEach((g) => { if (g.src && g.size) sizeOf[g.src] = g.size; });
  (p.panelSolo || []).forEach((m) => { delete sizeOf[m]; });   // E5 (Yanzi: 不可以不规则): pairs that don't match stand alone in the panel
  // panel order = the curated gallery order; preview / cover only add what the gallery lacks.
  // E5 (Yanzi): a project can set its own panel order (`p.panel`), so the panel doesn't open
  // on the same image as the case study — same calm layout, some photos in other places
  const all = [...new Set([...(p.panel || []), ...(p.gallery || []).map((g) => g.src), ...(p.preview || []), p.cover].filter(Boolean))]
    .filter((m) => !(p.panelHide || []).includes(m));   // Yanzi: some photos stay on the case study only
  const hue = HUES[i % HUES.length];
  const fig = (m) => {
    const crop = CROP[m.split("/").pop()];
    const style = crop ? ` style="aspect-ratio:${crop.toFixed(4)};--a:${crop.toFixed(4)}"` : "";
    return /\.(mp4|webm)$/i.test(m)
      ? `<figure class="pv-fig" style="aspect-ratio:${(crop || VR[m.split("/").pop()] || 16 / 9).toFixed(4)}"><video data-src="${m}" muted loop playsinline preload="none"></video></figure>`
      : `<figure class="pv-fig"${style}><img src="${m}" alt="" loading="lazy"></figure>`;
  };
  const rows = [];
  // curated layout (Yanzi): each video sits alone, full width; images that belong together are
  // set side by side by the project's own `size` ("half" = pair, "third" = trio); the rest full width
  const isVid = (m) => /\.(mp4|webm)$/i.test(m);
  all.forEach((m) => {
    let size = !isVid(m) && (sizeOf[m] === "half" || sizeOf[m] === "third") ? sizeOf[m] : "full";
    const last = rows[rows.length - 1], max = size === "half" ? 2 : 3;
    if (size !== "full" && last && last.size === size && last.items.length < max) last.items.push(m);
    else rows.push({ size, items: [m] });
  });
  // each row is one unit for the focus effect (it grows + turns to colour as a whole)
  const galleryHTML = all.length
    ? rows.map((r) => `<div class="pv-row pv-row-${r.size}">${r.items.map(fig).join("")}</div>`).join("")
    : [5 / 4, 16 / 10, 4 / 5].map((ar) =>
        `<div class="pv-row pv-row-full"><figure class="pv-fig pv-ph" style="aspect-ratio:${ar};--hue:${hue}"></figure></div>`).join("");   // placeholder project
  // E5 perf (Yanzi: "点开会卡一下"): the images go in once the panel has slid in, not during the slide
  const gal = document.getElementById("pv-gallery");
  gal.innerHTML = "";
  clearTimeout(pvFillT);
  pvFillT = setTimeout(() => { if (pvJ !== j) return; gal.innerHTML = galleryHTML; afterFill(); }, pvOpen ? 0 : 520);
  const href = `project.html?id=${p.id}${L === "zh" ? "&lang=zh" : ""}`;
  document.getElementById("pv-more").href = href;
  // E4: Next project (skips projects that have no images yet, same rule as the details page)
  const nx = stepProject(1), nb = document.getElementById("pv-next");
  nb.hidden = nx < 0;
  if (nx >= 0) document.getElementById("pv-next-name").textContent = PROJECTS[+items[nx].dataset.i][L];
  document.getElementById("pv-scroll").scrollTop = 0;
}
function afterFill() {
  // side-by-side rows: give each image its real ratio so they share one height (no cropping)
  document.querySelectorAll("#pv-gallery .pv-row-half img, #pv-gallery .pv-row-third img").forEach((img) => {
    const set = () => { if (img.naturalWidth) img.parentElement.style.setProperty("--a", (img.naturalWidth / img.naturalHeight).toFixed(4)); };
    if (img.complete) set(); else img.addEventListener("load", set, { once: true });
  });
  document.querySelectorAll("#pv-gallery video[data-src]").forEach((v) => pvVio.observe(v));
  requestAnimationFrame(() => document.getElementById("pv-scroll").dispatchEvent(new Event("scroll")));
}
// a panel video downloads only when it scrolls near view, and pauses when it leaves
let pvFillT = 0;
const VR = { "rebirth-digital-resurrection.mp4": 1620 / 1080, "rebirth-elevator.mp4": 1536 / 1080, "rebirth-gallery-hall.mp4": 1612 / 1080 };
const pvVio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.src) { v.src = v.dataset.src; v.preload = "auto"; } v.play().catch(() => {}); }
  else if (v.src) v.pause();
}), { root: document.getElementById("pv-scroll"), rootMargin: "100% 0px" });
function openPreview(j) {
  document.getElementById("h-hint")?.classList.add("done");   // E5: the "click any image" hint has done its job
  renderPreview(j);
  pvOpen = true; setHot(null);
  pv.setAttribute("aria-hidden", "false");
  reel.classList.add("is-previewing");
  document.body.classList.add("previewing");   // E3: blur everything behind the panel
  // E5 UX (keyboard / screen reader): focus moves into the panel, and back to where it came from on close
  pvOpener = document.activeElement;
  document.getElementById("pv-x").focus({ preventScroll: true });
}
function closePreview() {
  if (!pvOpen) return;
  pvOpen = false;
  pv.querySelectorAll("video").forEach((v) => v.pause());
  pv.setAttribute("aria-hidden", "true");
  reel.classList.remove("is-previewing");
  document.body.classList.remove("previewing");
  if (pvOpener && pvOpener.isConnected && pv.contains(document.activeElement)) pvOpener.focus({ preventScroll: true });
  pvOpener = null;
}
// Tab stays inside the open panel (it would otherwise walk through the blurred page behind it)
addEventListener("keydown", (e) => {
  if (!pvOpen || e.key !== "Tab") return;
  const f = [...pv.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((x) => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !pv.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !pv.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
});
document.getElementById("pv-x").addEventListener("click", closePreview);
window.closeProjectPanel = closePreview;   // the index layer closes the panel when it opens (never both at once)
document.getElementById("pv-veil").addEventListener("click", closePreview);
// for the Work Index layer: open project i's panel (its first floating image)
window.openProjectPanel = (i) => { if (PROJECTS[i] && PROJECTS[i].empty) return; const el = items.find((x) => +x.dataset.i === i); if (el) openPreview(+el.dataset.j); };
const openFull = (e) => { e.preventDefault(); if (pvI >= 0) goToProject(pvI); };
document.getElementById("pv-more").addEventListener("click", openFull);

// ---------- E4: next project inside the panel (button at the end; ← → keys too, no extra UI) ----------
function itemOf(k) {   // the floating image that opens project k; -1 if k has no images yet
  const p = PROJECTS[k]; if (!p || p.empty || !((p.preview && p.preview[0]) || p.cover)) return -1;
  const el = items.find((x) => +x.dataset.i === k); return el ? +el.dataset.j : -1;
}
function stepProject(d) {
  for (let s = 1; s < N; s++) { const j = itemOf(((pvI + d * s) % N + N) % N); if (j >= 0) return j; }
  return -1;
}
function goStep(d) {
  const j = stepProject(d); if (j < 0) return;
  const book = pv.querySelector(".pv-book");
  book.classList.remove("swap"); void book.offsetWidth;
  renderPreview(j);
  book.classList.add("swap");
}
document.getElementById("pv-next").addEventListener("click", () => goStep(1));
addEventListener("keydown", (e) => {
  if (!pvOpen || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === "ArrowRight") { e.preventDefault(); goStep(1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); goStep(-1); }
});
pv.addEventListener("pointerdown", (e) => e.stopPropagation());   // clicks inside the panel don't drive the scene
pv.addEventListener("pointermove", (e) => { e.stopPropagation(); setHot(null); });
addEventListener("keydown", (e) => { if (e.key === "Escape") closePreview(); });
// a click on empty space (not an image) while the panel is open closes it
reel.addEventListener("click", (e) => { if (pvOpen && !e.target.closest(".img, .pv")) closePreview(); });

function goToProject(i) {
  const url = new URL("project.html", location.href);
  url.searchParams.set("id", PROJECTS[i].id);
  if (lang() === "zh") url.searchParams.set("lang", "zh");
  // E5 (Yanzi "点完会卡着"): go straight away — the old 0.35s fade-out + 0.38s wait left the panel
  // alone on a white page
  location.href = url;
}
{ const id = new URLSearchParams(location.search).get("project"); if (id) location.replace(`project.html?id=${encodeURIComponent(id)}`); }

document.addEventListener("langchange", () => { showTip(hot); if (pvOpen) renderPreview(pvJ); });

// E2 has one style only (Refined). It ignores the Original/Refined choice saved by E / E1
// in this browser — that saved "original" broke the E2 layout.
document.getElementById("home").classList.add("refined");
// …and reset that saved choice, so E and E1 also stop opening in the old Original look
try { localStorage.setItem("homeStyle", "refined"); } catch (e) {}

// ---------- focus scroll (option A, after obys Odin's Crow) — default in E3 ----------
// In the scrolling panel every image is the same width and always in colour; while scrolling,
// the one passing the middle grows a little (6%).
if (new URLSearchParams(location.search).get("focus") !== "0") {   // default on in E3 (Yanzi: 只要效果); ?focus=0 turns it off
  document.body.classList.add("focus-mode");
  const scroller = document.getElementById("pv-scroll");
  let raf = 0;
  const GAP = 10;   // visible gap between rows = the CSS gap (10px), so nothing drifts
  const focusPass = () => {
    raf = 0;
    const r = scroller.getBoundingClientRect();
    const rows = [...scroller.querySelectorAll(".pv-row")];
    if (!rows.length) return;
    const first = rows[0], st = scroller.scrollTop;
    // the focus line starts on the first image (so it opens full size, in colour) and
    // eases to the panel's middle over the first ~half screen of scrolling
    const firstC = first.offsetTop + first.offsetHeight / 2 - st;           // first row centre, in scroller px
    const settle = Math.min(1, st / (r.height * 0.5));
    const focusY = (1 - settle) * firstC + settle * (r.height / 2);
    // rows stack from the top with a constant visible gap: shrinking pulls the rest up
    let y = first.offsetTop;   // visible top of the next row (layout px)
    rows.forEach((row) => {
      const h = row.offsetHeight, top = row.offsetTop;
      const c = (y + h / 2) - st;                                            // approx. visible centre
      const t = Math.max(0, 1 - Math.abs(c - focusY) / (r.height * 0.55));
      const e = t * t * (3 - 2 * t);
      // E3 (Yanzi): every image is the same size (full text-column width); only while scrolling
      // does the one passing the middle grow a little. At the top nothing is enlarged.
      // centred panel: a gentler 3% so a growing row stays inside the card's 16px margin
      const sc = 1 + (document.body.classList.contains("pv-center") ? 0.03 : 0.06) * e * settle;
      const ty = (y - top) - (1 - sc) * h / 2;                               // visible top lands on y
      row.style.transform = `translateY(${ty.toFixed(1)}px) scale(${sc.toFixed(4)})`;
      row.style.filter = "none";   // Yanzi: images in the panel are always in colour (no grey → colour)
      y += h * sc + GAP;
    });
  };
  const ask = () => { if (!raf) raf = requestAnimationFrame(focusPass); };
  scroller.addEventListener("scroll", ask, { passive: true });
  addEventListener("resize", ask);
  new MutationObserver(() => setTimeout(ask, 50)).observe(document.getElementById("pv-gallery"), { childList: true });
  document.getElementById("pv-gallery").addEventListener("load", ask, true);
}

// nav trial (Yanzi): ?nav=index → bar-style nav only while the index is open (version A);
// ?nav=all → bar-style nav everywhere (version B). Default: the centred-logo nav.
// Default is now version B (Yanzi, 2026-10-25); version A kept: ?nav=index · old centred nav: ?nav=centre
{ const q = new URLSearchParams(location.search).get("nav");
  const n = q === "index" || q === "centre" ? q : "all";
  if (n !== "centre") document.body.classList.add("navbar-" + n);
  // keep the choice when moving between work and index
  document.querySelectorAll('.h-nav a[href^="./"]').forEach((a) => { if (q) a.href = a.getAttribute("href").replace("./", "./?nav=" + q + "&").replace(/[?&]$/, ""); });
}

// panel layout: centred like alanxu.info (default, Yanzi 2026-10-25) · ?pvl=side = the right-half panel
// Yanzi: keep her own right-half panel format; the centred alanxu card stays at ?pvl=center
if (new URLSearchParams(location.search).get("pvl") === "center") document.body.classList.add("pv-center");

// footer trial: ?foot=dark → white text on a black strip (to compare with the default white one)
if (new URLSearchParams(location.search).get("foot") === "dark") document.body.classList.add("foot-dark");

// ?pv=<image number> opens the preview straight away (for screenshots / sharing one project)
{ const qs = new URLSearchParams(location.search), q = qs.get("pv"), sy = +qs.get("pvscroll") || 0;
  if (q !== null && items[+q]) setTimeout(() => { openPreview(+q); if (sy) setTimeout(() => { document.getElementById("pv-scroll").scrollTop = sy; }, 400); }, 300); }   // ?pvscroll=px (screenshots)

requestAnimationFrame(tick);
})();

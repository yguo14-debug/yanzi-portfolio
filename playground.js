// E4 — Playground sheet (no sideways scrolling; Yanzi 2026-11-01). Real work goes into ITEMS later (Yanzi): copy one line per piece.
//   en / zh  : name          kind : one of the filter keys below
//   at       : tool or place (en / zh)        year : "2025"
//   src      : image or video path ("media/…"), null = grey placeholder
//   r        : image ratio (width / height) — images keep it, so the bottoms line up and the tops step
(() => {
const FILTERS = [
  ["all", "All", "全部"], ["motion", "Motion", "动态"], ["3d", "3D", "三维"],
  ["type", "Type", "字体"], ["packaging", "Packaging", "包装"], ["ai", "AI", "AI"], ["code", "Code", "代码"],
];
const ph = (n, kind, at, year, r, h) => ({
  en: `Experiment ${String(n).padStart(2, "0")}`, zh: `实验 ${String(n).padStart(2, "0")}`,
  kind, at, year, src: null, r, h,
});
const T = (en, zh) => ({ en, zh: zh || en });
const ITEMS = [   // placeholders, newest first
  { en: "Backsplash Typeface", zh: "Backsplash 字体", kind: "type", at: T(""), year: "2026",   // Yanzi: no label; year 2026 (to confirm)
    src: "media/playground/backsplash-poster.webp", r: 0.5, h: 0.55, tester: "BACKSPLASH" },   // the poster set in Backsplash; opened: poster, then type in the face
  { en: "Offmap Open Launch", zh: "Offmap 开幕邀请函", kind: "type", at: T("Print · Invitation", "印刷 · 邀请函"), year: "2026",   // Yanzi 2026-11-08: folded fortune-teller invitation, OPEN LAUNCH -> Offmap 06/24
    src: "media/playground/offmap-launch.mp4", r: 1042 / 1258, h: 0.6 },   // her 4_raw.mov, re-encoded to H.264 (plays everywhere), loops in colour
  { en: "Artificial Coral Reef", zh: "人工珊瑚礁", kind: "3d", at: T("Blender"), year: "2024",   // Yanzi 2026-11-01 (year to confirm)
    src: "media/playground/grasper-sand.jpg?v=2", r: 1826 / 938, h: 0.62,   // cover: Yanzi's sharp photo of the piece on sand
    },   // Yanzi 2026-11-13: the website screenshot is out too — the sand photo alone (was seq: ["media/playground/grasper-website.jpg"])   // Yanzi 2026-11-13: the two blue underwater renders are out   // every 3 s → close-up underwater → reef field → the website → back (Yanzi 2026-11-08: the four-modules image is out)
  // (Audubon Typeface removed, Yanzi 2026-11-13)
  { en: "Noise Visualiser", zh: "噪声可视化工具", kind: "code", at: T("Motion tool", "动态工具"), year: "2026",   // Yanzi 2026-11-13 (year to confirm)
    src: "media/playground/noise-visualiser.mp4", r: 1080 / 1440, h: 0.6 },
  { en: "3D Type Path", zh: "三维文字路径动画", kind: "code", at: T("Motion · 3D type", "动态 · 三维文字"), year: "2026",   // Yanzi 2026-11-13: words travelling along 3D paths (year to confirm)
    src: "media/playground/type-path-3d.mp4", r: 1080 / 1440, h: 0.6 },
  { en: "Type Outline Tool", zh: "文字轮廓动态工具 1.0", kind: "code", at: T("Motion tool", "动态工具"), year: "2026",   // Yanzi 2026-11-13: her type outline tool 1.0 (year to confirm)
    src: "media/playground/type-outline-tool.mp4", r: 1080 / 1440, h: 0.6 },
  { en: "Type Warp Tool", zh: "文字形变 & 非均匀缩放动态工具", kind: "code", at: T("Motion tool", "动态工具"), year: "2026",   // Yanzi 2026-11-13 (year to confirm)
    src: "media/playground/type-warp-tool.mp4", r: 1080 / 1440, h: 0.6 },
  { en: "ASCII Motion", zh: "字符动态", kind: "code", at: T("Motion · Code", "动态 · 代码"), year: "2026",   // Yanzi 2026-11-13: her four ASCII frames (0 / @ / 2 / –) as a stop-motion loop (year to confirm)
    src: "media/playground/ascii-motion.mp4", r: 1080 / 1440, h: 0.6 },
    // (hidden 2026-11-13, Yanzi: out of the Playground for now) { en: "Sakura Lychee Fizz", zh: "樱花荔枝气泡饮", kind: "packaging", at: T("Packaging", "包装设计"), year: "2026",   // Yanzi 2026-11-01 (year to confirm)
  // src: "media/playground/sakura-lychee-fizz.webp", r: 2000 / 1294, h: 0.42 },
    // (hidden 2026-11-13, Yanzi: out of the Playground) { en: "Album Covers", zh: "专辑封面", kind: "packaging", at: T("CD covers", "CD 封面"), year: "2026",   // Yanzi 2026-11-13: Shakatak / Craig Ruhnke / Lionel Richie CD covers (name/year to confirm)
  // src: "media/playground/album-covers.webp?v=3", r: 2000 / 1137, h: 0.42 },
  { en: "Make Art, Inevitable", zh: "Make Art, Inevitable 海报", kind: "type", at: T("Poster · Design Charrette", "海报 · 设计速做"), year: "2026",   // Yanzi 2026-11-13: from her Design Charrette PDF, white border and frame line cut off (name/year to confirm)
    src: "media/playground/make-art-poster.webp", r: 1286 / 1934, h: 0.7 },
  // Yanzi 2026-11-13: two posters and the Mr.DOB book (its spreads one after another as a motion) — names/years to confirm
    // (hidden 2026-11-13, Yanzi: out of the Playground for now) { en: "Fantasias Type Poster", zh: "Fantasias 字体海报", kind: "type", at: T("Typographic poster", "字体海报"), year: "2021",
  // src: "media/playground/fantasias-type-poster.webp", r: 1728 / 2592, h: 0.7 },
    // (hidden 2026-11-13, Yanzi: out of the Playground for now) { en: "Blue Gate", zh: "Blue Gate 电影海报", kind: "type", at: T("Movie poster", "电影海报"), year: "2021",
  // src: "media/playground/blue-gate-poster.webp", r: 1944 / 2952, h: 0.7 },
    // (hidden 2026-11-13, Yanzi: out of the Playground) { en: "Publication & Game Site", zh: "出版物与游戏网站", kind: "code", at: T("Website · RISO · Game", "网站 · RISO 印刷 · 游戏"), year: "2026",   // Yanzi 2026-11-13: one piece, its two pages (Publication / Game) flip every 3 s (name/year to confirm)
  // src: "media/playground/site-publication.webp", r: 1497 / 768, h: 0.42, seq: ["media/playground/site-game.webp"] },
    // (hidden 2026-11-13, Yanzi: only the strong pieces stay) { en: "Mr.DOB Book", zh: "Mr.DOB 书籍设计", kind: "type", at: T("Book · Editorial", "书籍 · 编辑设计"), year: "2021",
  // src: "media/playground/mr-dob-book.mp4", r: 1600 / 1000, h: 0.45 },
];

const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const track = document.getElementById("pg-track");
const bar = document.getElementById("pg-filters");
const count = document.getElementById("pg-count");
let filter = "all";
try { const f = new URLSearchParams(location.search).get("f"); if (FILTERS.some(([k]) => k === f)) filter = f; } catch (e) {}

// a piece with several images (`seq`): they sit on top of each other and cross-fade every 3 s
const seqHTML = (it, eager) => `<span class="pg-seq">${[it.src, ...it.seq].map((m, k) =>
  `<img src="${m}" alt="" ${eager ? "" : 'loading="lazy" '}draggable="false"${k ? "" : ' class="on"'}>`).join("")}</span>`;
setInterval(() => {
  if (document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".pg-track .pg-seq").forEach((q) => {   // the grid only; the enlarged view is stepped by hand
    const imgs = [...q.children], k = imgs.findIndex((x) => x.classList.contains("on"));
    imgs[k].classList.remove("on"); imgs[(k + 1) % imgs.length].classList.add("on");
  });
}, 3000);
const media = (src) => !src ? "" : /\.(mp4|webm)$/i.test(src)
  ? `<video src="${src}" autoplay muted loop playsinline preload="metadata"></video>`
  : `<img src="${src}" alt="" loading="lazy" draggable="false">`;

// the strip's columns, wrapped into rows that fill the page (no sideways scrolling):
// 4 per row on a laptop, 3 on a tablet, 2 on a phone. In each row the column widths follow the
// every row shares the same columns so the lines run straight down the page (Yanzi: 对齐);
// each image keeps its ratio and stands on the row's year line, so the tops still step.
const perRow = () => (innerWidth > 1100 ? 4 : innerWidth > 760 ? 3 : 2);
let rowsOf = 0;

function render() {
  const l = L();
  bar.innerHTML = FILTERS.map(([k, en, zh]) =>
    `<button type="button" data-f="${k}" aria-pressed="${k === filter}">${l === "zh" ? zh : en}</button>`).join("");
  const list = ITEMS.filter((it) => filter === "all" || it.kind === filter);
  const n = rowsOf = perRow(), rows = [];
  for (let k = 0; k < list.length; k += n) rows.push(list.slice(k, k + n));
  track.innerHTML = rows.map((row) => {
    return `<div class="pg-row" style="--n:${n}">${row.map((it) => {
      return `
      <article class="pg-col" data-n="${ITEMS.indexOf(it)}" data-kind="${it.kind}" style="--r:${it.r};--i:${row.indexOf(it)}">
        <h2 class="pg-name">${it[l]}</h2>
        <p class="pg-meta"><span>${it.at[l]}</span><span>${it.year}</span></p>
        <div class="pg-img">${it.seq ? seqHTML(it) : media(it.src)}</div>
      </article>`;
    }).join("")}${row.length < n ? `<div class="pg-fill" style="grid-column:span ${n - row.length}"></div>` : ""}</div>`;
  }).join("");
  const nReal = list.filter((it) => it.src).length;   // grey slots are not counted
  count.textContent = l === "zh" ? `${nReal} 件` : `${nReal} ${nReal === 1 ? "piece" : "pieces"}`;
  track.querySelectorAll(".pg-row").forEach((r) => io.observe(r));
}

// reveal: each image rises out of its year line when its row comes into view, column after column
// (same curve as the About page's big type)
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
}), { threshold: .12 });

bar.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  filter = b.dataset.f; render();
});

// ---------- quick view (after soyeonkimwork.com/2D-3D) ----------
// magnifier cursor on the images; click → the piece grows from where it sits to the middle of a
// white screen (FLIP: measured from the thumbnail, so it zooms out of its own place)
const view = document.getElementById("pg-view"), fig = document.getElementById("pg-view-fig"), cap = document.getElementById("pg-view-cap");
let cur = -1, shown = [], sub = 0, opener = null;
const visibleList = () => ITEMS.filter((it) => filter === "all" || it.kind === filter);

// ---------- type tester (Backsplash): letters land like a modular display — each new one flicks
// through a few random glyphs before it settles ----------
const tester = document.getElementById("pg-tester"), tOut = document.getElementById("pg-t-out"), tIn = document.getElementById("pg-t-in");
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
let shownText = "";
function typeOut(text) {
  text = text.toUpperCase();
  const old = shownText; shownText = text;
  // words stay whole (each word is one unbreakable group of letters)
  tOut.innerHTML = text.split(" ").map((w) => `<span class="w">${[...w].map((ch) => `<span class="c">${ch.replace(/[<&>]/g, "")}</span>`).join("")}</span>`).join(" ") + `<span class="pg-t-caret"></span>`;   // the caret follows the text, same size
  fitType();
  if (calm) return;
  const letters = [...tOut.querySelectorAll(".c")], plain = text.replace(/ /g, ""), oldPlain = old.replace(/ /g, "");
  letters.forEach((sp, k) => { if (oldPlain[k] === plain[k]) return; flick(sp, k); });
}
function flick(sp, k) {   // only the letters that changed move
  let n = 0; const final = sp.textContent;
  const t = setInterval(() => {
    sp.textContent = ++n < 6 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : final;
    if (n >= 6) clearInterval(t);
  }, 45 + Math.min(k, 12) * 4);
}
// the letters shrink to fit the box, so a long word never breaks in the middle
function fitType() {
  if (tester.hidden) return;
  tOut.style.fontSize = "";
  let fs = parseFloat(getComputedStyle(tOut).fontSize);
  const box = tOut.parentElement.clientWidth;
  const longest = () => Math.max(0, ...[...tOut.querySelectorAll(".w")].map((w) => w.scrollWidth));
  while (longest() > box && fs > 22) { fs -= 2; tOut.style.fontSize = fs + "px"; }
}
tIn.addEventListener("input", () => typeOut(tIn.value));
// measure again once Backsplash itself has loaded (the first measure may use the wider fallback font)
document.fonts && document.fonts.load('40px "Backsplash"').then(fitType).catch(() => {});
addEventListener("resize", fitType);

function fill(it) {
  const l = L(), k = shown.indexOf(it);
  // a typeface piece shows its tester beside the poster
  view.classList.toggle("has-tester", !!it.tester);
  tester.hidden = !it.tester;
  if (it.tester) { tIn.value = it.tester; shownText = ""; typeOut(it.tester); document.fonts && document.fonts.load('40px "Backsplash"').then(fitType); }
  fig.style.setProperty("--r", it.r);
  fig.innerHTML = it.seq ? seqHTML(it, true) : it.src ? media(it.src).replace(' loading="lazy"', "") : "";
  // Yanzi: an opened piece shows only its own images — the count is of its images, not of all pieces
  const n = it.seq ? it.seq.length + 1 : 1;
  sub = 0;
  view.classList.toggle("multi", n > 1);
  cap.innerHTML = `${n > 1 ? `<span class="pg-v-n" id="pg-v-n">01/${String(n).padStart(2, "0")}</span>` : ""}<span>${it[l]}</span><span class="pg-v-g">${it.at[l]}</span><span class="pg-v-y">${it.year}</span>`;
}
function open(n, from, k) {
  // E6: `from` = a floating image in the cloud (any piece opens, whatever the grid filter is);
  // `k` = which of the piece's images was clicked, so the view opens on that one
  const it = ITEMS[n]; shown = from ? ITEMS.filter((x) => x.src) : visibleList(); cur = shown.indexOf(it); if (cur < 0) return;
  fill(it);
  if (k) step(k);
  view.classList.add("on"); view.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
  opener = from || null;
  // FLIP from the thumbnail (or the floating image it was clicked in)
  const th = from || track.querySelector(`.pg-col[data-n="${n}"] .pg-img`);
  const a = th.getBoundingClientRect(), b = fig.getBoundingClientRect();
  fig.style.transition = "none";
  fig.style.transform = `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`;
  fig.getBoundingClientRect();
  fig.style.transition = ""; fig.style.transform = "";
  if (it.tester) setTimeout(() => { tIn.focus({ preventScroll: true }); tIn.setSelectionRange(tIn.value.length, tIn.value.length); }, 400);   // ready to type, caret at the end
  else document.getElementById("pg-view-x").focus({ preventScroll: true });
}
function close() {
  if (!view.classList.contains("on")) return;
  view.classList.remove("on"); view.setAttribute("aria-hidden", "true"); document.body.style.overflow = "";
  if (opener && opener.isConnected && view.contains(document.activeElement)) opener.focus({ preventScroll: true });
  opener = null;
}
// ← → step through the opened piece's own images (never to another piece)
function step(d) {
  const imgs = [...fig.querySelectorAll(".pg-seq > img")];
  if (imgs.length < 2) return;
  imgs[sub].classList.remove("on");
  sub = (sub + d + imgs.length) % imgs.length;
  imgs[sub].classList.add("on");
  const c = document.getElementById("pg-v-n");
  if (c) c.textContent = `${String(sub + 1).padStart(2, "0")}/${String(imgs.length).padStart(2, "0")}`;
}

track.addEventListener("click", (e) => {
  const c = e.target.closest(".pg-col"); if (!c) return;
  open(+c.dataset.n);
});
view.addEventListener("click", (e) => {
  if (e.target.closest(".pg-view-nav, .pg-tester")) return;
  if (view.classList.contains("multi") && e.target.closest(".pg-view-fig")) { step(1); return; }   // clicking the image shows the next one
  close();
});
document.getElementById("pg-prev").addEventListener("click", () => step(-1));
document.getElementById("pg-next").addEventListener("click", () => step(1));
addEventListener("keydown", (e) => {
  if (!view.classList.contains("on")) return;
  if (e.key === "Escape") close();
  else if (e.target === tIn) return;   // arrows move the caret while typing
  else if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1);
});

// ---------- E6: two views — Cloud (the floating archive, default) / Grid (this sheet) ----------
// the cloud lives in cloud.js and opens pieces through window.PG
window.PG = { items: ITEMS, open, isOpen: () => view.classList.contains("on") };
const cl = document.getElementById("cl"), sw = document.getElementById("pg-viewsw"), hint = document.getElementById("pg-hint");
let mode = "cloud";   // Yanzi 2026-11-13: the Playground has no Grid view any more — the cloud only
function setMode(m) {
  mode = m;
  document.body.classList.toggle("pg-cloud", m === "cloud");
  cl.hidden = m !== "cloud"; track.hidden = m !== "grid"; bar.hidden = m !== "grid"; hint.hidden = m !== "cloud";
  // (the switch's buttons belong to modes.js now)
  if (m === "grid") track.querySelectorAll(".pg-row:not(.in)").forEach((r) => { io.unobserve(r); io.observe(r); });
}
if (0) sw.addEventListener("click", (e) => {   // E7: the switch now picks the field's modes (modes.js)
  const b = e.target.closest("button[data-v]"); if (!b || b.dataset.v === mode) return;
  setMode(b.dataset.v);
  const u = new URL(location.href);
  if (mode === "grid") u.searchParams.set("view", "grid"); else u.searchParams.delete("view");
  history.replaceState(null, "", u);
});

render();
setMode(mode);
addEventListener("resize", () => { if (perRow() !== rowsOf) render(); });
document.addEventListener("langchange", () => { render(); if (view.classList.contains("on")) fill(shown[cur]); });
})();

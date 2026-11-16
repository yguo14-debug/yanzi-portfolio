// E3 Work Index — a layer over the homepage; grid after tomorrow-happens.studio (three parts):
//   left   = work categories (All, Branding, Exhibition …) — click to filter
//   middle = the list: number · name · year (note + View ↗ on hover)
//   right  = small black square; the image sits inside it, lined up with the hovered row
// Click a row → closes the index and opens the project's panel on the homepage.
(() => {
const layer = document.getElementById("wi-layer");
const list = document.getElementById("wi-list");
const cats = document.getElementById("wi-cats");
const prev = document.getElementById("wi-preview");
const navIndex = document.getElementById("nav-index");
const navWork = document.getElementById("nav-images");   // E5: Images / List switch in the label row (Work stays current)
const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const base = window.ALL_PROJECTS || window.PROJECTS;
// E5: the list holds the same 8 slots as the archive (the count matches "/08" everywhere);
// slots without a project yet read "Coming soon" and can't be clicked
const LIST = base.map((p) => (p.empty ? { ...p, id: null } : p));
// categories, matched against each project's type + tags
const CATS = [   // Yanzi 2026-11-14 (Wayne Hunt: call it what it is — no "spatial", "editorial", "print", "collateral")
  { id: "all", en: "All", zh: "全部", re: null },
  { id: "identity", en: "Identity Design", zh: "识别设计", re: /identity|logo/i },
  { id: "exhibit", en: "Exhibit & Interior Design", zh: "展览与室内设计", re: /exhibit|interior|signage/i },
  { id: "packaging", en: "Packaging Design", zh: "包装设计", re: /packaging|product|furniture/i },
  { id: "book", en: "Type, Book & Poster Design", zh: "字体、书籍与海报设计", re: /typeface|font|specimen|catalog|publication|newspaper|poster|book|menu/i },
  { id: "web", en: "Web, App & Motion", zh: "网站、App 与动态", re: /web|app|animation|motion/i },
];
const text = (p) => [p.type && p.type.en, ...(p.tags || []).map((t) => t.en)].filter(Boolean).join(" ");
let cat = "all";
const firstMedia = (p) => {
  if (p.noCover) return null;
  const all = [...(p.preview || []), p.cover, ...((p.gallery || []).map((g) => g.src))].filter(Boolean);
  return all.find((m) => !/\.(mp4|webm)$/i.test(m)) || all[0];
};
function renderCats() {
  const l = L();
  if (IXV6) {   // v6: one line of small text above the list, like obys' "Space, About"
    cats.innerHTML = `<span class="wi-h-n">${l === "zh" ? "编号" : "No."}</span><span class="wi-h-cats">` + CATS.map((c, k) =>
      `<button type="button" class="wi-cat${c.id === cat ? " on" : ""}" data-c="${c.id}">${c[l]}</button>${k < CATS.length - 1 ? '<span class="wi-comma">, </span>' : ""}`).join("") + `</span>`;
    return;
  }
  cats.innerHTML = CATS.map((c) => {
    const n = c.re ? LIST.filter((p) => c.re.test(text(p))).length : LIST.length;
    return `<button type="button" class="wi-cat${c.id === cat ? " on" : ""}" data-c="${c.id}">
      <span>${c[l]}</span><span class="wi-cat-n">${c.id === cat ? "–" : "+"}</span></button>`;
  }).join("");
}
function renderV7() {
  const l = L(), c = CATS.find((x) => x.id === cat);
  list.innerHTML = LIST.map((p, i) => {
    const off = (c.re && !c.re.test(text(p))) || !p.id;
    return `<li class="wi-row${off ? " is-off" : ""}${p.id ? "" : " is-empty"}" data-i="${i}">
      <button type="button" class="wi-link"${p.id ? "" : " disabled"}>
        <span class="wi-n">${String(i + 1).padStart(2, "0")}</span>
        <span class="wi-name">${p[l]}</span>
        <span class="wi-meta"><span class="wi-cat-s">${p.type ? p.type[l] : ""}</span><span class="wi-y">${p.year || ""}</span></span>
      </button></li>`;
  }).join("");
  cats.innerHTML = CATS.map((x, k) =>
    `<button type="button" class="wi-cat${x.id === cat ? " on" : ""}" data-c="${x.id}">${x[l]}</button>${k < CATS.length - 1 ? '<span class="wi-comma">, </span>' : ""}`).join("");
  fitV7();
}
function fitV7() {
  // 10 rows share the height exactly; the type is as big as the row (and the width) allows
  const H = layer.clientHeight - 56 - 24, rowH = Math.max(36, Math.floor(H / LIST.length));
  list.style.setProperty("--rowH", rowH + "px");
  let fs = Math.round(rowH * 0.86);
  list.style.setProperty("--fs", fs + "px");
  const names = [...list.querySelectorAll(".wi-name")];
  const room = list.clientWidth * 0.62;
  const widest = Math.max(...names.map((n) => n.scrollWidth), 1);
  if (widest > room) { fs = Math.floor(fs * room / widest); list.style.setProperty("--fs", fs + "px"); }
}
function render() {
  if (IXV7) return renderV7();
  const l = L(), c = CATS.find((x) => x.id === cat);
  list.innerHTML = LIST.map((p, i) => {
    if (c.re && !c.re.test(text(p))) return "";
    return `<li class="wi-row${p.id ? "" : " is-empty"}" data-i="${i}">
      <button type="button" class="wi-link"${p.id ? "" : " disabled"}>
        <span class="wi-n">${String(i + 1).padStart(2, "0")}</span>
        <span class="wi-name">${p[l]}${p.year ? `<span class="wi-slash"> / ${p.year}</span>` : ""}</span>
        <span class="wi-note">${p.type ? p.type[l] : ""}</span>
        <span class="wi-go">${p.id ? (l === "zh" ? "查看 ↗" : "View ↗") : (l === "zh" ? "即将上线" : "Soon")}</span>
        <span class="wi-y">${p.year || ""}</span>
      </button></li>`;
  }).join("");
  renderCats();
}
/* ---------- large typography (after experiment.obys.agency/about) ----------
   At rest: a line about the archive, huge, lines set left / right in turn. Hovering a project
   swaps it for that project's name (letters rise in). Each line is fitted to the column width. */
const big = document.getElementById("wi-big");
const STATEMENT = {
  en: ["An index", "of work", "I chose", "to carry", "forward"],
  zh: ["作品索引", "那些", "我选择", "带走的", "东西"],
};
// index versions: v6 (default, one shared grid after obys about) · ?ix=v5 (big type swaps on hover) · ?ix=v4
const IXQ = new URLSearchParams(location.search).get("ix");
// v7 (default): the project names ARE the large type · ?ix=v6 shared grid + statement · ?ix=v5 · ?ix=v4
// default = v4 again (Yanzi: "the one with no big type"); big-type trials kept at ?ix=v5 / v6 / v7
const IXV5 = IXQ === "v5", IXV6 = IXQ === "v6", IXV7 = IXQ === "v7", IXV4 = !IXV5 && !IXV6 && !IXV7;
if (IXV7) document.body.classList.add("ix-v7");
if (IXV4) document.body.classList.add("ix-v4");
if (IXV6) document.body.classList.add("ix-v6");
function bigLines(lines) {
  if (IXV4) return;
  big.innerHTML = lines.map((ln, k) =>
    `<div class="wi-big-line${k % 2 ? " r" : ""}"><span>${[...ln].map((ch, n) =>
      `<i style="animation-delay:${n * 14 + k * 40}ms">${ch === " " ? "&nbsp;" : ch}</i>`).join("")}</span></div>`).join("");
  fitBig();
}
function fitBig() {
  const W = big.clientWidth; if (!W) return;
  if (IXV6) {   // one grid: each big line = 4 list rows = 80px; size fitted to the width, ≤ 88px
    big.style.setProperty("--big", "88px");
    let widest = 0;
    big.querySelectorAll(".wi-big-line > span").forEach((x) => { widest = Math.max(widest, x.scrollWidth + x.offsetLeft - big.offsetLeft); });
    const size = Math.min(88, 88 * W / Math.max(widest, 1));
    big.style.setProperty("--big", size.toFixed(1) + "px");
    return;
  }
  big.style.setProperty("--big", "200px");
  let widest = 0;
  big.querySelectorAll(".wi-big-line > span").forEach((s) => { widest = Math.max(widest, s.scrollWidth); });
  const lines = big.querySelectorAll(".wi-big-line").length || 1;
  const H = (layer.clientHeight || 700) - 100;                       // leave room above the footer line
  const size = Math.max(40, Math.min(150, 200 * W / (widest || 1), H / (lines * 0.95)));
  big.style.setProperty("--big", size.toFixed(1) + "px");
}
const nameLines = (p) => {
  const words = p[L()].split(/\s+/);
  const lines = words.length > 1 ? words : [p[L()]];
  return [...lines, p.year || ""];
};
addEventListener("resize", fitBig);

function show(i) {
  if (IXV7) {
    list.classList.toggle("is-hovering", i !== null);
    list.querySelectorAll(".wi-row").forEach((r) => r.classList.toggle("on", +r.dataset.i === i));
    if (i === null) { prev.classList.remove("on"); return; }
    const m = firstMedia(LIST[i]);
    prev.innerHTML = !m ? "" : /\.(mp4|webm)$/i.test(m) ? `<video src="${m}" autoplay muted loop playsinline></video>` : `<img src="${m}" alt="">`;
    prev.classList.toggle("on", !!m);
    return;
  }
  if (IXV5) bigLines(i === null ? STATEMENT[L()] : nameLines(LIST[i]));
  else if (IXV6 && !big.childElementCount) bigLines(STATEMENT[L()]);   // v6: the statement stays still
  list.classList.toggle("is-hovering", i !== null);
  list.querySelectorAll(".wi-row").forEach((r) => r.classList.toggle("on", +r.dataset.i === i));
  if (i === null) { prev.classList.remove("on"); return; }
  const p = LIST[i], m = firstMedia(p);
  prev.innerHTML = !m ? "" : /\.(mp4|webm)$/i.test(m)
    ? `<video src="${m}" autoplay muted loop playsinline></video>` : `<img src="${m}" alt="">`;
  const row = list.querySelector(`.wi-row[data-i="${i}"]`);
  const max = list.parentElement.clientHeight - prev.offsetHeight - 24;
  prev.style.top = Math.max(0, Math.min(row.offsetTop, max)) + "px";
  if (!IXV4) prev.style.left = (list.offsetLeft + list.offsetWidth + (list.parentElement.clientWidth * 0.024)) + "px";   // small thumb beside the row   // row.offsetTop is already relative to .wi
  prev.classList.add("on");
}
function setOpen(on) {
  // the index and the project panel never show at the same time
  if (on && document.getElementById("pv")?.getAttribute("aria-hidden") === "false" && window.closeProjectPanel) window.closeProjectPanel();
  layer.setAttribute("aria-hidden", String(!on));
  document.body.classList.toggle("indexing", on);
  navIndex && navIndex.classList.toggle("is-current", on);
  navWork && navWork.classList.toggle("is-current", !on);
  if (!on) show(null);
}
render();
if (IXV7) {
  layer.addEventListener("pointermove", (e) => {
    const r = layer.getBoundingClientRect();
    prev.style.transform = `translate(${e.clientX - r.left + 24}px, ${e.clientY - r.top - 70}px)`;
  });
  addEventListener("resize", fitV7);
  navIndex && navIndex.addEventListener("click", () => setTimeout(fitV7, 30));
}
cats.addEventListener("click", (e) => { const b = e.target.closest(".wi-cat"); if (!b) return; cat = b.dataset.c; show(null); render(); });
list.addEventListener("pointerover", (e) => { const r = e.target.closest(".wi-row"); if (r && !r.classList.contains("is-off")) show(+r.dataset.i); });
list.addEventListener("pointerleave", () => show(null));
list.addEventListener("click", (e) => {
  // "View ↗" → the full case details page; anywhere else on the row → the panel
  const go = e.target.closest(".wi-go");
  if (go) {
    const rr = go.closest(".wi-row"), p = rr && LIST[+rr.dataset.i];
    if (p && p.id) { e.stopPropagation(); location.href = `project.html?id=${p.id}${L() === "zh" ? "&lang=zh" : ""}`; return; }
  }
  const r = e.target.closest(".wi-row"); if (!r || r.classList.contains("is-empty") || r.classList.contains("is-off")) return;
  const i = +r.dataset.i; setOpen(false);
  // E6: no panel on the homepage any more — straight to the case study
  const p = LIST[i]; if (p && p.id && window.openCase && window.openCase(p.id)) return;   // E7: slide-up view
  if (p && p.id) location.href = `project.html?id=${encodeURIComponent(p.id)}${L() === "zh" ? "&lang=zh" : ""}`;
});
navIndex && navIndex.addEventListener("click", (e) => { e.preventDefault(); setOpen(layer.getAttribute("aria-hidden") === "true"); });
navWork && navWork.addEventListener("click", (e) => { if (document.body.classList.contains("indexing")) { e.preventDefault(); setOpen(false); } });
// (E6: Escape no longer closes the list — it is a view of the page, not a layer)
document.addEventListener("langchange", () => { render(); big.innerHTML = ""; show(null); });
// (E6: ?index=1 / ?view=list is handled by grid.js)
show(null);
navIndex && navIndex.addEventListener("click", () => setTimeout(fitBig, 30));
})();

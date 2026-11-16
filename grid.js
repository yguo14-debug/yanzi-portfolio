// E6 — Work homepage: every project on one sheet (critique 2026-11-02: the floating archive made
// people unsure how to navigate). Two views of the same list, switched in the label row:
//   Grid — equal columns on lines, cover still; hovering plays the project's video if it has one
//   List — E5's work index (work.js): categories, numbered rows, cover in a black square
// A click goes straight to the case study (no panel in between). "Coming soon" slots stay as
// grey blocks but are not links.
(() => {
// Yanzi (2026-11-13): the grid shows only the 6 real projects; the "Coming soon" slots stay in the List (index) view
const PROJECTS = window.PROJECTS.filter((p) => !p.empty);
const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const track = document.getElementById("wg-track"), list = document.getElementById("wi-layer");   // List = E5's work index (work.js)
const viewNav = document.getElementById("wg-view");
const isVid = (m) => /\.(mp4|webm)$/i.test(m || "");
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

// cover still = the project's first preview image (its curated cover), else its first still;
// hover video = the project's first video, if any
const mediaOf = (p) => [...new Set([...(p.preview || []), p.cover, ...(p.gallery || []).map((g) => g.src)].filter(Boolean))];
const stillOf = (p) => p.noCover ? null : mediaOf(p).find((m) => !isVid(m)) || null;
const videoOf = (p) => [p.cover, ...(p.gallery || []).map((g) => g.src)].find(isVid) || null;
// the grey line under the name: the project's tags (one style for every project), else its type
const kindOf = (p, l) => (p.tags && p.tags.length ? p.tags.map((t) => t[l]).join(l === "zh" ? "、" : " · ") : p.type ? p.type[l] : "");
const href = (p) => `project.html?id=${encodeURIComponent(p.id)}${L() === "zh" ? "&lang=zh" : ""}`;

let view = "grid";
{ const q = new URLSearchParams(location.search); if (q.get("view") === "list" || q.get("index") === "1") view = "list"; }

// Yanzi (2026-11-02): two per row, not equal — one 3.5/6 wide, the other 2.5/6; the wide one
// swaps sides every row, so the page doesn't line up like a table
const perRow = () => (innerWidth > 760 ? 2 : 1);
let rowsOf = 0;

function renderGrid() {
  const l = L(), n = rowsOf = perRow(), rows = [];
  for (let k = 0; k < PROJECTS.length; k += n) rows.push(PROJECTS.slice(k, k + n));
  track.innerHTML = rows.map((row, r) => `<div class="wg-row${n === 2 ? (r % 2 ? " is-flip" : " is-wide") : ""}" style="--n:${n}">${row.map((p, i) => {
    const still = stillOf(p), vid = p.noHoverVideo ? null : videoOf(p);   // Yanzi: some projects show only their cover on the homepage
    const inner = `
        <h2 class="wg-name">${p[l]}</h2>${p.line ? `<p class="wg-line">${p.line[l]}</p>` : ""}
        <div class="wg-meta">${p.tags && p.tags.length ? `<ul class="wg-tags">${p.tags.map((t) => `<li class="pill">${t[l]}</li>`).join("")}</ul>` : `<span class="wg-kind">${kindOf(p, l)}</span>`}<span class="wg-y">${p.year || ""}</span></div>
        <div class="wg-img">${p.coverVideo && vid ? `<video src="${vid}" autoplay muted loop playsinline preload="auto" aria-hidden="true" style="opacity:1"></video>` : still ? `<img src="${still}" alt="" loading="lazy" draggable="false">` : ""}${vid && !calm && !p.coverVideo ? `<video data-src="${vid}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ""}</div>`;
    return p.empty
      ? `<div class="wg-col is-empty" style="--i:${i}" aria-label="${l === "zh" ? "即将更新" : "Coming soon"}">${inner}</div>`
      : `<a class="wg-col" href="${href(p)}" style="--i:${i}">${inner}</a>`;
  }).join("")}${row.length < n ? `<div class="wg-fill" style="grid-column:span ${n - row.length}"></div>` : ""}</div>`).join("");
  track.querySelectorAll(".wg-row").forEach((r) => io.observe(r));
}

function render() {
  // (Yanzi: no project count)
  viewNav.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.v === view)));
  track.hidden = view !== "grid"; list.hidden = view !== "list";
  if (view === "grid") renderGrid();
  document.body.classList.toggle("indexing", view === "list");
}

// reveal: a row's covers rise out of its line when it comes into view
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
}), { threshold: .12 });

// grid hover: the cover video loads the first time, plays while pointed at, pauses after
track.addEventListener("pointerover", (e) => {
  const c = e.target.closest("a.wg-col"); if (!c || c.contains(e.relatedTarget)) return;
  const v = c.querySelector("video"); if (!v) return;
  if (!v.src) { v.src = v.dataset.src; v.preload = "auto"; }
  v.play().then(() => c.classList.add("is-playing")).catch(() => {});
});
track.addEventListener("pointerout", (e) => {
  const c = e.target.closest("a.wg-col"); if (!c || c.contains(e.relatedTarget)) return;
  const v = c.querySelector("video"); c.classList.remove("is-playing");
  if (v) setTimeout(() => { if (!c.classList.contains("is-playing")) v.pause(); }, 400);
});

// Grid / List — kept in the address, so Back and shared links land on the same view
viewNav.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-v]"); if (!b || b.dataset.v === view) return;
  view = b.dataset.v; render();
  const u = new URL(location.href); u.searchParams.delete("index");
  if (view === "list") u.searchParams.set("view", "list"); else u.searchParams.delete("view");
  history.replaceState(null, "", u);
});

render();
addEventListener("resize", () => { if (view === "grid" && perRow() !== rowsOf) renderGrid(); });
document.addEventListener("langchange", render);
})();

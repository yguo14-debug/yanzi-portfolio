// E7 — Playground modes (Yanzi 2026-11-13): two ways of being in space, switched in the label row.
//   Grid  — the endless warping grid (field.js)
//   Cloud — her original floating archive, drifting round in 3D (cloud.js)
// (Ring / Sphere / Tunnel after experiment.obys.agency were tried the same day; Yanzi kept these two.)
(() => {
const host = document.getElementById("cl"), sw = document.getElementById("pg-viewsw"), hint = document.getElementById("pg-hint");
const tip = document.getElementById("cl-tip"), cursor = document.getElementById("cl-cursor");
if (!host || !sw) return;
const lang = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const MODES = [
  ["grid", "Grid", "网格", "Drag in any direction · click a piece to open it", "任意方向拖动 · 点击作品查看"],
  ["cloud", "Cloud", "漂浮", "Drag to spin · click a piece to open it", "拖动旋转 · 点击作品查看"],
];
let mode = "grid";
function setMode(m, push) {
  mode = m; host.dataset.mode = m;
  sw.innerHTML = MODES.map(([k, en, zh], j) => `${j ? '<span aria-hidden="true">/</span>' : ""}<button type="button" data-v="${k}" aria-pressed="${k === m}">${lang() === "zh" ? zh : en}</button>`).join("");
  const md = MODES.find((x) => x[0] === m);
  hint.innerHTML = `<span>${lang() === "zh" ? md[4] : md[3]}</span>`;
  tip.classList.remove("on"); cursor.classList.remove("big");
  if (push) { const u = new URL(location.href); if (m === "grid") u.searchParams.delete("mode"); else u.searchParams.set("mode", m); history.replaceState(null, "", u); }
}
sw.hidden = false;
sw.addEventListener("click", (e) => { const b = e.target.closest("button[data-v]"); if (b && b.dataset.v !== mode) setMode(b.dataset.v, true); });
document.addEventListener("langchange", () => setMode(mode));
const q = new URLSearchParams(location.search).get("mode");
setMode(MODES.some((x) => x[0] === q) ? q : "grid");
})();

// Frame E — project page. Reads ?id=<project id> and fills the page from projects.js.

(() => {
const P = window.PROJECTS;
const N = P.length;
const id = new URLSearchParams(location.search).get("id");
let i = Math.max(0, P.findIndex((p) => p.id === id));
const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const $ = (s) => document.getElementById(s);

const media = (src) => !src ? "" : /\.(mp4|webm)$/i.test(src)
  ? `<video src="${src}" autoplay muted loop playsinline preload="metadata"></video>`
  : `<img src="${src}" alt="" loading="lazy">`;
const link = (p) => {
  const u = new URL("project.html", location.href);
  u.searchParams.set("id", p.id);
  if (L() === "zh") u.searchParams.set("lang", "zh");
  return u.pathname + u.search;
};

function render() {
  const p = P[i], l = L();
  document.title = `${p[l]} — yanzi.`;
  $("pj-count").textContent = `(${String(i + 1).padStart(2, "0")}/${String(N).padStart(2, "0")}) — ${p.year}`;
  $("pj-name").textContent = p[l];
  $("pj-tagline").textContent = p.tagline[l];
  $("pj-tags").innerHTML = p.tags.map((t) => `<li class="pill">${t[l]}</li>`).join("");
  $("pj-summary").textContent = p.summary[l];
  const H = l === "zh" ? ["背景", "挑战", "方案"] : ["Context", "Challenge", "Solution"];
  $("pj-brief").innerHTML = [[H[0], p.context], [H[1], p.challenge], [H[2], p.solution]]
    .map(([h, t]) => `<div><h3>${h}</h3><p>${t[l]}</p></div>`).join("");
  $("pj-process").innerHTML = (p.process || []).map((st, k) => `
    <li class="pj-step">
      <div class="pj-step-text">
        <span class="pj-step-n">${String(k + 1).padStart(2, "0")}</span>
        <h3>${st.title[l]}</h3>
        <p>${st.text[l]}</p>
      </div>
      <div class="pj-step-media">${st.media.map((m) => `<figure>${media(m)}</figure>`).join("")}</div>
    </li>`).join("");
  $("pj-credits").innerHTML = p.credits.map((c) => `<div><dt>${c.role[l]}</dt><dd>${c.names}</dd></div>`).join("");

  const next = P[(i + 1) % N];
  $("pj-next").href = link(next);
  $("pj-next").innerHTML = `<span class="img">${media(next.cover)}</span><span class="t">${next[l]}</span><span class="s">${next.summary[l]}</span>`;
  $("pj-related").innerHTML = [P[(i + 2) % N], P[(i + 3) % N]].map((r) =>
    `<a class="pj-card" href="${link(r)}"><span class="img">${media(r.cover)}</span><span class="t">${r[l]}</span><span class="s">${r.summary[l]}</span></a>`).join("");
}

function renderMedia() {
  const p = P[i];
  $("pj-hero").innerHTML = media(p.cover);
  $("pj-gallery").innerHTML = (p.gallery || []).map((g) =>
    `<figure class="${g.size === "half" ? "half" : ""}">${media(g.src)}</figure>`).join("");
}

// back to the archive without replaying the box intro
document.querySelectorAll('a[href="index.html"]').forEach((a) => { a.href = "index.html?from=project"; });

renderMedia();
render();
document.addEventListener("langchange", render);
})();

// Frame E — project page. Reads ?id=<project id> and fills the page from projects.js.
// videos with black bars baked in → the figure takes the real picture ratio and the bars are cropped
const CROP = { "RHV2v2xVQCZ3WEYdyOniS3I.mp4": 1620 / 1080, "poster_1_mp4.mp4": 1536 / 1080, "T21150_8.mp4": 1618 / 1080 };
// shapes of the local HD videos (black bars already cut off when they were encoded)
const VR = { "stay-in-lign-board-hd.mp4": 3000 / 2074, "fermologie-board-hd.mp4": 3000 / 2070, "rebirth-digital-resurrection.mp4": 1620 / 1080, "rebirth-elevator.mp4": 1536 / 1080, "rebirth-gallery-hall.mp4": 1612 / 1080 };
const barCrop = (src) => { const r = CROP[(src || "").split("/").pop()]; return r ? ` class="crop" style="aspect-ratio:${r.toFixed(4)}"` : ""; };

(() => {
const P = window.PROJECTS;
const N = P.length;
const id = new URLSearchParams(location.search).get("id");
let i = Math.max(0, P.findIndex((p) => p.id === id));
const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const $ = (s) => document.getElementById(s);

const media = (src) => !src ? "" : /\.(mp4|webm)$/i.test(src)
  ? `<video data-src="${src}" muted loop playsinline preload="none"></video>`   // E5 UX: loads only near the screen (lazyVideos)
  : `<img src="${src}" alt="" loading="lazy">`;
const link = (p) => {
  const u = new URL("project.html", location.href);
  u.searchParams.set("id", p.id);
  if (L() === "zh") u.searchParams.set("lang", "zh");
  if (document.documentElement.classList.contains("is-embed")) u.searchParams.set("embed", "1");   // E7: stay inside the slide-up view
  return u.pathname + u.search;
};

// E5 UX: a video downloads only when it comes within ~one screen of view, plays while visible,
// pauses when scrolled away (the page no longer pulls every video, ~22MB, on load)
const vio = new IntersectionObserver((es) => es.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) {
    if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.preload = "auto"; }
    v.play().catch(() => {});
  } else if (v.src) v.pause();
}), { rootMargin: "100% 0px" });
const lazyVideos = () => document.querySelectorAll("video[data-src]").forEach((v) => vio.observe(v));

// E5 UX: unwritten copy ("[Placeholder] …" / "【占位】…") never shows in the next / related cards
const real = (t) => (/placeholder|占位/i.test(t || "") ? "" : t);

function render() {
  const p = P[i], l = L();
  document.title = `${p[l]} — yanzi.`;
  // label row (same as the panel's): number · category · year
  $("pj-count").innerHTML = `<span class="pj-c-cat"></span><span class="pj-c-y">${p.year || ""}</span>`;
  $("pj-name").textContent = p[l];
  $("pj").classList.toggle("pj5-has-logo", !!p.logo);   // E5 (Yanzi): the logo replaces the big title
  // E4 info column (after gracejhwang.com): black label, grey text under it
  const tl = p.tagline && p.tagline[l] || "";
  $("pj-tagline").textContent = /placeholder|占位/i.test(tl) ? "" : tl;
  $("pj-tags").innerHTML = (p.tags || []).map((t) => `<li class="pill">${t[l]}</li>`).join("");
  const f = p.facts || {};
  $("pj-facts").innerHTML = [
    [l === "zh" ? "客户" : "Client", (f.client && f.client[l]) || "—"],
    [l === "zh" ? "特别感谢" : "Special thanks", (f.thanks && f.thanks[l]) || "—"],
    ...(f.tools ? [[l === "zh" ? "工具" : "Tools", f.tools[l]]] : []),
    ...(f.deliverables ? [[l === "zh" ? "交付内容" : "Deliverables", f.deliverables[l]]] : []),
  ].map(([k, v]) => `<div class="pj4-b"><h3 class="pj4-k">${k}</h3><p class="pj4-v">${v}</p></div>`).join("");
  const H = l === "zh" ? ["背景", "挑战", "方案"] : ["Context", "Challenge", "Solution"];
  $("pj-summary").textContent = p.summary[l];   // the large summary (E3); not repeated in Overview
  const paras = (t) => (Array.isArray(t) ? t : [t]).map((x) => `<p>${x}</p>`).join("");
  // E6 (Yanzi): a story block with `at` leaves the top column and sits beside that gallery image
  document.querySelectorAll(".pj6-side[data-at]").forEach((el) => {
    const b = (p.story || []).find((x) => x.at === el.dataset.at);
    el.innerHTML = b ? `<div class="pj4-b pj4-rule"><div class="pj4-v pj4-text"><h3 class="pj4-k">${b.k[l]}</h3>${paras(b[l])}</div></div>` : "";
  });
  $("pj-overview").innerHTML = p.story
    ? p.story.filter((b) => !b.at).map((b) => `<h3 class="pj4-k">${b.k[l]}</h3>${paras(b[l])}`).join("")   // Yanzi's own sections
    : [[H[0], p.context], [H[1], p.challenge], [H[2], p.solution]].filter(([, t]) => t)
      .map(([h, t]) => `<h3 class="pj4-k">${h}</h3><p>${t[l]}</p>`).join("");
  const PH = l === "zh" ? "设计过程" : "Process";
  // only steps with real images are shown (no empty grey boxes on the public page)
  // a step shows when it has images — or (E7) when it is a written Process block waiting for its images
  $("pj-process").innerHTML = (p.process || []).filter((st) => (st.media || []).some(Boolean) || (st.nonum && st.text)).map((st, k) => st.band
    // E7 (Yanzi): a black band, edge to edge, the pieces side by side in one row (scroll sideways for more)
    ? `<section class="pj7-band"><div class="pj7-band-row">${st.media.map((m) => `<figure>${media(m)}</figure>`).join("")}</div></section>` : `
    <section class="pj4-intro pj4-step">
      ${st.nonum
        // one sheet: the same info block as Context / Challenge / Solution (Yanzi): rule, black label, grey text
        ? `<aside class="pj4-info"><div class="pj4-b pj4-rule"><div class="pj4-v pj4-text"><h3 class="pj4-k">${st.label ? st.label[l] : PH}${st.sub ? ` <span class="pj5-sub">— ${st.sub[l]}</span>` : ""}</h3>${paras(st.text[l])}</div></div></aside>`
        : `<div class="pj4-info pj4-rule">
        ${k === 0 ? `<h2 class="pj4-k pj4-sec">${PH}</h2>` : ""}
        <h3 class="pj4-k"><span class="pj4-n">${String(k + 1).padStart(2, "0")}</span>${st.title[l]}</h3>
        <p class="pj4-v">${st.text[l]}</p>
      </div>`}
      ${(st.media || []).some(Boolean) ? `<div class="pj4-step-media${st.grid ? " pj5-sheet" : ""}${st.feature ? " pj7-feature" : ""}"${st.grid ? ` style="--cols:${st.grid};--r:${st.ratio || "auto"}"` : ""}>${st.media.filter(Boolean).map((m) => `<figure>${media(m)}</figure>`).join("")}</div>` : ""}
    </section>`).join("");

  // next + related skip projects that have no image yet
  const hasImg = (q) => !!((q.preview && q.preview[0]) || q.cover);
  const after = [1, 2, 3, 4, 5, 6, 7, 8].map((d) => P[(i + d) % N]).filter((q) => q !== P[i] && hasImg(q));
  const next = after[0] || P[(i + 1) % N];
  $("pj-next").href = link(next);
  $("pj-next").innerHTML = `<span class="img">${media((next.preview && next.preview[0]) || next.cover)}</span><span class="t">${next[l]}</span><span class="s">${(next.line ? next.line[l] : real(next.summary[l]))}</span>`;
  $("pj-related").innerHTML = after.slice(1, 3).map((r) =>
    `<a class="pj-card" href="${link(r)}"><span class="img">${media((r.preview && r.preview[0]) || r.cover)}</span><span class="t">${r[l]}</span><span class="s">${(r.line ? r.line[l] : real(r.summary[l]))}</span></a>`).join("");
}

function renderMedia() {
  const p = P[i];
  // hero = the chosen cover (first preview image, e.g. Rebirth's street wall), not the old video
  const hero = (p.preview && p.preview[0]) || p.cover;
  const hk = (hero || "").split("/").pop();
  $("pj-hero").innerHTML = media(hero);
  $("pj-hero").classList.toggle("crop", !!CROP[hk]);
  $("pj-hero").style.aspectRatio = CROP[hk] ? CROP[hk].toFixed(4) : "";
  // gallery without the hero (no repeat)
  // E7 (Yanzi): an image marked `aside` sits in the text column, under Context / Challenge / Solution
  document.querySelectorAll(".pj7-asidefig").forEach((f) => f.remove());
  const asideG = (p.gallery || []).find((g) => g.aside);
  if (asideG) document.querySelector(".pj4-intro > .pj4-info").insertAdjacentHTML("beforeend", `<figure class="pj7-asidefig">${media(asideG.src)}</figure>`);
  $("pj-gallery").innerHTML = (p.gallery || []).filter((g) => g.src !== hero && !g.aside).map((g) => {
    let attr = barCrop(g.src).replace(' class="crop"', "");
    // lazy videos have no size until they load → reserve their shape so the page doesn't jump
    if (!attr && /\.(mp4|webm)$/i.test(g.src || "")) attr = ` style="aspect-ratio:${(VR[g.src.split("/").pop().split("?")[0]] || 16 / 9).toFixed(4)}"`;
    // E6: an image with a story block beside it — text in the ¼ column, image in the ¾ (text filled in render())
    if ((p.story || []).some((b) => b.at === g.src))
      return `<div class="pj6-beside"><aside class="pj4-info pj6-side" data-at="${g.src}"></aside><figure${attr}>${media(g.src)}</figure></div>`;
    if (g.col) attr = attr ? attr.replace('style="', `style="--col:${g.col};`) : ` style="--col:${g.col}"`;   // staggered placement
    if (g.full) return `<figure class="pj7-full">${media(g.src)}</figure>`;   // E7: full screen, edge to edge
    return `<figure${g.row === 3 ? ' data-row="3"' : ""} class="${g.size === "half" ? "half" : ""}${g.col ? " pj5-col" : ""}${CROP[(g.src || "").split("/").pop()] ? " crop" : ""}"${attr}>${media(g.src)}</figure>`;
  }).join("");
  // the first two images (a pair counts as one) sit in the right 3/4 beside the info column
  pairUp($("pj-gallery"));
  const lead = $("pj-lead"); lead.innerHTML = "";
  { const kids = [...$("pj-gallery").children], stop = kids.findIndex((el) => el.classList.contains("pj6-beside") || el.classList.contains("pj7-full"));
    kids.slice(0, p.leadAll ? (stop > 0 ? stop : kids.length) : Math.min(asideG ? 1 : 2, stop < 0 ? 2 : stop)).forEach((el) => lead.appendChild(el)); }   // leadAll: every image before the next text sits in the ¾ column   // an image with its own text stays in the gallery
  // E7 (Yanzi, after dommaroon.info/nmm): `layout: "rail"` — each text block heads a group of images; the text
  // stays put in the left column while its images scroll past on the right, then the next block takes over
  if (p.layout === "rail") {
    const g = $("pj-gallery"); let grp = null;
    [...g.children].forEach((el) => {
      if (el.classList.contains("pj6-beside")) {
        grp = document.createElement("div"); grp.className = "pj7-group";
        const imgs = document.createElement("div"); imgs.className = "pj7-imgs";
        g.insertBefore(grp, el);
        grp.appendChild(el.querySelector("aside")); grp.appendChild(imgs); imgs.appendChild(el.querySelector("figure")); el.remove();
      } else if (grp) { grp = null; el.classList.add("pj7-right"); }   // images without their own text: right column, no text beside
      else el.classList.add("pj7-right");
    });
  }
  // E5: the project's own wordmark, animated, takes the big title's place (Yanzi 2026-11-01)
  if (p.logo) {
    const fig = document.createElement("figure"); fig.className = "pj5-logo"; fig.setAttribute("aria-hidden", "true");
    document.querySelector(".pj-head .pj-title").after(fig);
    fetch(p.logo).then((r) => r.text()).then((svg) => { fig.innerHTML = svg; fitLogo(); });   // static (Yanzi: no rolling)
  }
}

// E5 (Yanzi): the logo spans exactly the row of tags under it (measured with the English tags,
// so it keeps its size in Chinese too)
function fitLogo() {
  const svg = document.querySelector(".pj-head .pj5-logo > svg"), tags = $("pj-tags");
  if (!svg || !tags) return;
  const p = P[i], probe = document.createElement("ul");
  probe.className = "pj-tags"; probe.style.cssText = "position:absolute;visibility:hidden;left:0;top:0;flex-wrap:nowrap;width:max-content";
  probe.innerHTML = (p.tags || []).map((t) => `<li class="pill">${t.en}</li>`).join("");
  tags.parentElement.appendChild(probe);
  const w = probe.getBoundingClientRect().width; probe.remove();
  if (w) svg.style.width = Math.min(w, tags.parentElement.clientWidth) + "px";
}
addEventListener("resize", () => fitLogo());
if (document.fonts) document.fonts.ready.then(() => fitLogo());

// side-by-side figures: wrap each run of .half figures in one row that shares a height;
// each image keeps its own ratio (same as the panel)
function pairUp(g) {
  if (!g) return;
  const figs = [...g.children];
  for (let k = 0; k < figs.length; k++) {
    if (!figs[k].classList.contains("half") || figs[k].parentElement !== g) continue;
    const row = document.createElement("div"); row.className = "pj-row";
    g.insertBefore(row, figs[k]);
    const per = figs[k].dataset.row === "3" ? 3 : 2;   // E7: a row can hold three (Fermologie packaging)
    while (k < figs.length && figs[k].classList.contains("half")) { row.appendChild(figs[k]); if (row.children.length === per) break; k++; }
  }
  g.querySelectorAll(".pj-row img").forEach((img) => {
    // read the real size with a probe image (the gallery images are lazy, so theirs may be unknown)
    const probe = new Image();
    probe.onload = () => img.parentElement.style.setProperty("--a", (probe.naturalWidth / probe.naturalHeight).toFixed(4));
    probe.src = img.currentSrc || img.src;
  });
}

// back to the archive without replaying the box intro
document.querySelectorAll('a[href="index.html"]').forEach((a) => { a.href = "index.html?from=project"; });

renderMedia();
render();
lazyVideos();
document.addEventListener("langchange", () => { render(); lazyVideos(); });
})();

// E5 (Yanzi): line the facts column up with "contact" in the bar
(() => {
  const facts = document.getElementById("pj-facts"), c = document.querySelector(".bar-contact");
  if (!facts || !c) return;
  const align = () => {
    facts.style.setProperty("--fx", "0px");
    if (innerWidth <= 900) return;
    const vis = [...c.children].find((s) => s.offsetWidth) || c;
    const d = vis.getBoundingClientRect().left - facts.getBoundingClientRect().left;
    facts.style.setProperty("--fx", Math.max(0, d) + "px");
  };
  addEventListener("resize", align);
  document.addEventListener("langchange", () => requestAnimationFrame(align));
  if (document.fonts) document.fonts.ready.then(align);
  align();
// E7: inside the homepage's slide-up view, keep the homepage address (#id) on this project
if (document.documentElement.classList.contains("is-embed") && window.parent !== window) {
  try { window.parent.postMessage({ cs7: new URLSearchParams(location.search).get("id") }, location.origin); } catch (e) {}
  // moving on to the next project replaces this page instead of adding a Back step (Back = close the view)
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href*="project.html"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault(); location.replace(a.href);
  });
}
})();

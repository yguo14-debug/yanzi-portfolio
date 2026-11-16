// E7 — case study motion after plus-ex.com/experience: each text section fades in when 15% of it
// is on screen (once). The containers are fixed elements, so a language switch (which refills
// them) never hides text again.
(() => {
const els = document.querySelectorAll(".pj-head, #pj-overview, .pj6-side, #pj-process, .pj-more-work");
if (!("IntersectionObserver" in window)) return;
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
}), { threshold: .15 });
els.forEach((el) => { el.classList.add("pj7-fade"); io.observe(el); });
// .pj6-side is created by project.js after this file's first look — pick it up when it appears
new MutationObserver(() => document.querySelectorAll(".pj6-side:not(.pj7-fade)").forEach((el) => { el.classList.add("pj7-fade"); io.observe(el); }))
  .observe(document.getElementById("pj-gallery"), { childList: true });
// tall sections (Process) can be taller than the screen: 15% of them may never fit — show them
// as soon as their top is well inside the screen
addEventListener("scroll", () => document.querySelectorAll(".pj7-fade:not(.in)").forEach((el) => {
  if (el.getBoundingClientRect().top < innerHeight * .8) { el.classList.add("in"); io.unobserve(el); }
}), { passive: true });
// the opening photo is a video (Fermologie): start it at once — it is the first thing on screen —
// with its first frame as the poster so the slide-up never shows an empty frame
{ const hv = document.querySelector("#pj-hero video[data-src]");
  const id = new URLSearchParams(location.search).get("id"), p = (window.PROJECTS || []).find((q) => q.id === id);
  if (hv) {
    if (p && p.poster) hv.poster = p.poster;
    hv.src = hv.dataset.src; hv.preload = "auto"; hv.autoplay = true; hv.muted = true;
    hv.play().catch(() => {});
  } }
})();

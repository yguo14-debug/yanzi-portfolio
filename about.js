// E3 — About page text motion, rebuilt after experiment.obys.agency/about (their GSAP code, read 2026-10-26):
// 1. reveal: each big line rises out of its own line (yPercent 120 → 0, expo-out 1.15s, 80ms stagger);
//    the first statement on load, the closing one when it scrolls into view.
// 2. scroll drift: while you scroll, every line slides sideways by its own amount and direction,
//    trailing the scroll a little (their "scrub: 1.8"), so the staircase keeps shifting.
(() => {
const M = 24;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
// px at a 1440-wide page (same idea as their group1Moves / group2Moves), scaled to the real width
const MOVES = [[0, 100, -120, -200], [100, 250, 150, -100, 100]];

const blocks = [...document.querySelectorAll(".ab-big")].map((el, bi) => {
  const steps = (el.dataset.steps || "0").split(",").map(Number);
  const langs = [...el.children].map((wrap) => ({
    wrap,
    lines: [...wrap.children].map((src, i) => {
      const line = document.createElement("span"); line.className = "ab-line";
      const inner = document.createElement("span"); inner.className = "ab-in"; inner.style.setProperty("--i", i);
      inner.textContent = src.textContent;
      line.appendChild(inner); src.replaceWith(line);
      return { inner, step: steps[i] || 0, move: (MOVES[bi] || [])[i] || 0, x: 0 };
    }),
  }));
  return { el, langs, first: bi === 0 };
});
const visible = (b) => b.langs.find((l) => l.wrap.offsetParent !== null) || b.langs[0];

let W = 1440, k = 1;
// the largest size at which every line, its step and its rightward drift still fit inside the margins
function fit() {
  W = document.documentElement.clientWidth; k = W / 1440;
  const zh = false;   // the big statements are English in both languages (Yanzi), so they keep the English size
  blocks.forEach((b) => {
    const L = b.L = visible(b);   // cached: which language is showing (checked only on fit)
    b.el.style.setProperty("--fs", "100px");
    let fs = Infinity;
    L.lines.forEach((ln) => {
      ln.inner.style.setProperty("--x", "0px");
      const w = ln.inner.scrollWidth - M;
      const room = W - 2 * M - ln.step / 100 * W - Math.max(0, ln.move * k);
      fs = Math.min(fs, (room / w) * 100);
    });
    // Yanzi: keep the reference's proportions — type ≈ 6.4% of the page width (smaller only if a line would not fit)
    fs = Math.max(30, Math.min(fs * .98, W * (zh ? .058 : .064)));
    b.el.style.setProperty("--fs", fs.toFixed(1) + "px");
    L.lines.forEach((ln) => {
      ln.base = ln.step / 100 * W;
      ln.inner.style.setProperty("--x", ln.base.toFixed(1) + "px");   // the step: layout, set only here
    });
  });
}

// reveal (CSS transition on .ab-in, started by .in)
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in"); io.unobserve(e.target);
}), { threshold: .15 });
blocks.forEach((b) => (b.first ? requestAnimationFrame(() => b.el.classList.add("in")) : io.observe(b.el)));

const clamp = (v) => Math.min(1, Math.max(0, v));
// performance: the drift only moves each line with the GPU (`translate`, no layout), reads all
// positions before writing, and skips lines that are already where they should be
let running = false;
function wake() { if (!running) { running = true; requestAnimationFrame(tick); } }
function tick() {
  let moving = false;
  const vh = innerHeight, sy = scrollY;
  const ps = blocks.map((b) => {
    if (b.first) return clamp(sy / 1800);
    const r = b.el.getBoundingClientRect();
    return r.bottom < -50 || r.top > vh + 50 ? null : clamp((vh - r.top) / (vh + r.height));
  });
  blocks.forEach((b, bi) => {
    const p = ps[bi]; if (p === null) return;           // off screen: nothing to do
    (b.L || visible(b)).lines.forEach((ln) => {
      const target = still ? 0 : ln.move * k * p;
      if (Math.abs(target - ln.x) < .05) { if (ln.x !== target) { ln.x = target; ln.inner.style.translate = `${target.toFixed(2)}px 0`; } return; }
      ln.x += (target - ln.x) * .08;                     // trails the scroll, like their scrub
      ln.inner.style.translate = `${ln.x.toFixed(2)}px 0`;
      moving = true;
    });
  });
  if (moving) requestAnimationFrame(tick); else running = false;
}
addEventListener("scroll", wake, { passive: true });

// No custom smooth scroll: taking over the wheel fought the trackpad's own momentum and made
// the page feel stuck (Yanzi: "非常卡"). Native scrolling + the trailing line drift give the glide.

fit();

document.fonts && document.fonts.ready.then(fit);
addEventListener("resize", () => { fit(); wake(); });
document.addEventListener("langchange", () => requestAnimationFrame(() => { fit(); wake(); }));
wake();
})();

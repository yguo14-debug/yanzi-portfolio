// E7 — opening sequence after experiment.obys.agency. Shown once per visit (browser tab session) on
// the homepage; not when coming back from a case study. The counter follows the real loading of the
// homepage covers, never faster than ~1.8 s so the moment can be read.
(() => {
const el = document.getElementById("in7"); if (!el) return;
const skip = () => { el.classList.add("gone"); };
let seen = false;
try { seen = sessionStorage.getItem("yz-e7-intro") === "1"; } catch (e) {}
const q = new URLSearchParams(location.search);
if (seen || q.get("from") === "project" || matchMedia("(prefers-reduced-motion: reduce)").matches) { skip(); return; }
try { sessionStorage.setItem("yz-e7-intro", "1"); } catch (e) {}
document.documentElement.style.overflow = "hidden";

const n = document.getElementById("in7-n"), fill = document.getElementById("in7-fill");
const MIN = 1800, t0 = performance.now();
let loaded = 0, total = 1, shown = 0;
// what the counter waits for: the homepage's cover images (whatever exists when this runs, plus fonts)
requestAnimationFrame(() => {
  const imgs = [...document.querySelectorAll(".wg-img img")].slice(0, 2);   // the first screen only (the rest load lazily)
  total = imgs.length + 1;
  const one = () => { loaded++; };
  imgs.forEach((i) => { if (i.complete) one(); else { i.addEventListener("load", one, { once: true }); i.addEventListener("error", one, { once: true }); } });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(one);
});
el.classList.add("on");
const ease = (t) => 1 - Math.pow(1 - t, 3);
function tick(now) {
  const time = Math.min(1, (now - t0) / MIN);               // never faster than MIN
  const real = (now - t0 > MIN * 1.8) ? 1 : (total ? loaded / total : 1);   // never ahead of what has loaded (but never wait past ~3 s)
  const target = Math.min(ease(time), Math.max(real, time * 0.9)) * 100;
  shown += (target - shown) * 0.12;
  if (time >= 1 && real >= 1) shown = Math.max(shown, 99.6);
  const v = Math.min(100, Math.round(shown));
  n.textContent = v; fill.style.width = shown + "%";
  if (v < 100) return requestAnimationFrame(tick);
  n.textContent = 100; fill.style.width = "100%";
  setTimeout(() => el.classList.add("done"), 250);           // counter + line fade
  setTimeout(() => { el.classList.add("open"); document.documentElement.style.overflow = ""; }, 550);   // halves split straight onto the homepage
  setTimeout(skip, 550 + 1150);
}
requestAnimationFrame(tick);
// safety: never trap the visitor if something stalls
setTimeout(() => { if (!el.classList.contains("open")) { el.classList.add("done", "open"); document.documentElement.style.overflow = ""; setTimeout(skip, 1200); } }, 8000);
})();

// E7 — the Playground's dot cursor on the homepage work grid too (Yanzi 2026-11-13: "点击的时候也应该是这个圈，
// 而不是手指"): over the work, the arrow / hand is hidden and a dot follows the mouse; it grows over a project.
(() => {
if (!matchMedia("(hover: hover)").matches) return;
const area = document.getElementById("wg-track"); if (!area) return;
const dot = document.createElement("div"); dot.className = "dot7"; dot.setAttribute("aria-hidden", "true");
document.body.appendChild(dot);
area.addEventListener("pointermove", (e) => {
  dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  dot.classList.add("on");
  dot.classList.toggle("big", !!e.target.closest("a.wg-col"));
});
area.addEventListener("pointerleave", () => dot.classList.remove("on", "big"));
addEventListener("scroll", () => dot.classList.remove("big"), { passive: true });
})();

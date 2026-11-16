// E7 — open a case study inside the homepage, after plus-ex.com/experience.
// Click a project → loading line at the top → the case study (project.html?embed=1 in a frame)
// slides up once it has loaded, so nothing half-drawn is ever shown → ⌄, Esc or Back slides it down.
// The address gets #<project id>, so Back closes it and a shared link opens it straight away.
// Cmd/Ctrl-click (new tab) still opens the normal page.
(() => {
const load = document.getElementById("cs7-load"), view = document.getElementById("cs7-view");
const frame = document.getElementById("cs7-frame"), x = document.getElementById("cs7-x");
const L = () => (document.documentElement.dataset.lang === "zh" ? "zh" : "en");
const ids = new Set((window.PROJECTS || []).filter((p) => !p.empty).map((p) => p.id));
let openId = null, opener = null, token = 0, pushed = false;

function open(id, push = true) {
  if (!ids.has(id) || openId === id) return;
  openId = id; const my = ++token;
  opener = document.activeElement;
  load.className = "cs7-load"; void load.offsetWidth; load.classList.add("show");
  frame.onload = () => {
    if (my !== token || !String(frame.contentWindow.location.href).includes("project.html")) return;
    load.classList.add("ready");
    setTimeout(() => {
      if (my !== token) return;
      load.classList.add("done");
      view.classList.add("on"); view.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      x.focus({ preventScroll: true });
    }, 300);
  };
  // replace(), not src=: loading the frame must not add its own Back step (Back = close)
  frame.contentWindow.location.replace(`project.html?id=${encodeURIComponent(id)}&embed=1${L() === "zh" ? "&lang=zh" : ""}`);
  if (push) history.pushState({ cs7: id }, "", "#" + id);
  pushed = push;
}
function close(pop = false) {
  if (!openId) return;
  openId = null; token++;
  view.classList.remove("on"); view.setAttribute("aria-hidden", "true");
  load.className = "cs7-load";
  document.documentElement.style.overflow = "";
  setTimeout(() => { if (!openId) frame.contentWindow.location.replace("about:blank"); }, 850);   // after the slide down
  if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  if (pop || !location.hash) return;
  if (pushed) history.back();                                   // undo our own #id step
  else history.replaceState(null, "", location.pathname + location.search);   // opened from a shared link
}

// the grid's links (and the List view's rows, through window.openCase)
document.addEventListener("click", (e) => {
  const a = e.target.closest("a.wg-col"); if (!a) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  const id = new URL(a.href, location.href).searchParams.get("id");
  if (!ids.has(id)) return;
  e.preventDefault(); open(id);
});
window.openCase = (id) => { if (ids.has(id)) { open(id); return true; } return false; };
x.addEventListener("click", () => close());
addEventListener("keydown", (e) => { if (e.key === "Escape" && openId) close(); });
addEventListener("popstate", () => {
  const id = decodeURIComponent(location.hash.slice(1));
  if (ids.has(id)) open(id, false); else close(true);
});
// Esc pressed inside the case study (the frame has the focus) also closes it
frame.addEventListener("load", () => {
  try { frame.contentWindow.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); }); } catch (err) {}
});
// the case study tells us when its own "Next project" link moved it on: follow it in the address
addEventListener("message", (e) => {
  if (e.origin !== location.origin || !e.data || !ids.has(e.data.cs7) || !openId) return;
  openId = e.data.cs7;
  if (location.hash.slice(1) !== openId) history.replaceState({ cs7: openId }, "", "#" + openId);
});
// a shared link with #<id> opens that case study straight away
{ const id = decodeURIComponent(location.hash.slice(1)); if (ids.has(id)) open(id, false); }
})();

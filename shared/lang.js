// Shared by all frames: EN / 中 switch, scroll reveal, footer year.
// The first language is chosen by the inline script in each page's <head>.
(function () {
  // ?shot=1 → hide prototype tools for clean screenshots
  if (new URLSearchParams(location.search).get("shot") === "1") document.documentElement.classList.add("shot");
  const root = document.documentElement;
  const buttons = document.querySelectorAll("[data-set-lang]");

  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-Hans" : "en";
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLang === lang)));
    try { localStorage.setItem("lang", lang); } catch (e) {}
    const url = new URL(location.href);
    if (lang === "zh") url.searchParams.set("lang", "zh");
    else url.searchParams.delete("lang");
    history.replaceState(null, "", url);
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  buttons.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang)));
  setLang(root.dataset.lang || "en");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();

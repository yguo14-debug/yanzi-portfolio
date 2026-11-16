/* E4 logo: Yanzi's "yanzi guo" (logo motion.ai, artboard 1) folds into her "ỳz̄" (artboard 2).
   Only her own paths are used: letters move and fade, nothing is redrawn or clipped.
   The a's top bar becomes her grave and the i's dot her macron, corner by corner.
   It plays once when the page opens, then again whenever the logo is hovered.
   Phones, touch screens and reduced motion: the logo stays as the name. */
(function () {
  const GRAVE = [[166.185,31.176],[158.412,40.697],[120.506,14.664],[132.261,0.0]], MAC = [[317.914,27.825],[278.157,27.825],[278.157,11.964],[317.914,11.964]];
  const BAR = [[236, 54.63], [236, 74.5], [172.19, 74.5], [172.19, 54.63]];   // her a's top bar
  const DOTBOX = [604.41, 0, 631.26, 27.12];
  const OTHERS = ["a", "n", "istem", "g", "u", "o"];
  const DUR = 1500;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp01 = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const mix = (a, b, p) => a + (b - a) * p;
  const inOutQuart = t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  const outExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const centre = p => [p.reduce((s, v) => s + v[0], 0) / p.length, p.reduce((s, v) => s + v[1], 0) / p.length];
  const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
  const poly = p => "M" + p.map(v => v[0].toFixed(2) + "," + v[1].toFixed(2)).join(" L") + "Z";

  function setup(svg, align) {
    const q = k => svg.querySelector(`[data-k="${k}"]`);
    // where her ỳz̄ sits inside the wordmark's box: centred, or starting where the y starts
    const OX = align === "left" ? 20.8 - 80.9 : 573.65 - (80.9 + 350.7) / 2, OY = 191.2 - 194.5;
    const YD = [80.9 + OX - 20.8, 55.7 + OY - 54.1], ZD = [242.6 + OX - 468.4, 57.4 + OY - 54.1];
    const grave = GRAVE.map(p => [p[0] + OX, p[1] + OY]), mac = MAC.map(p => [p[0] + OX, p[1] + OY]);
    const ANG = Math.atan2(grave[0][1] - grave[3][1], grave[0][0] - grave[3][0]);
    const bc = centre(BAR), gc = centre(grave), mc = centre(mac);
    const sOff = BAR.map(p => [p[0] - bc[0], p[1] - bc[1]]);
    const fOff = grave.map(p => rot([p[0] - gc[0], p[1] - gc[1]], -ANG));
    const dc = [(DOTBOX[0] + DOTBOX[2]) / 2, (DOTBOX[1] + DOTBOX[3]) / 2];
    const op = (k, v) => q(k).style.opacity = v;
    const tf = (k, s) => q(k).setAttribute("transform", s);
    const setYZ = m => { tf("y", `translate(${YD[0] * m} ${YD[1] * m})`); tf("z", `translate(${ZD[0] * m} ${ZD[1] * m})`); };
    const barAt = (c, turn, shape) => poly(sOff.map((s, i) => {
      const v = rot([mix(s[0], fOff[i][0], shape), mix(s[1], fOff[i][1], shape)], ANG * turn);
      return [c[0] + v[0], c[1] + v[1]];
    }));
    const dotAt = (cx, cy, t) => {
      const w = mix(DOTBOX[2] - DOTBOX[0], mac[0][0] - mac[1][0], t), h = mix(DOTBOX[3] - DOTBOX[1], mac[0][1] - mac[2][1], t);
      const r = mix(Math.min(w, h) / 2, 0, t), x = cx - w / 2, y = cy - h / 2;
      return `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y}Z`;
    };

    function fold(p) {                               // yanzi guo -> ỳz̄
      for (const [i, k] of OTHERS.entries()) {
        const t = inOutQuart(clamp01(p, 0.06 + i * 0.045, 0.40 + i * 0.045));
        tf(k, `translate(0 ${30 * t})`); op(k, 1 - t);
      }
      setYZ(inOutQuart(clamp01(p, 0.30, 0.86)));
      const b1 = outExpo(clamp01(p, 0.14, 0.42)), b2 = inOutQuart(clamp01(p, 0.40, 0.94));
      q("bar").setAttribute("d", barAt([mix(bc[0], gc[0], b2), mix(bc[1] - 30 * b1, gc[1], b2)],
        inOutQuart(clamp01(p, 0.18, 0.62)), b2));
      op("bar", p > 0 ? 1 : 0);
      const d1 = outExpo(clamp01(p, 0.2, 0.46)), d2 = inOutQuart(clamp01(p, 0.46, 1));
      q("mac").setAttribute("d", dotAt(mix(dc[0], mc[0], d2), mix(dc[1] - 18 * d1, mc[1], d2), d2));
      op("mac", p > 0 ? 1 : 0); op("dot", p > 0 ? 0 : 1); tf("dot", "");
    }
    function unfold(u) {                             // ỳz̄ -> yanzi guo: marks lift away, letters rise in whole
      const out = inOutQuart(clamp01(u, 0, 0.3));
      q("bar").setAttribute("d", poly(grave.map(p => [p[0], p[1] - 20 * out]))); op("bar", 1 - out);
      q("mac").setAttribute("d", poly(mac.map(p => [p[0], p[1] - 20 * out]))); op("mac", 1 - out);
      setYZ(1 - inOutQuart(clamp01(u, 0.12, 0.7)));
      let iIn = 0;
      for (const [i, k] of OTHERS.entries()) {
        const t = inOutQuart(clamp01(u, 0.42 + i * 0.045, 0.72 + i * 0.045));
        if (k === "istem") iIn = t;
        tf(k, `translate(0 ${30 * (1 - t)})`); op(k, t);
      }
      tf("dot", `translate(0 ${30 * (1 - iIn)})`); op("dot", iIn);
    }

    let p = 0, target = 0, mode = "F", raf = 0, last = 0;
    const render = () => mode === "F" ? fold(p) : unfold(1 - p);
    function step(now) {
      const dt = last ? now - last : 16; last = now;
      p = target > p ? Math.min(target, p + dt / DUR) : Math.max(target, p - dt / DUR);
      render();
      raf = p === target ? 0 : requestAnimationFrame(step);
      if (!raf) last = 0;
    }
    function go(t) {
      if (t === target) return;
      if (p === 0 || p === 1) mode = t === 1 ? "F" : "U";   // a fresh move picks its own staging
      target = t;
      if (reduce) { p = t; render(); return; }
      if (!raf) raf = requestAnimationFrame(step);
    }
    fold(0);
    return go;
  }

  const logos = [];
  for (const svg of document.querySelectorAll("svg.h-logo, svg.bar-logo")) {
    if (!svg.querySelector('[data-k="cam"]')) continue;
    // fold toward the side the logo sits on: left-aligned logos keep the y where it is
    const r = svg.getBoundingClientRect();
    const centred = Math.abs(r.left + r.width / 2 - innerWidth / 2) < innerWidth * 0.1;
    logos.push({ svg, go: setup(svg, centred ? "centre" : "left") });
  }
  if (!logos.length) return;

  // plays once when the page opens (name -> ỳz̄ -> name), then rests on the name so the work
  // gets the attention; hovering the logo folds it again until the pointer leaves.
  // Phones and touch screens: no motion (the tone marks would be a few pixels tall).
  const still = reduce || matchMedia("(max-width: 700px), (hover: none)").matches;
  if (still) return;
  const HOLD = 1400;
  let intro = true;
  setTimeout(() => {
    logos.forEach(l => l.go(1));
    setTimeout(() => { if (intro) logos.forEach(l => l.go(0)); intro = false; }, DUR + HOLD);
  }, 900);
  for (const l of logos) {
    const a = l.svg.closest("a") || l.svg;
    a.addEventListener("mouseenter", () => { intro = false; l.go(1); });
    a.addEventListener("mouseleave", () => l.go(0));
  }
})();

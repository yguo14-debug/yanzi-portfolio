// Frame E — project data, shared by the homepage archive (home.js) and the
// project page (project.js). Text marked [placeholder] is waiting for Yanzi's copy.
// TEMP media: Yanzi's own videos streamed from Framer / Cloudinary — copy locally before launch.

(() => {
const LOREM = {
  // E4: placeholder at the target length — 2–3 short lines per block
  en: "[Placeholder] Two or three short lines: what the situation was and why it mattered.",
  zh: "【占位】两三行：当时的情况，以及它为什么重要。",
};

// Process: four steps, placeholder text + image slots (Yanzi will write the real copy)
const PROCESS = [
  { en: "Research", zh: "研究" },
  { en: "Concept", zh: "概念" },
  { en: "System", zh: "系统" },
  { en: "Application", zh: "应用" },
].map((t) => ({ title: t, text: LOREM, media: [null, null] }));

// E5 (UX): empty slots stay (Yanzi wants all 8) but say what they are — "Coming soon" — instead of
// "Project Name", and they don't open a panel full of placeholder text
const placeholder = (k) => ({
  id: `project-${k}`, empty: true,
  en: "Coming soon", zh: "即将更新",
  tagline: { en: "", zh: "" },
  summary: { en: "This project is being prepared.", zh: "这个项目正在整理中。" },
  year: "",
  type: { en: "In progress", zh: "整理中" },
  tags: [],
  cover: null,
  gallery: [],
  context: LOREM, challenge: LOREM, solution: LOREM,
  process: PROCESS,
  credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
});

window.PROJECTS = [
  {
    id: "rebirth-exe",
    line: { en: "An exhibition identity exploring transhumanism and the future of human identity.", zh: "一套探讨超人类主义与人类身份未来的展览识别。" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Rebirth.exe", zh: "Rebirth.exe",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "An exhibition identity exploring transhumanism, the idea that technology could transform human bodies and minds, while questioning what remains human when we can redesign ourselves.", zh: "一套探讨超人类主义的展览视觉识别——超人类主义认为科技可以改造人的身体与心智；而它追问的是：当我们可以重新设计自己，人还剩下什么。" },
    year: "2025",
    type: { en: "Exhibit Design / Motion Design", zh: "展览设计 / 动态设计" },
    facts: { client: { en: "Personal", zh: "个人项目" }, thanks: { en: "Tyrone Drake", zh: "Tyrone Drake" }, tools: { en: "Adobe After Effects, InDesign", zh: "Adobe After Effects、InDesign" } },
    tags: [
      { en: "Exhibit Design", zh: "展览设计" },
      { en: "Motion Design", zh: "动态设计" },
    ],
    cover: "media/rebirth-digital-resurrection.mp4",
    // logo: "media/rebirth-logo.svg",   // E6 (Yanzi 2026-11-02): back to the big typeset title; the wordmark (E5) can return by un-commenting
    // homepage panel order (Yanzi): same layout as before, some photos moved — it opens on the red
    // screen (the case study opens on the street wall). Pairs come from the gallery's `size: "half"`.
    panel: [
      "media/rebirth-hanging-screen.webp",
      "media/rebirth-1.webp", "media/rebirth-station-screen.webp",
      "media/rebirth-digital-resurrection.mp4",
      "media/rebirth-street-wall-v2.webp",
      "media/rebirth-subway-poster.webp",
      "media/rebirth-elevator.mp4",
      "media/rebirth-billboard-forest.webp",
      "media/rebirth-gallery-hall.mp4",
    ],
    // in the panel the subway poster stands alone (its tall partner is not shown there)
    panelSolo: ["media/rebirth-subway-poster.webp"],
    panelHide: ["media/rebirth-corridor-posters.webp"],   // Yanzi: not in the panel, case study only
    // the 3 shown first (homepage archive + panel opening)
    preview: [
      "media/rebirth-street-wall-v2.webp",           // COVER (Yanzi's favourite): street hoarding, all posters
      "media/rebirth-1.webp",                     // gallery installation (room)
      "media/rebirth-hanging-screen.webp",         // hanging red REBIRTH.EXE screen over the pit (Yanzi 2026-11-01)
    ],
    // curated order + pairing (Yanzi): cover first; each video alone; pairs that belong together
    // E5 colour order (Yanzi "调整一下配对", 2026-11-01): the identity is black / white / red / orange,
    // so the red screen leads big, the two bright rooms with red + orange accents pair up, videos
    // alternate with stills, and the dark green forest comes late and alone.
    gallery: [
      { src: "media/rebirth-street-wall-v2.webp" },                                     // cover (hero, not repeated)
      { src: "media/rebirth-hanging-screen.webp" },                                     // red screen, full width, first
      { src: "media/rebirth-1.webp", size: "half" },                                    // bright pair: room (red bed) +
      { src: "media/rebirth-station-screen.webp", size: "half" },                       // silver station (orange logo)
      { src: "media/rebirth-digital-resurrection.mp4" },                               // video (HD, local, bars cropped)
      // Yanzi: the 7 | 5 stagger looked bad → back to one even row (same height, widths follow the images)
      { src: "media/rebirth-subway-poster.webp", size: "half" },
      { src: "media/rebirth-corridor-posters.webp", size: "half" },
      { src: "media/rebirth-elevator.mp4" },                                           // video (elevator, HD, local)
      // the forest pulled in from the left onto the page's 3/4 line (same edge as the summary column)
      { src: "media/rebirth-billboard-forest.webp", col: "r34" },
      { src: "media/rebirth-gallery-hall.mp4" },                                       // video (gallery hall, HD, local)
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    // Yanzi's copy (2026-11-01). The info column shows `story` instead of Context / Challenge / Solution.
    // 中文 = Claude's translation, for Yanzi to check.
    story: [
      { k: { en: "Overview", zh: "概述" },
        en: [
          "Inspired by digital artist Frederik Heyman's surreal representations of the human body, I developed an exhibition identity around one central tension: the possibilities of human evolution and the uncertainty of what makes us human.",
          "Fragmented typography and geometric forms suggest the breakdown and reconstruction of identity, while a bold red, orange, and black palette conveys both excitement and unease. The exhibition unfolds through three stages, <strong>Origin, Transformation, and Rebirth</strong>, guiding visitors on a journey from human to posthuman.",
        ],
        zh: [
          "受数字艺术家 Frederik Heyman 对人体的超现实表现启发，我围绕一个核心张力发展了这套展览识别：人类进化的可能，与“何以为人”的不确定。",
          "碎片化的字体与几何形态暗示着身份的瓦解与重建，鲜明的红、橙、黑配色同时传达兴奋与不安。展览分为<strong>起源、蜕变、重生</strong>三个阶段，带领观众完成一段从人类走向后人类的旅程。",
        ] },
      { at: "media/rebirth-billboard-forest.webp",   // E6 (Yanzi): Context sits beside the forest image
        k: { en: "Context", zh: "背景" },
        en: [
          "Heyman's work is surreal and unsettling, but an exhibition identity must communicate clearly across different environments. The challenge was to preserve that sense of unease while creating a recognizable visual system that could adapt from street posters and digital screens to immersive gallery spaces.",
        ],
        zh: [
          "Heyman 的作品超现实、令人不安，但展览识别必须在不同环境里都能清楚传达。挑战在于：既保留那种不安感，又建立一套辨识度高的视觉系统，能从街头海报、数字屏幕一路延伸到沉浸式的展厅空间。",
        ] },
    ],
    // E5 Process (Yanzi 2026-11-01): small sheets at the bottom of the page, like a contact sheet.
    // Sources: content/rebirth-exe/process/ (Type logo fonts.pdf, framework.pdf). [placeholder] texts.
    process: [   // one sheet (Yanzi: "两个合并一起排列"): 25 icon pages, then the 6 layout-framework pages
      { title: { en: "Icons & layout framework", zh: "图标与版式框架" }, nonum: true,
        label: { en: "An Identity Built to Transform", zh: "一套为“蜕变”而生的识别" },   // Yanzi's heading for the Process block
        text: {
          en: [
            "I began by developing a range of icon concepts and poster layout sketches exploring evolution, consciousness, and the relationship between humans and technology. Rather than illustrating these ideas literally, I experimented with geometric forms, repetition, and fragmentation to express transformation through visual structure.",
            "These explorations helped shape a cohesive visual identity. The icons established a graphic vocabulary, while the poster studies explored how typography, imagery, and composition could work together. Together, they formed the foundation for a flexible system that could evolve across print, motion, and exhibition space.",
          ],
          zh: [
            "我先发展了一系列图标概念和海报版式草图，围绕演化、意识，以及人与科技的关系展开。我没有去直白地描绘这些概念，而是用几何形态、重复与碎片化去实验，让“蜕变”通过视觉结构本身表达出来。",
            "这些探索逐渐塑造出一套完整统一的视觉识别。图标确立了图形语言，海报研究则探索字体、图像与构图如何协同。两者共同成为一套灵活系统的基础，让它能在印刷、动态影像与展览空间中不断延展。",
          ] },
        grid: 8, ratio: 4000 / 3090,
        media: [
          ...Array.from({ length: 25 }, (_, k) => `media/rebirth-process/icons-${String(k + 1).padStart(2, "0")}.webp`),
          ...Array.from({ length: 6 }, (_, k) => `media/rebirth-process/framework-${String(k + 1).padStart(2, "0")}.webp`),
        ] },
    ],
    credits: [
      { role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" },
      { role: { en: "Context", zh: "背景" }, names: "[Placeholder — course / studio]" },
    ],
  },
  {
    // E7 (Yanzi 2026-11-08): new project in Maarten Baas's old place; Maarten moved down to the end.
    // Source files: content/fermologie/ (the jars photo; the cleaned restaurant animation, not used for now)
    id: "fermologie",
    line: { en: "A restaurant brand identity connecting food, culture, and wellness through fermentation.", zh: "一套以发酵连接食物、文化与健康的餐厅品牌识别。" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Fermologie", zh: "Fermologie",
    tagline: { en: "", zh: "" },
    summary: { en: "Fermologie is a fermentation-focused dining concept pairing daytime workshops with nighttime omakase. Through curated pairings, hands-on experiences, and artisanal products, guests discover fermentation through flavor, culture, and creativity.", zh: "Fermologie 是一个以发酵为核心的餐饮概念，白天是工作坊，夜晚是 omakase。通过精心策划的搭配、亲手参与的体验和手作产品，品牌邀请客人从风味、文化与创造力中认识发酵。" },   // Yanzi's copy 2026-11-14
    facts: { client: { en: "Personal", zh: "个人项目" }, thanks: { en: "Gerardo Herrera", zh: "Gerardo Herrera" },
      // DRAFT 2026-11-14 (hiring-manager review): say how the imagery was made, and what was delivered — Yanzi to confirm
      tools: { en: "Adobe Illustrator, InDesign, SketchUp<br>AI‑assisted image making", zh: "Adobe Illustrator、InDesign、SketchUp<br>AI 辅助图像生成" } },
    year: "2025",   // ArtCenter Student Gallery, summer 2025 (résumé) — confirm
    type: { en: "Brand Identity / Packaging Design / Interior Design", zh: "品牌识别 / 包装设计 / 室内设计" },
    tags: [
      { en: "Brand Identity", zh: "品牌识别" },
      { en: "Packaging Design", zh: "包装设计" },
      { en: "Interior Design", zh: "室内设计" },
    ],
    // Yanzi (2026-11-08): the restaurant film is off for now ("先别放") — the case study opens on the jars;
    // the film is kept in content/fermologie/ and on Yanzi's Desktop
    // Yanzi (2026-11-08): the case study opens on her restaurant film (1080p, 12 s loop); the homepage
    // keeps the relit jars photo and plays the film on hover
    preview: ["media/fermologie-intro.mp4", "media/fermologie-cover.webp"],
    cover: "media/fermologie-intro.mp4",
    poster: "media/fermologie-intro-poster.webp",
    // Yanzi's photos, "Kimichi" corrected to "Kimchi" on every label (2026-11-08); the net-bag photo is left out
    // (AI text on it); the two upright photos sit side by side
    // Yanzi (2026-11-08): the restaurant design first, from the street inwards — storefront, reception,
    // counter + dining room, the menu cards — then the packaging
    gallery: [
      { src: "media/fermologie-board-hd.mp4" },   // Yanzi 2026-11-14: brand board in motion — fermentation film -> logo, jars <-> cards every 2 s, palette accordion
      // Yanzi 2026-11-14: the storefront full screen; reception + counter side by side under it
      { src: "media/fermologie-storefront.webp" },   // full page width, like Rebirth (not edge to edge)
      { src: "media/fermologie-reception.webp", size: "half" },   // Yanzi: these two stay side by side
      { src: "media/fermologie-counter.webp", size: "half" },
      { src: "media/fermologie-dining-room.webp" },
      { src: "media/fermologie-menu-cards.webp", col: "r34" },   // under The Omakase Experience, in its ¾ column
      { src: "media/fermologie-menu-cards-all-hd.webp", col: "r34" },   // Yanzi 2026-11-14: all ten cards (fronts + backs), under the menu photo
      { src: "media/fermologie-cover.webp" },
      // Packaging: the net bag and the fridge side by side
      { src: "media/fermologie-net-bag.webp", size: "half" },
      { src: "media/fermologie-fridge.webp", size: "half" },
      { src: "media/fermologie-workshop-room.webp" },   // Workshops text beside it
      { src: "media/fermologie-workshop-poster.webp", size: "half" },      // the Kombucha workshop poster …
      { src: "media/fermologie-workshop-instagram.webp", size: "half" },   // … beside the workshop's Instagram story (Yanzi 2026-11-14)
      { src: "media/fermologie-website.webp", col: "r34" },   // digital: the website, after the Instagram story
    ],
    // Yanzi 2026-11-14: Context at the top (beside the board); Challenge beside the storefront;
    // Solution beside the dining room — texts are placeholders until Yanzi writes them
    leadAll: true,   // Yanzi: like Rebirth — board, storefront and the reception/counter pair all in the ¾ column beside the top text
    story: [   // Yanzi's copy 2026-11-14 (Chinese: my translation — Yanzi to check)
      { k: { en: "The Challenge", zh: "挑战" },
        en: ["Fermentation has shaped food cultures for centuries, yet its flavors and traditions remain unfamiliar to many. For health-conscious diners, exciting gut-friendly options can be hard to find, while conventional dining rarely offers cultural discovery or hands-on learning."],
        zh: ["发酵在饮食文化中已有数百年历史，但它的风味与传统对许多人来说依然陌生。注重健康的食客很难找到有趣又养胃的选择，而传统餐饮也很少提供文化探索和亲手学习的机会。"] },
      { k: { en: "Personal Story", zh: "个人故事" },
        en: ["Growing up with a sensitive stomach, I remember my grandmother making fermented foods and drinks for me after school. Those small gestures of love and care inspired Fermologie, a brand rooted in the connection between food, culture, and people."],
        zh: ["我从小肠胃敏感，记得放学后外婆常为我做发酵的食物和饮品。那些充满爱与关怀的小小举动启发了 Fermologie——一个扎根于食物、文化与人之间联结的品牌。"] },
      { k: { en: "Different Elements. Shared Possibilities.", zh: "不同的元素，共同的可能。" },
        en: ["Fermologie brings together food and beverages, science and tradition, learning and dining. Through the power of pairing, fermentation becomes more than a culinary practice. It becomes an experience of cultural discovery, creativity, and connection."],
        zh: ["Fermologie 把食物与饮品、科学与传统、学习与用餐结合在一起。借由搭配的力量，发酵不再只是一种烹饪方式，而成为一场关于文化探索、创造与联结的体验。"] },
      { at: "media/fermologie-dining-room.webp", k: { en: "The Omakase Experience", zh: "Omakase 体验" },
        en: [
          "<strong>Seven Courses. Seven Cultures. One Table.</strong>",
          "Fermologie reimagines omakase through seven courses inspired by global fermentation traditions. Each course pairs a fermented dish with a beverage from the same country, celebrating the unique flavors and cultural heritage of each tradition.",
          "With live preparation and chef-led storytelling, guests discover the science, craftsmanship, and stories behind every pairing.",
        ],
        zh: [
          "<strong>七道菜，七种文化，一场共享的体验。</strong>",
          "Fermologie 以七道菜重新诠释 omakase，每一道都取材自世界各地的发酵传统。每道发酵料理都搭配一款来自同一国家的饮品，呈现每种传统独特的风味与文化底蕴。",
          "通过现场制作与主厨的讲述，客人得以了解每一组搭配背后的科学、手艺与故事。",
        ] },
      { at: "media/fermologie-cover.webp", k: { en: "Packaged Food & Retail", zh: "包装食品与零售" },
        en: [
          "<strong>Fermentation for Everyday Living.</strong>",
          "Featuring familiar favorites like kimchi, chili sauce, and pickles, Fermologie's packaged collection makes fermented foods easy to enjoy. Available in-store and online, these products encourage healthier everyday eating beyond the restaurant.",
        ],
        zh: [
          "<strong>让发酵走进日常。</strong>",
          "Fermologie 的包装系列收录泡菜、辣椒酱、腌黄瓜等熟悉的风味，让发酵食品更容易亲近。产品在店内和网上都能买到，把更健康的日常饮食带到餐厅之外。",
        ] },
      { at: "media/fermologie-workshop-room.webp", k: { en: "Fermentation Workshops", zh: "发酵工作坊" },   // Yanzi's copy 2026-11-14
        en: [
          "<strong>Learn by Making.</strong>",
          "Through hands-on daytime workshops, guests learn traditional fermentation techniques, experiment with ingredients, and create their own fermented foods. These interactive sessions turn culinary curiosity into practical skills and a deeper love for the craft.",
        ],
        zh: [
          "<strong>在动手中学习。</strong>",
          "在白天的动手工作坊里，客人学习传统的发酵技法，尝试不同的食材，做出属于自己的发酵食物。这些互动课程把对美食的好奇，转化为实用的技能，以及对这门手艺更深的欣赏。",
        ] },
    ],
    process: [   // DRAFT (2026-11-14): Yanzi's process images go in `media` (sketches, logo studies, label tests)
      { title: { en: "Process", zh: "设计过程" }, nonum: true,
        label: { en: "3D Rendering & Spatial Design", zh: "3D 渲染与空间设计" },   // Yanzi's copy 2026-11-14
        text: {
          en: [
            "<strong>Bringing the Brand to Life.</strong>",
            "Using SketchUp, I developed a 3D restaurant concept to visualize how Fermologie's brand identity translates into a physical space. Its layout, materials, and atmosphere create an intimate dining environment that reflects the brand's character.",
          ],
          zh: [
            "<strong>让品牌在空间中成形。</strong>",
            "我用 SketchUp 发展了一个 3D 餐厅概念，呈现 Fermologie 的品牌识别如何转化为实体空间。设计探索空间布局、材质与氛围，营造出一个亲密、体现品牌个性的用餐环境。",
          ],
        },
        feature: true,   // Yanzi 2026-11-14: the space walkthrough large, the renders and SketchUp studies smaller under it
        media: ["media/fermologie-space-walkthrough.mp4", "media/fermologie-space-render-bar.webp", "media/fermologie-space-render-room.webp",
          "media/fermologie-space-render-glass.webp", "media/fermologie-space-render-axo.webp", "media/fermologie-space-sketchup.webp"] },
      { band: true,   // Yanzi 2026-11-14: the brand book spreads on black, side by side, under the space renders
        media: ["media/fermologie-book-service.webp", "media/fermologie-book-market.webp", "media/fermologie-book-logo.webp",
          "media/fermologie-book-persona.webp", "media/fermologie-book-color.webp"] },   // Yanzi: no Brand System section — logo + color stay in the book band
    ],
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  {
    id: "rite-aid",
    // Yanzi 2026-11-15: instead of Client / Special thanks. Link = the images on this page until she sends the full-project URL
    factsNote: { k: { en: "Retail Branding + Packaging Design", zh: "零售品牌 + 包装设计" }, link: { href: "#pj-gallery", en: "View full project", zh: "查看完整项目" } },
    line: { en: "Retail Branding + Packaging Design", zh: "零售品牌 + 包装设计" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Rite Aid", zh: "Rite Aid",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Identity Design / Logo Animation / Packaging Design", zh: "识别设计 / 标志动画 / 包装设计" },
    tags: [
      { en: "Identity Design", zh: "识别设计" },
      { en: "Logo Animation", zh: "标志动画" },
      { en: "Packaging Design", zh: "包装设计" },
    ],
    // TEMP: streamed from Framer — copy locally before launch
    // homepage tiles: stills first (the white logo video looked like a loading spinner when small)
    // Yanzi (2026-11-13): the cover is the logo motion only, smaller in its frame (re-rendered at 85%, local copy)
    preview: ["media/rite-aid-motion.mp4"],
    coverVideo: true,   // the homepage card plays it (no still first)
    cover: "media/rite-aid-motion.mp4",
    gallery: [
      { src: "media/rite-aid-motion.mp4" },   // video (logo motion), alone
      { src: "media/rite-aid-1.webp", size: "full" },   // social + packaging spread
      { src: "media/rite-aid-2.webp", size: "full" },   // gift cards in store
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  {
    id: "stay-in-lign",
    line: { en: "A countdown kit designed to turn the orthodontic journey into a motivating daily ritual.", zh: "一套倒数计时套装，把漫长的牙齿矫正过程变成每天都有动力的小仪式。" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Stayinlign", zh: "Stayinlign",   // Yanzi 2026-11-15: the name written as one word
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "Stayinlign is a conceptual collaboration with Invisalign that reimagines orthodontic care through interactive packaging, daily essentials, and a digital experience.", zh: "Stayinlign 是与隐适美（Invisalign）合作的概念项目，通过互动包装、日常护理用品和联网的数字体验，重新想象牙齿矫正护理。" },   // Yanzi 2026-11-15
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Packaging Design", zh: "包装设计" },
    tags: [
      { en: "Packaging Design", zh: "包装设计" },
    ],
    facts: { client: { en: "Personal", zh: "个人项目" }, thanks: { en: "Dan Hoy", zh: "Dan Hoy" } },   // Yanzi 2026-11-15
    noHoverVideo: true,   // Yanzi 2026-11-14: no board motion on the homepage card — the cover only
    cover: "media/stay-in-lign-cover-6.webp",    // Yanzi 2026-11-14: The Chewies taken out at the sink (from her original IMG_1774, 3200px)
    leadAll: true,   // Yanzi: every image in the ¾ column, edges aligned (the pair below as wide as the photo above)
    gallery: [
      { src: "media/stay-in-lign-board-hd.mp4" },   // Yanzi 2026-11-14: brand board in motion — logo GIF -> logo, colour accordion (draft from the compressed board; rebuild from originals)
      { src: "media/stay-in-lign-2b.webp" },                   // the kit + The Pod — from Yanzi's p2.png (2048px)
      { src: "media/stay-in-lign-3.webp", size: "half", row: 3 },   // using The Pod — three in one row (Yanzi)
      { src: "media/stay-in-lign-5.webp?v=3", size: "half" },      // using The Drop at a bright sink (Yanzi 2026-11-13: the real label put back on the AI scene)
      { src: "media/stay-in-lign-6.webp", size: "half" },      // the box: What's Inside (Yanzi 2026-11-14)
      { src: "media/stay-in-lign-4.webp", col: "r34" },        // kit by the sink
      // (app on the phone — media/stay-in-lign-1.webp — removed for now, Yanzi 2026-11-15; will come back with the app design)
    ],
    story: [   // Yanzi's copy 2026-11-15 (Chinese: my translation — Yanzi to check)
      { k: { en: "The Challenge", zh: "挑战" },
        en: [
          "<strong>Making a Long Journey Feel Rewarding</strong>",
          "Clear aligner treatment requires consistent care over several months. Repetitive cleaning routines and slow, often unnoticeable progress can make the journey feel tedious and discouraging.",
        ],
        zh: [
          "<strong>让漫长的过程变得有回报</strong>",
          "透明牙套治疗需要持续数月的细心护理。重复的清洁流程，加上缓慢、常常难以察觉的进展，让这段过程显得枯燥又容易让人泄气。",
        ] },
      { at: "media/stay-in-lign-2b.webp", k: { en: "Our Solution", zh: "我们的方案" },   // its own section, beside the open kit (Yanzi)
        en: [
          "<strong>Turning Daily Care into a Countdown</strong>",
          "Inspired by clocks and countdowns, Stayinlign combines a playful visual identity with functional packaging that becomes a reusable daily organizer.",
          "An embedded chip connects the kit to a companion app with reminders, wear-time tracking, progress visualization, and rewards, making daily care simpler, more engaging, and more motivating.",
        ],
        zh: [
          "<strong>把日常护理变成一场倒数</strong>",
          "Stayinlign 从时钟和倒数计时中获得灵感，把活泼的视觉识别与实用的包装结合，包装本身可以变成重复使用的日常收纳盒。",
          "内置芯片把套装与配套 App 连接起来，提供提醒、佩戴时长记录、进度可视化和奖励，让日常护理更简单、更有趣，也更有动力。",
        ] },
    ],
    process: [   // Yanzi 2026-11-14: dielines + material study (DRAFT text — Yanzi to confirm)
      { title: { en: "Dielines", zh: "刀版" }, nonum: true,
        label: { en: "Dielines", zh: "刀版结构" },
        text: {
          en: ["Each piece of the kit has its own folding carton: The Drop, The Pod, The Pick, and The Chewies. One system of soft blue gradients, a clock motif, and clear product names ties them together."],
          zh: ["套装里的每一件都有自己的折叠纸盒：The Drop、The Pod、The Pick 和 The Chewies。柔和的蓝色渐变、时钟图形和清楚的产品名称，把它们统一成一个系统。"],
        },
        grid: 3, ratio: 1.6,   // each dieline cropped to its artwork, centred in the cell
        media: ["media/stay-in-lign-process/dieline-1.webp?v=2", "media/stay-in-lign-process/dieline-2.webp?v=2", "media/stay-in-lign-process/dieline-3.webp?v=2"] },
      { title: { en: "Material Study", zh: "材料研究" }, nonum: true,
        label: { en: "Material Study", zh: "材料研究" },
        text: {
          en: ["I specified the material and print method for every part, from the rigid box, cover, and tray insert to the glass tablet tube and recycled paper boxes, balancing a premium feel with responsible stock."],
          zh: ["我为每个部件确定了材料和印刷方式：从硬盒、盒盖、内托，到玻璃药片管和再生纸盒，在高级感与环保用材之间取得平衡。"],
        },
        grid: 1, ratio: 1920 / 1080,   // full width, so the spec text can be read
        media: ["media/stay-in-lign-process/material-1.webp", "media/stay-in-lign-process/material-2.webp"] },
    ],
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  {
    id: "maarten-baas",
    line: { en: "It's About Time, an exhibition on Maarten Baas", zh: "设计师 Maarten Baas 的展览「It's About Time」" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Maarten Baas", zh: "Maarten Baas",
    tagline: { en: "It's About Time", zh: "It's About Time" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // from the poster: 14 February – 26 May 2025
    type: { en: "Publication Design / Identity Design", zh: "出版物设计 / 识别设计" },
    tags: [
      { en: "Publication Design", zh: "出版物设计" },
      { en: "Identity Design", zh: "识别设计" },
    ],
    cover: "media/maarten-baas-1.webp",
    gallery: [
      { src: "media/maarten-baas-1.webp" },                    // shop-window posters
      { src: "media/maarten-baas-2.webp", size: "half" },      // catalogue in hand + book spread
      { src: "media/maarten-baas-3.webp", size: "half" },
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },  {
    // Yanzi 2026-11-13: Sentire takes Tinkylife's place (Tinkylife kept below, not shown)
    id: "sentire",
    line: { en: "A typeface for the cycle of soul-work", zh: "一款写给「灵魂工作循环」的字体" },   // homepage card: a short line under the name, shown on hover (after basedesign.com; draft — Yanzi to confirm)
    en: "Sentire", zh: "Sentire",
    tagline: { en: "The Cycle of Soul-work", zh: "灵魂工作的循环" },
    summary: { en: "[Placeholder] A typeface and its specimen newspaper.", zh: "【占位】一款字体，以及它的字体样张报纸。" },
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Font Design", zh: "字体设计" },
    tags: [
      { en: "Font Design", zh: "字体设计" },
    ],
    cover: "media/sentire-cover.webp",   // Yanzi 2026-11-15: the specimen newspaper, from her original T24410 (5504×8256 → 2000×3000)
    gallery: [
      // (the newspaper photo is now the cover)
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },

  ...Array.from({ length: 2 }, (_, k) => placeholder(k + 7)),   // 8 slots: Rebirth.exe, Fermologie, Rite Aid, Stay in Lign, Sentire, Maarten Baas, 2 × Coming soon (E7)
];
// (Hiding empty slots was tried 2026-10-25 and undone at Yanzi's request — all 8 are shown.)
window.ALL_PROJECTS = window.PROJECTS;
// Tinkylife (replaced on the site by Sentire, 2026-11-13) — kept here to bring back if wanted
window.TINKYLIFE_HIDDEN =
  {
    id: "tinkylife",
    en: "Tinkylife", zh: "Tinkylife",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Pet Products / Cat Furniture / Product Design", zh: "宠物用品 / 猫家具 / 产品设计" },
    tags: [
      { en: "Pet products", zh: "宠物用品" },
      { en: "Cat furniture", zh: "猫家具" },
      { en: "Product design", zh: "产品设计" },
    ],
    cover: "media/tinkylife-1.webp",
    gallery: [
      { src: "media/tinkylife-1.webp", size: "half" },
      { src: "media/tinkylife-2.webp", size: "half" },
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  };
})();

// Frame E — project data, shared by the homepage archive (home.js) and the
// project page (project.js). Text marked [placeholder] is waiting for Yanzi's copy.
// TEMP media: Yanzi's own videos streamed from Framer / Cloudinary — copy locally before launch.

(() => {
const LOREM = {
  en: "[Placeholder] Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
  zh: "【占位】此处为占位文字，最终内容待补充。说明项目的背景、问题与思路，以及它为谁而做。",
};

// Process: four steps, placeholder text + image slots (Yanzi will write the real copy)
const PROCESS = [
  { en: "Research", zh: "研究" },
  { en: "Concept", zh: "概念" },
  { en: "System", zh: "系统" },
  { en: "Application", zh: "应用" },
].map((t) => ({ title: t, text: LOREM, media: [null, null] }));

const placeholder = (k) => ({
  id: `project-${k}`,
  en: "Project Name", zh: "项目名称",
  tagline: { en: "Tagline goes here", zh: "一句话标语" },
  summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
  year: "2025",
  type: { en: "Project type", zh: "项目类型" },
  tags: [{ en: "Identity", zh: "视觉识别" }],
  cover: null,
  gallery: [],
  context: LOREM, challenge: LOREM, solution: LOREM,
  process: PROCESS,
  credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
});

window.PROJECTS = [
  {
    id: "rebirth-exe",
    en: "Rebirth.exe", zh: "Rebirth.exe",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "An exhibition identity for Rebirth.exe that explores transhumanism, asking what remains human when identity can be uploaded, glitched and reborn.", zh: "Rebirth.exe 展览视觉识别——探讨“超人类主义”，追问当身份可以被上传、出错、重生时，人还剩下什么。" },
    year: "2025",
    type: { en: "Visual identity · Exhibition", zh: "视觉识别 · 展览设计" },
    tags: [
      { en: "Visual identity", zh: "视觉识别" },
      { en: "Exhibition design", zh: "展览设计" },
      { en: "Poster", zh: "海报" },
      { en: "Motion", zh: "动态" },
    ],
    cover: "https://framerusercontent.com/assets/RHV2v2xVQCZ3WEYdyOniS3I.mp4",
    // the 3 images in the homepage preview (first = the gallery installation view)
    preview: [
      "media/rebirth-1.webp",
      "https://framerusercontent.com/assets/RHV2v2xVQCZ3WEYdyOniS3I.mp4",
      "https://res.cloudinary.com/dkekg5zt/video/upload/v1787649296/poster_1_mp4.mp4",
    ],
    gallery: [
      { src: "media/rebirth-1.webp", size: "full" },
      { src: "https://res.cloudinary.com/dkekg5zt/video/upload/v1787649296/poster_1_mp4.mp4", size: "full" },
      { src: "https://res.cloudinary.com/dkekg5zt/video/upload/v1787666816/T21150_8.mp4", size: "full" },
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [
      { role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" },
      { role: { en: "Context", zh: "背景" }, names: "[Placeholder — course / studio]" },
    ],
  },
  placeholder(2),
  {
    id: "maarten-baas",
    en: "Maarten Baas", zh: "Maarten Baas",
    tagline: { en: "It's About Time", zh: "It's About Time" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // from the poster: 14 February – 26 May 2025
    type: { en: "Exhibition Identity / Editorial Design / Visual Communication", zh: "展览视觉识别 / 编辑设计 / 视觉传达" },
    tags: [
      { en: "Exhibition identity", zh: "展览视觉识别" },
      { en: "Editorial design", zh: "编辑设计" },
      { en: "Visual communication", zh: "视觉传达" },
    ],
    cover: "media/maarten-baas-1.webp",
    gallery: [
      { src: "media/maarten-baas-2.webp", size: "full" },
      { src: "media/maarten-baas-3.webp", size: "full" },
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
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
    gallery: [{ src: "media/tinkylife-2.webp", size: "full" }],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  {
    id: "rite-aid",
    en: "Rite Aid", zh: "Rite Aid",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Visual Identity / Packaging Design / Spatial Design", zh: "视觉识别 / 包装设计 / 空间设计" },
    tags: [
      { en: "Visual identity", zh: "视觉识别" },
      { en: "Packaging design", zh: "包装设计" },
      { en: "Spatial design", zh: "空间设计" },
    ],
    // TEMP: streamed from Framer — copy locally before launch
    cover: "https://framerusercontent.com/assets/HOu3C08iXRHED3WCUOTksgfmI.mp4",
    gallery: [
      { src: "media/rite-aid-1.webp", size: "full" },   // social + packaging spread
      { src: "media/rite-aid-2.webp", size: "full" },   // gift cards in store
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  {
    id: "stay-in-lign",
    en: "Stay in Lign", zh: "Stay in Lign",
    tagline: { en: "[Tagline placeholder]", zh: "【标语占位】" },
    summary: { en: "[Placeholder] One sentence that says what this project is and who it is for.", zh: "【占位】一句话说明这个项目是什么、为谁而做。" },
    year: "2025",   // [placeholder — confirm with Yanzi]
    type: { en: "Packaging / UI/UX Design", zh: "包装设计 / UI/UX 设计" },
    tags: [
      { en: "Packaging", zh: "包装设计" },
      { en: "UI/UX design", zh: "UI/UX 设计" },
    ],
    cover: "media/stay-in-lign-1.webp",          // app on the phone
    gallery: [
      { src: "media/stay-in-lign-2.webp", size: "full" },   // kit, top view
      { src: "media/stay-in-lign-3.webp", size: "full" },   // The Pod, unboxing
      { src: "media/stay-in-lign-4.webp", size: "full" },   // kit by the sink
    ],
    context: LOREM, challenge: LOREM, solution: LOREM,
    process: PROCESS,
    credits: [{ role: { en: "Design", zh: "设计" }, names: "Yanzi Guo" }],
  },
  ...Array.from({ length: 4 }, (_, k) => placeholder(k + 7)),   // 10 projects in total; 03 Maarten Baas, 04 Tinkylife, 05 Rite Aid, 06 Stay in Lign
];
})();
